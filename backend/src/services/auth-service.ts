import bcrypt from "bcrypt";
import AuthProvider from "../providers/auth-provider.js";
import ApiError from "../error/api-error.js";
import { SequelizeData } from "../db/db.js";
import { AuthModel } from "../types/auth-type.js";
import UserService from "./user-service.js";

export default class AuthService {
    
    constructor(
        private authProvider: AuthProvider, private sequelizeData: SequelizeData, private userService: UserService
    ) {}
    
    async login(username: string, password: string): Promise<number> {
        const credentials: AuthModel | null = await this.authProvider.findCredentialsByUsername(username);
        if (!credentials) { 
            throw new ApiError("Incorrect credentials.", 401);
        }
        const {password: storedPassword, userId} = credentials.get({ plain: true });
        
        if (!(await bcrypt.compare(password, storedPassword))) {
            throw new ApiError("Incorrect credentials.", 401);
        }
        
        return userId!;
    };  

    async register(username: string, password: string): Promise<void> {
        const credentials: AuthModel | null = await this.authProvider.findCredentialsByUsername(username);
        if (credentials) {
            throw new ApiError("Username already taken.", 400);
        }

        const transaction = await this.sequelizeData.transaction(); 
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = (await this.userService.createUser(transaction)).get({ plain: true });
            await this.authProvider.create({ username, password: hashedPassword, userId: user.id }, transaction);
    
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log(`Auth transaction failed ${(e as Error).stack}`)
            throw new ApiError("Registration failed. Please try again.", 500);
        }
    }
}