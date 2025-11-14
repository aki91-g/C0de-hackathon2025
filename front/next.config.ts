import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
