import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const customerMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "customer") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Customer access only",
    });
    return;
  }
  next();
};
