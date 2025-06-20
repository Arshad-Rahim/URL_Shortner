import { IUserRepository } from "@/interfaces/repositoryInterfaces/IUserRepository";
import { TUserRegister, TUserModel } from "../types/userType";
import { userModel } from "@/models/userModel";


export class UserRepository implements IUserRepository{
    async createUser(data: TUserRegister): Promise<void | TUserModel> {
        const userData = await userModel.create(data);
        return userData;
    }

    async findByEmail(email: string): Promise<TUserModel | null> {
        const user = await userModel.findOne({email});
        return user;
    }
}