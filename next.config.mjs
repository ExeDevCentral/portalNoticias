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
        {
          protocol: 'https',
          hostname: 'www.clarin.com',
        },
        {
          protocol: 'https',
          hostname: 'static.dw.com',
        },
        {
          protocol: 'https',
          hostname: 'static01.nyt.com',
        },
        {
          protocol: 'https',
          hostname: 'cnnespanol.cnn.com',
        },
        {
          protocol: 'https',
          hostname: 'i.guim.co.uk',
        },
        {
          protocol: 'https',
          hostname: 'actualidad-rt.com',
        },
        {
          protocol: 'https',
          hostname: 'cdni.rt.com',
        },
        {
          protocol: 'https',
          hostname: 'cdn.sputniknews.lat',
        },
        {
          protocol: 'https',
          hostname: 'www.aljazeera.com',
        },
        {
          protocol: 'https',
          hostname: 'resizer.glanacion.com',
        },
        {
          protocol: 'https',
          hostname: 'media.lacapital.com.ar',
        },
        {
          protocol: 'https',
          hostname: 'media.ambito.com',
        },
        {
          protocol: 'https',
          hostname: 'elciudadanoweb.com',
        },
      ],
    },
};

export default nextConfig;
