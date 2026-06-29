import { Schema, model, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const Room = model<IRoom>("Room", roomSchema);