import ExerciseProvider from "../providers/exercise-provider";
import { Exercise, ExerciseApi } from "../types/exercise-type";
import UserService from "./user-service";

export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider, private userService: UserService) {}
    
    async add(exercise: Exercise) {
        this.exerciseProvider.add(exercise);
    }

    async find(userId: number, query: string, duration: number): Promise<ExerciseApi> {
        const user = this.userService.getData(userId);
        return await this.exerciseProvider.find(query, user.weight, duration);
    };
};