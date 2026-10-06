import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

// Fuentes self-hosted (OFL) — sin requests a Google en runtime, display: swap.
const display = localFont({
  src: [
    { path: "./fonts/big-shoulders-display-latin-700-normal.woff2", weight: "700" },
    { path: "./fonts/big-shoulders-display-latin-900-normal.woff2", weight: "900" },
  ],
  display: "swap",
  variable: "--font-big-shoulders",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});
const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-instrument-serif",
  fallback: ["Georgia", "serif"],
});
const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: "Una carrera entera. Un solo gráfico.",
    url: site.url,
    siteName: "207",
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.title, description: "Una carrera entera. Un solo gráfico." },
};

export const viewport: Viewport = {
  themeColor: "#07111F",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
