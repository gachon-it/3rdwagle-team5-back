import express from "express";
import { getOpenAIResponse } from "../controllers/openaiController.js"; 

const router = express.Router();

// OpenAI API 라우트
router.post("/chat", getOpenAIResponse);

export default router;