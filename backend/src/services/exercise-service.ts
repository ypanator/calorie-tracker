import ApiError from "../error/api-error";
import ExerciseProvider from "../providers/exercise-provider";
import { Exercise, ExerciseApi, ExerciseModel } from "../types/exercise-type";
import UserService from "./user-service";

export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider, private userService: UserService) {}
    
    async add(exercise: Exercise): Promise<ExerciseModel> {
        return this.exerciseProvider.add(exercise);
    }

    async find(userId: number | null, query: string, duration: number): Promise<ExerciseApi> {
        if (userId === null) {
            return this.exerciseProvider.find(query, 75, duration);
        }
        const user = (await this.userService.getUserAttributes(userId))?.get({ plain: true }) ?? null;
        if (!user) {
            console.log(`The session should be set at this point. ExerciseService.find()`);
            throw new ApiError("User does not exist.", 500);
        }
        return this.exerciseProvider.find(query, user.weight, duration);
    };
};