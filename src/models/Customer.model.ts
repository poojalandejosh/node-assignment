import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface CustomerAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  created_by_admin_id: number;
  is_active: boolean;
  profile_image?: string | null;
}

type CustomerCreationAttributes = Optional<
  CustomerAttributes,
  "id" | "is_active"
>;

class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  declare id: number;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare password: string;
  declare phone: string;
  declare address: string;
  declare created_by_admin_id: number;
  declare is_active: boolean;
  declare profile_image?: string | null;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by_admin_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Customer",
    tableName: "customers",
    timestamps: true,
    paranoid: true,
  }
);
export default Customer;
