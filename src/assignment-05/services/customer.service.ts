import Customer from "../models/Customer.model";
import { hasPassword, comparePassword } from "../utils/password.util";

export const createCustomer =  async(
    first_name:string,
    last_name:string,
    email:string,
    password:string
)=>{
    const hashedPassword = await hasPassword(password);
    const customer = await Customer.create({
        first_name,
        last_name,
        email,
        password:hashedPassword
    })
    return customer;
}

export const getCustomer = async()=>{
    return Customer.findAll({
        attributes:{exclude:["password"]}
    })
}

export const updateCustomer = async(
    id:number,
    first_name:string,
    last_name:string,
    email:string,
    password:string
)=>{
    const hashedPassword = await hasPassword(password);

    const [affectedRows] = await Customer.update({
        first_name,
        last_name,
        email,
        password:hashedPassword
    },{
        where: { id }
    })
    return affectedRows;
}

export const deletCustomer = async(id:number)=>{
    const affectedRows = await Customer.destroy({where: { id }})
    return affectedRows;
}

export const findCustomerByEmail = async(email:string)=>{
    return Customer.findOne({
        where: { email }
    })
}

export const validateCustomerPassword = async(plainPassword:string,hashedPassword:string)=>{
    return await comparePassword(plainPassword,hashedPassword);
}
