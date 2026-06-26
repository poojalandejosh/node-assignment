import express from "express";
import cors from "cors";
import authRoutes from "../../src/assignment-05/routes/auth.routes";
import customerRoutes from "../../src/assignment-05/routes/customer.routes";

export const createAssignment05App = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/customer", customerRoutes);

  return app;
};
