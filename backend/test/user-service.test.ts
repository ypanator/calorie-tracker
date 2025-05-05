import { Sequelize } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { UserAttributes } from "../src/types/user-type.ts";
import { jest } from '@jest/globals';
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { createFailureRequestMock, createSequelizeData, createServer, createSuccessRequestMock, defaultUser } from "./test-utils.ts";
import { createMockAxiosResponse } from "./test-utils.ts";

let sequelizeData: SequelizeData;
let server: Server;
let originalEnv: NodeJS.ProcessEnv;

beforeAll(async () => {
    // Save original env
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
    process.env.user_api_key = 'test-key';
    
    await sequelizeData.sync({ force: true });
});

const insertUser = async () => {
    return (await server.userProvider.userModelStatic.create(defaultUser)).get({ plain: true });
};

describe("UserService.updateUserAttributes method", () => {
    beforeEach(() => {
        // Save original env and set API key for each test
        process.env = { ...originalEnv };
        process.env.user_api_key = 'test-key';
    });

    afterEach(() => {
        // Restore original env after each test
        process.env = originalEnv;
    });

    it("should throw error when API key is missing", async () => {
        process.env.user_api_key = '';
        const user = await insertUser();
        const newAttributes: UserAttributes = {
            gender: "male",
            age: 31,
            height: 175,
            weight: 77
        };

        await expect(server.userService.updateUserAttributes(user.id!, newAttributes))
            .rejects.toMatchObject({
                msg: "User statistics could not be updated. Please try again later",
                code: 500
            });
    });

    it("should update user attributes and stats in transaction", async () => {
        const user = await insertUser();
        const newAttributes: UserAttributes = {
            gender: "male",
            age: 31,
            height: 175,
            weight: 77
        };

        const mockResponse = createMockAxiosResponse({
            BMI_EER: {
                BMI: "25.5",
                "Estimated Daily Caloric Needs": "2,900 kcal/day"
            },
            macronutrients_table: {
                "macronutrients-table": [
                    ["header1", "value1"],
                    ["Carbs", "320 - 460 grams"],
                    ["Fiber", "40 grams"],
                    ["Protein", "65 grams"],
                    ["Fat", "65 - 110 grams"]
                ]
            }
        });

        const requestMock = createSuccessRequestMock(mockResponse);
        server.userService.userAxios.request = requestMock as any;

        const result = await server.userService.updateUserAttributes(user.id!, newAttributes);
        
        // Verify API result
        expect(result.bmi).toBe("25.5");
        expect(result.calories).toBe("2,900 kcal/day");
        expect(result.carbs).toBe("320 - 460 grams");
        expect(result.fiber).toBe("40 grams");
        expect(result.protein).toBe("65 grams");
        expect(result.fat).toBe("65 - 110 grams");

        // Verify database update
        const updatedUser = await server.userService.getUser(user.id!);
        expect(updatedUser?.get("age")).toBe(31);
        expect(updatedUser?.get("height")).toBe(175);
        expect(updatedUser?.get("weight")).toBe(77);
        expect(updatedUser?.get("bmi")).toBe("25.5");
    });

    it("should rollback transaction on API error", async () => {
        const user = await insertUser();
        const newAttributes: UserAttributes = {
            gender: "male",
            age: 31,
            height: 175,
            weight: 77
        };

        // Mock API failure with proper typing
        const requestMock = createFailureRequestMock(new Error("API Error"));
        server.userService.userAxios.request = requestMock as any;

        await expect(server.userService.updateUserAttributes(user.id!, newAttributes))
            .rejects.toMatchObject({
                msg: "User statistics could not be updated. Please try again later",
                code: 500
            });

        // Verify no changes were made
        const unchangedUser = await server.userService.getUser(user.id!);
        expect(unchangedUser?.get("age")).toBe(30);
        expect(unchangedUser?.get("height")).toBe(173);
        expect(unchangedUser?.get("weight")).toBe(75);
    });
});

describe("UserService.getUserProfile method", () => {
    it("should return user with exercises and foods", async () => {
        // Create user
        const user = await insertUser();

        // Add exercise
        await server.exerciseProvider.exerciseModelStatic.create({
            name: "Running",
            time: 30,
            calories: 300,
            userId: user.id
        });

        // Add food
        await server.foodProvider.foodModelStatic.create({
            name: "Apple",
            calories: 95,
            count: 1,
            unit: "piece",
            userId: user.id
        });

        const profile = await server.userService.getUserProfile(user.id!);
        expect(profile).not.toBeNull();
        
        const plainProfile = profile!.get({ plain: true });
        expect(plainProfile.exercises).toHaveLength(1);
        expect(plainProfile.exercises[0].name).toBe("Running");
        expect(plainProfile.foods).toHaveLength(1);
        expect(plainProfile.foods[0].name).toBe("Apple");
    });
});