import { ICodeRepository } from "@/interfaces/repositoryInterfaces/ICodeRepository";
import { codeModel } from "@/models/codeModel";
import { TAddCode, TCode } from "@/types/codeType";

export class CodeRepository implements ICodeRepository {
  async addURL(data: TAddCode): Promise<TCode> {
    const urlData = await codeModel.create(data);
    return urlData;
  }

  async getUrl(userId: string): Promise<TCode[]> {
    const urlDatas = await codeModel.find({ userId });
    return urlDatas;
  }

  async findUrlByShortCode(shortCode: string): Promise<TCode | null> {
    const urlData = await codeModel.findOne({ shortCode });
    return urlData;
  }

  async incrementClicks(id: string): Promise<void> {
    await codeModel.updateOne({ _id: id }, { $inc: { clicks: 1 } });
  }
}