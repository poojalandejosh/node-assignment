import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const customerLoginSchema = z.object({
  email: z.email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
});
