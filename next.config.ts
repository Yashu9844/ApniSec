import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 120,
  output: "standalone", // Required for Docker deployment
};

export default nextConfig;
