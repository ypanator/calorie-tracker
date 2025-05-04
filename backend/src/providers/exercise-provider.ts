import { ModelStatic, DataTypes } from "sequelize";
import { SequelizeData } from "../db/db.js";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import ApiError from "../error/api-error.js";
import exerciseApiSchema from "../schemas/exercise-api-schema.js";
import { Exercise, ExerciseApi, ExerciseModel } from "../types/exercise-type.js";
import { z } from "zod";
import UserProvider from "./user-provider.js";

/** Exercise data and API provider */
export default class ExerciseProvider {
    exerciseModelStatic: ModelStatic<ExerciseModel>;
    exerciseAxios: AxiosInstance;
    
    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.exerciseModelStatic = sequelizeData.define("exercise", {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: { len: [1, 100] }
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1 }
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: { min: 1 }                
            }
        });
        
        this.exerciseModelStatic.belongsTo(userProvider.userModelStatic, { foreignKey: "userId" });

        this.exerciseAxios = axios.create();
        axiosRetry(this.exerciseAxios, {
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
        });
    };
    
    /** Test helper to set axios instance */
    setAxiosInstanceForTesting(axiosInstance: AxiosInstance) {
        if (process.env.NODE_ENV === 'test') {
            this.exerciseAxios = axiosInstance;
        }
    }
    
    /** Add new exercise record */
    add(exercise: Exercise): Promise<ExerciseModel> {
        return this.exerciseModelStatic.create(exercise, { validate: true });
    };

    /** Find exercises and calculate calories based on weight */
    async find(activity: string, weight: number, duration: number): Promise<ExerciseApi> {
        const apiKey = process.env.exercise_api_key || "";
        if (!apiKey) {
            console.log("Missing exercises api key.");
            throw new ApiError("Searching for exercises is not available.", 500);
        }

        const options = {
            method: 'GET',
            url: 'https://calories-burned-by-api-ninjas.p.rapidapi.com/v1/caloriesburned',
            params: {
                activity: activity,
                weight: String(weight),
                duration: String(duration)
            },
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'calories-burned-by-api-ninjas.p.rapidapi.com'
            }
        };

        let response;
        try {
            response = await this.exerciseAxios.request(options);
        } catch (e) {
            console.log(`Error on calling the exercise api. ${(e as Error).stack}`);
            throw new ApiError("Searching for exercises is not available.", 500);
        }

        let responseData: ExerciseApi = response.data;
        try {
            responseData = exerciseApiSchema.parse(responseData);
        } catch (e) {
            if (e instanceof z.ZodError) {
                console.log(`Exercises api parsing error. - ${(e as Error).stack}`);
                throw new ApiError("Searching for exercises is not available.", 500);
            } else {
                console.log(`${(e as Error).stack}`);
            }
        }

        return responseData.slice(0, 5);
    }
};