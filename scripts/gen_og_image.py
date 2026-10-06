"""Generates public/og-image.png (1200x630), the link-preview image used by
LinkedIn, Slack, X, etc. Styled after the github.com/r0od3x profile header.

Run: python scripts/gen_og_image.py   (requires: pip install pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
INK, MUTED, FAINT = "#E2E8F0", "#94A3B8", "#5B6780"
VIOLET, BLUE, CYAN = (167, 139, 250), (96, 165, 250), (34, 211, 238)


def font(names, size):
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


SANS_BOLD = ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
SANS = ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]
MONO = ["consola.ttf", "cour.ttf", "DejaVuSansMono.ttf"]


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_at(t):
    return lerp(VIOLET, BLUE, t * 2) if t < 0.5 else lerp(BLUE, CYAN, (t - 0.5) * 2)


# Background: diagonal navy -> deep violet -> teal, like the profile header.
bg = Image.new("RGB", (W, H))
px = bg.load()
stops = [(0.0, (11, 15, 26)), (0.55, (20, 13, 46)), (1.0, (6, 32, 46))]
for y in range(H):
    for x in range(W):
        t = (x / W + y / H) / 2
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t <= t1:
                px[x, y] = lerp(c0, c1, (t - t0) / (t1 - t0))
                break

# Soft glows
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse((-120, -160, 520, 380), fill=(90, 40, 190))
g.ellipse((760, 320, 1320, 820), fill=(4, 110, 130))
glow = glow.filter(ImageFilter.GaussianBlur(120))
img = Image.blend(bg, Image.composite(glow, bg, glow.convert("L")), 0.55)
d = ImageDraw.Draw(img)

# Name in the violet -> blue -> cyan gradient
name = "Mohamed Reda Ghalbi"
f_name = font(SANS_BOLD, 64)
nx, ny = 80, 205
nw = int(d.textlength(name, font=f_name))
mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).text((nx, ny), name, font=f_name, fill=255)
grad = Image.new("RGB", (W, H))
gd = ImageDraw.Draw(grad)
for x in range(W):
    gd.line([(x, 0), (x, H)], fill=gradient_at(min(max((x - nx) / max(nw, 1), 0), 1)))
img.paste(grad, (0, 0), mask)

d.text((82, 150), "HI, I'M", font=font(SANS_BOLD, 22), fill=MUTED, spacing=8)
d.text((80, 300), "AI & Data Science Engineering Student · EMSI", font=font(SANS, 30), fill=INK)

# Terminal chip
tx, ty, tw, th = 80, 380, 600, 64
d.rounded_rectangle((tx, ty, tx + tw, ty + th), radius=14, fill=(13, 17, 29), outline=(43, 49, 80), width=2)
for i, c in enumerate([(248, 113, 113), (251, 191, 36), (52, 211, 153)]):
    d.ellipse((tx + 22 + i * 22, ty + 26, tx + 34 + i * 22, ty + 38), fill=c)
d.text((tx + 100, ty + 18), "~$ building ML models, LLM agents & apps", font=font(MONO, 22), fill=CYAN)

# Avatar with gradient ring
av_src = ROOT / "public" / "avatar.webp"
if av_src.exists():
    size = 270
    cx, cy = 985, 280
    ring = Image.new("RGB", (size + 16, size + 16))
    rd = ImageDraw.Draw(ring)
    for x in range(size + 16):
        rd.line([(x, 0), (x, size + 16)], fill=gradient_at(x / (size + 16)))
    ring_mask = Image.new("L", ring.size, 0)
    ImageDraw.Draw(ring_mask).ellipse((0, 0, size + 15, size + 15), fill=255)
    img.paste(ring, (cx - size // 2 - 8, cy - size // 2 - 8), ring_mask)
    d.ellipse((cx - size // 2 - 3, cy - size // 2 - 3, cx + size // 2 + 3, cy + size // 2 + 3), fill=(10, 13, 23))
    av = Image.open(av_src).convert("RGB").resize((size - 8, size - 8), Image.LANCZOS)
    av_mask = Image.new("L", av.size, 0)
    ImageDraw.Draw(av_mask).ellipse((0, 0, av.size[0] - 1, av.size[1] - 1), fill=255)
    img.paste(av, (cx - av.size[0] // 2, cy - av.size[1] // 2), av_mask)

d.line([(80, 530), (W - 80, 530)], fill=(43, 49, 80), width=2)
d.text((80, 555), "github.com/r0od3x", font=font(MONO, 24), fill=MUTED)
loc = "Casablanca, Morocco"
d.text((W - 80 - d.textlength(loc, font=font(MONO, 24)), 555), loc, font=font(MONO, 24), fill=FAINT)

out = ROOT / "public" / "og-image.png"
img.save(out, optimize=True)
print(f"wrote {out}")
