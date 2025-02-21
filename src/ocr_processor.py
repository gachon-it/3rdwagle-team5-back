import sys
import os
import pytesseract
import cv2
from PIL import Image
import json
import io  # UTF-8 강제 설정을 위한 모듈

# ✅ 기본 인코딩을 UTF-8로 변경 (Windows cmd에서 발생하는 cp949 문제 해결)
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding="utf-8")

# ✅ Tesseract 실행 경로 설정
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "이미지 파일이 전달되지 않았습니다."}, ensure_ascii=False))
        sys.exit(1)

    image_path = os.path.abspath(sys.argv[1])  # Node.js에서 전달된 이미지 경로

    try:
        img = cv2.imread(image_path)
        if img is None:
            print(json.dumps({"error": "이미지를 로드할 수 없습니다."}, ensure_ascii=False))
            sys.exit(1)

        # ✅ 이미지 전처리: 흑백 변환 (Grayscale)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # ✅ 이미지 전처리: 이진화 (Thresholding)
        _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # ✅ 배경 제거 (Adaptive Thresholding)
        adaptive_thresh = cv2.adaptiveThreshold(
            binary, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # ✅ 노이즈 제거 (Gaussian Blur)
        denoised = cv2.GaussianBlur(adaptive_thresh, (3, 3), 0)

        # ✅ OCR 실행 (한국어 + 영어 지원) & 무작위 문자 방지 (--psm 6 설정)
        config = "--psm 6"
        extracted_text = pytesseract.image_to_string(denoised, lang="eng+kor", config=config).strip().replace("\n", " ")

        # ✅ JSON 형식으로 변환하여 UTF-8 인코딩 유지
        result = {"text": extracted_text}
        print(json.dumps(result, ensure_ascii=False))  # 한글 깨짐 방지

    except Exception as e:
        print(json.dumps({"error": str(e)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
