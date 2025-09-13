/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Your existing settings below ---
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // --- ADD THE WEBPACK CONFIGURATION HERE ---
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback, // This is important to not overwrite other fallbacks
      fs: false, // This tells webpack to ignore `fs` module on the client-side
      encoding: false, // This tells webpack to ignore `encoding` module
    };
    return config;
  },
};

export default nextConfig;