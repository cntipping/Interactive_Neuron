import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.GITHUB_ACTIONS === 'true'
  ? {
      output: 'export',
      // Keep the prerender request at `/` and make assets relative so the
      // export works at either a user site or a repository Pages URL.
      assetPrefix: './',
      trailingSlash: true,
    }
  : {};

export default nextConfig;
