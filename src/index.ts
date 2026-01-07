import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express';
import * as controllers from './Modules/controllers.index'
import { dbconnection } from './DB/db.connection';
import { HttpException,FailedResponse } from './Utils';
const app = express()

app.use(express.json());
dbconnection();

app.use("/auth",controllers.authController);
app.use("/users",controllers.ProfileController);


// error handling middleware
app.use((err: HttpException | Error | null, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof HttpException) {
            return res.status(err.statusCode).json(FailedResponse(err.message, err.statusCode, err.error))
        } else {
            res.status(500).json(FailedResponse(err.message, 500, err))
        }
    }
    return next(); 
})


const Port :number | string = process.env.PORT || 3000
app.listen(Port , ()=>{
    console.log(`Server is running on port:${Port}`);
    
})