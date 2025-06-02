// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        // port: '', // Opcional si es un puerto no estándar
        // pathname: '/account123/**', // Opcional si quieres restringir a una ruta específica
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Si aún quieres intentar con Unsplash
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Si usaras este
      },
      // Aquí puedes añadir el hostname de tu bucket de Supabase Storage cuando empieces a usarlo
      // Ejemplo para Supabase Storage:
      // {
      //   protocol: 'https',
      //   hostname: 'fvsyjjbxqmxcesqfdlbp.supabase.co', // Reemplaza con tu referencia de proyecto
      //   pathname: '/storage/v1/object/public/**', // O la ruta a tus buckets públicos
      // },
    ],
  },
};

export default nextConfig;
