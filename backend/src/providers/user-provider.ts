import { Model, ModelStatic } from "sequelize";
import { User, UserAttributes, UserAttributesModel, UserModel, UserProfileModel } from "../types/user-type";

export default class UserProvider {

    createUser(defaultUser: User): Promise<UserAttributesModel> {
        throw new Error("Method not implemented.");
    }

    getUserProfileByUserId(userId: number): Promise<UserProfileModel> {
        throw new Error("Method not implemented.");
    }

    getUserAttributesByUserId(userId: number): Promise<UserAttributesModel> {
        throw new Error("Method not implemented.");
    }

    getUserByUserId(userId: number): Promise<UserModel> {
        throw new Error("Method not implemented.");
    }

    userModelStatic: ModelStatic<UserAttributesModel>;

}