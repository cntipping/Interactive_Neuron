import type { NextConfig } from 'next';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = process.env.GITHUB_ACTIONS === 'true' && repositoryName
  ? `/${repositoryName}`
  : '';

const nextConfig: NextConfig = process.env.GITHUB_ACTIONS === 'true'
  ? { output: 'export', basePath, assetPrefix: `${basePath}/` }
  : {};

export default nextConfig;
