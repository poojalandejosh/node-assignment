import * as authService from "../services/auth.service";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

const adminLogin = async (req: AuthRequest, res: Response) => {
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
};

const customerLogin = async (req: AuthRequest, res: Response) => {
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
};

const forgotPasswordMessage =
  "If the email exists, password reset instructions have been sent";

const forgotPassword = async (req: AuthRequest, res: Response) => {
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
};

const resetPassword = async (req: AuthRequest, res: Response) => {
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
};

const forgotPasswordCustomer = async (req: AuthRequest, res: Response) => {
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
};

const resePasswordCustomer = async (req: AuthRequest, res: Response) => {
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
};

const adminChangePassword = async (req: AuthRequest, res: Response) => {
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
};

const customerChangePassword = async (req: AuthRequest, res: Response) => {
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
    if (
      message === "Current password is incorrect" ||
      message === "Invalid current password"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default {
  adminLogin,
  customerLogin,
  forgotPassword,
  resetPassword,
  forgotPasswordCustomer,
  resePasswordCustomer,
  adminChangePassword,
  customerChangePassword,
};
