import jwt, { type SignOptions } from "jsonwebtoken";
import Admin from "../models/Admin.model";
import { comparePassword, hashPassword } from "../utils/password.util";
import Customer from "../models/Customer.model";
import { sendPasswordResetEmail } from "./email.service";

interface ResetTokenPayload {
  id: number;
  role: "admin" | "customer";
  purpose: "password_reset";
}

const createResetToken = (id: number, role: "admin" | "customer"): string => {
  const signOptions: SignOptions = {
    expiresIn: "15m",
  };

  return jwt.sign(
    { id, role, purpose: "password_reset" },
    process.env.JWT_SECRET!,
    signOptions
  );
};

const verifyResetToken = (token: string, role: "admin" | "customer"): number => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as ResetTokenPayload;

  if (payload.role !== role || payload.purpose !== "password_reset") {
    throw new Error("Invalid or expired reset token");
  }

  return payload.id;
};

export const adminLogin = async (email: string, password: string) => {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const isMatch = await comparePassword(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES || "1h") as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    { id: admin.id, role: "admin" },
    process.env.JWT_SECRET!,
    signOptions
  );
  return token;
};

export const customerLogin = async (email: string, password: string) => {
  const customer = await Customer.findOne({
    where: { email, is_active: true },
  });
  if (!customer) {
    throw new Error("Customer not found");
  }

  const isMatch = await comparePassword(password, customer.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES || "1h") as SignOptions["expiresIn"],
  };

  return jwt.sign(
    { id: customer.id, role: "customer" },
    process.env.JWT_SECRET!,
    signOptions
  );
};

export const changePassword = async (
  adminId: string,
  currentPassword: string,
  newPassword: string
) => {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(currentPassword, admin.password);
  if (!isMatch) {
    throw new Error("Invalid current password");
  }

  admin.password = await hashPassword(newPassword);
  await admin.save();
  return admin;
};

export const forgotAdminPassword = async (email: string): Promise<string | null> => {
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return null;
  }

  const resetToken = createResetToken(admin.id, "admin");
  await sendPasswordResetEmail(email, resetToken, "admin");
  return resetToken;
};

export const resetAdminPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const adminId = verifyResetToken(token, "admin");
  const admin = await Admin.findByPk(adminId);

  if (!admin) {
    throw new Error("User not found");
  }

  admin.password = await hashPassword(newPassword);
  await admin.save();
};

export const changeCustomerPassword = async (
  customerId: string,
  currentPassword: string,
  newPassword: string
) => {
  const customer = await Customer.findOne({
    where: { id: customerId, is_active: true },
  });
  if (!customer) {
    throw new Error("Customer not found");
  }
  const isMatch = await comparePassword(currentPassword, customer.password);
  if (!isMatch) {
    throw new Error("Invalid current password");
  }
  customer.password = await hashPassword(newPassword);
  await customer.save();
  return customer;
};

export const forgotCustomerPassword = async (
  email: string
): Promise<string | null> => {
  const customer = await Customer.findOne({
    where: { email, is_active: true },
  });

  if (!customer) {
    return null;
  }

  const resetToken = createResetToken(customer.id, "customer");
  await sendPasswordResetEmail(email, resetToken, "customer");
  return resetToken;
};

export const resetCustomerPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const customerId = verifyResetToken(token, "customer");
  const customer = await Customer.findOne({
    where: { id: customerId, is_active: true },
  });

  if (!customer) {
    throw new Error("User not found");
  }

  customer.password = await hashPassword(newPassword);
  await customer.save();
};
