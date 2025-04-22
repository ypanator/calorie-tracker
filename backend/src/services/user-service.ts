import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider";
import { User } from "../types/user-type";

export default class UserService {
    
    constructor(private userProvider: UserProvider) {}

    setParams(newParams: User): User {
        throw new Error("Method not implemented.");
    }
    getData(userId: number): User {
        throw new Error("Method not implemented.");
    }

    create(username: string, transaction: Transaction): User {
        throw new Error("Method not implemented.");
    }
}