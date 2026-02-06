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
          { key: "Permissions-Policy", value: "microphone=*" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
