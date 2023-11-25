/** @type {import('next').NextConfig} */
const webpack = require("webpack");
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Modify the webpack configuration here
    // For example, using ProvidePlugin to make a module available globally
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          $: "Stack",
          // Other global modules can be added here
        })
      );
    }

    return config;
  },
};
module.exports = nextConfig;
