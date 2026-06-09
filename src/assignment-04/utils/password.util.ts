import bcrypt from "bcrypt";

export const hashPassword = async(password:string)=>{
   return bcrypt.hash(password,10);
}

export const comparePassword = (password:string,hashPasword:string): Promise<boolean> =>{
  return bcrypt.compare(password,hashPasword);
}


