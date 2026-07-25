import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForSelector("text=Signature Collections", { timeout: 15000 });
await page.screenshot({ path: process.argv[2] + "/home-top.png" });

await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(400);
await page.screenshot({ path: process.argv[2] + "/home-mid.png" });

await page.evaluate(() => window.scrollTo(0, 3200));
await page.waitForTimeout(400);
await page.screenshot({ path: process.argv[2] + "/home-testimonials.png" });

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: process.argv[2] + "/home-footer.png" });

// mobile viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: process.argv[2] + "/home-mobile.png" });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
