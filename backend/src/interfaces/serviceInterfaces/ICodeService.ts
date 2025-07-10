import { TAddCode, TCode } from "@/types/codeType";

export interface ICodeService {
  addURL(data: TAddCode): Promise<TCode>;
  getUrl(
    userId: string,
    page?: number,
    limit?: number,
    search?:string
  ): Promise<{ urls: TCode[]; total: number }>;
  findUrlByShortCode(shortCode: string): Promise<TCode | null>;
  incrementClicks(id: string): Promise<void>;
}
