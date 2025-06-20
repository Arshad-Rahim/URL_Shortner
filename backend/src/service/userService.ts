import { IUserRepository } from "@/interfaces/repositoryInterfaces/IUserRepository";
import { IUserService } from "@/interfaces/serviceInterfaces/IUserService";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/shared/constant";
import { TUserLogin, TUserModel, TUserRegister } from "@/types/userType";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { CustomError } from "@/utils/customError";


export class UserService implements IUserService{
    constructor(private _userRepository:IUserRepository){}

    async registerUser(data: TUserRegister): Promise<void> {
        const alredyExisting = await this._userRepository.findByEmail(data.email);
        if(alredyExisting){
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS,HTTP_STATUS.CONFLICT)
        }
        let hashedPassword = '';
        if (data.password) {
          hashedPassword = await hashPassword(data.password);
        }

        const newUser = {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        };

        await this._userRepository.createUser(newUser);
    }

    async loginUser(data:TUserLogin):Promise<TUserModel |null>{
      const userData = await this._userRepository.findByEmail(data.email);
      if(!userData){
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        )
      }

      if(userData && userData.password){
        const valid = await comparePassword(data.password,userData.password);
        if(!valid){
          throw new CustomError(
            ERROR_MESSAGES.INVALID_PASSWORD,
            HTTP_STATUS.UNAUTHORIZED
          )
        }
      }

      return userData;

    }
}