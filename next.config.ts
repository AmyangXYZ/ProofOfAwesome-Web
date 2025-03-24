import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }
    return config
  },
}

export default nextConfig
