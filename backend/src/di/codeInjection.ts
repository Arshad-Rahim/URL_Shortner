import { CodeController } from "@/controller/codeController";
import { CodeRepository } from "@/repository/codeRepository";
import { CodeService } from "@/service/codeService";


const codeRepository = new CodeRepository();
const codeService = new CodeService(codeRepository);

export const injectedCodeController = new CodeController(codeService);

