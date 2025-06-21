import { Request, Response } from "express";
import { ITokenService } from "@/interfaces/tokenServiceInterface/tokenServiceInterface";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "@/shared/constant";
import { setAuthCookies } from "@/utils/cookieHelper";
import { CustomError } from "@/utils/customError";
import { CustomJwtPayload } from "@/middleware/authMiddleware";

export class RefreshController {
  constructor(private _jwtService: ITokenService) {}

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (
        !refreshToken ||
        refreshToken === "undefined" ||
        refreshToken === "null"
      ) {
        throw new CustomError(
          ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const payload = this._jwtService.verifyRefreshtoken(
        refreshToken
      ) as CustomJwtPayload | null;

      if (!payload || !payload.userId || !payload.email) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_REFRESH_TOKEN,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const newAccessToken = this._jwtService.generateAccessToken({
        id: payload.userId,
        email: payload.email,
      });

      setAuthCookies(res, newAccessToken, refreshToken);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
        accessToken: newAccessToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.error("Refresh token error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }
}
