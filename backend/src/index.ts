import express from "express";
import exerciseRouter from "./controllers/exercise-controller";
import foodRouter from "./controllers/food-controller";
import userRouter from "./controllers/user-controller";

let app = express();

app.use("/exercise", exerciseRouter);
app.use("/food", foodRouter);
app.use("/user", userRouter);

// testing endpoint
app.get("/", (req, res) => { res.send("Hello World!") });

app.listen(3000, () => console.log("listening on port 3000"));