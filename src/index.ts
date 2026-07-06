import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequalize from "./config/db";
import "./models/associations";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import customerRoutes from "./routes/customer.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

const startServer = async () => {
  try {
    await sequalize.authenticate();
    console.log("Database connected successfully");

    await sequalize.sync();
    console.log("Datebase tables synched");

    app.listen(Number(process.env.PORT || 4000), () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};
startServer();
