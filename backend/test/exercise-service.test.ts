import { Sequelize } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { jest } from '@jest/globals';
import { ExerciseApi } from "../src/types/exercise-type.ts";
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";

let sequelizeData: SequelizeData;
let server: Server;
let originalEnv: NodeJS.ProcessEnv;

beforeAll(async () => {
    // Save original env and set API keys
    originalEnv = process.env;
    
    class SequelizeData extends Sequelize {
        constructor() {
            super({
                dialect: "sqlite",
                storage: "./test/db/data.sqlite",
                logging: false
            });
        }
    }

    sequelizeData = new SequelizeData();
    server = new Server();
    await server.init({ sequelizeData });
});

afterAll(async () => {
    process.env = originalEnv;
    await server.close();
});

beforeEach(async () => {
    // Reset API keys before each test
    process.env = { ...originalEnv };
    process.env.exercise_api_key = 'test-key';
    
    await sequelizeData.sync({ force: true });
});

const insertUser = async () => {
    return (await server.userProvider.userModelStatic.create({
        gender: "male",
        age: 30,
        height: 173,
        weight: 85, // Different weight to test calorie calculations
        bmi: "25.1",
        calories: "2,813 kcal/day",
        carbs: "316 - 457 grams",
        fiber: "39 grams",
        protein: "60 grams",
        fat: "63 - 109 grams"
    })).get({ plain: true });
};

describe("ExerciseService.find method", () => {
    beforeEach(() => {
        // Reset API key before each test
        process.env.exercise_api_key = 'test-key';
    });

    it("should throw error when API key is missing", async () => {
        process.env.exercise_api_key = '';
        const user = await insertUser();

        try {
            await server.exerciseService.find(user.id!, "running", 30);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Searching for exercises is not available.");
            expect((error as ApiError).code).toBe(500);
        }
    });

    it("should return exercise data with user weight when user exists", async () => {
        const user = await insertUser();

        // Mock axios response
        const mockAxiosHeaders = new AxiosHeaders();
        const mockConfig: InternalAxiosRequestConfig = {
            headers: mockAxiosHeaders,
            method: 'GET',
            url: 'test-url',
            transformRequest: [],
            transformResponse: [],
            timeout: 0,
            adapter: 'xhr',
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            maxContentLength: -1,
            maxBodyLength: -1,
            env: {
                FormData: null as any
            },
            validateStatus: null
        };

        const mockResponse: AxiosResponse = {
            data: [{
                name: "running",
                calories_per_hour: 600,
                duration_minutes: 30,
                total_calories: 300
            }],
            status: 200,
            statusText: "OK",
            headers: mockAxiosHeaders,
            config: mockConfig
        };

        // Mock the API response
        type RequestFunction = <T = any>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
        const requestMock = jest.fn<RequestFunction>().mockResolvedValue(mockResponse);
        server.exerciseProvider.exerciseAxios.request = requestMock as any;

        const result = await server.exerciseService.find(user.id!, "running", 30);
        
        // Verify the result matches the mock response
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            name: "running",
            calories_per_hour: 600,
            duration_minutes: 30,
            total_calories: 300
        });

        // Verify the API was called with correct weight
        expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
            params: expect.objectContaining({
                weight: "85"
            })
        }));
    });

    it("should use default weight when user is not logged in", async () => {
        // Mock axios response
        const mockAxiosHeaders = new AxiosHeaders();
        const mockConfig: InternalAxiosRequestConfig = {
            headers: mockAxiosHeaders,
            method: 'GET',
            url: 'test-url',
            transformRequest: [],
            transformResponse: [],
            timeout: 0,
            adapter: 'xhr',
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            maxContentLength: -1,
            maxBodyLength: -1,
            env: {
                FormData: null as any
            },
            validateStatus: null
        };

        const mockResponse: AxiosResponse = {
            data: [{
                name: "running",
                calories_per_hour: 600,
                duration_minutes: 30,
                total_calories: 300
            }],
            status: 200,
            statusText: "OK",
            headers: mockAxiosHeaders,
            config: mockConfig
        };

        // Mock the API response
        type RequestFunction = <T = any>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
        const requestMock = jest.fn<RequestFunction>().mockResolvedValue(mockResponse);
        server.exerciseProvider.exerciseAxios.request = requestMock as any;

        const result = await server.exerciseService.find(null, "running", 30);
        
        // Verify default weight (75) was used
        expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
            params: expect.objectContaining({
                weight: "75"
            })
        }));
        
        expect(result).toHaveLength(1);
    });

    it("should throw error when API call fails", async () => {
        const user = await insertUser();

        // Mock API failure
        type RequestFunction = <T = any>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
        const requestMock = jest.fn<RequestFunction>().mockRejectedValue(new Error("API Error"));
        server.exerciseProvider.exerciseAxios.request = requestMock as any;

        try {
            await server.exerciseService.find(user.id!, "running", 30);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Searching for exercises is not available.");
            expect((error as ApiError).code).toBe(500);
        }
    });
});

describe("ExerciseService.add method", () => {
    it("should store exercise with user association", async () => {
        const user = await insertUser();
        
        const exercise = await server.exerciseService.add({
            name: "Running",
            time: 30,
            calories: 300,
            userId: user.id
        });

        const plainExercise = exercise.get({ plain: true });
        expect(plainExercise.name).toBe("Running");
        expect(plainExercise.time).toBe(30);
        expect(plainExercise.calories).toBe(300);
        expect(plainExercise.userId).toBe(user.id);
    });
});