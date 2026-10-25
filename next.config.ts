import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — see docs/design-system/ARCHITECTURE.md.
  output: "export",
  images: { unoptimized: true },
  // Dev only: the owner reviews over the LAN address; without this Next blocks its dev scripts there.
  allowedDevOrigins: ["192.168.20.5"],
};

export default nextConfig;
