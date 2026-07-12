import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pin the workspace root to this project (a stray package-lock.json in the
  // home directory otherwise confuses Next's root inference)
  turbopack: {
    root: __dirname,
  },
  // @sparticuz/chromium ships a binary asset that Next's file tracing can't
  // resolve on its own — keep it (and puppeteer-core) external so it's
  // required from node_modules as-is at runtime.
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
