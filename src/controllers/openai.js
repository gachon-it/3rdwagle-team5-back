import express from "express";
import { summarizeText } from "../services/openapiService.js"; // 서비스에서 summarizeText 함수를 가져옴

const openapiRouter = express.Router();

/**
 * 1️⃣ 텍스트 요약 API
 * - URL: `/openapi/summarize`
 * - Method: POST
 * - Content-Type: application/json
 */
openapiRouter.post("/summarize", async (req, res) => {
  const { inputText } = req.body;

  // 텍스트가 없다면 400 에러 응답
  if (!inputText) {
    return res.status(400).json({
      success: false,
      error: "입력된 텍스트가 없습니다.",
    });
  }

  try {
    // 서비스에서 텍스트 요약 함수 호출
    const summarizedText = await summarizeText(inputText);

    // 요약된 텍스트를 클라이언트에 반환
    return res.status(200).json({
      success: true,
      message: "텍스트 요약 성공",
      summarizedText,
    });
  } catch (error) {
    console.error("텍스트 요약 중 에러 발생:", error);
    return res.status(500).json({
      success: false,
      error: "텍스트 요약에 실패했습니다.",
    });
  }
});

export default openapiRouter;