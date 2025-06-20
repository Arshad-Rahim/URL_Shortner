import { UserController } from "@/controller/userController";
import { UserRepository } from "@/repository/userRepository";
import { JwtService } from "@/service/jwtService";
import { UserService } from "@/service/userService";


const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const jwtService = new JwtService();


export const injectedUserController = new UserController(userService,jwtService);
