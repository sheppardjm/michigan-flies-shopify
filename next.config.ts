import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      // iNaturalist open-data bucket serves only CC-licensed photos.
      { protocol: "https", hostname: "inaturalist-open-data.s3.amazonaws.com" },
      { protocol: "https", hostname: "static.inaturalist.org" },
    ],
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
