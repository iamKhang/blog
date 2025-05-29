/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'nuvyktdqoclzyglcwukn.supabase.co', // Thêm domain của Supabase của bạn
      'cdn.vietnambiz.vn',
      'avatars.githubusercontent.com'
    ],
  },
}

module.exports = nextConfig 