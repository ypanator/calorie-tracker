import { Sequelize } from "sequelize";

export class SequelizeData extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./data.sqlite"
        });
    }
}

export class SequelizeAuth extends Sequelize {
    constructor() {
        super({
            dialect: "sqlite",
            storage: "./auth.sqlite"
        });
    }
}