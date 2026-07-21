import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import validateBody from "../middleware/validate.middleware";
import { createCustomerSchema } from "../validations/admin.schema";
import adminController from "../controllers/admin.controllers";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post(
  "/customers",
  validateBody(createCustomerSchema),
  adminController.createCustomers
);

router.get("/customers", adminController.getCustomers);

router.get("/customers/:id", adminController.getCustomerById);

router.delete("/customers/:id", adminController.deleteCustomerById);

router.get("/transactions", adminController.getTransactions);

export default router;
