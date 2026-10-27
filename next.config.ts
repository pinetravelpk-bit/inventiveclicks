import type { NextConfig } from 'next';
// Runs as a Next.js server (next start) so API routes such as the free SEO tools can keep their keys server-side.
const nextConfig: NextConfig = { distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', images: { unoptimized: true }, poweredByHeader: false,
  // Pin the project root so a stray lockfile in a parent folder is never treated as the workspace root.
  outputFileTracingRoot: process.cwd(),
  async redirects() { return [{ source: '/tools/backlink-prospect-finder', destination: '/tools/website-audit', permanent: true }]; } };
export default nextConfig;
