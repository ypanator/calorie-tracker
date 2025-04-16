import express from "express";
import session from "express-session";
import sqliteStoreFactory from "express-session-sqlite";
import { Database } from "sqlite3";

import exerciseRouter from "./controllers/exercise-controller";
import foodRouter from "./controllers/food-controller";
import userRouter from "./controllers/user-controller";
import errorHandler from "./error-handler/error-handler";

const app = express();
const SqliteStore = sqliteStoreFactory(session);

const session_key: string = process.env.session_key || "";
if (!session_key) {
  throw new Error("Missing session_key in environment variables.");
}

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

app.use("/exercise", exerciseRouter);
app.use("/food", foodRouter);
app.use("/user", userRouter);

// testing endpoint
app.get("/", (req, res) => { res.send("Hello World!") });

app.listen(3000, () => console.log("listening on port 3000"));