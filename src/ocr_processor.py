import os
import pytesseract
import cv2
from PIL import Image

# OCR을 수행할 이미지 파일명
image_filename = "4.PNG"
image_path = os.path.abspath(image_filename)

# 이미지 열기 (OpenCV 사용)
try:
    img = cv2.imread(image_path)

    # 이미지 전처리: 흑백 변환 (Grayscale)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 이미지 전처리: 이진화 (Thresholding)
    _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # 배경 제거 (Adaptive Thresholding)
    adaptive_thresh = cv2.adaptiveThreshold(
        binary, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # ✅ 노이즈 제거 (Gaussian Blur)
    denoised = cv2.GaussianBlur(adaptive_thresh, (3, 3), 0)

    # ✅ OCR 실행 (한국어 + 영어 지원) & 무작위 문자 방지 (--psm 6 설정)
    config = "--psm 6"
    extracted_text = pytesseract.image_to_string(denoised, lang="eng+kor", config=config)

    # 결과 출력
    print(f"📄 {image_filename} - 추출된 텍스트:")
    print(extracted_text)

except FileNotFoundError:
    print(f"❌ 오류: '{image_filename}' 파일을 찾을 수 없습니다.")

except Exception as e:
    print(f"❌ 오류: {e}")
