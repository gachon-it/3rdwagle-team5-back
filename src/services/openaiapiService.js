import { SUMMARIZATION_PROMPT } from "../constant.js";
import openai from "../config/openaiConfig.js";

/**
 * OpenAI API를 사용하여 입력된 텍스트를 요약하는 함수
 * @param {string} inputText - 요약할 원본 텍스트
 * @returns {Promise<string>} GPT 모델이 생성한 요약된 텍스트
 * @throws {Error} OpenAI API 요청 실패 시 예외 발생
 */
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

    const summarizedTextByGPT = response.choices[0].message.content.trim();

    return summarizedTextByGPT;
  } catch (error) {
    console.error(
      "OpenAI API 요청 실패:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message || "OpenAI API 요청 실패"
    );
  }
}
