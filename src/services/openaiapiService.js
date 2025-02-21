import OpenAI from "openai"; // ✅ 최신 openai 버전에서는 OpenAI 클래스를 사용
import dotenv from "dotenv";

dotenv.config(); // 환경 변수 로드

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY, // ✅ 환경 변수에서 API 키 가져오기 (.env에서 확인 필요!)
});

// 텍스트 요약 함수
export async function summarizeText(inputText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ 최신 GPT 모델 사용 가능
      messages: [
        {
          role: "user",
          content: `다음 내용을 바탕으로 일시, 제목, 세부 내용을 요약해 주세요. 예시: ${inputText}`,
        },
      ],
      max_tokens: 150, // ✅ 응답 길이 제한 설정
      temperature: 0.4, // ✅ 응답의 일관성을 유지하도록 설정
    });

    // 요약된 텍스트 반환
    return response.choices[0].message.content; // ✅ 최신 버전 응답 구조 적용
  } catch (error) {
    console.error("❌ OpenAI API 요청 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "OpenAI API 요청 실패");
  }
}