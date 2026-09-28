import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "michiganflys.com" }],
        destination: "https://michiganflies.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.michiganflys.com" }],
        destination: "https://michiganflies.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
