import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pin the workspace root to this project (a stray package-lock.json in the
  // home directory otherwise confuses Next's root inference)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
