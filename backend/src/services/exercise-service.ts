import ExerciseProvider from "../providers/exercise-provider";
import { ExerciseAttributes } from "../providers/exercise-provider";
import { Exercise } from "../schemas/exercise-schema";

export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider) {}
    
    async add(exercise: ExerciseAttributes) {
        this.exerciseProvider.add(exercise);
    }

    // TODO: implement
    async find(query: string): Promise<Exercise> {
        return {
            name: "",
            time: 1,
            calories: 1
        };
    };
};