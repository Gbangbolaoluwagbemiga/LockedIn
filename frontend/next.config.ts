import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude problematic test files from being processed
  serverComponentsExternalPackages: ['thread-stream', 'pino'],
  
  webpack: (config, { isServer }) => {
    // Exclude test files from being bundled  
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /node_modules.*\/(test|tests|__tests__|spec)\//,
      use: 'null-loader',
    });
    
    return config;
  },
};

export default nextConfig;
