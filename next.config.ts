import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  reactStrictMode: true,

  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],

  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react",
      "motion",
      "class-variance-authority",
    ],
  },

  logging: {
    fetches: {},
  },
};

export default nextConfig;
