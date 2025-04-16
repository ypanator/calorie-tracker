import ExerciseProvider from "../providers/exercise-provider";
import { Exercise } from "../schemas/exercise-schema";

export default class ExerciseService {

    constructor(private exerciseProvider: ExerciseProvider) {}

    // TODO: implement
    async find(query: string): Promise<Exercise> {
        return {
            name: "",
            time: 1,
            calories: 1
        };
    };
};