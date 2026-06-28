import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("public/icons");

await fs.mkdir(outDir, { recursive: true });

const icons = {
  default: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <circle cx="96" cy="96" r="54" fill="#61cf98"/>
      <path fill="#1f6ed4" d="M96 28C74 58 51 91 51 123c0 27 20 48 45 48s45-21 45-48C141 91 118 58 96 28Z"/>
      <path fill="#9ee6ff" d="M96 60C82 82 68 104 68 124c0 18 13 31 28 31s28-13 28-31C124 104 110 82 96 60Z"/>
    </svg>
  `,
  sun: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <circle cx="96" cy="96" r="34" fill="#ffca3a"/>
      <g stroke="#ffca3a" stroke-width="12" stroke-linecap="round">
        <path d="M96 30v20M96 142v20M30 96h20M142 96h20M49 49l15 15M128 128l15 15M143 49l-15 15M64 128l-15 15"/>
      </g>
    </svg>
  `,
  cloud: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <path fill="#eef7f3" d="M60 124h73c16 0 28-12 28-27s-12-27-27-27c-7-21-25-36-47-36-27 0-48 21-50 48-14 3-25 15-25 31 0 17 13 27 48 27Z"/>
      <path fill="#cbd8d3" d="M63 124h70c12 0 23-7 27-18-7 6-15 9-26 9H60c-21 0-34-6-41-17 3 17 17 26 44 26Z"/>
    </svg>
  `,
  rain: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <path fill="#eef7f3" d="M57 98h78c14 0 24-10 24-24s-10-24-24-24c-8-18-25-30-45-30-26 0-47 20-49 45-15 3-27 15-27 31 0 18 15 31 43 31Z"/>
      <g stroke="#1f6ed4" stroke-width="10" stroke-linecap="round">
        <path d="M60 122l-11 24M93 122l-11 24M126 122l-11 24"/>
      </g>
    </svg>
  `,
  storm: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <path fill="#eef7f3" d="M57 96h78c14 0 24-10 24-24s-10-24-24-24c-8-18-25-30-45-30-26 0-47 20-49 45-15 3-27 15-27 31 0 18 15 31 43 31Z"/>
      <path fill="#ffca3a" d="M100 93 70 148h25l-9 33 38-60H99l1-28Z"/>
    </svg>
  `,
  wind: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
      <rect width="192" height="192" rx="42" fill="#73dda3"/>
      <g fill="none" stroke="#eef7f3" stroke-width="14" stroke-linecap="round">
        <path d="M32 66h81c15 0 15-24 0-24-8 0-13 5-15 10"/>
        <path d="M27 96h114c20 0 20-30 0-30-9 0-15 5-18 12"/>
        <path d="M51 126h75c15 0 15 24 0 24-8 0-13-5-15-10"/>
      </g>
    </svg>
  `
};

const badgeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <rect width="96" height="96" fill="transparent"/>
    <path
      fill="#ffffff"
      d="M48 7C37 23 24 40 24 58c0 16 11 29 24 29s24-13 24-29C72 40 59 23 48 7Zm0 67c-8 0-14-7-14-17 0-9 6-20 14-32 8 12 14 23 14 32 0 10-6 17-14 17Z"
    />
  </svg>
`;

for (const [name, svg] of Object.entries(icons)) {
  await sharp(Buffer.from(svg))
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, `notification-${name}.png`));
}

await sharp(Buffer.from(badgeSvg))
  .resize(96, 96)
  .png()
  .toFile(path.join(outDir, "notification-badge.png"));

console.log("Notification icons generated in public/icons");