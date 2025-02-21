import express from "express";
import { summarizeText } from "../services/openaiapiService.js"; // ✅ import 경로 수정

const openaiRouter = express.Router();

/**
 * 1️⃣ 텍스트 요약 API
 * - URL: `/openai/summarize`
 * - Method: POST
 * - Content-Type: application/json
 */
openaiRouter.post("/summarize", async (req, res) => {
  const { inputText } = req.body;

  // 입력 값 검증
  if (!inputText || inputText.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "입력된 텍스트가 없습니다.",
    });
  }

  try {
    // OpenAI 서비스 호출
    const summarizedText = await summarizeText(inputText);

    // 결과 반환
    return res.status(200).json({
      success: true,
      message: "텍스트 요약 성공",
      summarizedText,
    });
  } catch (error) {
    console.error("❌ 텍스트 요약 중 에러 발생:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "텍스트 요약에 실패했습니다.",
    });
  }
});
export function getOpenAIResponse(req, res) {
  res.json({ success: true, message: "OpenAI API is working!" });
}
export default openaiRouter;