import os
import sys
import json
import platform
from typing import Callable, Optional, List

import numpy as np
import cv2
from PIL import Image
import pytesseract
import pdfplumber
from PyPDF2 import PdfReader
from pdf2image import convert_from_path

# ---------- Tesseract auto-config (Windows friendly) ----------
def try_configure_tesseract_explicit_path() -> Optional[str]:
    explicit_path = os.environ.get("TESSERACT_CMD")
    if explicit_path and os.path.isfile(explicit_path):
        pytesseract.pytesseract.tesseract_cmd = explicit_path
        return explicit_path

    if platform.system().lower().startswith("win"):
        for path in [
            r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
            r"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe",
        ]:
            if os.path.isfile(path):
                pytesseract.pytesseract.tesseract_cmd = path
                return path
    return None

# ---------- Core OCR processor  ----------
class DocumentProcessor:
    def __init__(self, tesseract_cmd: Optional[str] = None, poppler_path: Optional[str] = None) -> None:
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
        else:
            try_configure_tesseract_explicit_path()
        self.poppler_path = poppler_path or os.environ.get("POPPLER_PATH")

    def _to_grayscale(self, image_bgr: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    def _threshold_otsu(self, gray: np.ndarray) -> np.ndarray:
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return thresh

    def _denoise(self, gray: np.ndarray) -> np.ndarray:
        return cv2.medianBlur(gray, 3)

    def _deskew(self, gray_or_bin: np.ndarray) -> np.ndarray:
        image = gray_or_bin.copy()
        if len(image.shape) == 3:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, bin_img = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        bin_inv = cv2.bitwise_not(bin_img)
        coords = np.column_stack(np.where(bin_inv > 0))
        if coords.size == 0:
            return gray_or_bin
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        if abs(angle) < 0.5:
            return gray_or_bin
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(gray_or_bin, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        return rotated

    def preprocess_image(self, image_bgr: np.ndarray, apply_deskew: bool = True) -> np.ndarray:
        gray = self._to_grayscale(image_bgr)
        denoised = self._denoise(gray)
        if apply_deskew:
            denoised = self._deskew(denoised)
        bin_img = self._threshold_otsu(denoised)
        return bin_img

    def ocr_numpy_image(self, image: np.ndarray, lang: str = "eng") -> str:
        if len(image.shape) == 2:
            pil_img = Image.fromarray(image)
        else:
            pil_img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        config = "--oem 3 --psm 6"
        return pytesseract.image_to_string(pil_img, lang=lang, config=config)

    def process_image_file(self, filepath: str, lang: str = "eng") -> str:
        image_bgr = cv2.imdecode(np.fromfile(filepath, dtype=np.uint8), cv2.IMREAD_COLOR)
        if image_bgr is None:
            raise RuntimeError("Unable to read image file.")
        preprocessed = self.preprocess_image(image_bgr)
        return self.ocr_numpy_image(preprocessed, lang=lang)

    def _extract_text_from_pdf_native(self, filepath: str) -> str:
        texts: List[str] = []
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    texts.append(page_text)
        return "\n\n".join(texts).strip()

    def _ocr_pdf_page(self, filepath: str, page_index_zero_based: int, dpi: int = 300, lang: str = "eng") -> str:
        images = convert_from_path(
            filepath,
            dpi=dpi,
            first_page=page_index_zero_based + 1,
            last_page=page_index_zero_based + 1,
            poppler_path=self.poppler_path,
        )
        if not images:
            return ""
        pil_img = images[0]
        image_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        preprocessed = self.preprocess_image(image_bgr)
        return self.ocr_numpy_image(preprocessed, lang=lang)

    def process_pdf_file(self, filepath: str, lang: str = "eng",
                         progress_callback: Optional[Callable[[int, int, str], None]] = None) -> str:
        native_text = self._extract_text_from_pdf_native(filepath)
        if native_text and len(native_text) >= 50:
            return native_text

        try:
            reader = PdfReader(filepath)
            total_pages = len(reader.pages)
        except Exception as exc:
            raise RuntimeError(f"Failed to read PDF: {exc}")

        ocr_texts: List[str] = []
        for page_idx in range(total_pages):
            if progress_callback:
                progress_callback(page_idx + 1, total_pages, f"OCR page {page_idx + 1}/{total_pages}")
            try:
                page_text = self._ocr_pdf_page(filepath, page_idx, dpi=300, lang=lang)
            except Exception as exc:
                if "poppler" in str(exc).lower() or "pdfinfo" in str(exc).lower():
                    raise RuntimeError(
                        "PDF to image conversion failed. Install Poppler and set POPPLER_PATH to its 'bin' directory."
                    ) from exc
                raise
            ocr_texts.append(page_text.strip())

        return ("\n\n".join(ocr_texts)).strip()

    def process_file(self, filepath: str, lang: str = "eng",
                     progress_callback: Optional[Callable[[int, int, str], None]] = None) -> str:
        if not os.path.isfile(filepath):
            raise FileNotFoundError("File does not exist.")

        ext = os.path.splitext(filepath)[1].lower()
        if ext in {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}:
            if progress_callback:
                progress_callback(0, 1, "Running OCR on image...")
            return self.process_image_file(filepath, lang=lang)
        elif ext == ".pdf":
            return self.process_pdf_file(filepath, lang=lang, progress_callback=progress_callback)
        else:
            raise RuntimeError("Unsupported file type. Supported: PDF, JPG, JPEG, PNG, BMP, TIF, TIFF")

# ---------- CLI entry ----------
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True, help="Path to input PDF/image")
    parser.add_argument("--lang", default="eng")
    args = parser.parse_args()
    try:
        proc = DocumentProcessor()
        text = proc.process_file(args.file, lang=args.lang)
        print(json.dumps({"ok": True, "file": os.path.basename(args.file), "text": text}, ensure_ascii=False))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))
        sys.exit(1)
