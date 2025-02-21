import { spawn } from "child_process";
import fs from "fs";
import { OCR_SCRIPT_PATH } from "../constant.js";

/**
 * OCR 서비스: Python OCR 스크립트 실행
 * @param {string} filePath - 업로드된 이미지 파일 경로
 * @returns {Promise<object>} OCR 결과(JSON)
 */
export const runOCR = (filePath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [OCR_SCRIPT_PATH, filePath]);

    let result = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python 오류:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error("OCR 분석 중 오류 발생"));
        return;
      }

      try {
        const parsedResult = JSON.parse(result);
        resolve(parsedResult);
      } catch (error) {
        reject(new Error("OCR 결과 처리 실패"));
      } finally {
        fs.unlink(filePath, (err) => {
          if (err) console.error("파일 삭제 실패:", err);
        });
      }
    });
  });
};
