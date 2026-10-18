"use client";

import { useMemo, useState } from "react";
import { ANOS, ESTANTE, MATERIAS, TRILHAS, anoCurto, type Materia } from "@/lib/data";
import { Feito, Marcar, ParaDiario } from "@/components/Registrar";
import { useAtlas } from "@/components/Providers";
import { AmazonLivro } from "@/components/Amazon";
import { AVISO_AFILIADO, AMAZON_TAG } from "@/lib/afiliados";

type Grupo = { titulo: string; cor: string; area: string; livros: { b: string; w: string; temas: string[] }[] };

export default function Livros() {
  const [m, setM] = useState<"all" | Materia | "for">("all");
  const [y, setY] = useState("all");
  const { user, feito, crianca } = useAtlas();

  const grupos = useMemo(() => {
    const g: Grupo[] = [];
    (Object.keys(MATERIAS) as Materia[]).filter((s) => m === "all" || m === s).forEach((s) =>
      ANOS.filter(([a]) => y === "all" || a === y).forEach(([a, l]) => {
        const mapa = new Map<string, { w: string; temas: string[] }>();
        (TRILHAS[s][a] || []).forEach((th) => (th.l || []).forEach(([b, w]) => {
          if (!mapa.has(b)) mapa.set(b, { w, temas: [] });
          mapa.get(b)!.temas.push(th.t);
        }));
        if (mapa.size) g.push({ titulo: `${MATERIAS[s]} · ${l}`, cor: `var(--${s})`, area: s, livros: [...mapa].map(([b, v]) => ({ b, ...v })) });
      }));
    if (m === "all" || m === "for")
      ESTANTE.forEach(([nome, itens]) => g.push({ titulo: `Formação · ${nome}`, cor: "var(--jog)", area: "out", livros: itens.map(([b, w]) => ({ b, w, temas: [] })) }));
    return g;
  }, [m, y]);

  const total = grupos.reduce((a, g) => a + g.livros.length, 0);
  const lidos = user ? grupos.reduce((a, g) => a + g.livros.filter((l) => feito("livro|" + l.b)).length, 0) : 0;

  const segM: [string, string][] = [["all", "Todas"], ...Object.entries(MATERIAS), ["for", "Formação"]];
  return (
    <div className="wrap">
      <h2>Estante de paradidáticos</h2>
      <p className="lead">Todos os livros das trilhas, por matéria e ano, com o tema que cada um ajuda a trabalhar, e a estante de Formação com livros sobre sentimentos, Brasil, mundo e arte.</p>
      <article className="card">
        <h3>Caderno de Conversa</h3>
        <p className="meta">PDF gratuito · 137 páginas · A4 · por Stephanie Kamarry</p>
        <p style={{ margin: 0 }}>Os 129 livros desta estante, cada um com a lição, um resumo, dez perguntas com respostas para conversar em família, uma atividade e uma sugestão do que ler depois.</p>
        <div className="row">
          <a className="btn" href="/caderno-de-conversa.pdf" download="Caderno-de-Conversa-Atlas-do-Aprender.pdf">Baixar o caderno em PDF</a>
        </div>
      </article>
      <div className="seg subj">{segM.map(([v, l]) => <button key={v} type="button" data-s={v} aria-pressed={m === v} onClick={() => setM(v as typeof m)}>{l}</button>)}</div>
      <div className="seg yr">{[["all", "Todos os anos"], ...ANOS.map(([a, l]) => [a, anoCurto(l)])].map(([v, l]) => <button key={v} type="button" aria-pressed={y === v} onClick={() => setY(v)}>{l}</button>)}</div>
      {user && <div className="prog"><span>{crianca}: {lidos} de {total} livros lidos neste filtro</span></div>}
      <div className="list">
        {grupos.length ? grupos.map((g) => (
          <div key={g.titulo} className="list">
            <p className="ybook">{g.titulo}</p>
            {g.livros.map((l) => (
              <article key={g.titulo + l.b} className="book" style={{ ["--sc" as string]: g.cor }}>
                <div>
                  <b>{l.b}</b>
                  <span className="meta">{l.w}</span>
                  {l.temas.length > 0 && <span className="meta">Tema: {l.temas.join(" · ")}</span>}
                </div>
                <Feito chave={"livro|" + l.b} texto="✓ lido" />
                <div className="row">
                  <Marcar chave={"livro|" + l.b} rotulo={["Já lemos", "Desmarcar"]} />
                  <ParaDiario area={g.area} tipo="Leitura" titulo={l.b} texto="Registrar leitura" />
                  <AmazonLivro livro={l.b} />
                </div>
              </article>
            ))}
          </div>
        )) : <div className="empty">Nenhum livro com esse filtro.</div>}
      </div>
      <p className="note">Edições e editoras variam; procure na biblioteca da escola, em bibliotecas públicas e sebos.{AMAZON_TAG ? ` Os botões “Ver na Amazon” abrem uma busca pelo título. ${AVISO_AFILIADO}` : ""} Os títulos indicados “com mediação” ficam melhores lidos junto com um adulto.</p>
    </div>
  );
}
