import express from "express";
import dotenv from "dotenv";
import pool from "./db.ts";
import cors from "cors";
import type { ResultSetHeader } from "mysql2";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/employee", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    console.log("request body:", req.body);

    const [result] = (await pool.execute(
      "insert into employee(first_name,last_name,email,password) values(?,?,?,?)",
      [first_name, last_name, email, password]
    )) as [ResultSetHeader, unknown];

    console.log("result is:", result);

    res.status(201).json({
      message: "Employee created successfully",
      employeeId: result.insertId,
    });
    
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});


app.get("/employee", async (req, res) => {
  try {
    const [row] = await pool.execute("select * from employee");

    console.log("row is:", row);
    res
      .status(200)
      .json({ message: "Employees fetched successfully", employees: row });
  } catch (error) {
    console.log("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

app.put("/employee/:id", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const id = req.params.id;

    const [result] = (await pool.execute(
      "update employee set  first_name=?,last_name=?,email=?,password=? where id=?",
      [first_name, last_name, email, password, id]
    )) as [ResultSetHeader, unknown];

    console.log("result is :", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully" });

  } catch (error) {
    console.log("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

app.delete("/employee/:id",async(req,res)=>{
    try{
      const {id} = req.params;

      const [result] = await pool.execute(
        "delete from employee where id=?",[id]
      ) as [ResultSetHeader,unknown];

      console.log("result is :",result);

      if(result.affectedRows === 0){
        return res.status(404).json({message:"Employee not found"})
      }
      res.status(200).json({message:"Employee deleted successfully"})
         
    }catch(error){   
      console.log("Error deleting employee:",error);
      res.status(500).json({error:"Failed to delete employee"})
    }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
