import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.ts";
import "./models/Customer.model.ts";
import customerRoutes from "./routes/customer.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);

app.use('/customer',customerRoutes);

const startServer = async ()=>{
    try{
        await sequelize.authenticate();
        console.log("Database connected successfully");
        await sequelize.sync();
        console.log("Database tables synced");
        app.listen(Number(process.env.PORT), () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(error){
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();