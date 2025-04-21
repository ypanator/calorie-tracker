import { Model, ModelStatic } from "sequelize";

export default class UserProvider {

    userModel: ModelStatic<Model<any, any>>;

}

export interface UserAttributes {
    id?: number,
    gender: "male" | "female"
    age: number,
    height: number,
    weight: number
}

export type UserModel = Model<UserAttributes>;