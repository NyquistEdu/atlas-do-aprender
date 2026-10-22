import type { Metadata } from "next";
import Link from "next/link";
import { DUVIDAS } from "@/lib/duvidas";

export const metadata: Metadata = {
  title: "Dúvidas comuns das famílias sobre o estudo das crianças",
  description: "O que a criança aprende em cada ano, o que fazer se ela não lê no 3º ano, quanto tempo estudar em casa, hábito de leitura, dever de casa e BNCC.",
  alternates: { canonical: "/duvidas" },
};

export default function Duvidas() {
  const anos = DUVIDAS.filter((d) => d.grupo === "ano");
  const gerais = DUVIDAS.filter((d) => d.grupo === "geral");
  return (
    <div className="wrap">
      <p className="eyebrow-i">Perguntas e respostas</p>
      <h1 className="hero-t">Dúvidas comuns</h1>
      <p className="lead">Respostas diretas para as perguntas que mais aparecem quando a família decide acompanhar o estudo das crianças em casa.</p>
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
