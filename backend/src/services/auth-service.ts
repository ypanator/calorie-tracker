import bcrypt from "bcrypt"
import AuthProvider from "../providers/auth-provider";
import ApiError from "../error-handler/api-error";

export default class AuthService {

    constructor(private authProvider: AuthProvider) {}

    async login(username: string, password: string): Promise<number> {
        const {password: storedPassword, id} = this.authProvider.findUserByUsername(username);
        if (!storedPassword) { 
            throw new ApiError(`Could not find user with ${username} username.`, 404);
        }

        if (!(await bcrypt.compare(password, storedPassword))) {
            throw new ApiError("Incorrect password.", 401);
        }

        return id;
    };  

    logout() {

    };
}