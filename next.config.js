/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/blog/introduction',
  //       permanent: false,
  //     },
  //   ];
  // },
}

module.exports = nextConfig
