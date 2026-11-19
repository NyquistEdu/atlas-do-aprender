"use client";
/** Peças reaproveitadas pelas Fases Vivas: régua, jogo relâmpago, desafio do chefão e resumo. */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useViva, Cronometro } from "@/components/viva/Shell";
import { NIVEIS, TIMES, nivelDe, quemTime } from "@/lib/viva";

export function Regua({ rotulo, cor, v, min, max, muda, mostra }: { rotulo: string; cor: string; v: number; min: number; max: number; muda: (n: number) => void; mostra?: string }) {
  return (
    <div className="viva-regua" style={{ ["--rc" as string]: cor }}>
      <span className="viva-regua-r">{rotulo}</span>
      <button type="button" onClick={() => muda(Math.max(min, v - 1))} aria-label={`menos ${rotulo}`}>−</button>
      <input type="range" min={min} max={max} value={v} onChange={(e) => muda(Number(e.target.value))} aria-label={rotulo}
        style={{ background: `linear-gradient(90deg, var(--rc) ${((v - min) / (max - min)) * 100}%, #e3e1da 0)` }} />
      <button type="button" onClick={() => muda(Math.min(max, v + 1))} aria-label={`mais ${rotulo}`}>+</button>
      <output>{mostra ?? v}</output>
    </div>
  );
}

/** Lê o texto em voz alta (para quem ainda está aprendendo a ler). */
export function falar(texto: string) {
  try {
    const sy = window.speechSynthesis; if (!sy) return;
    sy.cancel();
    const f = new SpeechSynthesisUtterance(texto); f.lang = "pt-BR"; f.rate = 0.92;
    const voz = sy.getVoices().find((v) => v.lang?.toLowerCase().startsWith("pt-br")) || sy.getVoices().find((v) => v.lang?.toLowerCase().startsWith("pt"));
    if (voz) f.voice = voz;
    sy.speak(f);
  } catch {}
}
export function Ouvir({ texto, claro = false }: { texto: string; claro?: boolean }) {
  return <button type="button" className={`viva-ouvir ${claro ? "claro" : ""}`} onClick={() => falar(texto)} aria-label={`Ouvir: ${texto}`} title="Ouvir">🔊 ouvir</button>;
}

export type RodadaTexto = { enunciado: React.ReactNode; opcoes: string[]; certa: string; explica: string };

/** Jogo relâmpago de alternativas, com rodadas infinitas, sequência, ampliar e "Valendo!". */
export function JogoTexto({ id, titulo, sub, icone, hab, gerar }: { id: string; titulo: string; sub: string; icone: string; hab: string; gerar: () => RodadaTexto }) {
  const v = useViva();
  const [r, setR] = useState<RodadaTexto | null>(null);
  const [esc, setEsc] = useState<string | null>(null);
  const [seq, setSeq] = useState(0);
  const [grande, setGrande] = useState(false);
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const nova = useCallback(() => {
    setR((antes) => { let x = gerar(); for (let i = 0; i < 4 && antes && x.explica === antes.explica; i++) x = gerar(); return x; });
    setEsc(null); setRod((n) => n + 1);
  }, [gerar]);
  useEffect(() => { nova(); }, [nova]);
  if (!r) return null;
  const responder = (o: string) => {
    if (esc !== null) return;
    setEsc(o); setValendo(false);
    if (o === r.certa) { const s = seq + 1; setSeq(s); v.sequencia(id, s); v.acertou(hab, 10); setTimeout(nova, 1000); }
    else { setSeq(0); v.errou(hab, r.explica); }
  };
  const corpo = (
    <div className={`viva-jogo ${grande ? "grande" : ""}`}>
      <div className="viva-jogo-topo">
        <span className="viva-jogo-ic">{icone}</span>
        <div><b>{titulo}</b><small>{sub}</small></div>
        <button type="button" className="viva-ico" onClick={() => setGrande(!grande)} aria-label={grande ? "Fechar" : "Ampliar"}>{grande ? "✕" : "⤢"}</button>
      </div>
      <div className="viva-jogo-corpo">{r.enunciado}</div>
      <div className="viva-opcoes txt">
        {r.opcoes.map((o) => (
          <button key={o} type="button" onClick={() => responder(o)} className={esc === null ? "" : o === r.certa ? "certa" : o === esc ? "errada" : "apaga"}>{o}</button>
        ))}
      </div>
      <div className="viva-jogo-pe">
        {esc !== null && esc !== r.certa ? <span className="viva-explica">{r.explica}</span> : <span className="viva-seq">🔥 {seq} seguidos · melhor {v.e.melhor[id] || 0}</span>}
        {v.modo === "juntos" && esc === null && (valendo
          ? <Cronometro segundos={20} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); setEsc("__tempo"); setSeq(0); v.errou(hab, "Acabou o tempo!"); }} />
          : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (20 s)</button>)}
        {esc !== null && esc !== r.certa && <button type="button" className="viva-btn mini" onClick={nova}>Nova rodada</button>}
      </div>
    </div>
  );
  return grande ? <div className="viva-overlay" onClick={(e) => { if (e.target === e.currentTarget) setGrande(false); }}>{corpo}</div> : corpo;
}

