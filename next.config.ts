import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las fuentes de las imágenes OG se leen del disco en runtime
  outputFileTracingIncludes: { "/*": ["./assets/og-fonts/**"] },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
};

export default nextConfig;
