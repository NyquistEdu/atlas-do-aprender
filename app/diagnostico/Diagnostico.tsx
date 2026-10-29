"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HABILIDADES_DIAG, SERIES, cienciasPara, inicio, responder, resultado, type Estado, type Resposta } from "@/lib/diagnostico";
import { MATERIAS, SLUG, TRILHAS, anoSlug } from "@/lib/data";
import { anoNome, apostilaDoTema } from "@/lib/apostilas";
import { jogosDoTema } from "@/lib/loja";
import { rastrear } from "@/lib/rastreio";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";

type M = "por" | "mat";
type Passo = { etapa: "inicio" } | { etapa: M; por: Estado; mat?: Estado } | { etapa: "fim"; por: Estado; mat: Estado };
type Salvo = { serie: string; nome: string; por: Estado; mat: Estado; quando: string };

const CHAVE = "atlas-diagnostico";
const BOTOES: [Resposta, string, string][] = [
  ["sim", "Já faz sozinha", "✓"],
  ["ajuda", "Faz com ajuda", "≈"],
  ["nao", "Ainda não", "…"],
];

function ler(): Salvo | null {
  try { return JSON.parse(localStorage.getItem(CHAVE) || "null"); } catch { return null; }
}
function gravar(s: Salvo | null) {
  try { s ? localStorage.setItem(CHAVE, JSON.stringify(s)) : localStorage.removeItem(CHAVE); } catch {}
}

const linkTema = (m: "por" | "mat" | "cie", ano: string, tema: number) => `/trilhas/${SLUG[m]}/${anoSlug(ano)}#tema-${tema}`;
const nomeTema = (m: "por" | "mat" | "cie", ano: string, tema: number) => TRILHAS[m][ano]?.[tema - 1]?.t || "";

