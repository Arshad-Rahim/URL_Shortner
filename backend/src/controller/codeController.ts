import { Request, Response } from "express";
import { ICodeService } from "@/interfaces/serviceInterfaces/ICodeService";
import { CustomRequest } from "@/middleware/authMiddleware";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "@/shared/constant";
import { CustomError } from "@/utils/customError";

export class CodeController {
  constructor(private _codeService: ICodeService) {}

  async addUrl(req: Request, res: Response) {
    try {
      const { originalUrl, customAlias } = req.body;
      const user = (req as CustomRequest).user;
      const userId = user?.userId;

      if (!originalUrl) {
        throw new CustomError(
          ERROR_MESSAGES.ORIGINAL_URL_REQUIRED,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const data = {
        longUrl: originalUrl,
        shortCode: customAlias || this.generateShortCode(),
        userId,
      };

      const urlData = await this._codeService.addURL(data);

      const responseData = {
        id: urlData._id.toString(),
        originalUrl: urlData.longUrl,
        shortUrl: `${process.env.BASE_URL}/${urlData.shortCode}`,
        shortCode: urlData.shortCode,
        clicks: urlData.clicks || 0,
        createdAt: urlData.createdAt.toISOString().split("T")[0],
      };

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.CREATED,
        ...responseData,
      });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      if (error.code === 11000 && error.keyPattern?.shortCode) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Custom alias already exists",
        });
        return;
      }
      console.error("Add URL error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getUrl(req: Request, res: Response) {
    try {
      const user = (req as CustomRequest).user;
      const userId = user?.userId;
      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      if (page < 1 || limit < 1) {
        throw new CustomError(
          "Page and limit must be positive integers",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const { urls, total } = await this._codeService.getUrl(
        userId,
        page,
        limit
      );

      const urlDatas = urls.map((url) => ({
        _id: url._id.toString(),
        longUrl: url.longUrl,
        shortCode: url.shortCode,
        clicks: url.clicks || 0,
        createdAt: url.createdAt,
      }));

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED_SUCCESS,
        urlDatas,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.error("Get URLs error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async redirectUrl(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      if (!shortCode) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_SHORT_CODE,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const url = await this._codeService.findUrlByShortCode(shortCode);
      if (!url) {
        throw new CustomError(
          ERROR_MESSAGES.URL_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      try {
        new URL(url.longUrl);
      } catch {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_URL,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await this._codeService.incrementClicks(url._id.toString());
      res.redirect(302, url.longUrl);
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.error("Redirect URL error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  async getUrlDetails(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const user = (req as CustomRequest).user;
      const userId = user?.userId;

      if (!userId) {
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_NOT_FOUND,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const url = await this._codeService.findUrlByShortCode(shortCode);
      if (!url || url.userId !== userId) {
        throw new CustomError(
          ERROR_MESSAGES.URL_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const responseData = {
        id: url._id.toString(),
        originalUrl: url.longUrl,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode,
        clicks: url.clicks || 0,
        createdAt: url.createdAt.toISOString().split("T")[0],
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED_SUCCESS,
        ...responseData,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
        return;
      }
      console.error("Get URL details error:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  }

  private generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
