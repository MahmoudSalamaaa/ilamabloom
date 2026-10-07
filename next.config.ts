import type { NextConfig } from "next";

const isGitHubPages = process.env.ILAMA_GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/n", destination: "/", permanent: true },
      { source: "/n/:path*", destination: "/", permanent: true },
      { source: "/nourio", destination: "/", permanent: true },
      { source: "/nourio/:path*", destination: "/", permanent: true },
    ];
  },
  images: { unoptimized: true },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/api/auth/:path*/", destination: "/api/auth/:path*" },
      { source: "/explore", destination: "/" },
      { source: "/life-stages", destination: "/" },
      { source: "/mental-health-nutrition", destination: "/" },
      { source: "/kids", destination: "/" },
      { source: "/everyday", destination: "/" },
      { source: "/weekly-bloom", destination: "/" },
      { source: "/easy-mode", destination: "/" },
      { source: "/food-lens", destination: "/" },
      { source: "/food-atlas", destination: "/" },
      { source: "/quick-log", destination: "/" },
      { source: "/journal", destination: "/" },
      { source: "/visit-prep", destination: "/" },
      { source: "/about", destination: "/" },
      { source: "/privacy", destination: "/" },
      { source: "/sitemap", destination: "/" },
    ];
  },
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/ilama-bloom" : "" },
  ...(isGitHubPages
    ? { output: "export", basePath: "/ilama-bloom", assetPrefix: "/ilama-bloom/" }
    : {}),
};

export default nextConfig;
