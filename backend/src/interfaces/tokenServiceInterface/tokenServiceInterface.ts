import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
  generateAccessToken(payload: {
    id: string;
    email: string;
  }): string;
  generateRefreshToken(payload: {
    id: string;
    email: string;
  }): string;
  verifyAccessToken(token: string): string | JwtPayload | null;
  verifyRefreshtoken(token: string): string | JwtPayload | null;
  decodeAccessToken(token: string): JwtPayload | null;
}
