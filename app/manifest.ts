import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlas do Aprender",
    short_name: "Atlas",
    description: "Encontre as lacunas de aprendizagem e siga o caminho, 15 minutos por dia, da alfabetização ao 5º ano.",
    start_url: "/?origem=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF8EC",
    theme_color: "#FFF8EC",
    lang: "pt-BR",
    categories: ["education", "kids"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
