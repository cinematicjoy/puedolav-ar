import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const input = path.resolve("public/icons/source.svg");
const outputDir = path.resolve("public/icons");

await fs.mkdir(outputDir, { recursive: true });

const icons = [
  { name: "icon-192.png", size: 192, padding: 0 },
  { name: "icon-512.png", size: 512, padding: 0 },
  { name: "maskable-512.png", size: 512, padding: 54 },
  { name: "apple-touch-icon.png", size: 180, padding: 0 }
];

for (const icon of icons) {
  const innerSize = icon.size - icon.padding * 2;

  const resized = await sharp(input)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: icon.size,
      height: icon.size,
      channels: 4,
      background: "#74e3a4"
    }
  })
    .composite([
      {
        input: resized,
        left: icon.padding,
        top: icon.padding
      }
    ])
    .png()
    .toFile(path.join(outputDir, icon.name));

  console.log(`Generated ${icon.name}`);
}