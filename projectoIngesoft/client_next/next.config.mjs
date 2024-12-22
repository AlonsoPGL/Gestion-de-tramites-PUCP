/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Habilita el modo standalone

  async redirects() {
    return [
      {
        source: '/administrador',
        destination: '/administrador/gestionUsuario',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
