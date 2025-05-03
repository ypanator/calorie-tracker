import { Sequelize } from "sequelize";
import Server from "../src/server";

export class SequelizeData extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./test/db/data.sqlite"
        });
    }
}

const sequelizeData = new SequelizeData();

const server: Server = new Server();
await server.init({ sequelizeData });
server.start();

export { server, sequelizeData };