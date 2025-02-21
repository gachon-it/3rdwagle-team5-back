import { Router } from "express";
import multer from "multer";
import path from "path";
import { runOCR } from "../services/ocr.js";

export const scheduleRouter = Router();
const upload = multer({ dest: "uploads/" });

/**
 * 1️⃣ 일정 추출 API (OCR 분석)
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
      events: events,
    });
  } catch (error) {
    console.error("이미지 처리 에러 발생:", error);
    res.status(500).send({ success: false, error: "이미지 처리 실패" });
  }
});

/**
 * 2️⃣ 일정 등록 API (구글 캘린더에 등록)
 * - URL: `/schedule/calendar`
 * - Method: POST
 * - Content-Type: application/send
 */
scheduleRouter.post("/calendar", async (req, res) => {
  console.log(req.body);
  const { title, date, start_time, end_time, location, description } = req.body;

  if (!title || !date || !start_time || !end_time) {
    return res.status(400).send({ success: false, error: "요청 형식 오류" });
  }

  try {
    // 구글 캘린더에 일정 등록하는 서비스 함수 호출

    return res.status(200).send({
      success: true,
      message: "캘린터에 일정 등록 완료",
    });
  } catch (error) {
    console.error("캘린더에 일정 등록 중 에러 발생:", error);
    res.status(500).send({
      success: false,
      error: "캘린터에 일정 등록 실패",
    });
  }
});
