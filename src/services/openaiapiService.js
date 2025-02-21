import OpenAI from "openai";
import dotenv from "dotenv";
import { SUMMARIZATION_PROMPT } from "../constant.js";

dotenv.config(); // 환경 변수 로드

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY,
});

// 텍스트 요약 함수
export async function summarizeText(inputText) {
  try {
    const prompt = SUMMARIZATION_PROMPT.replace("{{inputText}}", inputText);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.4,
    });

    const summarizedText = response.choices[0].message.content.trim();

    // GPT 응답에서 내용 추출
    return summarizedText;
  } catch (error) {
    console.error(
      "❌ OpenAI API 요청 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "OpenAI API 요청 실패"
    );
  }
}
