This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 环境变量配置

项目使用以下环境变量文件来管理不同环境下的配置：

- `.env.development` - 开发环境配置，应用于 `npm run dev`
- `.env.production` - 生产环境配置，应用于 `npm run build` 和 `npm run start`
- `.env.local` - 本地配置覆盖（不应提交到版本控制）

### 可用的环境变量

| 环境变量 | 描述 | 默认值 |
|---------|------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | API 服务端点 | 开发: `http://localhost:8000/api`<br>生产: 使用公网 IP |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | 开发: `http://localhost:3000`<br>生产: 使用公网 IP |

### 配置生产环境

部署到生产环境前，请修改 `.env.production` 文件中的 `NEXT_PUBLIC_API_BASE_URL` 和 `NEXT_PUBLIC_SITE_URL`，设置为实际的公网 IP 或域名。

```bash
# .env.production 示例
NEXT_PUBLIC_API_BASE_URL=http://your-domain-or-ip:8000/api
NEXT_PUBLIC_SITE_URL=http://your-domain-or-ip
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
