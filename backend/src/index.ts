import express from "express";
import session from "express-session";
import sqliteStoreFactory from "express-session-sqlite";
import { Database } from "sqlite3";

import { SequelizeAuth, SequelizeData } from "./db/db";
import dotenv from "dotenv"

import ExerciseProvider from "./providers/exercise-provider";
import ExerciseService from "./services/exercise-service";
import ExerciseController from "./controllers/exercise-controller";
import helmet from "helmet";
import errorHandler from "./error/error-handler";
import UserProvider from "./providers/user-provider";
import UserService from "./services/user-service";
import UserController from "./controllers/user-controller";
import FoodProvider from "./providers/food-provider";
import FoodService from "./services/food-service";
import FoodController from "./controllers/food-controller";
import AuthProvider from "./providers/auth-provider";
import AuthService from "./services/auth-service";
import AuthController from "./controllers/auth-controller";

const app = express();
const SqliteStore = sqliteStoreFactory(session);
dotenv.config()

const session_key: string = process.env.session_key || "";
if (!session_key) {
  throw new Error("Missing session_key in environment variables.");
}

app.use(helmet());
app.use(express.json());
app.use(errorHandler);
app.use(session({
    store: new SqliteStore({
			driver: Database,
			path: "./db/sessions.sqlite",
			ttl: 1000 * 60 * 60 * 24
		}),
    secret: session_key,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
}));

const sequelizeData: SequelizeData = new SequelizeData();
const sequelizeAuth: SequelizeAuth = new SequelizeAuth();

// Dependency Injection
const userProvider: UserProvider = new UserProvider(sequelizeData);
const userService: UserService = new UserService(userProvider, sequelizeData);
const userController: UserController = new UserController(userService);

const exerciseProvider: ExerciseProvider = new ExerciseProvider(sequelizeData, userProvider);
const exerciseService: ExerciseService = new ExerciseService(exerciseProvider, userService);
const exerciseController: ExerciseController = new ExerciseController(exerciseService);

const foodProvider: FoodProvider = new FoodProvider(sequelizeData);
const foodService = new FoodService(foodProvider);
const foodController: FoodController = new FoodController(foodService);

const authProvider: AuthProvider = new AuthProvider(sequelizeAuth, userProvider);
const authService: AuthService = new AuthService(authProvider, sequelizeAuth, userService, sequelizeData);
const authController: AuthController = new AuthController(authService);

userProvider.init(exerciseProvider, foodProvider, authProvider);

app.use("/exercise", exerciseController.router);
app.use("/food", foodController.router);
app.use("/user", userController.router);
app.use("/auth", authController.router);

// testing endpoint
app.get("/", (req, res) => { res.send("Hello World!") });

app.listen(3000, () => console.log("listening on port 3000"));