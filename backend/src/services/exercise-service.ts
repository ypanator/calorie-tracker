import { Exercise } from "../schemas/exercise-schema";

export default class ExerciseService {

    async add(exercise: Exercise): Promise<void> {

    }

    async find(query: string): Promise<Exercise> {
        return {
            name: "",
            time: 1,
            calories: 1
        };
    }
};