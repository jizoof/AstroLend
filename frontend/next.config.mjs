/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "standalone",

  // 🔥 THIS IS THE KEY FIX
  experimental: {
    runtime: "nodejs",
  },
};

export default nextConfig;