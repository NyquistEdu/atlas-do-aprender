import type { Metadata } from "next";
import Link from "next/link";
import "./viva.css";

export const metadata: Metadata = {
  title: "Fases Vivas · a fase da trilha para mexer, jogar e resolver",
  description: "Cada Fase Viva transforma um tema da trilha em 7 telas interativas: cena 3D, laboratório, jogos relâmpago, jogo de contexto, mundo real, desafio do chefão e resumo. Modo sozinho e modo juntos.",
  alternates: { canonical: "/vivas" },
};

const VIVAS = [
  { slug: "divide-ai", titulo: "Divide Aí!", tema: "Matemática · 3º ano · Fase 2", desc: "Repartir, agrupar e o que sobra", e: "🍪", livre: true },
  { slug: "nomear-e-descrever", titulo: "Nomear e Descrever", tema: "Português · 3º ano · Fase 5", desc: "Substantivos e adjetivos", e: "👾", livre: true },
  { slug: "olhar-o-ceu", titulo: "Olhar o Céu", tema: "Ciências · 3º ano · Fase 4", desc: "Sol, Lua, sombras e estrelas", e: "🌙", livre: true },
  { slug: "detetives-de-dados", titulo: "Detetives de Dados", tema: "Matemática · 3º ano · Fase 4", desc: "Pesquisa, tabelas e gráficos", e: "📊", livre: true },
  { slug: "pedaco-por-pedaco", titulo: "Pedaço por Pedaço", tema: "Matemática · 3º ano · Fase 5", desc: "Metade, terço, quarto e frações", e: "🍕", livre: true },
  { slug: "medir-o-mundo", titulo: "Medir o Mundo", tema: "Matemática · 3º ano · Fase 3", desc: "Comprimento, massa e capacidade", e: "📏", livre: true },
  { slug: "contar-ate-cem", titulo: "Contar até Cem", tema: "Matemática · Alfabetização · Fase 1", desc: "Contagem e números até 100", e: "🔢", livre: true },
];

const TELAS = [
  ["✨", "Capa em 3D", "A ideia aparece antes da conta, numa cena que gira com o dedo."],
  ["🧪", "Laboratório", "Controles mudam a conta e tudo responde na hora. Missões com estrelas."],
  ["⚡", "Treino relâmpago", "4 minijogos com rodadas infinitas e sequência de acertos."],
  ["🚐", "Jogo de contexto", "A conta acontece num lugar de verdade, com retorno a cada tentativa."],
  ["🌎", "No mundo", "Onde aquela conta aparece em casa, na escola e na rua."],
  ["🐙", "Desafio do chefão", "5 questões com resolução revelada passo a passo."],
  ["📌", "Resumo", "O que lembrar, as pegadinhas e o placar ou o progresso."],
];

export default function Page() {
  return (
    <div className="wrap" style={{ paddingBlock: "24px 60px", display: "grid", gap: 22 }}>
      <div>
        <p className="viva-kick" style={{ color: "var(--por)" }}>● Fases Vivas</p>
        <h1 className="hero-t">A fase da trilha que <span className="marca-amarela">ganhou vida</span>.</h1>
        <p className="lead">Cada tema da trilha vira 7 telas para mexer, jogar e resolver. A criança prevê pela conta antes de ver a cena confirmar. No celular, no computador ou na TV, sem instalar nada. A capa e o laboratório são abertos; do treino em diante, basta entrar na conta grátis do Atlas.</p>
      </div>
      <div className="vivas-lista">
        {VIVAS.map((v) => {
          const corpo = (
            <>
              <span className="vivas-e">{v.e}</span>
              <span className="vivas-t"><small>{v.tema}</small><b>{v.titulo}</b><span>{v.desc}</span></span>
              <span className={`tag ${v.livre ? "cie" : ""}`}>{v.livre ? "Grátis · jogar agora" : "Em breve"}</span>
            </>
          );
          return v.slug ? <Link key={v.titulo} className="vivas-item on" href={`/vivas/${v.slug}`}>{corpo}</Link> : <div key={v.titulo} className="vivas-item">{corpo}</div>;
        })}
      </div>
      <section className="card">
        <h2>Dois jeitos de usar</h2>
        <div className="g2-simples">
          <div><h3>Sozinho</h3><p className="meta">A criança joga no seu ritmo: ganha XP, cumpre missões com estrelas e sobe de nível, de Semente a Mestre. O progresso fica salvo no aparelho.</p></div>
          <div><h3>Juntos</h3><p className="meta">Time Sol contra Time Lua: irmãos, adulto e criança ou a turma na TV. Cronômetro “Valendo!”, placar e resolução revelada um passo de cada vez.</p></div>
        </div>
      </section>
      <section className="card">
        <h2>Toda Fase Viva tem 7 telas</h2>
        <ol className="vivas-telas">{TELAS.map(([e, t, d]) => <li key={t}><span>{e}</span><b>{t}</b><small>{d}</small></li>)}</ol>
      </section>
    </div>
  );
}
