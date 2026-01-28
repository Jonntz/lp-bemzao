import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Mova para a raiz aqui: */
  serverExternalPackages: ['@prisma/client'],

  experimental: {
    // reactCompiler geralmente fica dentro de experimental, verifique se não precisa mover para cá também se der erro
    // reactCompiler: true,
  },

  // Nota: Se 'reactCompiler' der erro na raiz, mova-o para dentro de 'experimental' acima.
  // Nas versões mais recentes, ele costuma ser ativado via experimental.reactCompiler: boolean

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },

      {
        protocol: 'https',
        hostname: 'bemzao.com',
      },
    ],
  },
};

export default nextConfig;