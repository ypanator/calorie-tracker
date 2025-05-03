import { Sequelize } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";

let sequelizeData: SequelizeData;
let server: Server;

beforeAll(async () => {

    class SequelizeData extends Sequelize {
        constructor() {
            super({
                dialect: "sqlite",
                storage: "./test/db/data.sqlite"
            });
        }
    }

    sequelizeData = new SequelizeData();
    server = new Server();
    await server.init({ sequelizeData });
});


const truncateAll = async (sequelize: Sequelize) => {
    for (const model of Object.values(sequelize.models)) {
        await model.destroy({ truncate: true, cascade: true });
    }
};

beforeEach(async () => {
    await sequelizeData.sync({ force: true });
});

const insertCredentials = async () => {
    const user = (await server.userProvider.userModelStatic.create({
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
    await server.authProvider.authModelStatic.create({
        username: "test",
        password: "$2a$10$NeJ2YiUNn88TDLlAELh9ZOg8BbGaSEiqxUWDOX/JTpPh7kFp..RrS", // hashed "test"
        userId: user.id
    });
};

describe("AuthService.login method", () => {
    // it("should throw error on not registered user.", async () => {
    //     try {
    //         await server.authService.login("test", "test");
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(ApiError);
    //         expect((error as ApiError).msg).toBe("Incorrect credentials.");
    //         expect((error as ApiError).code).toBe(401);
    //     }
    // });

    it("should throw on incorrect username.", async () => {
        try {
            await insertCredentials();
            await server.authService.login("test1", "test");
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Incorrect credentials.");
            expect((error as ApiError).code).toBe(401);
        }
    });

    // it("should throw on incorrect password.", async () => {
    //     try {
    //         await insertCredentials();
    //         await server.authService.login("test", "test1");
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(ApiError);
    //         expect((error as ApiError).msg).toBe("Incorrect credentials.");
    //         expect((error as ApiError).code).toBe(401);
    //     }
    // });
});