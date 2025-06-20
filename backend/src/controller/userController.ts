import { IUserService } from "@/interfaces/serviceInterfaces/IUserService";
import { ITokenService } from "@/interfaces/tokenServiceInterface/tokenServiceInterface";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "@/shared/constant";
import { setAuthCookies } from "@/utils/cookieHelper";
import { CustomError } from "@/utils/customError";
import { RegisterDTO } from "@/validation/registerValidation";
import { Request, Response } from "express";


export class UserController{
    constructor(
      private _userService:IUserService,
      private _jwtService:ITokenService
    ){}

    async registerUser(req:Request,res:Response){
        try {
            let data:RegisterDTO = req.body;

            await this._userService.registerUser(data);

            res.status(HTTP_STATUS.CREATED).json({
              success: true,
              message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
            });
        } catch (error) {
            if (error instanceof CustomError) {
              res
                .status(error.statusCode)
                .json({ success: false, message: error.message });
              return;
            }
            console.log(error);
            res
              .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
              .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
        }
    }


    async loginUser(req:Request,res:Response){
      try {
        const data = req.body;

        const user = await this._userService.loginUser(data);

        if (!user || !user._id || !user.email) {
          throw new Error("User data is missing or incomplete");
        }
  
        const accessToken = this._jwtService.generateAccessToken({
          id: user._id.toString(),
          email: user.email,
        });

        const refreshToken = this._jwtService.generateRefreshToken({
          id:user._id.toString(),
          email:user.email
        })

        setAuthCookies(
          res,
          accessToken,
          refreshToken
        )

        res.status(HTTP_STATUS.OK).json({
          message:SUCCESS_MESSAGES.LOGIN_SUCCESS,
          user:{id:user?._id,name:user?.name,email:user?.email}
        })
        
      } catch (error) {
        if (error instanceof CustomError) {
          res
            .status(error.statusCode)
            .json({ success: false, message: error.message });
          return;
        }
        console.log(error);
        res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
}