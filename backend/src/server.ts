import express from "express";
import session from "express-session";
import sqliteStoreFactory from "express-session-sqlite";
import { Database } from "sqlite3";
import { Express } from 'express';

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
  
    constructor() {
      this.app = express();
      this.SqliteStore = sqliteStoreFactory(session);
      dotenv.config()
    
      const session_key: string = process.env.session_key || "";
      if (!session_key) {
        throw new Error("Missing session_key in environment variables.");
      }
    
      this.app.use(helmet());
      this.app.use(express.json());
      this.app.use(errorHandler);
      this.app.use(session({
          store: new this.SqliteStore({
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
    
      this.sequelizeData = new SequelizeData();
      this.sequelizeAuth = new SequelizeAuth();
    
      // Dependency Injection
      this.userProvider = new UserProvider(this.sequelizeData);
      this.userService = new UserService(this.userProvider, this.sequelizeData);
      this.userController = new UserController(this.userService);
    
      this.exerciseProvider = new ExerciseProvider(this.sequelizeData, this.userProvider);
      this.exerciseService = new ExerciseService(this.exerciseProvider, this.userService);
      this.exerciseController = new ExerciseController(this.exerciseService);
    
      this.foodProvider = new FoodProvider(this.sequelizeData);
      this.foodService = new FoodService(this.foodProvider);
      this.foodController = new FoodController(this.foodService);
    
      this.authProvider = new AuthProvider(this.sequelizeAuth, this.userProvider);
      this.authService = new AuthService(this.authProvider, this.sequelizeAuth, this.userService, this.sequelizeData);
      this.authController = new AuthController(this.authService);
    
      this.userProvider.init(this.exerciseProvider, this.foodProvider, this.authProvider);
    
      this.app.use("/exercise", this.exerciseController.router);
      this.app.use("/food", this.foodController.router);
      this.app.use("/user", this.userController.router);
      this.app.use("/auth", this.authController.router);
    
      // testing endpoint
      this.app.get("/", (req, res) => { res.send("Hello World!") });
    }
  
    public start(port: number = 3000): void {
      this.app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    }
  }