import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isCloudflarePages =
  process.env.CF_PAGES === "1" || process.env.CLOUDFLARE_PAGES === "true";
const isStaticExport = isGitHubPages || isCloudflarePages;

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        basePath: isGitHubPages
          ? process.env.GITHUB_PAGES_BASE_PATH || ""
          : "",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
