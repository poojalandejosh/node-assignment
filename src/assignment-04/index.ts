import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import employeeRoutes from "./modules/employee.module.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/employee",employeeRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})