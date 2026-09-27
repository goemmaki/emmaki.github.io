import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — see docs/design-system/ARCHITECTURE.md.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
