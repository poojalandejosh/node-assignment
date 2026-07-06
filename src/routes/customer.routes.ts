import { Router } from "express";
import * as customerService from "../services/customer.service.ts";
import validateBody from "../middleware/validate.middleware.ts";
import {
  updateCustomerSchema,
  depositeSchema,
  withdrawSchema,
} from "../validations/customer.schema.ts";
import { success } from "zod";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware.ts";
import { customerMiddleware } from "../middleware/customer.middleware.ts";

const router = Router();

router.use(authMiddleware);
router.use(customerMiddleware);

router.get("/dashboard", async (req: AuthRequest, res) => {
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
      error: error.message,
    });
  }
});

router.put(
  "/profile",
  validateBody(updateCustomerSchema),
  async (req: AuthRequest, res) => {
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
  }
);

router.post(
  "/deposit",
  validateBody(depositeSchema),
  async (req: AuthRequest, res) => {
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
  }
);

router.post(
  "/withdraw",
  validateBody(withdrawSchema),
  async (req: AuthRequest, res) => {
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
  }
);

router.get("/transactions", async (req: AuthRequest, res) => {
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
});

export default router;
