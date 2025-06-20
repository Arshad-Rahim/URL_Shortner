import { injectedUserController } from "@/di/userInjection";
import { validateDTO } from "@/middleware/validateDTO";
import { RegisterSchema } from "@/validation/registerValidation";
import { Request, Response, Router } from "express";


export class Routes{
    public router = Router();

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes(){
       
        this.router.post(
          "/register/user",
          validateDTO(RegisterSchema),
          (req: Request, res: Response) =>
            injectedUserController.registerUser(req, res)
        );


        this.router.post(
          "/login",
          (req: Request, res: Response) =>
            injectedUserController.loginUser(req, res)
        );
    }

}


export default new Routes().router;

