import express from "express";
import session from "express-session";
const { default: sqliteStoreFactory } = await import("express-session-sqlite");
import sqlite from "sqlite3";
import { Express } from 'express';

import { SequelizeAuth, SequelizeData } from "./db/db.js";
import dotenv from "dotenv";

import ExerciseProvider from "./providers/exercise-provider.js";
import ExerciseService from "./services/exercise-service.js";
import ExerciseController from "./controllers/exercise-controller.js";
import helmet from "helmet";
import errorHandler from "./error/error-handler.js";
import UserProvider from "./providers/user-provider.js";
import UserService from "./services/user-service.js";
import UserController from "./controllers/user-controller.js";
import FoodProvider from "./providers/food-provider.js";
import FoodService from "./services/food-service.js";
import FoodController from "./controllers/food-controller.js";
import AuthProvider from "./providers/auth-provider.js";
import AuthService from "./services/auth-service.js";
import AuthController from "./controllers/auth-controller.js";

export default class Server {
    private readonly app: Express;
    private readonly SqliteStore: any;
    private readonly sequelizeData: SequelizeData;
    private readonly sequelizeAuth: SequelizeAuth;
    private readonly userProvider: UserProvider;
    private readonly userService: UserService;
    private readonly userController: UserController;
    private readonly exerciseProvider: ExerciseProvider;
    private readonly exerciseService: ExerciseService;
    private readonly exerciseController: ExerciseController;
    private readonly foodProvider: FoodProvider;
    private readonly foodService: FoodService;
    private readonly foodController: FoodController;
    private readonly authProvider: AuthProvider;
    private readonly authService: AuthService;
    private readonly authController: AuthController;
  
    constructor(dependencies?: { sequelizeData?: SequelizeData, sequelizeAuth?: SequelizeAuth }) {
      this.app = express();
      this.SqliteStore = sqliteStoreFactory(session);
      dotenv.config({ path: "./src/keys.env" });
    
      const session_key: string = process.env.session_key || "";
      if (!session_key) {
        throw new Error("Missing session_key in environment variables.");
      }
    
      this.app.use(helmet());
      this.app.use(express.json());
      this.app.use(session({
        store: new this.SqliteStore({
          driver: sqlite.Database,
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
      
      this.sequelizeData = dependencies?.sequelizeData || new SequelizeData();
      this.sequelizeAuth = dependencies?.sequelizeAuth || new SequelizeAuth();
      
      // Dependency Injection
      this.userProvider = new UserProvider(this.sequelizeData);
      this.userService = new UserService(this.userProvider, this.sequelizeData);
      this.userController = new UserController(this.userService);
      
      this.exerciseProvider = new ExerciseProvider(this.sequelizeData, this.userProvider);
      this.exerciseService = new ExerciseService(this.exerciseProvider, this.userService);
      this.exerciseController = new ExerciseController(this.exerciseService);
      
      this.foodProvider = new FoodProvider(this.sequelizeData, this.userProvider);
      this.foodService = new FoodService(this.foodProvider);
      this.foodController = new FoodController(this.foodService);
      
      this.authProvider = new AuthProvider(this.sequelizeAuth, this.userProvider);
      this.authService = new AuthService(this.authProvider, this.sequelizeAuth, this.userService, this.sequelizeData);
      this.authController = new AuthController(this.authService);
      
      this.userProvider.init(this.exerciseProvider, this.foodProvider, this.authProvider);
      
      this.sequelizeAuth.sync();
      this.sequelizeData.sync();
      
      this.app.use("/exercise", this.exerciseController.router);
      this.app.use("/food", this.foodController.router);
      this.app.use("/user", this.userController.router);
      this.app.use("/auth", this.authController.router);
      
      // testing endpoint
      this.app.get("/", (req, res) => { res.send("Hello World!") });
      
      this.app.use(errorHandler);
    }
  
    public start(port: number = 3000): void {
      this.app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    };
  }