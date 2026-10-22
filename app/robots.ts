import type { MetadataRoute } from "next";
import { url } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/entrar", "/diario", "/planejamento/pedidos"] }],
    sitemap: url("/sitemap.xml"),
    host: url("/"),
  };
}
