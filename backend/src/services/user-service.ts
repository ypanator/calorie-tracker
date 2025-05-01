import { Transaction } from "sequelize";
import UserProvider from "../providers/user-provider.js";
import axios, { Axios, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { UserAttributes, UserApi, User, UserAttributesModel, UserProfileModel, UserModel, UserApiModel, UserProfile } from "../types/user-type.js";
import ApiError from "../error/api-error.js";
import { SequelizeData } from "../db/db.js";

export default class UserService {
    
    userAxios: AxiosInstance

    constructor(private userProvider: UserProvider, private sequelizeData: SequelizeData) {
        this.userAxios = axios.create();
        axiosRetry(this.userAxios, {
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
        });
    }

    async updateUserAttributes(userId: number, attributes: UserAttributes): Promise<UserApi> {
        const apiKey = process.env.user_api_key || "";
        if (!apiKey) {
            console.log("Missing user api key.");
            throw new ApiError("User statistics could not be updated. Please try again later", 500);
        }
        
        const options = {
            method: 'GET',
            url: 'https://nutrition-calculator.p.rapidapi.com/api/nutrition-info',
            params: {
                measurement_units: 'met',
                sex: attributes.gender,
                age_value: attributes.age,
                age_type: 'yrs',
                cm: attributes.height,
                kilos: attributes.weight,
                activity_level: 'Low Active'
            },
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'nutrition-calculator.p.rapidapi.com'
            }
        };
        
        let response: AxiosResponse<any, any>;
        try {
            response = await this.userAxios.request(options);
        } catch (e) {
            console.log(`Error on calling the user api. ${(e as Error).stack}`);
            throw new ApiError("User statistics could not be updated. Please try again later", 500);
        }
        
        const data = response.data;
        let truncatedData: UserApi = {
            bmi: data.BMI_EER.BMI,
            calories: data.BMI_EER["Estimated Daily Caloric Needs"],
            carbs: data.macronutrients_table["macronutrients-table"][1][1],
            fiber: data.macronutrients_table["macronutrients-table"][2][1],
            protein: data.macronutrients_table["macronutrients-table"][3][1],
            fat: data.macronutrients_table["macronutrients-table"][4][1]
        }

        const transaction = await this.sequelizeData.transaction();
        try {
            await this.userProvider.updateAttributes(userId, attributes, transaction);
            await this.userProvider.updateUserApi(userId, truncatedData, transaction);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            console.log(`Error on saving new data. ${(e as Error).stack}`);
            throw new ApiError("User statistics could not be updated. Please try again later", 500);
        }
        return truncatedData;
    }

    getUserAttributes(userId: number): Promise<UserAttributesModel | null> {
        return this.userProvider.getUserAttributesByUserId(userId);
    }

    getUser(userId: number): Promise<UserModel | null> {
        return this.userProvider.getUserByUserId(userId);
    }

    getUserProfile(userId: number): Promise<UserProfileModel | null> {
        return this.userProvider.getUserProfileByUserId(userId);
    }

    createUser(transaction: Transaction): Promise<UserModel> {
        const defaultUser: User = {
            gender: "male",
            age: 30,
            height: 173,
            weight: 75,

            bmi: "25.1",
            calories: "2,813 kcal/day",
            carbs: "316 - 457 grams",
            fiber: "39 grams",
            protein: "60 grams",
            fat: "63 - 109 grams"
        }

        return this.userProvider.createUser(defaultUser, transaction);
    }


};
