"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SERIES, atual, inicio, perguntadas, responder, resultado, type Area, type Estado, type Resposta, type Resultado } from "@/lib/diagnostico";
import { MATERIAS, SLUG, TRILHAS, anoSlug } from "@/lib/data";
import { anoNome, apostilaDoTema } from "@/lib/apostilas";
import { jogosDoTema } from "@/lib/loja";
import { rastrear } from "@/lib/rastreio";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";

const ORDEM: Area[] = ["por", "mat", "cie"];
type Estados = Partial<Record<Area, Estado>>;
type Passo = { etapa: "inicio" } | { etapa: "perguntas"; m: Area; es: Estados } | { etapa: "fim"; es: Record<Area, Estado> };
type Salvo = { v: 2; serie: string; nome: string; es: Record<Area, Estado>; quando: string };

const CHAVE = "atlas-diagnostico";
const BOTOES: [Resposta, string, string][] = [
  ["sim", "Já faz sozinha", "✓"],
  ["ajuda", "Faz com ajuda", "≈"],
  ["nao", "Ainda não", "…"],
];

function ler(): Salvo | null {
  try { const s = JSON.parse(localStorage.getItem(CHAVE) || "null"); return s && s.v === 2 ? s : null; } catch { return null; }
}
function gravar(s: Salvo | null) {
  try { s ? localStorage.setItem(CHAVE, JSON.stringify(s)) : localStorage.removeItem(CHAVE); } catch {}
}

const linkTema = (m: Area, ano: string, tema: number) => `/trilhas/${SLUG[m]}/${anoSlug(ano)}#tema-${tema}`;
const nomeTema = (m: Area, ano: string, tema: number) => TRILHAS[m][ano]?.[tema - 1]?.t || "";
const codigo = (m: Area, r: Resultado) => (r.trabalhar[0] ? `${m}${r.trabalhar[0].h.ano}-${r.trabalhar[0].h.tema}+${r.trabalhar.length}` : `${m}ok`);

