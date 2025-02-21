import express from "express";
import dotenv from "dotenv";
import { scheduleRouter } from "./controllers/scheduler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/schedule", scheduleRouter);

app.listen(process.env.PORT, (err) => {
  console.log(`Server running on port ${process.env.PORT}`);
});
