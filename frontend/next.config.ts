import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // Empty config to allow webpack config
  webpack: (config) => {
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
