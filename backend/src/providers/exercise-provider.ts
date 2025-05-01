import { ModelStatic, DataTypes, Model, } from "sequelize";
import { SequelizeData } from "../db/db";
import axios, { AxiosResponse } from "axios";
import ApiError from "../error/api-error";
import exerciseApiSchema from "../schemas/exercise-api-schema";
import { Exercise, ExerciseApi, ExerciseModel } from "../types/exercise-type";
import { z } from "zod";
import UserProvider from "./user-provider";

export default class ExerciseProvider {
    
    exerciseModelStatic: ModelStatic<ExerciseModel>;
    
    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.exerciseModelStatic = sequelizeData.define("Exercise", {
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
        
        // maybe foreign key definition is redundant?
        this.exerciseModelStatic.belongsTo(userProvider.userModelStatic, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            }
        });
    };
    
    add(exercise: Exercise): Promise<ExerciseModel> {
        return this.exerciseModelStatic.create(exercise, { validate: true });
    };

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

        let response: AxiosResponse<any, any>;
        try {
            response = await axios.request(options);
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