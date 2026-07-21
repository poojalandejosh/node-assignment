import dotenv from "dotenv";
import sequelize from "../config/db";
import "../models/associations";
import Admin from "../models/Admin.model";
import { hashPassword } from "../utils/password.util";

dotenv.config();

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = "admin@bank.com";
    const exists = await Admin.findOne({ where: { email } });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await Admin.create({
      name: "Super Admin",
      email,
      password: await hashPassword("Test@123"),
    });

    console.log("Admin seeded:");
    console.log("Email: admin@bank.com");
    console.log("Password: Test@123");
    process.exit(0);
  } catch (error) {
    console.error("seec failed", error);
    process.exit(1);
  }
};

seedAdmin();
