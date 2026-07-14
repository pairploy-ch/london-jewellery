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

/* Renders an HTML string to a PDF buffer (A5, 148x210mm, print
   backgrounds on). Uses @sparticuz/chromium on Vercel/serverless, a local
   Chrome/Edge install in dev. */
export async function htmlToPdf(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  let executablePath: string;
  let args: string[] = [];
  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    executablePath = await chromium.executablePath();
    // @sparticuz/chromium ships the dedicated "chrome-headless-shell" binary,
    // not the full browser — it must be launched with headless: "shell" or
    // Puppeteer's newer full-browser headless handshake fails against it.
    args = await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" });
  } else {
    const local = localBrowserPath();
    if (!local) {
      throw new Error(
        "No local Chrome/Edge install found. Install Google Chrome or Microsoft Edge to generate PDFs in development.",
      );
    }
    executablePath = local;
  }

  const browser = await puppeteer.launch({
    executablePath,
    args,
    headless: isServerless ? "shell" : true,
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    // Additional Details is free text and can run long enough to overflow
    // the single sheet. Rather than let it spill onto a second page,
    // uniformly shrink the whole report to fit within 210mm — `zoom` (unlike
    // `transform: scale`) actually reflows layout, so the shrunk content no
    // longer occupies extra page height. Floored so pathologically long
    // input degrades to a (still legible) overflow onto a second page
    // rather than shrinking to an unreadable sliver.
    const MIN_SCALE = 0.75;
    await page.evaluate((minScale) => {
      const el = document.querySelector<HTMLElement>(".page");
      if (!el) return;
      const PX_PER_MM = 96 / 25.4;
      const pageHeightPx = 210 * PX_PER_MM;
      if (el.scrollHeight > pageHeightPx) {
        const scale = Math.max(minScale, pageHeightPx / el.scrollHeight);
        el.style.zoom = String(scale);
      }
    }, MIN_SCALE);

    const pdf = await page.pdf({
      width: "148mm",
      height: "210mm",
      printBackground: true,
      preferCSSPageSize: false,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
