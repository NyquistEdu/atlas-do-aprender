import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { respostaPublica, resumoDe } from "@/lib/perguntas";
import { anoNome } from "@/lib/apostilas";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { id: string } };
export const revalidate = 600;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const r = await respostaPublica(params.id);
  return r ? { title: r.titulo, description: resumoDe(r.resposta), alternates: { canonical: `/duvidas/r/${r.id}` }, openGraph: { title: r.titulo, description: resumoDe(r.resposta), type: "article" } } : { robots: { index: false } };
}

export default async function Resposta({ params }: P) {
  const r = await respostaPublica(params.id);
  if (!r) notFound();
  return (
    <div className="wrap artigo">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "QAPage",
        mainEntity: { "@type": "Question", name: r.titulo, answerCount: 1, acceptedAnswer: { "@type": "Answer", text: r.resposta, author: { "@type": "Person", name: "Stephanie Kamarry" }, url: url(`/duvidas/r/${r.id}`) } },
      })} />
      <p className="eyebrow-i"><Link href="/duvidas">Pergunte à professora</Link></p>
      <h1 className="hero-t">{r.titulo}</h1>
      <p className="meta">{r.ano ? `Pergunta de uma família com criança no ${anoNome(r.ano)}` : "Pergunta de uma família"}{r.respondida_em ? ` · respondida em ${new Date(r.respondida_em).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
      <section className="resp-prof">
        <p className="resp-assina">Resposta da Stephanie</p>
        {r.resposta.split(/\n{2,}/).map((t, i) => <p key={i}>{t}</p>)}
      </section>
      <div className="feedback">
        <p className="feedback-t">Tem outra dúvida?</p>
        <p>Mande a sua pergunta: eu respondo pessoalmente.</p>
        <div className="row"><Link className="btn small" href="/duvidas">Perguntar à professora</Link></div>
      </div>
    </div>
  );
}
