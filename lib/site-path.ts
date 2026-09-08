const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function siteAssetPath(path: string): string {
  if (!basePath || !path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
