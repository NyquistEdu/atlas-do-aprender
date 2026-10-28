import type { MetadataRoute } from "next";
import { ANOS, SLUG, anoSlug, type Materia } from "@/lib/data";
import { APOSTILAS, GRATUITOS, KITS } from "@/lib/apostilas";
import { TEMATICAS } from "@/lib/tematicas";
import { url } from "@/lib/seo";
import { DUVIDAS } from "@/lib/duvidas";
import { PEDIR_CONSENTIMENTO } from "@/lib/consentimento";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  const fixo: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"], ["/livros", 0.9, "monthly"], ["/jogos", 0.8, "monthly"], ["/mao-na-massa", 0.8, "monthly"],
    ["/apostilas", 0.9, "weekly"], ["/loja", 0.8, "monthly"], ["/olimpiadas", 0.8, "monthly"], ["/tematicas", 0.8, "monthly"], ["/duvidas", 0.8, "monthly"], ["/planejamento", 0.9, "monthly"], ["/guia", 0.5, "yearly"], ...(PEDIR_CONSENTIMENTO ? [["/privacidade", 0.2, "yearly"] as [string, number, "yearly"]] : []),
  ];
  const trilhas = (Object.keys(SLUG) as Materia[]).flatMap((s) => ANOS.map(([y]) => `/trilhas/${SLUG[s]}/${anoSlug(y)}`));
  return [
    ...fixo.map(([p, priority, changeFrequency]) => ({ url: url(p), lastModified: agora, changeFrequency, priority })),
    ...trilhas.map((p) => ({ url: url(p), lastModified: agora, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...[...KITS, ...GRATUITOS, ...APOSTILAS].map((a) => ({ url: url(`/apostilas/${a.slug}`), lastModified: agora, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...DUVIDAS.map((d) => ({ url: url(`/duvidas/${d.slug}`), lastModified: agora, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...TEMATICAS.map((t) => ({ url: url(`/tematicas/${t.slug}`), lastModified: agora, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