export type Questao = { cena: string; texto: string; op: string[]; certa: number; passos: string[]; hab: string };

export function Desafio({ chefe, emoji, sub, questoes, minimo = 4, tela = 6, ouvir = false }: { chefe: string; emoji: string; sub: string; questoes: Questao[]; minimo?: number; tela?: number; ouvir?: boolean }) {
  const v = useViva();
  const [i, setI] = useState(0);
  const [esc, setEsc] = useState<number | null>(null);
  const [passo, setPasso] = useState(0);
  const [acertos, setAcertos] = useState<boolean[]>([]);
  const [valendo, setValendo] = useState(false);
  const fim = acertos.length === questoes.length;
  const q = questoes[Math.min(i, questoes.length - 1)];
  const juntos = v.modo === "juntos";
  const total = acertos.filter(Boolean).length;
  useEffect(() => { if (fim && total >= minimo) v.venceuChefao(total, questoes.length); }, [fim]); // eslint-disable-line react-hooks/exhaustive-deps
  const responder = (o: number) => {
    if (esc !== null) return;
    setEsc(o); setValendo(false);
    const ok = o === q.certa;
    setAcertos((a) => [...a, ok]);
    if (ok) v.acertou(q.hab, 20, "Acertou!"); else v.errou(q.hab);
    setPasso(juntos ? 0 : q.passos.length);
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela {tela} · hora do desafio</p>
        <h2>Desafio do chefão: {chefe} {emoji}</h2>
        <p className="viva-sub">{sub} Acerte pelo menos {minimo} das {questoes.length} questões para vencer.</p>
      </header>
      {fim ? (
        <div className="viva-card viva-fim">
          <p className="viva-fim-e">{total >= minimo ? "🏆" : emoji}</p>
          <h3 className="viva-h3">{total >= minimo ? `Você derrotou ${chefe}!` : `${chefe} escapou desta vez…`}</h3>
          <p>{total} de {questoes.length} questões certas.</p>
          <p className="viva-bolinhas fim">{acertos.map((a, k) => <span key={k} className={a ? "feita" : "erro"}>{a ? "✓" : "✕"}</span>)}</p>
          <div className="viva-row" style={{ justifyContent: "center" }}>
            <button type="button" className="viva-btn" onClick={() => { setI(0); setEsc(null); setPasso(0); setAcertos([]); }}>Jogar de novo</button>
            <button type="button" className="viva-btn ghost" onClick={() => v.irPara(tela + 1)}>Ver o resumo</button>
          </div>
        </div>
      ) : (
        <div className="viva-desafio">
          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <small className="viva-kick">Questão {i + 1} de {questoes.length}</small>
              {juntos && esc === null && (valendo
                ? <Cronometro segundos={90} rodando={valendo} chaveReinicio={i} onFim={() => { setValendo(false); setEsc(-1); setAcertos((a) => [...a, false]); setPasso(0); v.errou(q.hab, "Acabou o tempo!"); }} />
                : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (90 s)</button>)}
            </div>
            <div className="viva-q-cena" aria-hidden="true">{q.cena}</div>
            <p className="viva-q-texto">{q.texto}{ouvir && <> <Ouvir texto={q.texto} claro /></>}</p>
            <div className="viva-alts">
              {q.op.map((o, k) => (
                <button key={o} type="button" onClick={() => responder(k)} className={esc === null ? "" : k === q.certa ? "certa" : k === esc ? "errada" : "apaga"}><i>{"ABCD"[k]}</i>{o}</button>
              ))}
            </div>
          </div>
          <div className="viva-card viva-resol">
            <h3 className="viva-h3">Resolução</h3>
            {esc === null ? <p className="viva-sub">Escolha uma alternativa. {juntos ? "Depois, revele a resolução um passo de cada vez com a turma." : "A explicação aparece logo depois."}</p> : (
              <>
                <ol>{q.passos.slice(0, passo).map((p) => <li key={p}>{p}</li>)}</ol>
                <div className="viva-row">
                  {passo < q.passos.length
                    ? <button type="button" className="viva-btn" onClick={() => setPasso(passo + 1)}>Revelar próximo passo</button>
                    : <button type="button" className="viva-btn" onClick={() => { setI(i + 1); setEsc(null); setPasso(0); }}>{i + 1 < questoes.length ? "Próxima questão →" : "Ver o resultado"}</button>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export type ItemResumo = { t: string; f: string; ex: string };
export type Pegadinha = { cor: string; d: string };

export function Resumo({ titulo, itens, pegadinhas, habs, links, totalMissoes, tela = 7 }: {
  titulo: string; itens: ItemResumo[]; pegadinhas: Pegadinha[]; habs: Record<string, string>; links: [string, string][]; totalMissoes: number; tela?: number;
}) {
  const v = useViva();
  const nv = nivelDe(v.e.xp);
  const missoes = Object.keys(v.e.missoes).length;
  const estrelas = Object.values(v.e.missoes).reduce((a, b) => a + b, 0);
  const treinar = Object.entries(v.e.erros).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const { sol, lua } = v.e.placar;
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela {tela} · para revisar antes da prova</p>
        <h2>Resumo da fase e as pegadinhas</h2>
      </header>
      <div className="viva-resumo">
        <div className="viva-caderno-resumo">
          <p className="viva-mao escuro">{titulo} · tudo o que você precisa lembrar</p>
          <div className="viva-res-grid">
            {itens.map((r, k) => <div key={r.t} className="viva-res"><b><i>{k + 1}</i>{r.t}</b><span>{r.f}</span><small>{r.ex}</small></div>)}
          </div>
        </div>
        <div className="viva-col">
          {v.modo === "juntos" ? (
            <div className="viva-card">
              <h3 className="viva-h3">Placar da partida</h3>
              {(["sol", "lua"] as const).map((t) => <p key={t} className="viva-placar-l"><span>{TIMES[t].icone} {quemTime(v.e, t, false)}</span><b style={{ color: TIMES[t].cor }}>{v.e.placar[t]}</b></p>)}
              <p className="viva-vencedor">{sol === lua ? (sol === 0 ? "Ainda sem pontos. Bora jogar!" : "Empate! Rodada extra?") : `${TIMES[sol > lua ? "sol" : "lua"].icone} ${quemTime(v.e, sol > lua ? "sol" : "lua", false)} venceu!`}</p>
              <button type="button" className="viva-btn" onClick={v.zerarPlacar}>Zerar placar</button>
            </div>
          ) : (
            <div className="viva-card">
              <h3 className="viva-h3">Meu progresso</h3>
              <p className="viva-nivel-g">{nv.icone} <b>{nv.nome}</b> <small>{v.e.xp} XP</small></p>
              <div className="viva-niveis">{NIVEIS.map((n, k) => <span key={n.nome} className={k <= nv.i ? "on" : ""}><b>{n.icone}</b>{n.nome}</span>)}</div>
              <p className="viva-sub">{missoes} de {totalMissoes} missões · {estrelas} ⭐{nv.prox ? ` · faltam ${nv.prox.xp - v.e.xp} XP para ${nv.prox.nome}` : ""}</p>
              {treinar.length > 0 && <><small className="viva-kick" style={{ color: "#56607a" }}>Para treinar mais</small><ul className="viva-treinar">{treinar.map(([h, n]) => <li key={h}>{habs[h] || h} <small>({n} {n === 1 ? "erro" : "erros"})</small></li>)}</ul></>}
              <button type="button" className="link-btn" onClick={() => { if (window.confirm("Apagar o progresso desta fase neste aparelho?")) v.recomecar(); }}>recomeçar a fase</button>
            </div>
          )}
          <div className="viva-notas">
            {pegadinhas.map((p, k) => <div key={p.d} className="viva-nota" style={{ background: p.cor, transform: `rotate(${[-1.5, 1.2, -0.8, 1][k % 4]}deg)` }}><b>Pegadinha {k + 1}</b><span>{p.d}</span></div>)}
          </div>
          <div className="viva-card">
            <h3 className="viva-h3">Para continuar</h3>
            <ul className="viva-links">{links.map(([h, t]) => <li key={h}><Link href={h}>{t}</Link></li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
