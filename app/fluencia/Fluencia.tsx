"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAtlas } from "@/components/Providers";
import { supabase } from "@/lib/supabase";
import { rastrear } from "@/lib/rastreio";
import {
  NIVEL_DO_ANO, PROSODIA, TIPOS_ERRO, corretas, nivelPorId, perfil, porMinuto, precisao, recomendacoes, tokens,
  type Etapa, type Nivel, type Resultado,
} from "@/lib/fluencia";

type ParteId = "palavras" | "pseudo" | "texto";
const PARTES: { id: ParteId; nome: string; prep: string }[] = [
  { id: "palavras", nome: "Palavras", prep: "A criança lê as palavras em voz alta, da esquerda para a direita, linha por linha. Quando ela errar, toque na palavra. Não corrija e não ajude: se ela travar por 3 segundos, diga “pode passar para a próxima” e marque a palavra como erro." },
  { id: "pseudo", nome: "Palavras inventadas", prep: "Agora são palavras que não existem. Avise a criança: “estas palavras são inventadas, leia do jeito que está escrito”. Elas mostram se ela realmente junta as letras e os sons, sem adivinhar. Toque nas que ela errar." },
  { id: "texto", nome: "Texto", prep: "A criança lê o texto em voz alta, sem ler o título. Toque nas palavras que ela errar. Quando o minuto acabar, você vai tocar na última palavra que ela leu. Preste atenção também no jeito de ler: depois vamos perguntar sobre o ritmo e a expressão." },
];
const ANOS: [string, string][] = [["1", "1º ano"], ["2", "2º ano"], ["3", "3º ano"], ["4", "4º ano"], ["5", "5º ano"]];
const CHAVE = "atlas-fluencia";
const vazio = (): Etapa => ({ lidas: 0, erros: {}, seg: 60 });

type Fase =
  | { f: "inicio" }
  | { f: "prep"; p: number }
  | { f: "lendo"; p: number }
  | { f: "parou"; p: number }
  | { f: "classificar"; p: number }
  | { f: "prosodia" }
  | { f: "comp" }
  | { f: "resultado"; r: Resultado };

