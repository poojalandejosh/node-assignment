import { Router } from "express";
import * as authService from "../services/auth.service";
import validateBody from "../middleware/validate.middleware";
import {
  adminLoginSchema,
  customerLoginSchema,
} from "../validations/auth.schema";

const router = Router();

router.post(
  "/admin/login",
  validateBody(adminLoginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await authService.adminLogin(email, password);

      res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        data: token,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (message === "Invalid email or password") {
        return res.status(401).json({ message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/logout", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
});

router.post(
  "/customer/login",
  validateBody(customerLoginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await authService.customerLogin(email, password);
      res.status(200).json({
        success: true,
        message: "Customer logged in successfully",
        data: token,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (message === "Invalid email or password") {
        return res.status(401).json({ message });
      }
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

export default router;
