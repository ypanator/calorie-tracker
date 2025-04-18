import { ModelStatic, DataTypes, Model, } from "sequelize";
import { SequelizeData } from "../db/db";

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
};

export interface ExerciseAttributes {
    id?: number,
    name: string,
    time: number,
    calories: number,
    userId: number
}

export type ExerciseModel = Model<ExerciseAttributes>