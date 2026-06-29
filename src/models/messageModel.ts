import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "./userModel";

export interface IMessage extends Document {
    room: Types.ObjectId;
    sender: Types.ObjectId;
    messageText: string;
    createdAt: Date;
    updatedAt: Date;
  }

  const messageSchema = new Schema<IMessage>(
    {
      room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      messageText: { type: String, required: true },
    },
    { timestamps: true }
  );

  export const Message = model<IMessage>("Message", messageSchema);