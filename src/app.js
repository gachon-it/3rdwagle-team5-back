import express from "express";
import dotenv from "dotenv";
import scheduleURouter from "./controllers/scheduler.js"; 
import openaiRouter from "./routes/openaiRouter.js"; // ✅ 경로 수정 (route → routes)

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/schedule", scheduleURouter);

app.use("/openai", openaiRouter); 

console.log("OPENAI_API_KEY:", process.env.OPENAPI_KEY); // 환경 변수 로드 확인

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});