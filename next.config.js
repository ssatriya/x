/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "*.googleusercontent.com",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;
