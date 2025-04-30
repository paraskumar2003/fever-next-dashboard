/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    api_url: "https://v3api.countrygame.live",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fever-v3.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
