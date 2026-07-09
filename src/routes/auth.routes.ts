import { Router,Response } from "express";
import * as authService from "../services/auth.service";
import validateBody from "../middleware/validate.middleware";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  adminLoginSchema,
  changePasswordSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.schema";
import { customerMiddleware } from "../middleware/customer.middleware";

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

const forgotPasswordMessage =
  "If the email exists, password reset instructions have been sent";

router.post(
  "/admin/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;
      const resetToken = await authService.forgotAdminPassword(email);

      res.status(200).json({
        success: true,
        message: forgotPasswordMessage,
        ...(process.env.NODE_ENV === "development" && resetToken
          ? { resetToken }
          : {}),
      });
    } catch (error) {
      console.log("admin forgot password failed", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/admin/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res) => {
    try {
      const { token, new_password } = req.body;
      await authService.resetAdminPassword(token, new_password);

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (message === "Invalid or expired reset token") {
        return res.status(400).json({ success: false, message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/customer/forgot-password",
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;
      const resetToken = await authService.forgotCustomerPassword(email);

      res.status(200).json({
        success: true,
        message: forgotPasswordMessage,
        ...(process.env.NODE_ENV === "development" && resetToken
          ? { resetToken }
          : {}),
      });
    } catch (error) {
      console.log("customer forgot password failed", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/customer/reset-password",
  validateBody(resetPasswordSchema),
  async (req, res) => {
    try {
      const { token, new_password } = req.body;
      await authService.resetCustomerPassword(token, new_password);

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (message === "Invalid or expired reset token") {
        return res.status(400).json({ success: false, message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/admin/change-password",
  authMiddleware,
  adminMiddleware,
  validateBody(changePasswordSchema),
  async (req: AuthRequest, res) => {
    try {
      const { currentPassword, new_password } = req.body;
      await authService.changePassword(
        req.user!.id.toString() as string,
        currentPassword,
        new_password
      );
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (
        message === "Current password is incorrect" ||
        message === "Invalid current password"
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.put(
  "/customer/change-password",
  authMiddleware,
  customerMiddleware,
  validateBody(changePasswordSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { currentPassword, new_password } = req.body;
      await authService.changeCustomerPassword(
        req.user!.id.toString(),
        currentPassword,
        new_password
      );
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      if (message === "Current password is incorrect" || message === "Invalid current password") {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

export default router;

