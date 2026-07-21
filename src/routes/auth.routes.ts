import { Router } from "express";
import validateBody from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import {
  adminLoginSchema,
  changePasswordSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.schema";
import { customerMiddleware } from "../middleware/customer.middleware";
import authControllers from "../controllers/auth.controllers";

const router = Router();

router.post(
  "/admin/login",
  validateBody(adminLoginSchema),
  authControllers.adminLogin
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
  authControllers.customerLogin
);

const forgotPasswordMessage =
  "If the email exists, password reset instructions have been sent";

router.post(
  "/admin/forgot-password",
  validateBody(forgotPasswordSchema),
  authControllers.forgotPassword
);

router.post(
  "/admin/reset-password",
  validateBody(resetPasswordSchema),
  authControllers.resetPassword
);

router.post(
  "/customer/forgot-password",
  validateBody(forgotPasswordSchema),
  authControllers.forgotPassword
);

router.post(
  "/customer/reset-password",
  validateBody(resetPasswordSchema),
  authControllers.resePasswordCustomer
);

router.put(
  "/admin/change-password",
  authMiddleware,
  adminMiddleware,
  validateBody(changePasswordSchema),
  authControllers.adminChangePassword
);

router.put(
  "/customer/change-password",
  authMiddleware,
  customerMiddleware,
  validateBody(changePasswordSchema),
  authControllers.customerChangePassword
);

export default router;

