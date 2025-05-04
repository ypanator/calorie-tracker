import { DataTypes, Model, ModelStatic, Sequelize, Transaction } from "sequelize";
import { User, UserApi, UserApiModel, UserAttributes, UserAttributesModel, UserModel, UserProfileModel } from "../types/user-type.js";
import { SequelizeData } from "../db/db.js";
import ExerciseProvider from "./exercise-provider.js";
import FoodProvider from "./food-provider.js";
import { INITIALLY_DEFERRED } from "sequelize/types/deferrable";
import AuthProvider from "./auth-provider.js";

/**
 * Provider class handling user data persistence and relationships
 */
export default class UserProvider {
    /** Sequelize model for user records */
    userModelStatic: ModelStatic<UserModel>;
    exerciseProvider!: ExerciseProvider;
    foodProvider!: FoodProvider;
    authProvider!: AuthProvider;
    
    constructor(private sequelizeData: SequelizeData) {
        this.userModelStatic = sequelizeData.define("user", {
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

    /**
     * Initializes provider relationships and associations
     * @param exerciseProvider The exercise provider instance
     * @param foodProvider The food provider instance
     * @param authProvider The auth provider instance
     */
    init(exerciseProvider: ExerciseProvider, foodProvider: FoodProvider, authProvider: AuthProvider) {
        this.exerciseProvider = exerciseProvider;
        this.foodProvider = foodProvider;
        this.authProvider = authProvider;

        this.userModelStatic.hasMany(this.exerciseProvider.exerciseModelStatic, { as: "exercises", foreignKey: "userId"  });
        this.userModelStatic.hasMany(this.foodProvider.foodModelStatic, { as: "foods", foreignKey: "userId"  });
        this.userModelStatic.hasOne(this.authProvider.authModelStatic, { foreignKey: "userId" });
    }
        
    /**
     * Creates a new user record
     * @param user The user data to create
     * @param transaction The transaction to use for creation
     * @returns Promise resolving to the created user model
     */
    createUser(user: User, transaction: Transaction): Promise<UserModel> {
        return this.userModelStatic.create(user, { transaction, validate: true });
    };
        
    /**
     * Gets a user's complete profile including exercises and foods
     * @param userId The ID of the user
     * @returns Promise resolving to the user profile model or null if not found
     */
    getUserProfileByUserId(userId: number): Promise<UserProfileModel | null> {
        return this.userModelStatic.findByPk(userId, { include: [
            { model: this.exerciseProvider.exerciseModelStatic, as: "exercises" },
            { model: this.foodProvider.foodModelStatic, as: "foods" }
        ]}) as Promise<UserProfileModel | null>;
    };
    
    /**
     * Gets a user's basic attributes (gender, age, height, weight)
     * @param userId The ID of the user
     * @returns Promise resolving to user attributes model or null if not found
     */
    getUserAttributesByUserId(userId: number): Promise<UserAttributesModel | null> {
        return this.userModelStatic.findByPk(userId, {
            attributes: ["gender", "age", "height", "weight"]
        });
    };
    
    /**
     * Gets a user by ID with all fields
     * @param userId The ID of the user
     * @returns Promise resolving to user model or null if not found
     */
    getUserByUserId(userId: number): Promise<UserModel | null> {
        return this.userModelStatic.findByPk(userId);
    };
    
    /**
     * Updates user attributes
     * @param userId The ID of the user to update
     * @param attributes The new attributes to set
     * @param transaction The transaction to use for the update
     * @returns Promise resolving to the number of affected rows
     */
    updateAttributes(userId: number, attributes: UserAttributes, transaction: Transaction): Promise<[affectedCount: number]> {
        return this.userModelStatic.update(attributes, { where: { id: userId }, transaction, validate: true });
    };
    
    /**
     * Gets a user's nutrition API data
     * @param userId The ID of the user
     * @returns Promise resolving to user API model or null if not found
     */
    getUserApiByUserId(userId: number): Promise<UserApiModel | null> {
        return this.userModelStatic.findByPk(userId, {
            attributes: ["bmi", "calories", "carbs", "fiber", "protein", "fat"]
        })
    };

    /**
     * Updates a user's nutrition API data
     * @param userId The ID of the user to update
     * @param apiData The new API data to set
     * @param transaction The transaction to use for the update
     * @returns Promise resolving to the number of affected rows
     */
    updateUserApi(userId: number, apiData: UserApi, transaction: Transaction): Promise<[affectedCount: number]>{
        return this.userModelStatic.update(apiData, { where: { id: userId }, transaction, validate: true });
    };
}