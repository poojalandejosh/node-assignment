import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const customerLoginSchema = z.object({
  email: z.email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

const newPasswordField = z
  .string()
  .min(8, "password must be at least 8 characters")
  .regex(/[A-Z]/, "password must contain at least one uppercase letter")
  .regex(/[0-9]/, "password must contain at least one number");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    new_password: newPasswordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("valid email is required"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "reset token is required"),
    new_password: newPasswordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

