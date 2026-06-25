import jwt from "jsonwebtoken";
import * as customerService from "./customer.service";

export const login = async (email:string,password:string)=>{
    const customer = await customerService.findCustomerByEmail(email);
    if(!customer){
        throw new Error("Customer not found");
    }
    const isValid = await customerService.validateCustomerPassword(password,customer.password);
    if(!isValid){
        throw new Error("Invalid password");
    }
    const token = jwt.sign({id:customer.id},process.env.JWT_SECRET!,{expiresIn:"1h"});
    return {token};   
}
