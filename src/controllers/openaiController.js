import { summarizeText } from "../services/openaiapiService.js"; // ✅ OpenAI 서비스 함수 가져오기

export async function summarizeTextController(req, res) {
  const { inputText } = req.body;

  if (!inputText || inputText.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "입력된 텍스트가 없습니다.",
    });
  }

  try {
    const summarizedText = await summarizeText(inputText);

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
}