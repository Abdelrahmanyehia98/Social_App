import 'dotenv/config'
import express from 'express'
import * as controllers from './Modules/controllers.index'
const app = express()

app.use(express.json());
app.use("/users",controllers.authController);



const Port :number | string = process.env.PORT || 3000
app.listen(Port , ()=>{
    console.log(`Server is running on port:${Port}`);
    
})