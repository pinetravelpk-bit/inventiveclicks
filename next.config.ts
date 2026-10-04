import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output: 'export', distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', images: { unoptimized: true } };
export default nextConfig;
