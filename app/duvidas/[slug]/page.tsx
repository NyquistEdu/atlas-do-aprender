import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DUVIDAS, duvida } from "@/lib/duvidas";
import { MATERIAS, SLUG, TRILHAS, anoSlug, type Materia } from "@/lib/data";
import { apostilaDoTema } from "@/lib/apostilas";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { slug: string } };
export const generateStaticParams = () => DUVIDAS.map((d) => ({ slug: d.slug }));

export function generateMetadata({ params }: P): Metadata {
  const d = duvida(params.slug);
  return d ? { title: d.pergunta, description: d.resumo, alternates: { canonical: `/duvidas/${d.slug}` }, openGraph: { title: d.pergunta, description: d.resumo, type: "article" } } : {};
}

export default function Pagina({ params }: P) {
  const d = duvida(params.slug);
  if (!d) notFound();
  const [visao, ...resto] = d.secoes;
  const outras = [...DUVIDAS.filter((x) => x.grupo !== d.grupo).slice(0, 3), ...DUVIDAS.filter((x) => x.slug !== d.slug && x.grupo === d.grupo).slice(0, 2)];
  return (
    <div className="wrap artigo">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Article", headline: d.pergunta, description: d.resumo, inLanguage: "pt-BR", author: { "@type": "Person", name: "Stephanie Kamarry" }, publisher: { "@type": "Organization", name: "Atlas do Aprender", logo: { "@type": "ImageObject", url: url("/logo.png") } }, mainEntityOfPage: url(`/duvidas/${d.slug}`), image: url("/og-v2.png") },
          { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Pergunte à professora", item: url("/duvidas") }, { "@type": "ListItem", position: 2, name: d.pergunta, item: url(`/duvidas/${d.slug}`) }] },
        ],
      })} />
      <p className="eyebrow-i"><Link href="/duvidas">Pergunte à professora</Link></p>
      <h1 className="hero-t">{d.pergunta}</h1>
      <p className="lead">{d.resumo}</p>
      {[visao].map((s) => (
        <section key={s.h}><h2>{s.h}</h2>{s.p?.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}{s.lista && <ul>{s.lista.map((t) => <li key={t}>{t}</li>)}</ul>}</section>
      ))}
      {d.ano && (
        <section>
          <h2>Os temas do {d.ano}º ano no Atlas</h2>
          <div className="res">
            {(Object.keys(MATERIAS) as Materia[]).map((m) => (
              <section key={m}>
                <h4><Link href={`/trilhas/${SLUG[m]}/${anoSlug(d.ano!)}`}>{MATERIAS[m]}</Link></h4>
                <ul>{TRILHAS[m][d.ano!].map((t, i) => {
                  const ap = apostilaDoTema(m, d.ano!, i + 1);
                  return <li key={t.t}><Link href={`/trilhas/${SLUG[m]}/${anoSlug(d.ano!)}#tema-${i + 1}`}>{t.t}</Link>{ap && <> · <Link href={`/apostilas/${ap.slug}`}>apostila</Link></>}</li>;
                })}</ul>
              </section>
            ))}
          </div>
        </section>
      )}
      {resto.map((s) => (
        <section key={s.h}><h2>{s.h}</h2>{s.p?.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}{s.lista && <ul>{s.lista.map((t) => <li key={t}>{t}</li>)}</ul>}</section>
      ))}
      {d.links && (
        <div className="feedback">
          <p className="feedback-t">No Atlas</p>
          <ul>{d.links.map(([h, t]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
        </div>
      )}
      <section>
        <h2>Outras dúvidas</h2>
        <ul>{outras.map((o) => <li key={o.slug}><Link href={`/duvidas/${o.slug}`}>{o.pergunta}</Link></li>)}</ul>
      </section>
    </div>
  );
}
