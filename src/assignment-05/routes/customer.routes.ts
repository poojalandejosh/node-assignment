import { Router } from "express";
import { UniqueConstraintError } from "sequelize";
import * as customerService from "../services/customer.service";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/create", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res
        .status(400)
        .json({
          message: "first_name, last_name, email and password are required",
        });
    }

    const customer = await customerService.createCustomer(
      first_name,
      last_name,
      email,
      password
    );
    res.status(201).json({
      message: "Customer created successfully",
      customerId: customer.id,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const customers = await customerService.getCustomer();
    res.status(200).json({
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "first_name, last_name, email and password are required",
      });
    }

    const result = await customerService.updateCustomer(
      id,
      first_name,
      last_name,
      email,
      password
    );
    if (result === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await customerService.deletCustomer(id);
    if (result === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
