import { DataTypes, Model, ModelStatic, Sequelize, Transaction } from "sequelize";
import { User, UserApi, UserApiModel, UserAttributes, UserAttributesModel, UserModel, UserProfileModel } from "../types/user-type.js";
import { SequelizeData } from "../db/db.js";
import ExerciseProvider from "./exercise-provider.js";
import FoodProvider from "./food-provider.js";
import { INITIALLY_DEFERRED } from "sequelize/types/deferrable";
import AuthProvider from "./auth-provider.js";

export default class UserProvider {
    
    userModelStatic: ModelStatic<UserModel>;
    exerciseProvider!: ExerciseProvider;
    foodProvider!: FoodProvider;
    authProvider!: AuthProvider;
    
    constructor(private sequelizeData: SequelizeData) {
            this.userModelStatic = sequelizeData.define("User", {
                gender: {
                    type: DataTypes.ENUM("male", "female"),
                    allowNull: false,
                },
                age: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: { min: 1, max: 100 }
                },
                height: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: { min: 120, max: 250 }
                },
                weight: {
                    type: DataTypes.INTEGER,
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
    };

    init(exerciseProvider: ExerciseProvider, foodProvider: FoodProvider, authProvider: AuthProvider) {
        this.exerciseProvider = exerciseProvider;
        this.foodProvider = foodProvider;
        this.authProvider = authProvider;

        this.userModelStatic.hasMany(this.exerciseProvider.exerciseModelStatic, { as: "exercises", foreignKey: "userId"  });
        this.userModelStatic.hasMany(this.foodProvider.foodModelStatic, { as: "foods", foreignKey: "userId"  });
        this.userModelStatic.hasMany(this.authProvider.authModelStatic, { foreignKey: "userId" });

    }
        
    createUser(user: User, transaction: Transaction): Promise<UserModel> {
        return this.userModelStatic.create(user, { transaction, validate: true });
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
        return this.userModelStatic.update(attributes, { where: { id: userId }, transaction, validate: true });
    };
    
    getUserApiByUserId(userId: number): Promise<UserApiModel | null> {
        return this.userModelStatic.findByPk(userId, {
            attributes: ["bmi", "calories", "carbs", "fiber", "protein", "fat"]
        })
    };

    updateUserApi(userId: number, apiData: UserApi, transaction: Transaction): Promise<[affectedCount: number]>{
        return this.userModelStatic.update(apiData, { where: { id: userId }, transaction, validate: true });
    };
}