import { Sequelize } from "sequelize";

export class SequelizeData extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./src/db/data.sqlite"
        });
    }
}