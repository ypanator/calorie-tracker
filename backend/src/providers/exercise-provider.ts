import { ModelStatic, DataTypes } from "sequelize";
import sequelize from "../db/db";
import { Exercise } from "../schemas/exercise-schema";

class ExerciseProvider {
    
    exerciseModel: ModelStatic<any>;

    constructor() {
        this.exerciseModel = sequelize.define("Exercise", {
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

        // TODO: implement User
        this.exerciseModel.belongsTo(User);
    };

    async create(exercise: Exercise, userId: Number) {
        return await this.exerciseModel.create({
            ...exercise,
            UserId: userId
        });
    };
};

export default ExerciseProvider;