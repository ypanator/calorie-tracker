import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider";
import { UserAttributes, UserApi, User, UserAttributesModel, UserProfileModel, UserModel, UserApiModel, UserProfile } from "../types/user-type";

export default class UserService {
    
    constructor(private userProvider: UserProvider) {}

    async updateUserAttributes(userId: number, attributes: UserAttributes): Promise<UserApiModel | null> {
        this.userProvider.updateAttributes(userId, attributes);
        return this.userProvider.getUserApiByUserId(userId);
    }

    async getUserAttributes(userId: number): Promise<UserAttributesModel | null> {
        return this.userProvider.getUserAttributesByUserId(userId);
    }

    async getUser(userId: number): Promise<UserModel | null> {
        return this.userProvider.getUserByUserId(userId);
    }

    async getUserProfile(userId: number): Promise<UserProfileModel | null> {
        return this.userProvider.getUserProfileByUserId(userId);
    }

    async createUser(transaction: Transaction): Promise<UserModel> {
        const defaultUser: User = {
            gender: "male",
            age: 30,
            height: 173,
            weight: 75
        }

        return this.userProvider.createUser(defaultUser);
    }
};
