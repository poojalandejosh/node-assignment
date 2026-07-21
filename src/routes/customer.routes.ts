import { Router } from "express";
import validateBody from "../middleware/validate.middleware.ts";
import {
  updateCustomerSchema,
  depositeSchema,
  withdrawSchema,
} from "../validations/customer.schema.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { customerMiddleware } from "../middleware/customer.middleware.ts";
import { upload } from "../middleware/upload.middleware.ts";
import customerControllers from "../controllers/customer.controllers.ts";
const router = Router();

router.use(authMiddleware);
router.use(customerMiddleware);

router.get("/dashboard", customerControllers.getDashboard);

router.put(
  "/profile",
  validateBody(updateCustomerSchema),
  customerControllers.updateProfile
);

router.post(
  "/deposit",
  validateBody(depositeSchema),
  customerControllers.depositAmount
);

router.post(
  "/withdraw",
  validateBody(withdrawSchema),
  customerControllers.withdrawAmount
);

router.get("/transactions", customerControllers.fetchTransactions);

router.post(
  "/profile/photo",
  upload.single("photo"),
  customerControllers.uploadProfileImage
)

export default router;
