import { Router,Response,Request,NextFunction } from "express";
import { Message } from "../models/messageModel";
import { Room } from "../models/roomModel";

const router = Router();

router.get("/:roomName",async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const roomName = req.params.roomName;
        const room = await Room.findOne({ name: roomName });
        if(!room){
            res.status(200).json([]);
            return;
        }
        const messages = await Message.find({ room: room._id })
        .populate('sender','username')
        .sort({ createdAt: 1 })
        .limit(50);
        res.status(200).json(messages);
    }catch(error){
        next(error);
    }
})
export default router;