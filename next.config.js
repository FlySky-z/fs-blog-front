module.exports = {
  images: {
    domains: [
      "picsum.photos",
      "localhost", // 本地开发环境
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // 可以添加生产环境的域名
      // {
      //   protocol: 'https',
      //   hostname: 'your-backend-domain.com',
      //   pathname: '/**',
      // }
    ],
  },
};
