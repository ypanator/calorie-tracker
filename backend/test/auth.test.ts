import { Sequelize } from "sequelize";
import ApiError from "../src/error/api-error.ts";
import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { jest } from '@jest/globals';

let sequelizeData: SequelizeData;
let server: Server;

beforeAll(async () => {
    class SequelizeData extends Sequelize {
        constructor() {
            super({
                dialect: "sqlite",
                storage: "./test/db/data.sqlite",
                logging: false
            });
        }
    }

    sequelizeData = new SequelizeData();
    server = new Server();
    await server.init({ sequelizeData });
});

afterAll(async () => {
    await server.close();
})

beforeEach(async () => {
    // cleans all tables
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
    it("should throw error on not registered user.", async () => {
        try {
            await server.authService.login("test", "test");
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Incorrect credentials.");
            expect((error as ApiError).code).toBe(401);
        }
    });

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

    it("should throw on incorrect password.", async () => {
        try {
            await insertCredentials();
            await server.authService.login("test", "test1");
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Incorrect credentials.");
            expect((error as ApiError).code).toBe(401);
        }
    });

    it("should return userId on successful login.", async () => {
        await insertCredentials();
        const userId = await server.authService.login("test", "test");
        expect(typeof userId).toBe("number");
    });
});

describe("AuthService.register method", () => {
    it("should throw on duplicate username.", async () => {
        try {
            await insertCredentials();
            await server.authService.register("test", "test");
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).msg).toBe("Username already taken.");
            expect((error as ApiError).code).toBe(400);
        }
    });

    it("should create user and auth records on successful registration.", async () => {
        await server.authService.register("test", "test");
        const auth = await server.authProvider.findCredentialsByUsername("test");
        expect(auth).not.toBeNull();
        
        const credentials = auth!.get({ plain: true });
        expect(credentials.username).toBe("test");
        expect(credentials.userId).toBeDefined();
        
        const user = await server.userService.getUser(credentials.userId!);
        expect(user).not.toBeNull();
    });
});