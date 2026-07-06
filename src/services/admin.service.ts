import { Op } from "sequelize";
import sequalize from "../config/db";
import Customer from "../models/Customer.model";
import Account from "../models/Account.model";
import Transaction from "../models/Transaction.model";
import { hashPassword, generatePassword } from "../utils/password.util";
// import {sendCustomerCredentials} from "./email.service";

const generateAccountNumber = () => {
  return `SA${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

export const createCustomer = async (
  adminId: number,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    initial_deposite?: number;
  }
) => {
  const plainPassword = generatePassword(8);
  const hashedPassword = await hashPassword(plainPassword);
  const initialDeposite = data.initial_deposite || 0;

  const result = await sequalize.transaction(async (t) => {
    const customer = await Customer.create(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: hashedPassword,
        created_by_admin_id: adminId,
        is_active: true,
      },
      { transaction: t }
    );
    const account = await Account.create(
      {
        customer_id: customer.id,
        account_number: generateAccountNumber(),
        balance: initialDeposite,
        account_type: "savings",
      },
      { transaction: t }
    );
    if (initialDeposite > 0) {
      await Transaction.create(
        {
          account_id: account.id,
          transaction_type: "deposit",
          amount: initialDeposite,
          balance_after: initialDeposite,
          description: "Initial deposit by admin",
          status: "completed",
        },
        { transaction: t }
      );
    }
    return { customer, account, plainPassword };
  });

  //    await sendCustomerCredentials(
  //     data.email,
  //     result.plainPassword,
  //     result.acoount.acooiunt_number
  //    )
  return {
    customerId: result.customer.id,
    accountNumber: result.account.account_number,
    temporaryPassword: result.plainPassword,
  };
};

const customerListAttributes = [
  "id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "is_active",
  "createdAt",
];

const accountListAttributes = ["account_number", "account_type", "balance"];

const customerInclude = [
  {
    model: Account,
    as: "account",
    required: false,
    attributes: accountListAttributes,
  },
];

export const getCustomers = async (search?: string) => {
  const baseQuery = {
    where: { is_active: true },
    attributes: customerListAttributes,
    include: customerInclude,
    order: [["createdAt", "ASC"]] as [string, string][],
  };

  if (search) {
    return Customer.findAll({
      ...baseQuery,
      where: {
        is_active: true,
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
    });
  }

  return Customer.findAll(baseQuery);
};

export const getCustomerById = async (id: number) => {
  return Customer.findOne({
    where: { id, is_active: true },
    attributes: customerListAttributes,
    include: customerInclude,
  });
};

export const deleteCustomer = async (id: number) => {
  const [updatedCount] = await Customer.update(
    { is_active: false },
    { where: { id, is_active: true } }
  );
  return updatedCount;
};

export const getAllTransactions = async () => {
  return Transaction.findAll({
    include: [
      {
        model: Account,
        as: "account",
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};
