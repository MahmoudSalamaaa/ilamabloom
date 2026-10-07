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
  async rewrites() {\r\n    return [{ source: "/api/auth/:path*/", destination: "/api/auth/:path*" }];\r\n  },\r\n  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/ilama-bloom" : "" },
  ...(isGitHubPages
    ? { output: "export", basePath: "/ilama-bloom", assetPrefix: "/ilama-bloom/" }
    : {}),
};

export default nextConfig;
