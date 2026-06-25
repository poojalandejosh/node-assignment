import { Router } from "express";
import * as authService from "../services/auth.service";

const router = Router();

router.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }
        const {token} = await authService.login(email,password);

        res.status(200).json({
            message:"Login successful",
            token
        });
    }catch(error){
        const message = error instanceof Error ? error.message : "Internal server error";
        if(message === "Customer not found" || message === "Invalid password"){
            return res.status(401).json({message});
        }
        return res.status(500).json({message:"Internal server error"});
    }
})
export default router;