import sys
import os
import pytesseract
import cv2
from PIL import Image
import json  # JSON 변환을 위한 라이브러리 추가

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "이미지 파일이 전달되지 않았습니다."}))
        sys.exit(1)

    image_path = os.path.abspath(sys.argv[1])

    try:
        img = cv2.imread(image_path)
        if img is None:
            print(json.dumps({"error": "이미지를 로드할 수 없습니다."}))
            sys.exit(1)

        # 이미지 전처리
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        adaptive_thresh = cv2.adaptiveThreshold(binary, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        denoised = cv2.GaussianBlur(adaptive_thresh, (3, 3), 0)

        # OCR 실행
        config = "--psm 6"
        extracted_text = pytesseract.image_to_string(denoised, lang="eng+kor", config=config).strip()

        # ✅ JSON 형식으로 변환하여 출력
        result = {"text": extracted_text}
        print(json.dumps(result))  # JSON 출력

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
