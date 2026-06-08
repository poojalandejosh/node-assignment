import { Router } from "express";
import * as employeeService from "../services/employee.service.ts";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const result = await employeeService.createEmployee(
      first_name,
      last_name,
      email,
      password
    );

    res.status(201).json({
        message: "Employee created successfully",
        employee: result.insertId,
      });

    console.log("result is:", result);
  } catch(error){
    console.log("Error creating employee:",error);
    res.status(500).json({error:"Failed to create employee"});
  }
});

router.get('/',async(req,res)=>{
    try{
        const result = await employeeService.getEmployee();
        res.status(200).json({message:"Employee fetched successfully",employees:result});
    }catch(error){
        console.log("Error fetching employee:",error);
        res.status(500).json({error:"Failed to fetch employee"});
    }
})

router.put('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {first_name,last_name,email,password} = req.body;
        const result = await employeeService.updateEmployee(id,first_name,last_name,email,password);
        res.status(200).json({message:"Employee updated successfully",employee:result.affectedRows});
    }catch(error){
        console.log("Error updating employee:",error);
        res.status(500).json({error:"Failed to update employee"});
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await employeeService.deleteEmployee(id);
        res.status(200).json({message:"Employee deleted successfully",employee:result.affectedRows});
    }catch(error){
        console.log("Error deleting employee:",error);
        res.status(500).json({error:"Failed to delete employee"});
    }
})

export default router;