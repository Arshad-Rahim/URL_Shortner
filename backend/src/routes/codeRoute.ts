import { Router, Request, Response } from "express";
import { injectedCodeController } from "@/di/codeInjection";
import { authMiddleware } from "@/middleware/authMiddleware";

export class CodeRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/shorten",
      // authMiddleware,
      (req: Request, res: Response) => injectedCodeController.addUrl(req, res)
    );

    this.router.get(
      "/urlDatas",
      // authMiddleware,
      (req: Request, res: Response) => injectedCodeController.getUrl(req, res)
    );

    this.router.get(
      "/api/urls/:shortCode",
      // authMiddleware,
      (req: Request, res: Response) =>
        injectedCodeController.getUrlDetails(req, res)
    );

    this.router.get("/:shortCode", (req: Request, res: Response) =>
      injectedCodeController.redirectUrl(req, res)
    );
  }
}

export default new CodeRoutes().router;
