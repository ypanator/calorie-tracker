import { Sequelize } from "sequelize";

const sequelize: Sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data.sqlite"
})

export default sequelize;