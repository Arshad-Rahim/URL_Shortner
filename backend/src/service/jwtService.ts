import ms from "ms";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ITokenService } from "@/interfaces/tokenServiceInterface/tokenServiceInterface";

export class JwtService implements ITokenService {
  private _accessSecret: Secret;
  private _accessExpiresIn: string;
  private _refreshExpiresIn: string;

  constructor() {
    this._accessSecret = (process.env.JWT_SECRET as Secret) || "secret";
    this._accessExpiresIn = process.env.JWT_ACCESS_EXPIRES || "3h";
    this._refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || "24h";
  }

  generateAccessToken(payload: { id: string; email: string }): string {
    return jwt.sign(
      { userId: payload.id, email: payload.email },
      this._accessSecret,
      {
        expiresIn: this._accessExpiresIn as ms.StringValue,
      }
    );
  }

  generateRefreshToken(payload: { id: string; email: string }): string {
    return jwt.sign(
      { userId: payload.id, email: payload.email },
      this._accessSecret,
      {
        expiresIn: this._refreshExpiresIn as ms.StringValue,
      }
    );
  }

  verifyAccessToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, this._accessSecret) as JwtPayload;
    } catch (error) {
      console.error("Access token verification failed:", error);
      return null;
    }
  }

  verifyRefreshtoken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, this._accessSecret) as JwtPayload;
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }

  decodeAccessToken(token: string): JwtPayload | null {
    try {
      console.log("token inside the decode token in the token service", token);
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      console.error("Refresh token verification failed:", error);
      return null;
    }
  }
}
