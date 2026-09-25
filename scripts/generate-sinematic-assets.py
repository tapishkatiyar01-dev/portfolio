"""Generate cinematic assets for templates/sinematic theme."""

from __future__ import annotations

import math
import os
import random
import struct
import subprocess
import zlib
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "sinematic"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
FPS = 20
DURATION = 10
FRAMES = FPS * DURATION


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def rgba(r: int, g: int, b: int, a: int = 255) -> tuple[int, int, int, int]:
    return (r, g, b, a)


def make_grain(size: int = 256) -> Image.Image:
    random.seed(42)
    img = Image.new("RGBA", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            n = random.randint(0, 255)
            px[x, y] = (n, n, n, random.randint(18, 42))
    return img.filter(ImageFilter.GaussianBlur(0.4))


def make_vignette(w: int = W, h: int = H) -> Image.Image:
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for step in range(28, 0, -1):
        t = step / 28
        alpha = int(lerp(0, 210, t ** 1.8))
        margin_x = int((w * 0.08) * (1 - t))
        margin_y = int((h * 0.08) * (1 - t))
        draw.rectangle(
            [margin_x, margin_y, w - margin_x, h - margin_y],
            fill=(0, 0, 0, alpha),
        )
    return img.filter(ImageFilter.GaussianBlur(8))


def make_light_leak(w: int = W, h: int = H) -> Image.Image:
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    # Warm leak — top-right
    draw.ellipse([-w * 0.15, -h * 0.35, w * 0.75, h * 0.55], fill=(249, 115, 22, 95))
    # Lime leak — left
    draw.ellipse([-w * 0.45, h * 0.15, w * 0.35, h * 1.05], fill=(201, 255, 74, 70))
    # Indigo leak — bottom
    draw.ellipse([w * 0.25, h * 0.55, w * 1.05, h * 1.2], fill=(49, 46, 129, 110))

    layer = layer.filter(ImageFilter.GaussianBlur(48))
    return Image.alpha_composite(img, layer)


def make_frame_texture(size: int = 512) -> Image.Image:
    random.seed(7)
    img = Image.new("RGBA", (size, size), (20, 22, 26, 255))
    draw = ImageDraw.Draw(img)

    for _ in range(120):
        x1 = random.randint(0, size)
        y1 = random.randint(0, size)
        x2 = x1 + random.randint(-80, 80)
        y2 = y1 + random.randint(-2, 2)
        draw.line([(x1, y1), (x2, y2)], fill=(255, 255, 255, random.randint(4, 14)), width=1)

    for _ in range(900):
        x = random.randint(0, size - 1)
        y = random.randint(0, size - 1)
        img.putpixel((x, y), (255, 255, 255, random.randint(2, 10)))

    return img.filter(ImageFilter.GaussianBlur(0.6))


def make_divider_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 24" fill="none">
  <line x1="0" y1="12" x2="1200" y2="12" stroke="rgba(244,241,234,0.15)" stroke-width="1"/>
  <g fill="rgba(201,255,74,0.35)">
    <rect x="24" y="8" width="8" height="8" rx="1"/>
    <rect x="44" y="8" width="8" height="8" rx="1"/>
    <rect x="64" y="8" width="8" height="8" rx="1"/>
    <rect x="1128" y="8" width="8" height="8" rx="1"/>
    <rect x="1148" y="8" width="8" height="8" rx="1"/>
    <rect x="1168" y="8" width="8" height="8" rx="1"/>
  </g>
</svg>
"""


def blob_alpha(cx: float, cy: float, radius: float, rgb: tuple[int, int, int], peak: int) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x0 = int(cx - radius)
    y0 = int(cy - radius)
    x1 = int(cx + radius)
    y1 = int(cy + radius)
    draw.ellipse([x0, y0, x1, y1], fill=(*rgb, peak))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.42))


def render_ambient_frame(t: float) -> Image.Image:
    """t in [0, 1) — seamless loop."""
    base = Image.new("RGB", (W, H), (8, 9, 11))

    # Slow indigo base wash
    angle = t * math.tau
    wash = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wdraw = ImageDraw.Draw(wash)
    cx = W * (0.5 + 0.08 * math.sin(angle))
    cy = H * (0.45 + 0.06 * math.cos(angle * 0.9))
    wdraw.ellipse([cx - 900, cy - 700, cx + 900, cy + 700], fill=(15, 15, 35, 180))
    base = Image.alpha_composite(base.convert("RGBA"), wash).convert("RGB")

    blobs = [
        (
            W * (0.72 + 0.06 * math.sin(angle)),
            H * (0.18 + 0.05 * math.cos(angle * 1.1)),
            420,
            (201, 255, 74),
            52,
        ),
        (
            W * (0.22 + 0.07 * math.cos(angle * 0.85)),
            H * (0.72 + 0.06 * math.sin(angle * 1.2)),
            520,
            (49, 46, 129),
            88,
        ),
        (
            W * (0.55 + 0.09 * math.sin(angle * 1.35 + 1.2)),
            H * (0.48 + 0.08 * math.cos(angle * 0.75)),
            300,
            (249, 115, 22),
            38,
        ),
    ]

    comp = base.convert("RGBA")
    for cx, cy, radius, rgb, peak in blobs:
        comp = Image.alpha_composite(comp, blob_alpha(cx, cy, radius, rgb, peak))

    # Subtle moving scan band
    scan = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(scan)
    band_y = int(H * ((t * 0.35) % 1.0))
    sdraw.rectangle([0, band_y, W, band_y + 120], fill=(201, 255, 74, 10))
    comp = Image.alpha_composite(comp, scan.filter(ImageFilter.GaussianBlur(18)))

    return comp.convert("RGB")


def write_webm(frames: list[Image.Image], path: Path) -> None:
    import imageio_ffmpeg

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libvpx-vp9",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "34",
        "-b:v",
        "0",
        "-deadline",
        "good",
        "-cpu-used",
        "4",
        str(path),
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    for frame in frames:
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    stderr = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
    code = proc.wait()
    if code != 0:
        raise RuntimeError(f"ffmpeg failed ({code}): {stderr[-800:]}")


def write_mp4(frames: list[Image.Image], path: Path) -> None:
    import imageio_ffmpeg

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "28",
        "-preset",
        "medium",
        "-movflags",
        "+faststart",
        str(path),
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    assert proc.stdin is not None
    for frame in frames:
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    stderr = proc.stderr.read().decode("utf-8", errors="replace") if proc.stderr else ""
    code = proc.wait()
    if code != 0:
        raise RuntimeError(f"ffmpeg mp4 failed ({code}): {stderr[-800:]}")


def write_poster(frame: Image.Image, path: Path) -> None:
    poster = frame.copy()
    poster.thumbnail((1280, 720), Image.Resampling.LANCZOS)
    poster.save(path, "JPEG", quality=82, optimize=True)


def main() -> None:
    print("Generating static assets…")
    make_grain().save(OUT / "grain.png", optimize=True)
    make_vignette().save(OUT / "vignette.png", optimize=True)
    make_light_leak().save(OUT / "light-leak.png", optimize=True)
    make_frame_texture().save(OUT / "frame-texture.png", optimize=True)
    (OUT / "divider.svg").write_text(make_divider_svg(), encoding="utf-8")

    print(f"Rendering {FRAMES} ambient frames ({DURATION}s @ {FPS}fps)…")
    frames = [render_ambient_frame(i / FRAMES) for i in range(FRAMES)]

    print("Encoding video…")
    write_webm(frames, OUT / "ambient-loop.webm")
    write_mp4(frames, OUT / "ambient-loop.mp4")
    write_poster(frames[0], OUT / "ambient-poster.jpg")

    sizes = {p.name: p.stat().st_size for p in OUT.iterdir() if p.is_file()}
    print("Done. Files in public/sinematic/:")
    for name, size in sorted(sizes.items()):
        print(f"  {name}: {size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
