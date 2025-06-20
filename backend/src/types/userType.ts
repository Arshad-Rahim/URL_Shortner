import { Types } from "mongoose";

export type TUserRegister = {
  name: string;
  email: string;
  password: string;
};

export type TUserModel = {
  name: string;
  email: string;
  password?: string | null | undefined;
  _id?: Types.ObjectId;
};

export type TUserLogin = {
  email: string;
  password: string;
};
