import mongoose from "mongoose";

export async function dbconnection() {
    try{
        await mongoose.connect(process.env.DB_URL_LOCAL as string)
        console.log("database connected successfully");
        
    }catch(error){
        console.log(`error connecting to the database ${error}`);
    }

}