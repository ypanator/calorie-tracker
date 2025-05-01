import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

export class SequelizeData extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./src/db/data.sqlite"
        });
    }
}

export class SequelizeAuth extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./src/db/auth.sqlite"
        });
    }
}