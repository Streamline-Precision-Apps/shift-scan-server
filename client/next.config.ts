import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const isMobile = process.env.NEXT_PUBLIC_IS_MOBILE === "true";

const nextConfig: NextConfig = {
  ...(isMobile ? { output: "export" as const } : {}),
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "https://shift-scan-server-897456891133.us-west3.run.app/",
    "192.168.1.102",
    "192.168.1.102:3000",
    "localhost:3000",
  ],
  // Suppress WebSocket HMR console warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce console noise from webpack HMR
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const msg = args[0]?.toString() || '';
        // Filter out WebSocket connection warnings
        if (msg.includes('WebSocket') || msg.includes('webpack-hmr')) {
          return;
        }
        originalWarn.apply(console, args);
      };
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin("./i18n.ts");
const combinedConfig = withNextIntl(nextConfig);

module.exports = combinedConfig;
