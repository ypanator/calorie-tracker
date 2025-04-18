import { ModelStatic, DataTypes, Model, } from "sequelize";
import { SequelizeData } from "../db/db";
import { Exercise } from "../schemas/exercise-schema";

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

    async create(exercise: Exercise, userId: number): Promise<ExerciseModel> {
        return this.exerciseModel.create({ ...exercise, userId: userId });
    };
};

export interface ExerciseAttributes {
    name: string,
    time: number,
    calories: number,
    userId: number
}

export type ExerciseModel = Model<ExerciseAttributes>