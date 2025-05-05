import { Sequelize, QueryTypes, QueryOptionsWithType } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { jest } from '@jest/globals';
import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { createSequelizeData, createServer } from "./test-utils.ts";

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
    process.env.food_api_key = 'test-key';
    process.env.food_api_id = 'test-id';
    
    await sequelizeData.sync({ force: true });
});

const insertUser = async () => {
    return (await server.userProvider.userModelStatic.create({
        gender: "male",
        age: 30,
        height: 173,
        weight: 75,
        bmi: "25.1",
        calories: "2,813 kcal/day",
        carbs: "316 - 457 grams",
        fiber: "39 grams",
        protein: "60 grams",
        fat: "63 - 109 grams"
    })).get({ plain: true });
};

describe("FoodService.find method", () => {
    it("should throw error when API key is missing", async () => {
        process.env.food_api_key = '';
        
        await expect(server.foodService.find("apple", 1))
            .rejects.toMatchObject({
                msg: "Searching for foods is not available.",
                code: 500
            });
    });

    it("should throw error when API ID is missing", async () => {
        process.env.food_api_id = '';
        
        await expect(server.foodService.find("apple", 1))
            .rejects.toMatchObject({
                msg: "Searching for foods is not available.",
                code: 500
            });
    });

    it("should return both common and branded food items", async () => {
        // Setup mock responses for all API calls
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

        // Mock response for initial search
        const searchResponse: AxiosResponse = {
            data: {
                common: [{
                    food_name: "apple",
                    serving_unit: "medium"
                }],
                branded: [{
                    nix_item_id: "123",
                    food_name: "Apple Juice",
                    serving_unit: "ml"
                }]
            },
            status: 200,
            statusText: "OK",
            headers: mockAxiosHeaders,
            config: mockConfig
        };

        // Mock response for common food details
        const commonDetailsResponse: AxiosResponse = {
            data: {
                foods: [{
                    food_name: "apple",
                    nf_calories: 95,
                    serving_unit: "medium"
                }]
            },
            status: 200,
            statusText: "OK",
            headers: mockAxiosHeaders,
            config: mockConfig
        };

        // Mock response for branded food details
        const brandedDetailsResponse: AxiosResponse = {
            data: {
                foods: [{
                    food_name: "Apple Juice",
                    nf_calories: 120,
                    serving_unit: "ml"
                }]
            },
            status: 200,
            statusText: "OK",
            headers: mockAxiosHeaders,
            config: mockConfig
        };

        // Setup the request mock to return appropriate responses based on URL
        type RequestFunction = <T = any>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
        const requestMock = jest.fn<RequestFunction>().mockImplementation((config: AxiosRequestConfig) => {
            if (config.url?.includes('search/instant')) {
                return Promise.resolve(searchResponse);
            } else if (config.url?.includes('natural/nutrients')) {
                return Promise.resolve(commonDetailsResponse);
            } else if (config.url?.includes('search/item')) {
                return Promise.resolve(brandedDetailsResponse);
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        server.foodProvider.foodAxios.request = requestMock as any;

        const result = await server.foodService.find("apple", 2);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            name: "apple",
            calories: 190, // 95 * 2 servings
            count: 2,
            unit: "medium"
        });
        expect(result[1]).toEqual({
            name: "Apple Juice",
            calories: 240, // 120 * 2 servings
            count: 2,
            unit: "ml"
        });

        // Verify the number and types of API calls
        expect(requestMock).toHaveBeenCalledTimes(3); // Initial search + 2 detail calls
    });

    it("should handle API errors gracefully", async () => {
        // Mock API failure
        type RequestFunction = <T = any>(config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
        const requestMock = jest.fn<RequestFunction>().mockRejectedValue(new Error("API Error"));
        server.foodProvider.foodAxios.request = requestMock as any;

        await expect(server.foodService.find("apple", 1))
            .rejects.toMatchObject({
                msg: "Searching for foods is not available.",
                code: 500
            });
    });
});

describe("FoodService.add method", () => {
    it("should store food with user association", async () => {
        // First create a user
        const user = await insertUser();
        
        const food = await server.foodService.add({
            name: "Apple",
            calories: 95,
            count: 1,
            unit: "piece",
            userId: user.id
        });

        const plainFood = food.get({ plain: true });
        expect(plainFood.name).toBe("Apple");
        expect(plainFood.calories).toBe(95);
        expect(plainFood.count).toBe(1);
        expect(plainFood.unit).toBe("piece");
        expect(plainFood.userId).toBe(user.id);
    });
});