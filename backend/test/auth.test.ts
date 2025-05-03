import { Sequelize } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import { server, sequelizeAuth, sequelizeData } from "../test/test-objects.ts"

const truncateAll = async (sequelize: Sequelize) => {
    for (const model of Object.values(sequelize.models)) {
        await model.destroy({ truncate: true, cascade: true });
    }
};

beforeEach(async () => {
    await sequelizeData.sync({ force: true });
    await sequelizeAuth.sync({ force: true });
});

const insertCredentials = async () => await server.authProvider.create({
    username: "test",
    password: "$2a$10$NeJ2YiUNn88TDLlAELh9ZOg8BbGaSEiqxUWDOX/JTpPh7kFp..RrS", // hashed "test"
    userId: 1234
});


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
            console.log((error as Error).message)
            console.log((error as Error).stack ?? "")
            console.log((error as Error).name)
            console.log((error as Error).cause)
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