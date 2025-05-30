import { Sequelize } from "sequelize"
import { SequelizeData } from "../src/db/db.ts";
import Server from "../src/server.ts";
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import { jest } from '@jest/globals';
import { User } from "../src/types/user-type.ts";

export const createSequelizeData = (): SequelizeData => 
    new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });

export const createServer = async (sequelizeData?: SequelizeData): Promise<Server> => {
    const server = new Server();
    await server.init({ sequelizeData });
    return server;
}

export const createMockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
    config: {
        headers: new AxiosHeaders(),
        method: 'GET',
        url: 'mock-url'
    } as any
});

export type RequestFunction = (config: AxiosRequestConfig) =>
    Promise<AxiosResponse<any>>;
  
export const createRequestMock = (func: RequestFunction) =>
    jest.fn<RequestFunction>().mockImplementation(func);

export const defaultUser: User = {
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
}