export default function Diagnostico() {
  const [serie, setSerie] = useState("");
  const [nome, setNome] = useState("");
  const [hist, setHist] = useState<Passo[]>([{ etapa: "inicio" }]);
  const passo = hist[hist.length - 1];

  useEffect(() => {
    const s = ler();
    if (s) { setSerie(s.serie); setNome(s.nome); setHist([{ etapa: "fim", es: s.es }]); }
  }, []);

  const ir = (p: Passo) => { setHist((h) => [...h, p]); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const voltar = () => setHist((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const quem = nome.trim() || "a criança";

  if (passo.etapa === "inicio") {
    return (
      <section className="card diag">
        <h2 style={{ margin: 0 }}>Vamos começar</h2>
        <p className="meta" style={{ margin: 0 }}>São perguntas sobre o que a criança já faz no dia a dia, em Português, Matemática e Ciências. Leva de 4 a 6 minutos e não precisa de cadastro.</p>
        <label className="f">Nome ou apelido da criança (opcional)<input maxLength={30} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Lia" /></label>
        <div className="f" role="group" aria-label="Ano escolar">
          <span>Em que ano escolar {nome.trim() || "ela"} está (ou estaria)?</span>
          <div className="seg">
            {SERIES.map(([k, l]) => <button key={k} type="button" aria-pressed={serie === k} onClick={() => setSerie(k)}>{l}</button>)}
          </div>
        </div>
        <div className="row">
          <button className="btn" type="button" disabled={!serie} onClick={() => { rastrear("DiagnosticoIniciado", { tipo: serie }); ir({ etapa: "perguntas", m: "por", es: { por: inicio("por", serie) } }); }}>Começar o diagnóstico</button>
        </div>
        <p className="note" style={{ margin: 0 }}>Se a criança tiver lacunas de anos anteriores, o diagnóstico percebe e volta na trilha sozinho. Nada do que você responde sai do seu aparelho: o resultado fica guardado só neste navegador.</p>
      </section>
    );
  }

  if (passo.etapa === "perguntas") {
    const { m, es } = passo;
    const e = es[m]!;
    const h = atual(m, e);
    const parte = ORDEM.indexOf(m) + 1;
    const totalFeitas = ORDEM.reduce((t, a) => t + (es[a] ? perguntadas(es[a]!) : 0), 0);
    const pct = Math.min(96, Math.round(((parte - 1) / 3) * 100 + (perguntadas(e) / 12) * 33));
    const responde = (r: Resposta) => {
      const n = responder(m, e, r);
      const novo = { ...es, [m]: n };
      if (!n.feito) return ir({ etapa: "perguntas", m, es: novo });
      const prox = ORDEM[parte];
      if (prox) return ir({ etapa: "perguntas", m: prox, es: { ...novo, [prox]: inicio(prox, serie) } });
      const fim = novo as Record<Area, Estado>;
      rastrear("DiagnosticoConcluido", { tipo: ORDEM.map((a) => codigo(a, resultado(a, fim[a]))).join("/") });
      gravar({ v: 2, serie, nome, es: fim, quando: new Date().toISOString() });
      ir({ etapa: "fim", es: fim });
    };
    return (
      <section className="card diag" style={{ ["--sc" as string]: `var(--${m})` }} aria-live="polite">
        <div className="diag-barra" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
        <p className="eyebrow-i" style={{ margin: 0, color: `var(--${m})` }}>{MATERIAS[m]} · parte {parte} de 3 · {anoNome(h.ano)}</p>
        <p className="meta" style={{ margin: 0 }}>Hoje, {quem}…</p>
        <h2 className="diag-q">{h.frase}</h2>
        {h.exemplo && <p className="meta" style={{ margin: 0 }}>Por exemplo: {h.exemplo}</p>}
        <div className="diag-bts">
          {BOTOES.map(([r, l, s]) => (
            <button key={r} type="button" className={`diag-bt ${r}`} onClick={() => responde(r)}><span aria-hidden="true">{s}</span>{l}</button>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <button type="button" className="link-btn" onClick={voltar}>← Voltar</button>
          <span className="meta">{totalFeitas} respondidas · na dúvida, “Faz com ajuda”</span>
        </div>
      </section>
    );
  }

  // Resultado
  const es = passo.es;
  const rs = Object.fromEntries(ORDEM.map((a) => [a, resultado(a, es[a])])) as Record<Area, Resultado>;
  const refazer = () => { gravar(null); setHist([{ etapa: "inicio" }]); };
  const serieNome = SERIES.find((s) => s[0] === serie)?.[1] || "";
  const resumo = [`Diagnóstico do site (${serieNome})`, ...ORDEM.map((a) => {
    const r = rs[a];
    if (!r.trabalhar.length) return `${MATERIAS[a]}: tudo firme no que foi perguntado`;
    return `${MATERIAS[a]}: ${r.trabalhar.map((i) => `${anoNome(i.h.ano)} tema ${i.h.tema}${i.r === "ajuda" ? " (com ajuda)" : ""}`).join(", ")}`;
  })].join(" · ");
  const paraPlanejamento = () => { try { sessionStorage.setItem("atlas-diagnostico-resumo", resumo); } catch {} };
  const primeiro = ORDEM.map((a) => rs[a].trabalhar[0] && linkTema(a, rs[a].trabalhar[0].h.ano, rs[a].trabalhar[0].h.tema)).find(Boolean) || "/trilhas/portugues/1-ano";
  const anterior = ORDEM.some((a) => rs[a].trabalhar.some((i) => SERIES.find((s) => s[0] === serie) && Number(i.h.ano) < Number(SERIES.find((s) => s[0] === serie)![3])));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section className="card diag">
        <p className="eyebrow-i" style={{ margin: 0 }}>Resultado</p>
        <h2 style={{ margin: 0 }}>O caminho de {nome.trim() || "estudo"}</h2>
        <p className="meta" style={{ margin: 0 }}>Em cada matéria, os temas para trabalhar aparecem na ordem da trilha: comece pelo primeiro e siga a lista. Os temas marcados “com ajuda” costumam andar mais rápido.</p>
        {anterior && <p className="diag-aviso">Alguns temas são de anos anteriores ao da série. Isso é comum e não é motivo de preocupação: firmar a base é o caminho mais rápido para alcançar a turma.</p>}
        <div className="diag-res">{ORDEM.map((a) => <CartaoResultado key={a} m={a} r={rs[a]} />)}</div>
      </section>

      <Cadastro volta={primeiro} />

      <section className="card" style={{ borderTop: "5px solid var(--cie)" }}>
        <h3 style={{ margin: 0 }}>Quer um plano feito para a sua criança?</h3>
        <p style={{ margin: 0 }}>O diagnóstico mostra o ponto de partida. No <b>Planejamento gratuito</b>, eu converso com você por vídeo, conheço a criança e a rotina da família e monto um plano de estudos semana a semana. O resultado deste diagnóstico já vai junto no formulário.</p>
        <div className="row">
          <Link className="btn" href="/planejamento" onClick={paraPlanejamento}>Quero o planejamento gratuito</Link>
          <button type="button" className="btn ghost" onClick={refazer}>Refazer o diagnóstico</button>
        </div>
      </section>
    </div>
  );
}

function Extras({ m, ano, tema }: { m: Area; ano: string; tema: number }) {
  const ap = apostilaDoTema(m, ano, tema);
  const jgs = jogosDoTema(m, ano, tema);
  return (
    <>
      {ap && <Link className="btn small ghost" href={`/apostilas/${ap.slug}`}>Apostila: {ap.titulo}</Link>}
      {jgs.map((j) => <Link key={j.slug} className="btn small ghost" href={`/loja#${j.slug}`}>Jogo: {j.nome}</Link>)}
    </>
  );
}

function CartaoResultado({ m, r }: { m: Area; r: Resultado }) {
  const cab = <p className="eyebrow-i" style={{ margin: 0, color: `var(--${m})` }}>{MATERIAS[m]}</p>;
  if (!r.trabalhar.length) {
    const p = r.proximo;
    return (
      <article className="diag-cartao" style={{ ["--sc" as string]: `var(--${m})` }}>
        {cab}
        {p ? (
          <>
            <h3>Tudo firme! Próximo passo: {anoNome(p.ano)}, tema {p.tema} · {nomeTema(m, p.ano, p.tema)}</h3>
            <p className="meta">Pelo que você respondeu, os temas até aqui estão firmes. Pode seguir em frente na trilha.</p>
            <div className="row"><Link className="btn small" href={linkTema(m, p.ano, p.tema)}>Abrir o tema</Link><Extras m={m} ano={p.ano} tema={p.tema} /></div>
          </>
        ) : (
          <>
            <h3>Trilha firme até o 5º ano</h3>
            <p className="meta">Os temas do 5º ano servem para aprofundar, e as olimpíadas são um ótimo próximo desafio.</p>
            <div className="row"><Link className="btn small" href={`/trilhas/${SLUG[m]}/5-ano`}>Ver o 5º ano</Link><Link className="btn small ghost" href="/olimpiadas">Olimpíadas</Link></div>
          </>
        )}
      </article>
    );
  }
  const [pri, ...resto] = r.trabalhar;
  return (
    <article className="diag-cartao" style={{ ["--sc" as string]: `var(--${m})` }}>
      {cab}
      <h3>Comece por: {anoNome(pri.h.ano)}, tema {pri.h.tema} · {nomeTema(m, pri.h.ano, pri.h.tema)}</h3>
      <p style={{ margin: 0 }}>{TRILHAS[m][pri.h.ano]?.[pri.h.tema - 1]?.o}</p>
      <div className="row"><Link className="btn small" href={linkTema(m, pri.h.ano, pri.h.tema)}>Abrir o tema</Link><Extras m={m} ano={pri.h.ano} tema={pri.h.tema} /></div>
      {resto.length > 0 && (
        <>
          <p className="meta" style={{ marginTop: 6 }}><b>Depois, nesta ordem:</b></p>
          <ol className="diag-lista">
            {resto.map((i) => (
              <li key={`${i.h.ano}-${i.h.tema}`}>
                <Link href={linkTema(m, i.h.ano, i.h.tema)}>{anoNome(i.h.ano)}, tema {i.h.tema} · {nomeTema(m, i.h.ano, i.h.tema)}</Link>
                <span className={`diag-tag ${i.r}`}>{i.r === "ajuda" ? "com ajuda" : "ainda não"}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      <p className="meta">{r.firmes} {r.firmes === 1 ? "tema já está firme" : "temas já estão firmes"} entre os que você respondeu.</p>
    </article>
  );
}

function Cadastro({ volta }: { volta: string }) {
  const { user, configurado } = useAtlas();
  if (!configurado || user) return null;
  return (
    <section className="card" style={{ borderTop: "5px solid var(--por)" }}>
      <h3 style={{ margin: 0 }}>Guarde o caminho e marque o progresso</h3>
      <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b> Com a conta, você marca cada tema concluído, registra o que a criança fez no diário e acompanha a evolução.</p>
      <FormAcesso volta={volta} origem="diagnostico" botao="Criar minha conta grátis" />
    </section>
  );
}
