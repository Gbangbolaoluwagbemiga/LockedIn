const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Fix for nested dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Resolve modules from root first, then nested
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];
    
    // Force resolve lodash from root
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': path.resolve(__dirname, 'node_modules/lodash'),
    };
    
    return config;
  },
  transpilePackages: [
    '@reown/appkit',
    '@reown/appkit-adapter-wagmi',
    '@reown/appkit-controllers',
  ],
};

module.exports = nextConfig;

