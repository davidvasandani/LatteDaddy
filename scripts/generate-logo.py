#!/usr/bin/env python3
"""Generate LatteDaddy app icon assets. Deterministic — same output every run."""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)

CANVAS = 1024          # final output size
SUPERSAMPLE = 2        # render at 2x then downsample for anti-aliasing
GRADIENT_START = (210, 105, 30)    # #D2691E top-left
GRADIENT_END = (242, 166, 90)      # #F2A65A bottom-right
MARK_COLOR = (250, 246, 240)       # #FAF6F0


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def render_background(size):
    img = Image.new("RGB", (size, size))
    px = img.load()
    diag = (size - 1) * 2
    for y in range(size):
        for x in range(size):
            t = (x + y) / diag
            px[x, y] = lerp(GRADIENT_START, GRADIENT_END, t)
    return img


def bezier_point(p0, p1, p2, t):
    one = 1 - t
    return (
        one * one * p0[0] + 2 * one * t * p1[0] + t * t * p2[0],
        one * one * p0[1] + 2 * one * t * p1[1] + t * t * p2[1],
    )


def draw_curl(img, size, max_stroke, min_stroke):
    """Stamp tapered cream curl. Two Bézier segments form a ~270° curl
    opening toward the upper right, evoking a single steam wisp."""
    draw = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    r = size * 0.34

    segments = [
        # (p0, control, p2) — counter-clockwise from bottom, around to top-right
        ((cx - r * 0.2, cy + r * 1.0),
         (cx - r * 1.6, cy + r * 0.2),
         (cx - r * 0.9, cy - r * 1.1)),
        ((cx - r * 0.9, cy - r * 1.1),
         (cx + r * 0.8, cy - r * 1.6),
         (cx + r * 1.2, cy - r * 0.1)),
    ]

    steps = 400
    total = steps * len(segments)
    i = 0
    for p0, p1, p2 in segments:
        for s in range(steps):
            t = s / (steps - 1)
            x, y = bezier_point(p0, p1, p2, t)
            progress = i / total
            radius = max_stroke / 2 + (min_stroke - max_stroke) / 2 * progress
            draw.ellipse(
                (x - radius, y - radius, x + radius, y + radius),
                fill=MARK_COLOR,
            )
            i += 1


def render_icon():
    s = CANVAS * SUPERSAMPLE
    img = render_background(s)
    draw_curl(img, s, max_stroke=160 * SUPERSAMPLE, min_stroke=60 * SUPERSAMPLE)
    return img.resize((CANVAS, CANVAS), Image.LANCZOS)


def render_adaptive():
    """Android foreground: transparent bg, mark only, scaled to 66% safe zone."""
    s = CANVAS * SUPERSAMPLE
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    # Draw mark on temp canvas sized to safe zone, then paste centered
    safe = int(s * 0.66)
    mark = Image.new("RGBA", (safe, safe), (0, 0, 0, 0))
    draw_curl(mark, safe, max_stroke=safe / 6.4, min_stroke=safe / 17)
    offset = (s - safe) // 2
    img.paste(mark, (offset, offset), mark)
    return img.resize((CANVAS, CANVAS), Image.LANCZOS)


def main():
    icon = render_icon()
    icon.save(OUT / "icon.png", "PNG")
    icon.save(OUT / "splash-icon.png", "PNG")
    render_adaptive().save(OUT / "adaptive-icon.png", "PNG")
    print(f"Wrote 3 PNGs to {OUT}")


if __name__ == "__main__":
    main()
