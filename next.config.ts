import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/god-mode", destination: "/godmode", permanent: false },
      { source: "/Godmode", destination: "/godmode", permanent: false },
      { source: "/GODMODE", destination: "/godmode", permanent: false },
    ];
  },
};

export default nextConfig;
