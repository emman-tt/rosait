import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "perfumegh.com" },
    ],
  },
  async redirects() {
    return [
      // "/" is not a designed route on this site — send visitors to "/home".
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },

};

export default nextConfig;
