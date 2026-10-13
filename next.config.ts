import type { NextConfig } from 'next';
// Runs as a Next.js server (next start) so API routes such as the free SEO tools can keep their keys server-side.
const nextConfig: NextConfig = { distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', images: { unoptimized: true }, poweredByHeader: false };
export default nextConfig;
