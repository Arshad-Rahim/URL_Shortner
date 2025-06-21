import { Router, Request, Response } from "express";
import { injectedUserController } from "@/di/userInjection";
import { validateDTO } from "@/middleware/validateDTO";
import { RegisterSchema } from "@/validation/registerValidation";
import { JwtService } from "@/service/jwtService"; 
import { RefreshController } from "@/controller/refreshController";

const jwtService = new JwtService(); 
const refreshController = new RefreshController(jwtService); 
export class Routes {
  public router = Router();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/register/user",
      validateDTO(RegisterSchema),
      (req: Request, res: Response) =>
        injectedUserController.registerUser(req, res)
    );

    this.router.post("/login", (req: Request, res: Response) =>
      injectedUserController.loginUser(req, res)
    );

    this.router.post("/logout", (req: Request, res: Response) =>
      injectedUserController.logoutUser(req, res)
    );

    this.router.post("/refresh", (req: Request, res: Response) =>
      refreshController.refreshToken(req, res)
    );
  }
}

export default new Routes().router;
