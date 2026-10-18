/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'ichef.bbci.co.uk',
        },
        {
          protocol: 'https',
          hostname: 'imagenes.elpais.com',
        },
        {
          protocol: 'https',
          hostname: 'vdmedia.elpais.com',
        },
        {
          protocol: 'https',
          hostname: 'www.infobae.com',
        },
      ],
    },
};

export default nextConfig;
