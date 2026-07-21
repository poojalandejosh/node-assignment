import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import * as customerService from "../services/customer.service";

const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await customerService.getDashboard(req.user!.id);
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    console.log("get dashboard error", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const customer = await customerService.updateProfile(
      req.user!.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: customer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (message === "Customer not found") {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }
    console.log("update profile error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const depositAmount = async (req: AuthRequest, res: Response) => {
  try {
    const result = await customerService.deposite(
      req.user!.id,
      req.body.amount
    );
    res.status(200).json({
      success: true,
      message: "Deposit successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (message === "Account not found") {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }
    if (message === "Insufficient balance") {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }
    console.log("deposit error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const withdrawAmount = async (req: AuthRequest, res: Response) => {
  try {
    const result = await customerService.withdraw(
      req.user!.id,
      req.body.amount
    );
    res.status(200).json({
      success: true,
      message: "Withdraw successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (message === "Account not found") {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }
    if (message === "Insufficient balance") {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }
    console.log("withdraw error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const fetchTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await customerService.getMyTransaction(req.user!.id);
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.log("get transactions error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const customer = await customerService.updateprofileImage(
      req.user!.id,
      req.file.filename
    );

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: customer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message,
      });
    }
    console.log("update profile photo error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export default {
  getDashboard,
  updateProfile,
  depositAmount,
  withdrawAmount,
  fetchTransactions,
  uploadProfileImage,
};
