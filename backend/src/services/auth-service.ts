import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthProvider from "../providers/auth-provider.js";
import ApiError from "../error/api-error.js";
import { SequelizeData } from "../db/db.js";
import { AuthModel } from "../types/auth-type.js";
import UserService from "./user-service.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
// Once we've checked JWT_SECRET exists, we can safely assert its type
const SECRET_KEY: jwt.Secret = JWT_SECRET;

/**
 * Service class handling user authentication and registration
 */
export default class AuthService {
    constructor(
        private authProvider: AuthProvider, 
        private sequelizeData: SequelizeData, 
        private userService: UserService
    ) {}
    
    private generateToken(userId: number): string {
        return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '24h' });
    }

    /**
     * Authenticates a user with username and password
     * @param username The username to authenticate
     * @param password The password to verify
     * @returns Promise resolving to the JWT token if authentication is successful
     * @throws {ApiError} If credentials are incorrect or user doesn't exist
     */
    async login(username: string, password: string): Promise<string> {
        const credentials: AuthModel | null = await this.authProvider.findCredentialsByUsername(username);
        if (!credentials) { 
            throw new ApiError("Incorrect credentials.", 401);
        }
        const {password: storedPassword, userId} = credentials.get({ plain: true });
        
        if (!(await bcrypt.compare(password, storedPassword))) {
            throw new ApiError("Incorrect credentials.", 401);
        }
        
        return this.generateToken(userId!);
    }

    /**
     * Registers a new user with username and password
     * @param username The username for the new account
     * @param password The password for the new account
     * @returns Promise resolving to the JWT token
     * @throws {ApiError} If username is taken or registration fails
     */
    async register(username: string, password: string): Promise<string> {
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
            return this.generateToken(user.id!);
        } catch (e) {
            await transaction.rollback();
            console.log(`Auth transaction failed ${(e as Error).stack}`)
            throw new ApiError("Registration failed. Please try again.", 500);
        }
    }
}