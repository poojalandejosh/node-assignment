import { z } from "zod";

export const updateCustomerSchema = z
  .object({
    phone: z.string().min(10, "phone must be at least 10 digits").optional(),
    address: z.string().min(1, "address is required").optional(),
  })
  .refine((data) => data.phone || data.address, {
    message: "At least phone or address is required",
  });

export const depositeSchema = z.object({
  amount: z.number().positive("amount must be greater than 0"),
});

export const withdrawSchema = z.object({
  amount: z.number().positive("amount must be greater than 0"),
});
