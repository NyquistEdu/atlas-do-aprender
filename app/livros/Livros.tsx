"use client";

import { useMemo, useState } from "react";
import { ANOS, ESTANTE, MATERIAS, TRILHAS, anoCurto, type Materia } from "@/lib/data";
import { Feito, Marcar, ParaDiario } from "@/components/Registrar";
import { useAtlas } from "@/components/Providers";
import { AmazonLivro } from "@/components/Amazon";
import { AVISO_AFILIADO, AMAZON_TAG } from "@/lib/afiliados";
import { ConviteConta } from "@/components/Acesso";

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
      ESTANTE.forEach(([nome, itens]) => g.push({ titulo: `Além da escola · ${nome}`, cor: "var(--jog)", area: "out", livros: itens.map(([b, w]) => ({ b, w, temas: [] })) }));
    return g;
  }, [m, y]);

  const total = grupos.reduce((a, g) => a + g.livros.length, 0);
  const lidos = user ? grupos.reduce((a, g) => a + g.livros.filter((l) => feito("livro|" + l.b)).length, 0) : 0;

  const segM: [string, string][] = [["all", "Todas"], ...Object.entries(MATERIAS), ["for", "Além da escola"]];
  return (
    <div className="wrap">
      <h2>Livros para ler com a criança</h2>
      <p className="lead">
        Indicações de livros infantis para ler junto, separadas por matéria e ano escolar, e uma estante extra sobre
        sentimentos, Brasil, mundo e arte. Em cada livro dizemos o que a história ajuda a trabalhar. Os livros não ficam
        aqui no site: você encontra na biblioteca da escola, em bibliotecas públicas, em sebos ou nas lojas.
      </p>
      <ConviteConta origem="livros" titulo="Marque os livros que vocês já leram"
        texto="Com uma conta, o Atlas guarda as leituras de cada criança e mostra quantos livros faltam em cada ano." />
      <article className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        <img src="/apostilas/caderno-de-conversa/capa.webp" alt="Capa do Caderno de Conversa" width={96} height={136} style={{ borderRadius: 6, flex: "0 0 auto" }} />
        <div style={{ flex: "1 1 260px" }}>
          <p className="meta" style={{ margin: 0 }}>Para usar junto com estes livros · PDF gratuito</p>
          <h3 style={{ marginTop: 4 }}>Caderno de Conversa: o que perguntar depois da leitura</h3>
          <p style={{ margin: "0 0 8px" }}>
            Terminou um livro com seu filho e não sabe por onde puxar a conversa? O caderno tem uma página para cada um dos
            129 livros desta estante: a lição da história, um resumo curto, dez perguntas já com respostas, uma atividade e
            uma sugestão do que ler depois.
          </p>
          <p className="meta" style={{ margin: 0 }}>Como usar: leiam o livro juntos, abram a página dele no caderno e escolham duas ou três perguntas. Dez minutos de conversa já valem.</p>
          <div className="row">
            <a className="btn" href="/caderno-de-conversa.pdf" download="Caderno-de-Conversa-Atlas-do-Aprender.pdf">Baixar grátis (PDF, 137 páginas)</a>
            <a className="btn ghost" href="/apostilas/caderno-de-conversa">Ver páginas de exemplo</a>
          </div>
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
                  <Marcar chave={"livro|" + l.b} rotulo={["Marcar como lido", "Desmarcar lido"]} origem="livros" />
                  <ParaDiario area={g.area} tipo="Leitura" titulo={l.b} texto="Anotar no diário" />
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
