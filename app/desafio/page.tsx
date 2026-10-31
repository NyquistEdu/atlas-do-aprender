import type { Metadata } from "next";
import Link from "next/link";
import { DESAFIOS, desafioAtual } from "@/lib/desafios";
import { todasFases } from "@/lib/fasesInfo";
import Mural, { type DesafioInfo } from "../mural/Mural";
import { Selos, Participantes } from "./Selos";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const d = desafioAtual();
  return {
    title: `Desafio de ${d.mes}: ${d.titulo}`,
    description: `${d.resumo} Um desafio por mês para fazer em família, com material de casa.`,
    alternates: { canonical: "/desafio" },
  };
}

export default function Pagina() {
  const d = desafioAtual();
  const info: Record<string, DesafioInfo> = Object.fromEntries(DESAFIOS.map((x) => [x.id, { id: x.id, titulo: x.titulo, emoji: x.emoji, mes: x.mes }]));
  const passados = DESAFIOS.filter((x) => x.id < d.id).sort((a, b) => b.id.localeCompare(a.id));
  return (
    <div className="wrap largo">
      <section className="desafio-hero">
        <span className="selo desafio-selo" aria-hidden="true">{d.emoji}<br />selo do mês</span>
        <p className="eyebrow-i">desafio de {d.mes}</p>
        <h1 className="hero-t">{d.titulo}</h1>
        <p className="lead">{d.resumo}</p>
        <div className="desafio-fatos">
          <span>⏱️ {d.duracao}</span><span>📅 Mostre o resultado {d.prazo}</span><Participantes desafio={d.id} />
        </div>
        {d.pdf && <div className="row"><a className="btn" href={d.pdf.href} download={d.pdf.nome}>{d.pdf.rotulo}</a><a className="btn ghost" href="#participar">Mostrar o resultado</a></div>}
      </section>

      <div className="desafio-grid">
        <section className="card">
          <h2>Por que fazer</h2>
          <p>{d.porque}</p>
          <h3>Vocês vão precisar de</h3>
          <ul className="dentro">{d.materiais.map((m) => <li key={m}>{m}</li>)}</ul>
          <h3>Ligado às trilhas</h3>
          <ul className="dentro">{d.temas.map((t) => <li key={t.id}><Link href={t.href}>{t.rotulo}</Link></li>)}</ul>
        </section>
        <section className="card">
          <h2>Passo a passo</h2>
          <ol className="desafio-passos">{d.passos.map((p, i) => <li key={p.titulo}><span className="ini-n">{i + 1}</span><div><b>{p.titulo}</b><p>{p.texto}</p></div></li>)}</ol>
        </section>
      </div>

      <section className="card">
        <h2>Para cada idade</h2>
        <div className="desafio-idades">{d.porIdade.map((x) => <div key={x.faixa}><b>{x.faixa}</b><p>{x.texto}</p></div>)}</div>
      </section>

      <div id="participar" className="fase-painel-ancora" />
      <section className="card desafio-como">
        <h2>Como participar</h2>
        <p>{d.participar}</p>
        <Selos info={info} />
      </section>
      <Mural fases={todasFases()} desafios={info} desafio={info[d.id]} />

      {passados.length > 0 && (
        <section>
          <h2 className="sec-t">Desafios anteriores</h2>
          <div className="home-grid">{passados.map((x) => <div key={x.id} className="home-card" style={{ ["--sc" as string]: "var(--jog)" }}><b>{x.emoji} {x.titulo}</b><span>Desafio de {x.mes} de {x.ano}</span></div>)}</div>
        </section>
      )}
    </div>
  );
}
