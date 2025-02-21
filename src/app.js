import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.listen(process.env.PORT, (err) => {
  console.log(`Server running on port ${process.env.PORT}`);
});
