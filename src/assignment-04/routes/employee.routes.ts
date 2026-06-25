import { Router } from "express";
import * as employeeService from "../services/employee.service.ts";
import { validate } from "../middleware/validate.middleware.ts";
import {
  employeeBodySchema,
  employeeIdSchema,
} from "../validators/employee.validator.ts";

const router = Router();

router.post("/", validate(employeeBodySchema), async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const result = await employeeService.createEmployee(
      first_name,
      last_name,
      email,
      password
    );

    res.status(201).json({
      message: "Employee created successfully",
      employee: result.insertId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.log("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await employeeService.getEmployee();

    if(!result || result.length === 0){
      return res.status(404).json({
         message: "No employees found" ,
         employees:[],
        });
    }
  
    res.status(200).json({
      message: "Employee fetched successfully",
      result,
    });

  } catch (error) {
    console.log("Error fetching employee:", error);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.put(
  "/:id",
  validate(employeeIdSchema, "params"),
  validate(employeeBodySchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password } = req.body;
      const result = await employeeService.updateEmployee(
        String(id),
        first_name,
        last_name,
        email,
        password
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        message: "Employee updated successfully",
        employee: result.affectedRows,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists") {
        return res.status(409).json({ message: "Email already exists" });
      }
      console.log("Error updating employee:", error);
      res.status(500).json({ error: "Failed to update employee" });
    }
  }
);

router.delete("/:id", validate(employeeIdSchema, "params"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await employeeService.deleteEmployee(String(id));

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      employee: result.affectedRows,
    });
  } catch (error) {
    console.log("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

export default router;
