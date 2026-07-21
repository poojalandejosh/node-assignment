import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Admin access only",
    });
    return;
  }
  next();
};
