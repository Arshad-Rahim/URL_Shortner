import { Types } from "mongoose";

export type TAddCode = {
  userId: string;
  longUrl: string;
  shortCode: string;
};

export type TCode = {
  _id: string | Types.ObjectId;
  userId: any;
  longUrl: string;
  shortCode: string;
  clicks: number;
  isActive: boolean;
  createdAt: Date;
};
