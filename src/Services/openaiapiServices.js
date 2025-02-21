import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config(); // 환경변수 .env 파일 사용

// OpenAI API 설정
const configuration = new Configuration({

});
const openai = new OpenAIApi(configuration);

// 텍스트 요약 함수
export async function summarizeText(inputText) {
  try {
    // OpenAI API 호출: 텍스트를 요약하는 요청
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",  // 또는 gpt-4-turbo
      messages: [
        {
          role: "user",
          content: `다음 내용을 바탕으로 일시, 제목, 세부 내용을 요약해 주세요. 예시: ${inputText}`,
        },
      ],
    });

    // 요약된 텍스트 반환
    const summarizedText = response.data.choices[0].message.content;
    return summarizedText;
  } catch (error) {
    console.error("❌ OpenAI API 요청 실패:", error);
    throw new Error("API 요청 실패");
  }
}