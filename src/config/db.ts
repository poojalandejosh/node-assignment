import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async()=>{
    try{
       const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp_ts_db' as string;
       await mongoose.connect(mongoUri);
       console.log('MongoDB Connected successfully via Mongoose.');
    }catch(error){
        console.log('MongoDB Connection Error:', error);
        process.exit(1);

    }
}

export default connectDB;