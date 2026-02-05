import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 95],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "microphone=*",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/cv",
        destination: "/cv.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
