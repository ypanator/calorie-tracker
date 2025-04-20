import ExerciseProvider from "../providers/exercise-provider";
import { ExerciseAttributes } from "../providers/exercise-provider";
import { ExerciseApi } from "../schemas/exercise-api-schema";
import { Exercise } from "../schemas/exercise-schema";

export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider, private userService: UserService) {}
    
    async add(exercise: ExerciseAttributes) {
        this.exerciseProvider.add(exercise);
    }

    async find(userId: number, query: string, duration: number): Promise<ExerciseApi> {
        const user = this.userService.findByUserId(userId);
        return await this.exerciseProvider.find(query, user.get("weight"), duration);
    };
};