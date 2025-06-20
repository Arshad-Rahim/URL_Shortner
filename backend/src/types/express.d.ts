import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: CustomJwtPayload;
    cookies: { [key: string]: string };
  }
}
