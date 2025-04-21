import bcrypt from "bcrypt"
import AuthProvider from "../providers/auth-provider";
import ApiError from "../error-handler/api-error";
import { Sequelize } from "sequelize";
import { AuthAttributes } from "../providers/auth-provider";
import UserService from "./user-service";

export default class AuthService {
    
    constructor(
        private authProvider: AuthProvider, private sequelize: Sequelize, private userService: UserService
    ) {}
    
    async login(username: string, password: string): Promise<number> {
        const credentials: AuthAttributes | null = await this.authProvider.findCredentialsByUsername(username);
        if (!credentials) { 
            throw new ApiError(`Could not find user with ${username} username.`, 404);
        }
        const {hashedPassword: storedPassword, userId} = credentials;
        
        if (!(await bcrypt.compare(password, storedPassword))) {
            throw new ApiError("Incorrect password.", 401);
        }
        
        return userId!;
    };  

    async register(username: string, password: string): Promise<void> {
        const transaction = await this.sequelize.transaction(); 

        try {
            const credentials = await this.authProvider.findCredentialsByUsername(username);
            if (credentials) {
                throw new ApiError("Username already taken.", 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.userService.create({ username }, { transaction });
            await this.authProvider.create({ username, hashedPassword, userId: user.id }, transaction );
    
            await transaction.commit();

        } catch (e) {
            if (transaction) await transaction.rollback();
            throw new ApiError("Registration failed. Please try again.", 500);
        }
    }
}