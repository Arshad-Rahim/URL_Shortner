import { ICodeRepository } from "@/interfaces/repositoryInterfaces/ICodeRepository";
import { codeModel } from "@/models/codeModel";
import { TAddCode, TCode } from "@/types/codeType";

export class CodeRepository implements ICodeRepository {
  async addURL(data: TAddCode): Promise<TCode> {
    const urlData = await codeModel.create(data);
    return urlData;
  }

  async getUrl(
    userId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{ urls: TCode[]; total: number }> {
    const skip = (page - 1) * limit;
    const urls = await codeModel.find({ userId }).sort({createdAt:-1}).skip(skip).limit(limit);
    const total = await codeModel.countDocuments({ userId });
    return { urls, total };
  }

  async findUrlByShortCode(shortCode: string): Promise<TCode | null> {
    const urlData = await codeModel.findOne({ shortCode });
    return urlData;
  }

  async incrementClicks(id: string): Promise<void> {
    await codeModel.updateOne({ _id: id }, { $inc: { clicks: 1 } });
  }
}
