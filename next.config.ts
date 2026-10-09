import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las fuentes de las imágenes OG se leen del disco en runtime
  outputFileTracingIncludes: { "/*": ["./assets/og-fonts/**"] },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Respaldo si la API de Commons no responde en el build: Special:FilePath redirige a upload.wikimedia.org
      { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/wiki/Special:FilePath/**" },
      // Miniaturas de los videos de YouTube (se muestran sin optimizar)
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
