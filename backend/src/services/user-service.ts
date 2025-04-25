import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider";
import { UserAttributes, UserApi, User, UserAttributesModel, UserProfileModel, UserModel, UserApiModel, UserProfile } from "../types/user-type";

export default class UserService {
    
    constructor(private userProvider: UserProvider) {}

    async updateUserAttributes(userId: number, attributes: UserAttributes): Promise<UserApiModel> {
        throw new Error("Method not implemented.");
    }

    async getUserAttributes(userId: number): Promise<UserAttributesModel> {
        return this.userProvider.getUserAttributesByUserId(userId);
    }

    async getUser(userId: number): Promise<UserModel> {
        return this.userProvider.getUserByUserId(userId);
    }

    async getUserProfile(userId: number): Promise<UserProfileModel> {
        return this.userProvider.getUserProfileByUserId(userId);
    }

    async createUser(transaction: Transaction): Promise<UserAttributesModel> {
        const defaultUser: User = {
            gender: "male",
            age: 30,
            height: 173,
            weight: 75
        }

        return this.userProvider.createUser(defaultUser);
    }
};
