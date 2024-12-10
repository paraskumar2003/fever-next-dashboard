import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     baseUrl: "https://trapi.vouch.club"  //testing

//   }
// };

// export default nextConfig;

// Dynamic BaseUrl Based on production or testing //

const nextConfig: NextConfig = {
  env: {
    baseUrl: process.env.NODE_ENV === "production"
      ? "https://trapi.vouch.club"
      : "https://trapi.vouch.club",
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'fever-v3.s3.ap-south-1.amazonaws.com',
        },
    ],
},
};

export default nextConfig;