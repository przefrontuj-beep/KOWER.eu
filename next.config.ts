import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/lamele-detaliczne",
        destination: "/lamele/klient-indywidualny",
        permanent: true,
      },
      {
        source: "/lamele-hurtowe",
        destination: "/lamele/sprzedaz-hurtowa",
        permanent: true,
      },
      {
        source: "/lamele-na-wymiar",
        destination: "/lamele/na-wymiar",
        permanent: true,
      },
      {
        source: "/oplaszczowywanie-elementow",
        destination: "/lamele/oplaszczowywanie-elementow",
        permanent: true,
      },
      {
        source: "/agd-wolnostojace",
        destination: "/agd/wolnostojace",
        permanent: true,
      },
      {
        source: "/agd-do-zabudowy",
        destination: "/agd/do-zabudowy",
        permanent: true,
      },
      {
        source: "/drobne-agd",
        destination: "/agd/male-agd",
        permanent: true,
      },
      {
        source: "/producenci-agd",
        destination: "/agd/producenci-agd",
        permanent: true,
      },
      {
        source: "/ciecie-plyt-meblowych",
        destination: "/uslugi-plytowe/ciecie-plyt",
        permanent: true,
      },
      {
        source: "/oklejanie-plyt-meblowych",
        destination: "/uslugi-plytowe/oklejanie-plyt",
        permanent: true,
      },
      {
        source: "/producenci-plyt-meblowych",
        destination: "/materialy-i-fronty/producenci-plyt-meblowych",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
