import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import * as controllers from './Modules/controllers.index'
import { dbconnection } from './DB/db.connection';
const app = express()

app.use(express.json());
dbconnection();

app.use("/auth",controllers.authController);
app.use("/users",controllers.ProfileController);


// error handling middleware
app.use((err: Error | null, req: Request, res: Response, next: NextFunction) => {
  const status = 500;
  const message = 'Something went wrong';
  res.status(status).json({ message });
});


const Port :number | string = process.env.PORT || 3000
app.listen(Port , ()=>{
    console.log(`Server is running on port:${Port}`);
    
})