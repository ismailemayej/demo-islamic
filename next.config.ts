/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // SWC minify default হিসেবে active, explicit key আর দরকার নেই
  // swcMinify: true, // Removed

  experimental: {
    appDir: true, // App Router enabled
    optimizeCss: true,
    esmExternals: true,
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
    // unoptimized: true, // optional
  },

  // future key obsolete, সরিয়ে দিলাম
  // future: {
  //   webpack5: true,
  // },
};

module.exports = nextConfig;
