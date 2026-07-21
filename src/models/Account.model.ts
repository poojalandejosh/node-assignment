import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface AccountAttributes {
  id: number;
  customer_id: number;
  account_number: string;
  account_type: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type AccountCreationAttributes = Optional<
  AccountAttributes,
  "id" | "balance" | "account_type"
>;

class Account
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  declare id: number;
  declare customer_id: number;
  declare account_number: string;
  declare account_type: string;
  declare balance: number;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "savings",
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "accounts",
    timestamps: true,
    paranoid: true,
    hooks: {},
  }
);

export default Account;
