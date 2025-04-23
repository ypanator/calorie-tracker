import { Model, ModelStatic } from "sequelize";
import { UserAttributes } from "../types/user-type";

export default class UserProvider {

    userModelStatic: ModelStatic<Model<UserAttributes>>;

}

export interface UserAttributes {
    id?: number,
    gender: "male" | "female"
    age: number,
    height: number,
    weight: number
}

export type UserModel = Model<UserAttributes>;