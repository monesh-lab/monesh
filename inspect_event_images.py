import os
from PIL import Image

path = r"C:\Users\mones_yuolfx5\.gemini\antigravity\scratch\figma-to-website"
asset_dir = os.path.join(path, "asset")

images_to_check = [
    "WhatsApp Image 2026-07-23 at 09.31.38 - Copy.jpeg",
    "Vedanta-Aluminiums-rural-health-camps-reach-10000-residents-2 - Copy.png",
    "case-img-1 - Copy.jpg",
    "a37b89723c - Copy.jpg",
    "POST - Copy.jpg",
    "images (5) - Copy.jpg"
]

for name in images_to_check:
    img_path = os.path.join(asset_dir, name)
    if os.path.exists(img_path):
        img = Image.open(img_path)
        print(f"{name}: {img.size} {img.format}")
    else:
        print(f"{name} does not exist!")
