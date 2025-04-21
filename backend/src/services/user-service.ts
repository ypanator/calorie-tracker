import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider";

export default class UserService {
    
    constructor(private userProvider: UserProvider) {}

    setParams(newParams: { gender: "male" | "female"; age: number; height: number; weight: number; }) {
        throw new Error("Method not implemented.");
    }
    getData(arg0: number) {
        throw new Error("Method not implemented.");
    }

    create(arg0: { username: string; }, arg1: { transaction: Transaction; }) {
        throw new Error("Method not implemented.");
    }
}