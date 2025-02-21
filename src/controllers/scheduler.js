import { Router } from "express";
import multer from "multer";
import path from "path";
import { runOCR } from "../services/ocr.js";
import { summarizeText } from "../services/openaiapiService.js";

export const scheduleRouter = Router();
const upload = multer({ dest: "uploads/" });

/**
 * 일정 추출 API (OCR 분석)
 * - URL: `/schedule/upload`
 * - Method: POST
 * - Content-Type: multipart/form-data
 */
scheduleRouter.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  if (!req.file)
    return res.status(400).send({ success: false, error: "등록된 파일 없음." });

  const filePath = path.resolve(req.file.path);

  try {
    // 일정 정보 추출을 위한 OCR을 사용한 서비스 함수 호출
    const eventText = await runOCR(filePath);
    const summarizedText = await summarizeText(eventText);

    return res.status(200).json({
      success: true,
      message: "텍스트 요약 성공",
      summarizedText,
    });
  } catch (error) {
    console.error("이미지 처리 에러 발생:", error);
    res.status(500).send({ success: false, error: "이미지 처리 실패" });
  }
});
