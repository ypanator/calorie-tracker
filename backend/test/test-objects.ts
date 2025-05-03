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

export class SequelizeAuth extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./test/db/auth.sqlite"
        });
    }
}

const sequelizeAuth = new SequelizeAuth();
const sequelizeData = new SequelizeData();

const server: Server = new Server();
await server.init({ sequelizeData, sequelizeAuth });
server.start();

export { server, sequelizeAuth, sequelizeData };