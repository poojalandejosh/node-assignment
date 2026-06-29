import express from "express";
import chatRoutes from "./routes/chatRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use("/api/messages", chatRoutes);
app.use(errorHandler);

export default app;