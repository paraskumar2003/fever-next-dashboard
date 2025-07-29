/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    api_url: "https://v3api.countrygame.live",
    // api_url: "http://localhost:3002",
  },
  output: "export",
};

export default nextConfig;
