import mongoose, { Types } from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true, // Ensure unique short codes
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const codeModel = mongoose.model("code", codeSchema);
