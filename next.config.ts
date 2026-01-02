import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // webpack: (config) => {
  //   config.externals = [...(config.externals || []), "fs", "path"];
  //   return config;
  // },
turbopack: {
    // ...
  },
};

export default nextConfig;
