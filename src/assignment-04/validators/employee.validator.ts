import { z } from "zod";

export const employeeBodySchema = z.object({
  first_name: z.string().min(1, "first_name is required").max(100),
  last_name: z.string().min(1, "last_name is required").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const employeeIdSchema = z.object({
  id: z.coerce.number().int().positive("Invalid employee id"),
});
