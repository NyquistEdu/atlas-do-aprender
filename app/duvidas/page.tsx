import type { Metadata } from "next";
import Link from "next/link";
import { DUVIDAS } from "@/lib/duvidas";
import { respostasPublicas, resumoDe } from "@/lib/perguntas";
import { anoNome } from "@/lib/apostilas";
import Perguntar from "@/components/Perguntar";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Pergunte à professora: dúvidas das famílias sobre o estudo das crianças",
  description: "Mande a sua dúvida sobre leitura, matemática, rotina e aprendizagem e receba a resposta de uma professora. O que a criança aprende em cada ano, o que fazer se ela não lê no 3º ano, quanto tempo estudar em casa e mais.",
  alternates: { canonical: "/duvidas" },
};

export default async function Duvidas() {
  const respostas = await respostasPublicas();
  const anos = DUVIDAS.filter((d) => d.grupo === "ano");
  const gerais = DUVIDAS.filter((d) => d.grupo === "geral");
  return (
    <div className="wrap">
      <p className="eyebrow-i">Perguntas e respostas</p>
      <h1 className="hero-t">Pergunte à professora</h1>
      <p className="lead">Dúvidas sobre o estudo das crianças em casa, respondidas por mim, Stephanie: professora, pesquisadora e mãe de três.</p>
      <Perguntar />
      {respostas.length > 0 && (
        <>
          <h2 className="sec-t">Respostas da professora</h2>
          <div className="list">
            {respostas.map((r) => (
              <Link key={r.id} href={`/duvidas/r/${r.id}`} className="card duv">
                <b>{r.titulo}</b><span>{resumoDe(r.resposta)}</span>
                {r.ano && <small className="tag" style={{ justifySelf: "start" }}>{anoNome(r.ano)}</small>}
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="sec-t">O que a criança aprende em cada ano</h2>
      <div className="duv-anos">
        {anos.map((d) => <Link key={d.slug} href={`/duvidas/${d.slug}`} className="card duv"><b>{d.ano}º ano</b><span>{d.resumo}</span></Link>)}
      </div>
      <h2 className="sec-t">Outras dúvidas</h2>
      <div className="list">
        {gerais.map((d) => <Link key={d.slug} href={`/duvidas/${d.slug}`} className="card duv"><b>{d.pergunta}</b><span>{d.resumo}</span></Link>)}
      </div>
    </div>
  );
}
