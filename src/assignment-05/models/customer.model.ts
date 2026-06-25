import { DataTypes,Model,Optional } from "sequelize";
import sequelize from "../config/db";

interface CustomerAttributes{
    id:number;
    first_name:string;
    last_name:string;
    email:string;
    password:string;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes,"id">{}

class Customer extends Model<CustomerAttributes,CustomerCreationAttributes> implements CustomerAttributes
{
   declare id:number;
   declare first_name:string;
   declare last_name:string;
   declare email:string;
   declare password:string;
}

Customer.init({
    id:{
        type : DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    first_name:{
        type: DataTypes.STRING(100),
        allowNull:false,
    },
    last_name:{
        type: DataTypes.STRING(100),
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull:false,
        unique:true,
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull:false,
    },
},{
    sequelize,
    modelName:"Customer",
    tableName:"customer",
    timestamps:true,
})

export default Customer;