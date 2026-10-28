import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMATICAS, tematica } from "@/lib/tematicas";
import { AmazonLivro } from "@/components/Amazon";
import { url, jsonLd } from "@/lib/seo";

export const generateStaticParams = () => TEMATICAS.map((t) => ({ slug: t.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = tematica(params.slug);
  return t ? { title: `${t.titulo}: livros, filmes e atividades para crianças`, description: t.resumo, alternates: { canonical: `/tematicas/${t.slug}` }, openGraph: { title: t.titulo, description: t.resumo } } : {};
}

export default function Tema({ params }: { params: { slug: string } }) {
  const t = tematica(params.slug);
  if (!t) notFound();
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "Article", headline: t.titulo, description: t.resumo, inLanguage: "pt-BR",
        author: { "@type": "Person", name: "Stephanie Kamarry" }, publisher: { "@type": "Organization", name: "Atlas do Aprender" }, mainEntityOfPage: url(`/tematicas/${t.slug}`),
      })} />
      <p className="eyebrow-i"><Link href="/tematicas">Temáticas</Link> · {t.quando}</p>
      <h1 className="hero-t">{t.emoji} {t.titulo}</h1>
      {t.intro.map((p) => <p className="lead" key={p.slice(0, 20)}>{p}</p>)}
      {t.material && (
        <section className="card">
          <p className="eyebrow-i" style={{ margin: 0 }}>Gratuito para imprimir</p>
          <h3 style={{ marginTop: 4 }}>{t.material.titulo}</h3>
          <p>{t.material.texto}</p>
          <div className="row"><Link className="btn" href={t.material.href}>Ver e baixar</Link></div>
        </section>
      )}
      <section className="books">
        <h4>Livros para ler junto</h4>
        <ul>{t.livros.map(([b, w]) => <li key={b}><b>{b}</b><span>{w}</span><AmazonLivro livro={b} /></li>)}</ul>
      </section>
      <div className="res">
        {t.blocos.map((bl) => (
          <section key={bl.nome}>
            <h4>{bl.nome}</h4>
            <ul>{bl.itens.map(([n, d]) => <li key={n}><b>{n}</b>{d ? `: ${d}` : ""}</li>)}</ul>
          </section>
        ))}
      </div>
      {t.cuidado && <p className="note">{t.cuidado}</p>}
    </div>
  );
}
