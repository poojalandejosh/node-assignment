import { Router } from "express";
import { UniqueConstraintError } from "sequelize";
import * as adminService from "../services/admin.service";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import validateBody from "../middleware/validate.middleware";
import {
  createCustomerSchema,
  searchCustomerSchema,
} from "../validations/admin.schema";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post(
  "/customers",
  validateBody(createCustomerSchema),
  async (req: AuthRequest, res) => {
    try {
      const result = await adminService.createCustomer(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        customerId: result.customerId,
        accountNumber: result.accountNumber,
        temporaryPassword: result.temporaryPassword,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
          success: false,
          message: "Customer already exists",
        });
      }
      console.log("create customer failed", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

router.get("/customers", async (req: AuthRequest, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    if (search) {
      const parsed = searchCustomerSchema.safeParse({ search });
      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
    }
    const customers = await adminService.getCustomers(search);
    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.log("get customers failed", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await adminService.getCustomerById(Number(req.params.id));
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      customer,
    });
  } catch (error) {
    console.log("get customer by id failed", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/customers/:id", async (req, res) => {
  try {
    const result = await adminService.deleteCustomer(Number(req.params.id));
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Delete customer failed", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/transactions", async (_req, res) => {
  try {
    const transactions = await adminService.getAllTransactions();
    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.log("get transaction failsed", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
