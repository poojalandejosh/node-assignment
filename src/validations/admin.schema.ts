import { z } from "zod";

export const createCustomerSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  last_name: z.string().min(1, "last name is required"),
  email: z.email("valid email is required"),
  phone: z.string().min(10, "phone number is required"),
  address: z.string().min(1, "address is required"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .regex(/[A-Z]/, "password must contain at least one uppercase letter")
    .regex(/[a-z]/, "password must contain at least one lowercase letter")
    .regex(/[0-9]/, "password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "password must contain at least one special character"),
  initial_deposite: z.number().positive().optional(),
});

export const searchCustomerSchema = z.object({
  search: z.string().min(1, "search is required"),
});
