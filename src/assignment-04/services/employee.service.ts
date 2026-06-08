import pool from "../config/db.ts";
import type { ResultSetHeader } from "mysql2";

export const createEmployee = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
    const [result] = (await pool.execute(
        "insert into employee(first_name,last_name,email,password) values(?,?,?,?)",
        [first_name,last_name,email,password]
    )) as [ResultSetHeader, unknown];

    console.log("result is:", result);

    return result;
};

export const getEmployee = async()=>{
    const [row] = await pool.execute("select * from employee");

    console.log("row is:", row);
    return row;
}

export const updateEmployee = async(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string
)=>{
  const [result]= (await pool.execute(
    "update employee set first_name=?,last_name=?,email=?,password=? where id=?",
    [first_name,last_name,email,password,id]
  )) as [ResultSetHeader, unknown];

  console.log("result is:", result);

  return result;
}

export const deleteEmployee = async(id:string)=>{
    const [result] = (await pool.execute(
        "delete from employee where id=?",[id]
        )) as [ResultSetHeader, unknown];

  console.log("result is:", result);

  return result;
}
 
