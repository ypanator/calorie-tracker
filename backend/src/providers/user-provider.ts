import { DataTypes, Model, ModelStatic, Sequelize, Transaction } from "sequelize";
import { User, UserApi, UserApiModel, UserAttributes, UserAttributesModel, UserModel, UserProfileModel } from "../types/user-type";
import { SequelizeData } from "../db/db";
import ExerciseProvider from "./exercise-provider";

export default class UserProvider {
    
    userModelStatic: ModelStatic<UserModel>;
    
    constructor(
        private sequelizeData: SequelizeData, private exerciseProvider: ExerciseProvider, private foodProvider: FoodProvider) {
            this.userModelStatic = sequelizeData.define("User", {
                gender: {
                    type: DataTypes.ENUM("male", "female"),
                    allowNull: false,
                },
                age: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                    validate: { min: 1, max: 100 }
                },
                height: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                    validate: { min: 120, max: 250 }
                },
                weight: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                    validate: { min: 30, max: 300 }
                },
                bmi: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 100] }
                },
                calories: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 200] }
                },
                carbs: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 200] }
                },
                fiber: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 200] }
                },
                protein: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 200] }
                },
                fat: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: { len: [1, 200] }
                },
            });
            
            this.userModelStatic.hasMany(this.exerciseProvider.exerciseModelStatic, { as: "exercises" });
            this.userModelStatic.hasMany(this.foodProvider.foodModelStatic, { as: "foods" });
    };
        
    createUser(user: User, transaction: Transaction): Promise<UserModel> {
        return this.userModelStatic.create(user, { transaction });
    };
        
    getUserProfileByUserId(userId: number): Promise<UserProfileModel | null> {
        return this.userModelStatic.findByPk(userId, { include: [
            { model: this.exerciseProvider.exerciseModelStatic, as: "exercises" },
            { model: this.foodProvider.foodModelStatic, as: "foods" }
        ]}) as Promise<UserProfileModel | null>;
    };
    
    getUserAttributesByUserId(userId: number): Promise<UserAttributesModel | null> {
        return this.userModelStatic.findByPk(userId, {
            attributes: ["gender", "age", "height", "weight"]
        });
    };
    
    getUserByUserId(userId: number): Promise<UserModel | null> {
        return this.userModelStatic.findByPk(userId);
    };
    
    updateAttributes(userId: number, attributes: UserAttributes, transaction: Transaction): Promise<[affectedCount: number]> {
        return this.userModelStatic.update(attributes, { where: { id: userId }, transaction});
    };
    
    getUserApiByUserId(userId: number): Promise<UserApiModel | null> {
        return this.userModelStatic.findByPk(userId, {
            attributes: ["bmi", "calories", "carbs", "fiber", "protein", "fat"]
        })
    };

    updateUserApi(userId: number, apiData: UserApi, transaction: Transaction): Promise<[affectedCount: number]>{
        return this.userModelStatic.update(apiData, { where: { id: userId }, transaction});
    };
}