/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: process.env.DOMAIN_IMAGE as string,
      },
    ],
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: [process.env.DOMAIN_IMAGE as string], // Adicione o domínio aqui
//   },
// };

// export default nextConfig;
