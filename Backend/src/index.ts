import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'

import * as controllers from './Modules/controllers.index'
import { dbconnection } from './DB/db.connection';
import { HttpException,FailedResponse } from './Utils';
import { ioIntializer } from './Gateways/SocketIo/socketio.gateways'
import { createHandler } from "graphql-http";
import { MainSchema } from "./GraphQl/main.gql";
import { authentication } from "./Middleware";
import { IRequest } from "./Common";

const app = express()

app.use(cors())
app.use(express.json())


// GraphQl
app.all('/graphql', authentication, createHandler(
    { schema: MainSchema, context: (req) => ({ user: (req.raw as IRequest).loggedInUser }) 
}))

// create a write stream (in append mode)
let accessLogStream = fs.createWriteStream('access.log')
// setup the logger
app.use(morgan('dev', { stream: accessLogStream }))

dbconnection();

app.use('/api/auth', controllers.authController)
app.use('/api/users', controllers.profileController)
app.use('/api/posts', controllers.postController)
app.use('/api/comments', controllers.commentController)
app.use('/api/reacts', controllers.reactController)

// error handling middleware
app.use((err: HttpException | Error | null, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof HttpException) {
            return res.status(err.statusCode).json(FailedResponse(err.message, err.statusCode, err.error))
        } else {
            res.status(500).json(FailedResponse(err.message, 500, err))
        }
    }
})


const port: number | string = process.env.PORT || 500
const server = app.listen(port, () => {
    console.log('Server is running on port ' + port);
})

ioIntializer(server)