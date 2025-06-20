import { TAddCode, TCode } from "@/types/codeType";

export interface ICodeService {
  addURL(data: TAddCode): Promise<TCode>;
  getUrl(userId: string): Promise<TCode[]>;
  findUrlByShortCode(shortCode: string): Promise<TCode | null>;
  incrementClicks(id: string): Promise<void>;
}
