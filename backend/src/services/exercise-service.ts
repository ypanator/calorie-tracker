import ExerciseProvider from "../providers/exercise-provider";
import { ExerciseAttributes } from "../providers/exercise-provider";
import { Exercise } from "../schemas/exercise-schema";

export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider) {}
    
    async add(exercise: ExerciseAttributes) {
        this.exerciseProvider.add(exercise);
    }

    async find(query: string): Promise<Exercise> {
        return await this.exerciseProvider.find(query);
    };
};