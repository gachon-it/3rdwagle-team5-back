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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `다음 내용을 바탕으로 여러 개의 일정을 각각 나누어 요약해 주세요.
          각 일정은 '/'로 구분되며, "ISO 8601 형식의 일시/제목/세부 내용" 형식으로 정리됩니다.
          
          - 일시는 반드시 "YYYY-MM-DDTHH:mm:ss+09:00" 형식으로 변환해야 합니다.
          - 예를 들어 "2023년 7월 15일 오전 9시"는 "2023-07-15T09:00:00+09:00"으로 변환됩니다.
          - 시간 정보가 없을 경우 기본적으로 "T00:00:00+09:00"을 추가합니다.
          
          예시:
          2023-07-15T09:00:00+09:00/전국 고등학생 프로그래밍 대회 개최 안내/2023년 7월 15일에 전국 고등학생을 대상으로 한 프로그래밍 대회가 개최됩니다.
          2023-08-20T10:30:00+09:00/대학생 해커톤 대회/2023년 8월 20일에 대학생 대상 해커톤이 진행됩니다.
    
          입력 내용:
          ${inputText}`
        },
      ],
      max_tokens: 300,
      temperature: 0.4,
    });

    const summarizedText = response.choices[0].message.content.trim(); 

    // GPT 응답에서 내용 추출
    return summarizedText

  } catch (error) {
    console.error("❌ OpenAI API 요청 실패:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || "OpenAI API 요청 실패");
  }
}