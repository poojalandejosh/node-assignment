import pool from "../config/db.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { hashPassword } from "../utils/password.util.ts";

export const findEmployeeByEmail = async (email: string) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id FROM employee WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] ?? null;
};

export const createEmployee = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) => {
    const existingEmployee = await findEmployeeByEmail(email);
    if (existingEmployee) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const [result] = (await pool.execute(
        "insert into employee(first_name,last_name,email,password) values(?,?,?,?)",
        [first_name,last_name,email,hashedPassword]
    )) as [ResultSetHeader, unknown];

    console.log("result is:", result);

    return result;
};

export const getEmployee = async()=>{
    const [row] = await pool.execute<RowDataPacket[]>(
      "SELECT id, first_name, last_name, email FROM employee"
    );

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
    const [existingRows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM employee WHERE email = ? AND id != ? LIMIT 1",
      [email, id]
    );
    if (existingRows[0]) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

  const [result]= (await pool.execute(
    "update employee set first_name=?,last_name=?,email=?,password=? where id=?",
    [first_name,last_name,email,hashedPassword,id]
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
 
