/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'nuvyktdqoclzyglcwukn.supabase.co', // Thêm domain của Supabase của bạn
      'cdn.vietnambiz.vn',
      'avatars.githubusercontent.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 