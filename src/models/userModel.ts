import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
