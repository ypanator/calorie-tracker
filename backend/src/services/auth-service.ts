import bcrypt from "bcrypt";
import AuthProvider from "../providers/auth-provider.js";
import ApiError from "../error/api-error.js";
import { SequelizeAuth, SequelizeData } from "../db/db.js";
import { AuthModel } from "../types/auth-type.js";
import UserService from "./user-service.js";

export default class AuthService {
    
    constructor(
        private authProvider: AuthProvider, private sequelizeAuth: SequelizeAuth, private userService: UserService, private sequelizeData: SequelizeData
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

        const transactionAuth = await this.sequelizeAuth.transaction(); 
        const transactionData = await this.sequelizeData.transaction(); 
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = (await this.userService.createUser(transactionData)).get({ plain: true });
            await this.authProvider.create({ username, password: hashedPassword, userId: user.id }, transactionAuth );
    
            await transactionAuth.commit();
            await transactionData.commit();
        } catch (e) {
            await transactionAuth.rollback();
            await transactionData.rollback();
            console.log(`Auth transaction failed ${(e as Error).stack}`)
            throw new ApiError("Registration failed. Please try again.", 500);
        }
    }
}