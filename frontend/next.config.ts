import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  webpack: (config) => {
    // Resolve optional peer dependencies and React Native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      porto: false,
      '@react-native-async-storage/async-storage': false,
      'react-native': false,
    };
    
    // Ignore test files and React Native imports
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /\/test\//,
        contextRegExp: /thread-stream|pino/,
      })
    );
    
    // Handle .node files
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    
    return config;
  },
};

export default nextConfig;
