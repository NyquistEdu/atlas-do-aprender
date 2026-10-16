import type { Metadata } from "next";
import { GUIA_DRIVE } from "@/lib/data";
export const metadata: Metadata = { title: "Guia de uso" };
export default function Guia() {
  return (
    <div className="wrap">
      <h2>Guia de uso</h2>
      <p className="lead">Um PDF de 6 páginas que explica como começar, para que serve cada aba, como usar o diário, uma semana possível de atividades, cuidados e perguntas frequentes.</p>
      <article className="card">
        <h3>Atlas do Aprender: guia de uso</h3>
        <p className="meta">PDF · 6 páginas · A4 · por Stephanie Kamarry</p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Como abrir e cadastrar as crianças</li>
          <li>Trilhas, livros, jogos, mão na massa e diário, aba por aba</li>
          <li>O método prever, testar, observar e explicar nos experimentos</li>
          <li>Uma semana possível e como fazer com mais de uma criança</li>
          <li>Cuidados e perguntas frequentes</li>
        </ul>
        <div className="row">
          <a className="btn" href="/guia.pdf" download="Atlas-do-Aprender-guia.pdf">Baixar o guia em PDF</a>
          <a className="btn ghost" href={GUIA_DRIVE} target="_blank" rel="noopener noreferrer">Abrir no Google Drive</a>
        </div>
      </article>
    </div>
  );
}