export default function Diagnostico() {
  const [serie, setSerie] = useState("");
  const [nome, setNome] = useState("");
  const [hist, setHist] = useState<Passo[]>([{ etapa: "inicio" }]);
  const passo = hist[hist.length - 1];

  useEffect(() => {
    const s = ler();
    if (s) { setSerie(s.serie); setNome(s.nome); setHist([{ etapa: "fim", por: s.por, mat: s.mat }]); }
  }, []);

  const ir = (p: Passo) => { setHist((h) => [...h, p]); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const voltar = () => setHist((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const quem = nome.trim() || "a criança";

  if (passo.etapa === "inicio") {
    return (
      <section className="card diag">
        <h2 style={{ margin: 0 }}>Vamos começar</h2>
        <p className="meta" style={{ margin: 0 }}>São de 10 a 16 perguntas sobre o que a criança já faz no dia a dia. Leva uns 3 minutos e não precisa de cadastro.</p>
        <label className="f">Nome ou apelido da criança (opcional)<input maxLength={30} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Lia" /></label>
        <div className="f" role="group" aria-label="Ano escolar">
          <span>Em que ano escolar {nome.trim() || "ela"} está (ou estaria)?</span>
          <div className="seg">
            {SERIES.map(([k, l]) => <button key={k} type="button" aria-pressed={serie === k} onClick={() => setSerie(k)}>{l}</button>)}
          </div>
        </div>
        <div className="row">
          <button className="btn" type="button" disabled={!serie} onClick={() => { rastrear("DiagnosticoIniciado", { tipo: serie }); ir({ etapa: "por", por: inicio("por", serie) }); }}>Começar o diagnóstico</button>
        </div>
        <p className="note" style={{ margin: 0 }}>Nada do que você responde sai do seu aparelho. O resultado fica guardado só neste navegador.</p>
      </section>
    );
  }

  if (passo.etapa === "por" || passo.etapa === "mat") {
    const m = passo.etapa;
    const e = m === "por" ? passo.por : passo.mat!;
    const h = HABILIDADES_DIAG[m][e.i];
    const feitas = Object.keys(passo.por.respostas).length + (passo.mat ? Object.keys(passo.mat.respostas).length : 0);
    const pct = Math.min(95, Math.round((feitas / 14) * 100));
    const responde = (r: Resposta) => {
      const n = responder(m, e, r);
      if (m === "por") {
        if (n.feito) ir({ etapa: "mat", por: n, mat: inicio("mat", serie) });
        else ir({ etapa: "por", por: n });
      } else {
        if (n.feito) {
          const fim = { etapa: "fim" as const, por: passo.por, mat: n };
          const rp = resultado("por", passo.por), rm = resultado("mat", n);
          rastrear("DiagnosticoConcluido", { tipo: `por${rp.h ? `${rp.h.ano}-${rp.h.tema}` : "ok"}/mat${rm.h ? `${rm.h.ano}-${rm.h.tema}` : "ok"}` });
          gravar({ serie, nome, por: passo.por, mat: n, quando: new Date().toISOString() });
          ir(fim);
        } else ir({ etapa: "mat", por: passo.por, mat: n });
      }
    };
    return (
      <section className="card diag" style={{ ["--sc" as string]: `var(--${m})` }} aria-live="polite">
        <div className="diag-barra" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
        <p className="eyebrow-i" style={{ margin: 0, color: `var(--${m})` }}>{MATERIAS[m]} · {m === "por" ? "parte 1 de 2" : "parte 2 de 2"}</p>
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
          <span className="meta">Na dúvida, escolha “Faz com ajuda”.</span>
        </div>
      </section>
    );
  }

  // Resultado
  const fim = passo as Extract<Passo, { etapa: "fim" }>;
  const rp = resultado("por", fim.por), rm = resultado("mat", fim.mat);
  const cieAno = cienciasPara(serie);
  const refazer = () => { gravar(null); setHist([{ etapa: "inicio" }]); };
  const resumo = [
    `Diagnóstico do site (${SERIES.find((s) => s[0] === serie)?.[1] || ""})`,
    `Português: ${rp.h ? `começar em ${anoNome(rp.h.ano)}, tema ${rp.h.tema} (${nomeTema("por", rp.h.ano, rp.h.tema)})` : "domina a trilha até o 5º ano"}`,
    `Matemática: ${rm.h ? `começar em ${anoNome(rm.h.ano)}, tema ${rm.h.tema} (${nomeTema("mat", rm.h.ano, rm.h.tema)})` : "domina a trilha até o 5º ano"}`,
  ].join(" · ");
  const paraPlanejamento = () => { try { sessionStorage.setItem("atlas-diagnostico-resumo", resumo); } catch {} };
  const primeira = rp.h ? linkTema("por", rp.h.ano, rp.h.tema) : rm.h ? linkTema("mat", rm.h.ano, rm.h.tema) : "/trilhas/portugues/5-ano";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section className="card diag">
        <p className="eyebrow-i" style={{ margin: 0 }}>Resultado</p>
        <h2 style={{ margin: 0 }}>Por onde {nome.trim() || "a criança"} pode começar</h2>
        <p className="meta" style={{ margin: 0 }}>O tema indicado é o primeiro que ainda não está firme. Os anteriores valem como revisão rápida, se quiser.</p>
        <div className="diag-res">
          <CartaoResultado m="por" r={rp} />
          <CartaoResultado m="mat" r={rm} />
          <article className="diag-cartao" style={{ ["--sc" as string]: "var(--cie)" }}>
            <p className="eyebrow-i" style={{ margin: 0, color: "var(--cie)" }}>Ciências</p>
            <h3>Tema 1 · {nomeTema("cie", cieAno, 1)}</h3>
            <p className="meta">{anoNome(cieAno)}. Em Ciências os temas não dependem tanto um do outro: siga a ordem do ano em que a criança está, puxando pela curiosidade dela.</p>
            <Link className="btn small" href={linkTema("cie", cieAno, 1)}>Ver o tema</Link>
          </article>
        </div>
      </section>

      <Cadastro volta={primeira} />

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

function CartaoResultado({ m, r }: { m: M; r: ReturnType<typeof resultado> }) {
  if (!r.h) {
    return (
      <article className="diag-cartao" style={{ ["--sc" as string]: `var(--${m})` }}>
        <p className="eyebrow-i" style={{ margin: 0, color: `var(--${m})` }}>{MATERIAS[m]}</p>
        <h3>Trilha completa até o 5º ano</h3>
        <p className="meta">Pelo que você respondeu, tudo está firme. Os temas do 5º ano servem para aprofundar, e as olimpíadas são um ótimo próximo desafio.</p>
        <div className="row"><Link className="btn small" href={`/trilhas/${SLUG[m]}/5-ano`}>Ver o 5º ano</Link><Link className="btn small ghost" href="/olimpiadas">Olimpíadas</Link></div>
      </article>
    );
  }
  const { ano, tema } = r.h;
  const ap = apostilaDoTema(m, ano, tema);
  const jgs = jogosDoTema(m, ano, tema);
  return (
    <article className="diag-cartao" style={{ ["--sc" as string]: `var(--${m})` }}>
      <p className="eyebrow-i" style={{ margin: 0, color: `var(--${m})` }}>{MATERIAS[m]}</p>
      <h3>Tema {tema} · {nomeTema(m, ano, tema)}</h3>
      <p className="meta">{anoNome(ano)}. {r.firmes > 0 ? `${r.firmes} ${r.firmes === 1 ? "tema anterior já está firme" : "temas anteriores já estão firmes"}.` : "É o começo da trilha."}</p>
      <p style={{ margin: 0 }}>{TRILHAS[m][ano]?.[tema - 1]?.o}</p>
      <div className="row">
        <Link className="btn small" href={linkTema(m, ano, tema)}>Abrir o tema</Link>
        {ap && <Link className="btn small ghost" href={`/apostilas/${ap.slug}`}>Apostila: {ap.titulo}</Link>}
        {jgs.map((j) => <Link key={j.slug} className="btn small ghost" href={`/loja#${j.slug}`}>Jogo: {j.nome}</Link>)}
      </div>
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
