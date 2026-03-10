import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.join(import.meta.dirname, "..", "screenshots");

async function screenshot() {
  const urlPath = process.argv[2] ?? "/fb-ads-course?flow=dual&preview=true";
  const label = process.argv[3] ?? urlPath.replace(/[^a-zA-Z0-9]/g, "_").replace(/^_+|_+$/g, "");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: "networkidle" });

  // Full-page screenshot
  const fullPath = path.join(OUT_DIR, `${label}_full.png`);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`Full page: ${fullPath}`);

  // Viewport-only screenshot (above the fold)
  const foldPath = path.join(OUT_DIR, `${label}_fold.png`);
  await page.screenshot({ path: foldPath });
  console.log(`Above fold: ${foldPath}`);

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobilePath = path.join(OUT_DIR, `${label}_mobile.png`);
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log(`Mobile: ${mobilePath}`);

  await browser.close();
}

screenshot().catch((err) => {
  console.error(err);
  process.exit(1);
});
