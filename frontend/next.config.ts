import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true, // ← disables blocking on ESLint errors during build
  },
};

export default nextConfig;
