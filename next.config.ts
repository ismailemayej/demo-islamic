/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Next.js SWC compiler দিয়ে দ্রুত minification
  experimental: {
    optimizeCss: true, // Tailwind + CSS optimization
    esmExternals: true, // Modern ES6 modules
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
    ],
    // unoptimized: true, // Production এ অফ রাখুন, optimized images ব্যবহার করুন
  },
  future: {
    webpack5: true, // Next.js 13+ Modern Webpack
  },
};

module.exports = nextConfig;
