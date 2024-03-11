/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    config.watchOptions = {
      poll: 1000,
    }
    return config
  },
}

export default nextConfig
