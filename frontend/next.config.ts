import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  webpack: (config) => {
    // Resolve optional peer dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      porto: false,
    };
    
    // Ignore test files that are accidentally included by dependencies
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /\/test\//,
        contextRegExp: /thread-stream|pino/,
      })
    );
    
    return config;
  },
};

export default nextConfig;
