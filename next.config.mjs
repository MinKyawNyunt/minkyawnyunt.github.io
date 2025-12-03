/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  distDir: 'docs',
  basePath: process.env.NODE_ENV === 'production' ? '/profile' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/profile' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
