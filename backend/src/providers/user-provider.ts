import { Model, ModelStatic } from "sequelize";
import { User } from "../types/user-type";

export default class UserProvider {

    userModelStatic: ModelStatic<Model<User>>;

}

export interface UserAttributes {
    id?: number,
    gender: "male" | "female"
    age: number,
    height: number,
    weight: number
}

export type UserModel = Model<UserAttributes>;