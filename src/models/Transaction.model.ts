import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface TransactionAttributes {
  id: number;
  account_id: number;
  transaction_type: "deposit" | "withdraw";
  amount: number;
  balance_after: number;
  status: "completed" | "failed";
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id" | "status" | "description"
>;

class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  declare id: number;
  declare account_id: number;
  declare transaction_type: "deposit" | "withdraw";
  declare amount: number;
  declare balance_after: number;
  declare status: "completed" | "failed";
  declare description?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("deposit", "withdraw"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    balance_after: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "failed"),
      allowNull: false,
      defaultValue: "completed",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
  }
);

export default Transaction;
