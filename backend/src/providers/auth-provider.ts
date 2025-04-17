import { Transaction } from "sequelize";

export default class AuthProvider {
    create(arg0: { userId: any; hashedPassword: Promise<string>; }, arg1: { transaction: Transaction; }) {
        throw new Error("Method not implemented.");
    }
    findCredentialsByUsername(username: string): { password: any; id: any; } | PromiseLike<{ password: any; id: any; }> {
        throw new Error("Method not implemented.");
    }
    
}