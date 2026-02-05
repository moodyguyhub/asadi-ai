// scripts/generate-cv.js
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");

async function main() {
  const projectRoot = process.cwd();
  const inputHtml = path.join(projectRoot, "public", "cv.html");
  const outputPdf = path.join(projectRoot, "public", "cv.pdf");

  if (!fs.existsSync(inputHtml)) {
    throw new Error(`Missing input HTML: ${inputHtml}`);
  }

  const chromiumPath =
    process.env.CHROME_PATH ||
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    "/usr/bin/google-chrome"; // system Chrome

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Load local file
  await page.goto(`file://${inputHtml}`, { waitUntil: "networkidle0" });

  // Keep "screen" styling (dark theme) in the PDF
  await page.emulateMediaType("screen");

  await page.pdf({
    path: outputPdf,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`✅ CV PDF generated: ${outputPdf}`);
}

main().catch((err) => {
  console.error("❌ Failed to generate CV PDF:", err);
  process.exit(1);
});
