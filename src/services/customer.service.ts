import sequalize from "../config/db";
import Customer from "../models/Customer.model";
import Account from "../models/Account.model";
import Transaction from "../models/Transaction.model";

const customerAttributes = [
  "id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "is_active",
  "createdAt",
];

const accountAttributes = ["account_number", "account_type", "balance"];

const getCustomerAccount = async (customerId: number) => {
  return Account.findOne({
    where: { customer_id: customerId },
    include: [
      {
        model: Customer,
        as: "customer",
        where: { id: customerId, is_active: true },
        attributes: [],
      },
    ],
  });
};

export const getDashboard = async (customerId: number) => {
  return Customer.findOne({
    where: { id: customerId, is_active: true },
    attributes: customerAttributes,
    include: [
      {
        model: Account,
        as: "account",
        attributes: accountAttributes,
      },
    ],
  });
};

export const updateProfile = async (
  customerId: number,
  data: { phone?: string; address?: string }
) => {
  const customer = await Customer.findOne({
    where: { id: customerId, is_active: true },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (data.phone) {
    customer.phone = data.phone;
  }

  if (data.address) {
    customer.address = data.address;
  }

  await customer.save();
  return getDashboard(customerId);
};

export const deposite = async (customerId: number, amount: number) => {
  return sequalize.transaction(async (t) => {
    const account = await getCustomerAccount(customerId);
    if (!account) {
      throw new Error("Account not found");
    }
    const newBalance = Number(account.balance) + Number(amount);
    await account.update({ balance: newBalance }, { transaction: t });

    await Transaction.create(
      {
        account_id: account.id,
        transaction_type: "deposit",
        amount,
        balance_after: newBalance,
        description: "Customer deposite",
        status: "completed",
      },
      { transaction: t }
    );

    return { balance: newBalance };
  });
};

export const withdraw = async (customerId: number, amount: number) => {
  return sequalize.transaction(async (t) => {
    const account = await getCustomerAccount(customerId);
    if (!account) {
      throw new Error("Account not found");
    }
    const currentBalance = Number(account.balance);
    if (amount > currentBalance) {
      throw new Error("Insufficient balance");
    }
    const newBalance = currentBalance - amount;
    await account.update({ balance: newBalance }, { transaction: t });

    await Transaction.create(
      {
        account_id: account.id,
        transaction_type: "withdraw",
        amount,
        balance_after: newBalance,
        description: "Customer withdraw",
        status: "completed",
      },
      { transaction: t }
    );

    return { balance: newBalance };
  });
};

export const getMyTransaction = async (customerId: number) => {
  const account = await Account.findOne({
    where: { customer_id: customerId },
  });
  if (!account) return [];

  return Transaction.findAll({
    where: { account_id: account.id },
    order: [["createdAt", "DESC"]],
  });
};
