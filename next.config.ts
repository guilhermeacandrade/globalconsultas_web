import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [process.env.DOMAIN_IMAGE as string], // Adicione o domínio aqui
  },
};

export default nextConfig;
