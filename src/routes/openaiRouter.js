import express from "express";
import { summarizeTextController } from "../controllers/openaiController.js"; 

const router = express.Router();

// OpenAI API 라우트
router.post("/summarize", summarizeTextController);

export default router;