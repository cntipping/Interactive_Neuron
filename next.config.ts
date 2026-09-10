import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.GITHUB_ACTIONS === 'true'
  ? {
      output: 'export',
    }
  : {};

export default nextConfig;
