import Server from "../src/server.ts";
import { SequelizeData } from "../src/db/db.ts";
import { createSequelizeData, createServer, defaultUser } from "./test-utils.ts";

let sequelizeData: SequelizeData;
let server: Server;

beforeAll(async () => {
    sequelizeData = createSequelizeData();
    server = await createServer(sequelizeData);
});

afterAll(async () => {
    await server.close();
})

beforeEach(async () => {
    // cleans all tables
    await sequelizeData.sync({ force: true });
});

const insertCredentials = async () => {
    const user = (await server.userProvider.userModelStatic.create(defaultUser)).get({ plain: true });
    await server.authProvider.authModelStatic.create({
        username: "test",
        password: "$2a$10$NeJ2YiUNn88TDLlAELh9ZOg8BbGaSEiqxUWDOX/JTpPh7kFp..RrS", // hashed "test"
        userId: user.id
    });
};

describe("AuthService.login method", () => {
    it("should throw error on not registered user.", async () => {
        await expect(server.authService.login("test", "test")).rejects.toMatchObject({
            msg: "Incorrect credentials.",
            code: 401
        });
    });

    it("should throw on incorrect username.", async () => {
        await insertCredentials();
        await expect(server.authService.login("test1", "test")).rejects.toMatchObject({
            msg: "Incorrect credentials.",
            code: 401
        });
    });

        it("should throw on incorrect password.", async () => {
            await insertCredentials();
            await expect(server.authService.login("test", "test1")).rejects.toMatchObject({
                msg: "Incorrect credentials.",
                code: 401
            });
        });

        it("should return userId on successful login.", async () => {
            await insertCredentials();
            const userId = await server.authService.login("test", "test");
            expect(typeof userId).toBe("number");
        });
    });

    describe("AuthService.register method", () => {
        it("should throw on duplicate username.", async () => {
            await insertCredentials();
            await expect(server.authService.register("test", "test")).rejects.toMatchObject({
                msg: "Username already taken.",
                code: 400
            });
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