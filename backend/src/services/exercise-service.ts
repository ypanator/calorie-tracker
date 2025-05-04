import ApiError from "../error/api-error.js";
import ExerciseProvider from "../providers/exercise-provider.js";
import { Exercise, ExerciseApi, ExerciseModel } from "../types/exercise-type.js";
import UserService from "./user-service.js";

/**
 * Service class handling exercise-related business logic
 */
export default class ExerciseService {
    
    constructor(private exerciseProvider: ExerciseProvider, private userService: UserService) {}
    
    /**
     * Adds a new exercise to the database
     * @param exercise The exercise to add
     * @returns Promise resolving to the created exercise model
     */
    add(exercise: Exercise): Promise<ExerciseModel> {
        return this.exerciseProvider.add(exercise);
    }

    /**
     * Finds exercises matching the given query and calculates calories based on user's weight
     * @param userId The ID of the user, or null for anonymous queries
     * @param query The search query string
     * @param duration The duration of the exercise in minutes
     * @returns Promise resolving to exercise data with calculated calories
     * @throws {ApiError} If the user doesn't exist but userId is provided
     */
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