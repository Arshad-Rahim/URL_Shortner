import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/shared/constant";
import { JwtService } from "@/service/jwtService";

const tokenService = new JwtService();

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken;

    if (!token || token === "undefined" || token === "null") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      });
      return;
    }

    const payload = tokenService.verifyAccessToken(
      token
    ) as CustomJwtPayload | null;

    if (!payload || !payload.userId || !payload.email) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
      return;
    }

    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_EXPIRED,
      });
      return;
    }

    console.error("Authentication error:", error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }
};
