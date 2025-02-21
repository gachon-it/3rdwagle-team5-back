import { Router } from "express";
import multer from "multer";
import path from "path";
import { runOCR } from "../services/ocr.js";

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
    const events = await runOCR(filePath);

    return res.status(200).send({
      success: true,
      message: "일정 추출 성공",
      events: events.text,
    });
  } catch (error) {
    console.error("이미지 처리 에러 발생:", error);
    res.status(500).send({ success: false, error: "이미지 처리 실패" });
  }
});
