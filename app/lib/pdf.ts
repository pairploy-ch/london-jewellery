import { existsSync } from "fs";

/* Local Chrome/Edge install paths — used in dev, where @sparticuz/chromium's
   Linux-only binary can't run. Not needed on Vercel. */
function localBrowserPath(): string | undefined {
  const candidates =
    process.platform === "win32"
      ? [
          `${process.env["PROGRAMFILES"]}\\Google\\Chrome\\Application\\chrome.exe`,
          `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
          `${process.env["PROGRAMFILES"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
          `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
          ]
        : ["/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"];
  return candidates.find((p) => p && existsSync(p));
}

/* Renders an HTML string to a PDF buffer (A4, print backgrounds on).
   Uses @sparticuz/chromium on Vercel/serverless, a local Chrome/Edge install
   in dev. */
export async function htmlToPdf(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  let executablePath: string;
  let args: string[] = [];
  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    executablePath = await chromium.executablePath();
    args = chromium.args;
  } else {
    const local = localBrowserPath();
    if (!local) {
      throw new Error(
        "No local Chrome/Edge install found. Install Google Chrome or Microsoft Edge to generate PDFs in development.",
      );
    }
    executablePath = local;
  }

  const browser = await puppeteer.launch({ executablePath, args, headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
