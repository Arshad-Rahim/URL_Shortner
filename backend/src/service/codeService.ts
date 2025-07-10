import { ICodeRepository } from "@/interfaces/repositoryInterfaces/ICodeRepository";
import { ICodeService } from "@/interfaces/serviceInterfaces/ICodeService";
import { TAddCode, TCode } from "@/types/codeType";

export class CodeService implements ICodeService {
  constructor(private _codeRepository: ICodeRepository) {}

  async addURL(data: TAddCode): Promise<TCode> {
    const urlData = await this._codeRepository.addURL(data);
    return urlData;
  }

  async getUrl(
    userId: string,
    page: number = 1,
    limit: number = 5,
    search: string = ""
  ): Promise<{ urls: TCode[]; total: number }> {
    const { urls, total } = await this._codeRepository.getUrl(
      userId,
      page,
      limit,
      search
    );
    return { urls, total };
  }

  async findUrlByShortCode(shortCode: string): Promise<TCode | null> {
    const urlData = await this._codeRepository.findUrlByShortCode(shortCode);
    return urlData;
  }

  async incrementClicks(id: string): Promise<void> {
    await this._codeRepository.incrementClicks(id);
  }
}
