import { ModelStatic, DataTypes, Model, } from "sequelize";
import { SequelizeData } from "../db/db";
import axios from "axios";
import ApiError from "../error-handler/api-error";

export default class ExerciseProvider {
    
    exerciseModel: ModelStatic<ExerciseModel>;
    
    constructor(private sequelizeData: SequelizeData, private userProvider: UserProvider) {
        this.exerciseModel = sequelizeData.define("Exercise", {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    len: [1, 100]
                }
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            calories: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }                
            }
        });
        
        // maybe foreign key definition is redundant?
        this.exerciseModel.belongsTo(userProvider.userModel, {
            foreignKey: {
                name: "userId",
                allowNull: false,
            }
        });
        this.exerciseModel.sync();
    };
    
    async add(exercise: ExerciseAttributes): Promise<ExerciseModel> {
        return this.exerciseModel.create(exercise);
    };

    async find(activity: string, weight: number, duration: number) {
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

        const response = await axios.request(options);
        if (response.status >= 400) {
            console.log(`Exercises api error. - ${response.status} - ${response.data}`);
            throw new ApiError("Searching for exercises is not available.", 500);
        }

        return response.data;
    }
};

export interface ExerciseAttributes {
    id?: number,
    name: string,
    time: number,
    calories: number,
    userId: number
}

export type ExerciseModel = Model<ExerciseAttributes>