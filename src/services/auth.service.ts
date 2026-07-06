import jwt, { type SignOptions } from "jsonwebtoken";
import Admin from "../models/Admin.model";
import { comparePassword } from "../utils/password.util";
import Customer from "../models/Customer.model";

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
