/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'imgs.search.brave.com',
      'img.freepik.com',
      'media.istockphoto.com',
      'preview.redd.it',
      'res.cloudinary.com',
      'd2ngzhad4k6uhe.cloudfront.net',
      'm.media-amazon.com'
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': process.cwd(),
    };
    return config;
  },
};

export default nextConfig;