"""Pillow-based image verification and normalization.

Why this exists:
- `python-magic` needs a native libmagic which is painful on Windows.
- Pillow can verify real image content, handle EXIF orientation, and
  normalize uploads to bounded JPEG bytes for LLM providers.
"""

from __future__ import annotations

import io

from PIL import Image, ImageOps


ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
MAX_DIMENSION = 2048
NORMALIZED_MAX_DIMENSION = 1568
NORMALIZED_QUALITY = 88


class ImageValidationError(ValueError):
    pass


def verify_and_normalize(image_bytes: bytes) -> tuple[bytes, dict]:
    """Verify image bytes with Pillow and return normalized JPEG bytes + meta."""
    if not image_bytes:
        raise ImageValidationError("Empty file.")

    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img.verify()
    except Exception as exc:  # noqa: BLE001 - surface as validation error
        raise ImageValidationError(f"File is not a valid image: {exc}") from exc

    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            fmt = (img.format or "").upper()
            if fmt not in ALLOWED_FORMATS:
                # Re-open check covers BMP/GIF/TIFF etc. Reject explicitly.
                raise ImageValidationError(
                    f"Unsupported image format: {fmt or 'unknown'}. Use JPEG, PNG, or WebP."
                )
            img = ImageOps.exif_transpose(img)
            width, height = img.size
            if width < 32 or height < 32:
                raise ImageValidationError("Image is too small. Use at least 32x32px.")
            if max(width, height) > MAX_DIMENSION * 3:
                raise ImageValidationError("Image dimensions are unreasonably large.")

            rgb = img.convert("RGB")
            rgb.thumbnail(
                (NORMALIZED_MAX_DIMENSION, NORMALIZED_MAX_DIMENSION),
                Image.LANCZOS,
            )
            buf = io.BytesIO()
            rgb.save(buf, format="JPEG", quality=NORMALIZED_QUALITY, optimize=True)
            normalized = buf.getvalue()
            meta = {
                "original_format": fmt,
                "original_size": {"width": width, "height": height},
                "normalized_size": {"width": rgb.size[0], "height": rgb.size[1]},
                "normalized_bytes": len(normalized),
            }
            return normalized, meta
    except ImageValidationError:
        raise
    except Exception as exc:  # noqa: BLE001
        raise ImageValidationError(f"Could not process image: {exc}") from exc


def sniff_mime(image_bytes: bytes) -> str:
    """Best-effort MIME sniff without native deps. Returns image/* or octet-stream."""
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if image_bytes.startswith(b"RIFF") and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    return "application/octet-stream"