function lerHist(): Resultado[] {
  try { const v = JSON.parse(localStorage.getItem(CHAVE) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function gravarHist(h: Resultado[]) {
  try { localStorage.setItem(CHAVE, JSON.stringify(h)); } catch {}
}
const novoId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));
const hojeISO = () => new Date().toISOString().slice(0, 10);
const dataBR = (d: string) => d.split("-").reverse().join("/");

export default function Fluencia() {
  const { user, criancas, crianca: criancaAtual } = useAtlas();
  const [fase, setFase] = useState<Fase>({ f: "inicio" });
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [forma, setForma] = useState<"A" | "B">("A");
  const [et, setEt] = useState<Record<ParteId, Etapa>>({ palavras: vazio(), pseudo: vazio(), texto: vazio() });
  const [prosodia, setProsodia] = useState(0);
  const [comp, setComp] = useState<(boolean | null)[]>([]);
  const [hist, setHist] = useState<Resultado[]>([]);
  const [resta, setResta] = useState(60);
  const inicioRef = useRef(0);

  const nivel: Nivel = nivelPorId(NIVEL_DO_ANO[ano] || "1");
  const dados = nivel.formas[forma];

  // histórico: navegador + conta (quando a tabela existe)
  useEffect(() => { setHist(lerHist()); }, []);
  useEffect(() => {
    if (user && criancaAtual && !nome) setNome(criancaAtual);
    if (!supabase || !user) return;
    supabase.from("fluencia").select("id,dados").order("data").then(({ data, error }) => {
      if (error || !data) return;
      const daConta = data.map((x) => ({ ...(x.dados as Resultado), id: x.id as string }));
      setHist((h) => {
        const ids = new Set(daConta.map((r) => r.id));
        const junto = [...daConta, ...h.filter((r) => !ids.has(r.id))].sort((a, b) => a.data.localeCompare(b.data));
        gravarHist(junto);
        return junto;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, criancaAtual]);

  // sugere a versão que a criança ainda não fez por último
  useEffect(() => {
    const ult = [...hist].reverse().find((r) => r.crianca === nome.trim() && r.nivel === nivel.id);
    setForma(ult ? (ult.forma === "A" ? "B" : "A") : "A");
  }, [nome, nivel.id, hist]);

  // cronômetro
  const lendo = fase.f === "lendo";
  useEffect(() => {
    if (!lendo) return;
    inicioRef.current = Date.now();
    setResta(60);
    const t = setInterval(() => {
      const r = 60 - Math.floor((Date.now() - inicioRef.current) / 1000);
      setResta(Math.max(0, r));
      if (r <= 0) { clearInterval(t); parar(60); }
    }, 200);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lendo]);

  const topo = () => document.getElementById("flu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const parteAtual = "p" in fase ? PARTES[fase.p] : null;
  const itens = (id: ParteId): string[] => (id === "palavras" ? dados.palavras : id === "pseudo" ? dados.pseudo : tokens(dados.texto).filter((x) => x.w).map((x) => x.t));

  function parar(seg: number) {
    setFase((f) => {
      if (f.f !== "lendo") return f;
      const id = PARTES[f.p].id;
      setEt((e) => ({ ...e, [id]: { ...e[id], seg: Math.max(1, Math.min(60, seg)) } }));
      return { f: "parou", p: f.p };
    });
  }
  const terminouAntes = () => {
    if (fase.f !== "lendo") return;
    const p = fase.p, id = PARTES[p].id;
    const seg = Math.max(1, Math.round((Date.now() - inicioRef.current) / 1000));
    setEt((e) => ({ ...e, [id]: { ...e[id], lidas: itens(id).length, seg } }));
    if (Object.keys(et[id].erros).length) { setFase({ f: "classificar", p }); topo(); } else avancar(p);
  };
  const tocar = (i: number) => {
    if (!parteAtual) return;
    const id = parteAtual.id;
    if (fase.f === "lendo") {
      setEt((e) => {
        const erros = { ...e[id].erros };
        if (erros[i] !== undefined) delete erros[i]; else erros[i] = "erro";
        return { ...e, [id]: { ...e[id], erros } };
      });
    } else if (fase.f === "parou") {
      setEt((e) => {
        const erros = Object.fromEntries(Object.entries(e[id].erros).filter(([k]) => Number(k) <= i));
        return { ...e, [id]: { ...e[id], lidas: i + 1, erros } };
      });
    }
  };
  const confirmarParada = () => {
    if (fase.f !== "parou") return;
    const id = PARTES[fase.p].id;
    if (Object.keys(et[id].erros).length) { setFase({ f: "classificar", p: fase.p }); topo(); }
    else if (fase.p === 2 && et.texto.lidas === 0) finalizar(0, []);
    else avancar(fase.p);
  };
  function avancar(p: number) {
    if (p < 2) setFase({ f: "prep", p: p + 1 });
    else { setFase({ f: "prosodia" }); }
    topo();
  }
  const pular = (p: number) => {
    const id = PARTES[p].id;
    setEt((e) => ({ ...e, [id]: { lidas: 0, erros: {}, seg: 60 } }));
    if (p === 2) finalizar(0, [], { ...et, texto: { lidas: 0, erros: {}, seg: 60 } });
    else avancar(p);
  };

  function finalizar(pros: number, cp: (boolean | null)[], etapas = et) {
    const r: Resultado = {
      id: novoId(), crianca: nome.trim() || "Criança", data: hojeISO(), nivel: nivel.id, forma,
      palavras: etapas.palavras, pseudo: etapas.pseudo, texto: etapas.texto, prosodia: pros, comp: cp.map((x) => x === true),
    };
    const novo = [...hist, r];
    setHist(novo); gravarHist(novo);
    if (supabase && user) supabase.from("fluencia").insert({ id: r.id, crianca: r.crianca, data: r.data, nivel: r.nivel, forma: r.forma, dados: r }).then(() => {});
    rastrear("FluenciaConcluida", { tipo: `${r.nivel}${r.forma}-${perfil(r).id}` });
    setFase({ f: "resultado", r });
    topo();
  }

  const apagar = (id: string) => {
    if (!window.confirm("Apagar este teste do histórico? Não dá para desfazer.")) return;
    setHist((h) => { const n = h.filter((x) => x.id !== id); gravarHist(n); return n; });
    if (supabase && user) supabase.from("fluencia").delete().eq("id", id).then(() => {});
  };

  const recomecar = () => {
    setEt({ palavras: vazio(), pseudo: vazio(), texto: vazio() });
    setProsodia(0); setComp([]); setFase({ f: "inicio" }); topo();
  };

  // ------------------------------------------------------------- INÍCIO
  if (fase.f === "inicio") {
    const doNome = hist.filter((r) => r.crianca === nome.trim());
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <section className="card diag">
          <h2 style={{ margin: 0 }}>Antes de começar</h2>
          <ul className="flu-lista">
            <li>Escolha um lugar calmo. A criança fica com o celular ou tablet na frente dela; você fica ao lado, vendo a mesma tela.</li>
            <li>São <b>3 leituras de 1 minuto</b>: palavras, palavras inventadas e um texto curto. No final, você faz algumas perguntas sobre o texto. Tudo leva uns 10 minutos.</li>
            <li>Você só toca nas palavras que ela errar. O site cronometra e faz as contas.</li>
            <li>Diga que não é prova: “quero ver como você está lendo, leia do seu jeito”.</li>
          </ul>
          {user && criancas.length > 0 ? (
            <div className="f" role="group" aria-label="Criança">
              <span>Quem vai ler?</span>
              <div className="seg">{criancas.map((c) => <button key={c} type="button" aria-pressed={nome === c} onClick={() => setNome(c)}>{c}</button>)}</div>
            </div>
          ) : (
            <label className="f">Nome ou apelido da criança<input maxLength={30} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Lia" /></label>
          )}
          <div className="f" role="group" aria-label="Ano escolar">
            <span>Em que ano escolar ela está?</span>
            <div className="seg">{ANOS.map(([k, l]) => <button key={k} type="button" aria-pressed={ano === k} onClick={() => setAno(k)}>{l}</button>)}</div>
          </div>
          {ano && (
            <div className="f" role="group" aria-label="Versão do teste">
              <span>Versão do texto ({nivel.nome}, {nivel.anos})</span>
              <div className="seg">{(["A", "B"] as const).map((v) => <button key={v} type="button" aria-pressed={forma === v} onClick={() => setForma(v)}>Versão {v}: {nivel.formas[v].titulo}</button>)}</div>
              <span className="meta" style={{ fontWeight: 400 }}>Para acompanhar a evolução, alterne as versões a cada 2 ou 3 meses. Já deixamos marcada a que ela não fez por último.</span>
            </div>
          )}
          <div className="row">
            <button className="btn" type="button" disabled={!ano || !nome.trim()} onClick={() => { rastrear("FluenciaIniciada", { tipo: `${nivel.id}${forma}` }); setFase({ f: "prep", p: 0 }); topo(); }}>Começar o teste</button>
          </div>
          <p className="note" style={{ margin: 0 }}>{user ? "O resultado fica salvo na sua conta, no histórico desta criança." : "O resultado fica guardado neste navegador. Com a conta gratuita, o histórico fica salvo em qualquer aparelho."}</p>
        </section>
        {doNome.length > 0 && <Historico lista={doNome} nome={nome.trim()} apagar={apagar} />}
      </div>
    );
  }

  // ------------------------------------------------------------- PREPARO DE CADA ETAPA
  if (fase.f === "prep") {
    const P = PARTES[fase.p];
    return (
      <section className="card diag">
        <Barra p={fase.p} />
        <p className="eyebrow-i" style={{ margin: 0 }}>Etapa {fase.p + 1} de 3 · {P.nome}</p>
        <h2 style={{ margin: 0 }}>Para o adulto</h2>
        <p style={{ margin: 0 }}>{P.prep}</p>
        <p className="meta" style={{ margin: 0 }}>O cronômetro de 1 minuto começa quando você tocar no botão. Se ela ler tudo antes, toque em “Ela terminou”.</p>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn" type="button" onClick={() => { setFase({ f: "lendo", p: fase.p }); topo(); }}>Começar: 1 minuto</button>
          {fase.p > 0 && <button className="btn ghost" type="button" onClick={() => pular(fase.p)}>Ela ainda não consegue: pular etapa</button>}
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------- LEITURA / ONDE PAROU
  if (fase.f === "lendo" || fase.f === "parou") {
    const P = PARTES[fase.p];
    const e = et[P.id];
    const parou = fase.f === "parou";
    const marca = (i: number) => `flu-w${e.erros[i] !== undefined ? " err" : ""}${parou && i < e.lidas ? " lida" : ""}${parou && i === e.lidas - 1 ? " fim" : ""}`;
    let k = -1;
    return (
      <section className="card diag flu-tela">
        <div className="flu-topo">
          <span className="eyebrow-i" style={{ margin: 0 }}>{P.nome}</span>
          {parou ? <b className="flu-aviso">Toque na última palavra que ela leu</b> : <span className={`flu-relogio${resta <= 10 ? " fim" : ""}`} aria-live="off">{resta}s</span>}
        </div>
        {P.id === "texto" ? (
          <div className="flu-texto">
            <h3>{dados.titulo}</h3>
            {dados.texto.split("\n").map((par, pi) => (
              <p key={pi}>{tokens(par).map((tk, ti) => {
                if (!tk.w) return <span key={ti}>{tk.t}</span>;
                k += 1; const i = k;
                return <button key={ti} type="button" className={marca(i)} onClick={() => tocar(i)}>{tk.t}</button>;
              })}</p>
            ))}
          </div>
        ) : (
          <div className={`flu-grade${P.id === "pseudo" ? " ps" : ""}${nivel.id === "3" ? " longas" : ""}`}>
            {itens(P.id).map((w, i) => <button key={i} type="button" className={marca(i)} onClick={() => tocar(i)}>{w}</button>)}
          </div>
        )}
        <div className="flu-rodape">
          {parou ? (
            <>
              <span className="meta">{e.lidas ? `${e.lidas} lidas · ${Object.keys(e.erros).length} erros` : "Toque na última palavra lida"}</span>
              <button className="btn" type="button" disabled={!e.lidas && Object.keys(e.erros).length > 0} onClick={confirmarParada}>{e.lidas ? "Confirmar" : "Ela não leu nenhuma"}</button>
            </>
          ) : (
            <>
              <span className="meta">Toque nas palavras que ela errar. Tocou sem querer? Toque de novo.</span>
              <button className="btn ghost" type="button" onClick={terminouAntes}>Ela terminou</button>
            </>
          )}
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------- TIPO DOS ERROS
  if (fase.f === "classificar") {
    const P = PARTES[fase.p];
    const e = et[P.id];
    const lista = itens(P.id);
    const setTipo = (i: number, t: string) => setEt((x) => ({ ...x, [P.id]: { ...x[P.id], erros: { ...x[P.id].erros, [i]: t } } }));
    return (
      <section className="card diag">
        <Barra p={fase.p} />
        <p className="eyebrow-i" style={{ margin: 0 }}>{P.nome} · {corretas(e)} corretas de {e.lidas} lidas</p>
        <h2 style={{ margin: 0 }}>Que tipo de erro foi?</h2>
        <p className="meta" style={{ margin: 0 }}>Opcional, mas é o que mostra onde está a lacuna. Se não lembrar, deixe em branco.</p>
        <div className="flu-erros">
          {Object.keys(e.erros).map(Number).sort((a, b) => a - b).map((i) => (
            <div key={i} className="flu-erro">
              <b>{lista[i]}</b>
              <div className="seg">{TIPOS_ERRO.map(([t, l]) => <button key={t} type="button" aria-pressed={e.erros[i] === t} onClick={() => setTipo(i, e.erros[i] === t ? "erro" : t)}>{l}</button>)}</div>
            </div>
          ))}
        </div>
        <div className="row"><button className="btn" type="button" onClick={() => avancar(fase.p)}>Continuar</button></div>
      </section>
    );
  }

  // ------------------------------------------------------------- PROSÓDIA
  if (fase.f === "prosodia") {
    return (
      <section className="card diag">
        <p className="eyebrow-i" style={{ margin: 0 }}>Depois do texto</p>
        <h2 style={{ margin: 0 }}>Como foi o jeito de ler?</h2>
        <p className="meta" style={{ margin: 0 }}>Pense no minuto de leitura do texto e escolha a frase mais parecida.</p>
        <div className="flu-opcoes">
          {PROSODIA.map(([n, l]) => <button key={n} type="button" aria-pressed={prosodia === n} onClick={() => setProsodia(n)}><b>{n}</b>{l}</button>)}
        </div>
        <div className="row"><button className="btn" type="button" disabled={!prosodia} onClick={() => { setComp(dados.perguntas.map(() => null)); setFase({ f: "comp" }); topo(); }}>Continuar</button></div>
      </section>
    );
  }

  // ------------------------------------------------------------- COMPREENSÃO
  if (fase.f === "comp") {
    return (
      <section className="card diag">
        <p className="eyebrow-i" style={{ margin: 0 }}>Compreensão</p>
        <h2 style={{ margin: 0 }}>Perguntas sobre o texto</h2>
        <p className="meta" style={{ margin: 0 }}>Leia cada pergunta em voz alta. A criança responde falando, sem olhar o texto. Marque se ela acertou: vale a ideia, não precisa ser com as mesmas palavras.</p>
        <div className="flu-erros">
          {dados.perguntas.map((q, i) => (
            <div key={i} className="flu-erro">
              <b>{i + 1}. {q.p}</b>
              <span className="meta">Resposta esperada: {q.r}</span>
              <div className="seg">
                <button type="button" aria-pressed={comp[i] === true} onClick={() => setComp((c) => c.map((x, j) => (j === i ? true : x)))}>✓ Acertou</button>
                <button type="button" aria-pressed={comp[i] === false} onClick={() => setComp((c) => c.map((x, j) => (j === i ? false : x)))}>✗ Não acertou</button>
              </div>
            </div>
          ))}
        </div>
        <div className="row"><button className="btn" type="button" disabled={comp.some((x) => x === null)} onClick={() => finalizar(prosodia, comp)}>Ver o resultado</button></div>
      </section>
    );
  }

  // ------------------------------------------------------------- RESULTADO
  const r = fase.r;
  const pf = perfil(r);
  const todos = [r.palavras, r.pseudo, r.texto].flatMap((e) => Object.values(e.erros));
  const doNome = hist.filter((x) => x.crianca === r.crianca);
  const nv = nivelPorId(r.nivel);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section className={`card diag flu-res ${pf.id}`}>
        <p className="eyebrow-i" style={{ margin: 0 }}>Resultado · {r.crianca} · {dataBR(r.data)} · {nv.nome} ({nv.anos}), versão {r.forma}</p>
        <h2 style={{ margin: 0 }}>{pf.nome}</h2>
        <p style={{ margin: 0 }}>{pf.desc}</p>
        <div className="flu-nums">
          <Num v={porMinuto(r.texto)} l="palavras corretas por minuto no texto" destaque />
          <Num v={`${precisao(r.texto)}%`} l="de precisão no texto" />
          <Num v={porMinuto(r.palavras)} l="palavras por minuto" />
          <Num v={porMinuto(r.pseudo)} l="palavras inventadas por minuto" />
          {r.prosodia > 0 && <Num v={`${r.prosodia}/4`} l="ritmo e expressão" />}
          {r.comp.length > 0 && <Num v={`${r.comp.filter(Boolean).length}/${r.comp.length}`} l="perguntas de compreensão" />}
        </div>
        {todos.length > 0 && (
          <p className="meta" style={{ margin: 0 }}>Erros: {TIPOS_ERRO.map(([t, l]) => [l.split(" (")[0], todos.filter((x) => x === t).length] as [string, number]).filter(([, n]) => n).map(([l, n]) => `${l.toLowerCase()} (${n})`).join(" · ") || `${todos.length} sem tipo marcado`}</p>
        )}
        <p className="meta" style={{ margin: 0 }}>Referência: no 2º ano, o leitor fluente lê mais de 65 palavras corretas por minuto, com pelo menos 90% de precisão. Nos anos seguintes, a velocidade continua crescendo; o mais importante é comparar a criança com ela mesma.</p>
      </section>

      <section className="card diag">
        <h2 style={{ margin: 0 }}>O que fazer agora</h2>
        <div className="flu-recs">
          {recomendacoes(r).map((d) => (
            <div key={d.t} className="flu-rec">
              <b>{d.t}</b>
              <p>{d.d}</p>
              {d.link && <Link className="btn small" href={d.link[0]}>{d.link[1]} →</Link>}
            </div>
          ))}
        </div>
        <p className="note" style={{ margin: 0 }}>Este teste mostra onde treinar, não é diagnóstico. Se a leitura não evolui depois de alguns meses de treino, ou se a criança troca letras também ao falar, converse com a escola e procure um fonoaudiólogo.</p>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn" type="button" onClick={recomecar}>Fazer outro teste</button>
          <button className="btn ghost" type="button" onClick={() => window.print()}>Imprimir</button>
        </div>
      </section>

      {doNome.length > 0 && <Historico lista={doNome} nome={r.crianca} apagar={apagar} />}
    </div>
  );
}

function Barra({ p }: { p: number }) {
  return <div className="diag-barra" aria-hidden="true"><i style={{ width: `${Math.round(((p + 1) / 4) * 100)}%` }} /></div>;
}

function Num({ v, l, destaque }: { v: string | number; l: string; destaque?: boolean }) {
  return <div className={`flu-num${destaque ? " d" : ""}`}><b>{v}</b><span>{l}</span></div>;
}

function Historico({ lista, nome, apagar }: { lista: Resultado[]; nome: string; apagar: (id: string) => void }) {
  const pts = lista.map((r) => ({ d: r.data, v: porMinuto(r.texto), p: perfil(r).nome, r }));
  const max = Math.max(80, ...pts.map((p) => p.v)) * 1.1;
  const W = 600, H = 200, ml = 34, mb = 26, mt = 12;
  const x = (i: number) => (pts.length === 1 ? (W + ml) / 2 : ml + 14 + (i * (W - ml - 28)) / (pts.length - 1));
  const y = (v: number) => mt + (H - mt - mb) * (1 - v / max);
  return (
    <section className="card diag">
      <h2 style={{ margin: 0 }}>Evolução de {nome}</h2>
      <p className="meta" style={{ margin: 0 }}>Palavras corretas por minuto no texto, a cada teste. A linha tracejada marca 65, a referência de leitor fluente no 2º ano.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="flu-graf" role="img" aria-label={`Evolução da leitura de ${nome}`}>
        <line x1={ml} x2={W} y1={y(65)} y2={y(65)} className="ref" />
        <text x={ml - 6} y={y(65) + 4} textAnchor="end" className="eixo">65</text>
        <text x={ml - 6} y={y(0) + 4} textAnchor="end" className="eixo">0</text>
        <line x1={ml} x2={W} y1={y(0)} y2={y(0)} className="base" />
        {pts.length > 1 && <polyline points={pts.map((p, i) => `${x(i)},${y(p.v)}`).join(" ")} className="lin" />}
        {pts.map((p, i) => (
          <g key={p.r.id}>
            <circle cx={x(i)} cy={y(p.v)} r={5} className="pt" />
            <text x={x(i)} y={y(p.v) - 10} textAnchor="middle" className="val">{p.v}</text>
            <text x={x(i)} y={H - 6} textAnchor="middle" className="eixo">{dataBR(p.d).slice(0, 5)}</text>
          </g>
        ))}
      </svg>
      <div className="flu-tabw"><table className="flu-tab">
        <thead><tr><th>Data</th><th>Versão</th><th>Texto/min</th><th>Precisão</th><th>Perguntas</th><th>Perfil</th><th></th></tr></thead>
        <tbody>{[...pts].reverse().map((p) => (
          <tr key={p.r.id}><td>{dataBR(p.d)}</td><td>{nivelPorId(p.r.nivel).nome} {p.r.forma}</td><td>{p.v}</td><td>{precisao(p.r.texto)}%</td><td>{p.r.comp.length ? `${p.r.comp.filter(Boolean).length}/${p.r.comp.length}` : "–"}</td><td>{p.p}</td><td><button type="button" className="link-btn" onClick={() => apagar(p.r.id)} aria-label={`Apagar o teste de ${dataBR(p.d)}`}>Apagar</button></td></tr>
        ))}</tbody>
      </table></div>
    </section>
  );
}

