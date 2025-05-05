import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { createRequestMock, createSequelizeData, createServer, defaultUser } from "./test-utils.ts";
import { createMockAxiosResponse } from "./test-utils.ts";

let sequelizeData: SequelizeData;
let server: Server;
let originalEnv: NodeJS.ProcessEnv;

beforeAll(async () => {
    // Save original env and set API keys
    originalEnv = process.env;
    sequelizeData = createSequelizeData();
    server = await createServer(sequelizeData);
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
    return (await server.userProvider.userModelStatic.create(defaultUser)).get({ plain: true });
};

describe("ExerciseService.find method", () => {
beforeEach(() => {
        // Reset API key before each test
        process.env.exercise_api_key = 'test-key';
    });

    beforeEach(() => {
        // Reset API key before each test
        process.env.exercise_api_key = 'test-key';
    });

    it("should throw error when API key is missing", async () => {
        process.env.exercise_api_key = '';
        

        await expect(server.exerciseService.find(null, "running", 30))
            .rejects.toMatchObject({
                msg: "Searching for exercises is not available.",
                code: 500
            });
    });

    it("should throw error when API ID is missing", async () => {
        process.env.exercise_api_id = '';
        
        await expect(server.exerciseService.find(null, "running", 30))
            .rejects.toMatchObject({
                msg: "Searching for exercises is not available.",
                code: 500
            });
    });

    it("should return exercise data with user weight when user exists", async () => {
        const user = await insertUser();

        const mockResponse = createMockAxiosResponse([{
            name: "running",
            calories_per_hour: 600,
            duration_minutes: 30,
            total_calories: 300
        }]);

        // Mock the API response
        const requestMock = createRequestMock((config) => Promise.resolve(mockResponse));
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
                weight: "75"
            })
        }));
    });

    it("should use default weight when user is not logged in", async () => {
        const mockResponse = createMockAxiosResponse([{
            name: "running",
            calories_per_hour: 600,
            duration_minutes: 30,
            total_calories: 300
        }]);

        // Mock the API response
        const requestMock = createRequestMock((config) => Promise.resolve(mockResponse));
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
        const requestMock = createRequestMock((config) => Promise.reject(new Error("API Error")));
        server.exerciseProvider.exerciseAxios.request = requestMock as any;

        await expect(server.exerciseService.find(user.id!, "running", 30))
            .rejects.toMatchObject({
                msg: "Searching for exercises is not available.",
                code: 500
            });
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