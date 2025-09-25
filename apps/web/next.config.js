const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@website-checker/database', '@website-checker/types'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;