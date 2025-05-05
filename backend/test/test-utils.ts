import { Sequelize } from "sequelize"
import { SequelizeData } from "../src/db/db.ts";
import Server from "../src/server.ts";
import { AxiosHeaders, AxiosResponse } from "axios";

export const createSequelizeData = (): SequelizeData => {
    return new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
};

export const createServer = async (sequelizeData?: SequelizeData): Promise<Server> => {
    const server = new Server();
    await server.init({ sequelizeData });
    return server;
}