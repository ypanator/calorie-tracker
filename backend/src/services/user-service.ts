import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider";
import { UserAttributes, UserApi, User, UserAttributesModel, UserProfileModel, UserModel, UserApiModel } from "../types/user-type";

export default class UserService {
    
    constructor(private userProvider: UserProvider) {}

    updateUserAttributes(userId: number, attributes: UserAttributes): Promise<UserApiModel> {
        throw new Error("Method not implemented.");
    }

    getUserAttributes(userId: number): Promise<UserAttributesModel> {
        return this.userProvider.getUserByUserId(userId);
    }

    // probably unnecessary?
    // getUser(userId: number): Promise<UserModel> {
    //     return this.userProvider.getUserFullByUserId(userId);
    // }

    getUserProfile(userId: number): Promise<UserProfileModel> {
        return this.userProvider.getUserProfileByUserId(userId);
    }

    createUser(username: string, transaction: Transaction): UserProfile {
        this.userProvider.createUser()
    }
};

const defaultUser: User = {
    gender: "male",
    age: 30,
    height: 173,
    weight: 75
}