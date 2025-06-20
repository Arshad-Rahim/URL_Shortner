import { TUserLogin, TUserModel, TUserRegister } from "@/types/userType";

export  interface IUserService{
    registerUser(data:TUserRegister):Promise<void>;
    loginUser(data:TUserLogin):Promise<TUserModel |null>;
}