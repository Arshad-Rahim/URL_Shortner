import { TUserModel, TUserRegister } from "../../types/userType";


export interface IUserRepository {
  createUser(data: TUserRegister): Promise<void | TUserModel>;
  findByEmail(email: string): Promise<TUserModel |null>;
}