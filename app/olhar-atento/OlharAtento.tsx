"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COMANDOS, CORES, ESCALA, FICHAS, itemText, type Ficha } from "@/lib/olharAtento";
import { useAtlas } from "@/components/Providers";

type Stroop = { t1?: number; e1?: number; t2?: number; e2?: number };
type Jogos = { digDireta?: number; digInversa?: number; stroop?: Stroop; comandos?: Record<string, boolean> };
type Estado = { id: string; nome: string; serie: string; resp: Record<string, Record<string, number>>; notas: Record<string, string>; ditado: Record<string, number>; jogos: Jogos };
type Store = { v: 2; ativa: string; lista: Estado[]; importou?: boolean };
type Nivel = "none" | "ok" | "warn" | "alert" | "info";
type Aval = { r: number; n: number; soma: number; max: number; pct: number; fortes: string[]; flag: boolean; nivel: Nivel; rotulo: string; faixa?: string; parcial?: boolean; som?: number; regra?: number };
type Muda = (fn: (s: Estado) => Estado) => void;

// Mesma chave da primeira versão: quem já tinha respostas de uma criança não perde nada.
const CHAVE = "atlas-kit-observacao";
const novaCrianca = (nome = ""): Estado => ({ id: Math.random().toString(36).slice(2, 10), nome, serie: "", resp: {}, notas: {}, ditado: {}, jogos: {} });
const SERIES: [string, string][] = [["0", "Educação infantil"], ["1", "1º ano"], ["2", "2º ano"], ["3", "3º ano"], ["4", "4º ano"], ["5", "5º ano"], ["6", "6º ano ou mais"]];
type Aba = "fichas" | "jogos" | "relatorio" | "ajuda";
const ABAS: [Aba, string][] = [["fichas", "Fichas"], ["jogos", "Jogos de observação"], ["relatorio", "Relatório"], ["ajuda", "Quando procurar ajuda"]];
const COR: Record<Nivel, string> = { alert: "var(--por)", warn: "var(--jog)", ok: "var(--cie)", info: "var(--mat)", none: "var(--line)" };

const total = (f: Ficha) => (f.tipo === "ditado" ? f.erros!.length : f.itens!.length);
const fmt = (ms: number) => (ms / 1000).toFixed(1).replace(".", ",") + " s";
const vazia = (c: Estado) => !c.nome.trim() && !Object.keys(c.resp).length && !Object.keys(c.ditado).length && !Object.keys(c.jogos).length;
const nomeDe = (c: Estado) => c.nome.trim() || "Sem nome";

function ler(): Store {
  try {
    const o = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (o && o.v === 2 && Array.isArray(o.lista) && o.lista.length) return o;
    if (o && typeof o === "object" && o.resp) { const c = { ...novaCrianca(), ...o, id: novaCrianca().id }; return { v: 2, ativa: c.id, lista: [c] }; }
  } catch {}
  const c = novaCrianca();
  return { v: 2, ativa: c.id, lista: [c] };
}

function avaliar(f: Ficha, S: Estado): Aval {
  const n = total(f);
  const base: Aval = { r: 0, n, soma: 0, max: 2 * n, pct: 0, fortes: [], flag: false, nivel: "none", rotulo: "Não iniciada" };
  if (f.tipo === "ditado") {
    const tem = Object.keys(S.ditado).length > 0;
    let som = 0, regra = 0;
    f.erros!.forEach((e, i) => { const v = S.ditado[i] || 0; if (e.som) som += v; else regra += v; });
    if (!tem) return base;
    const s = S.serie === "" ? null : Number(S.serie);
    let nivel: Nivel = "ok", faixa = "Poucos sinais";
    if (s !== null && s >= 3 && som >= 4) { nivel = "alert"; faixa = "Converse com um profissional"; }
    else if (som >= 3) { nivel = "warn"; faixa = "Acompanhe os erros de som"; }
    else if (regra >= 8) { nivel = "warn"; faixa = "Treine as regras"; }
    return { ...base, r: n, som, regra, nivel, faixa, rotulo: faixa };
  }
  const res = S.resp[f.id] || {};
  let soma = 0, flag = false;
  const fortes: string[] = [];
  f.itens!.forEach((it, i) => {
    const v = res[i]; if (v === undefined) return;
    soma += v;
    if (v === 2) fortes.push(itemText(it));
    if (typeof it === "object" && it.flag && v > 0) flag = true;
  });
  const r = Object.keys(res).length, pct = n ? soma / (2 * n) : 0;
  const out: Aval = { ...base, r, soma, pct, fortes, flag };
  if (f.tipo === "pref") return { ...out, nivel: r ? "info" : "none", rotulo: r ? (r < n ? "Em andamento" : "Pronta") : "Não iniciada" };
  if (!r) return out;
  if (f.positivo) {
    if (pct >= 0.6) { out.nivel = "info"; out.faixa = "Muitos sinais de alto potencial"; }
    else if (pct >= 0.35) { out.nivel = "info"; out.faixa = "Alguns talentos em destaque"; }
    else { out.nivel = "none"; out.faixa = "Poucos sinais nesta ficha"; }
  } else {
    if (pct > 0.55) { out.nivel = "alert"; out.faixa = "Converse com um profissional"; }
    else if (pct >= 0.3) { out.nivel = "warn"; out.faixa = "Acompanhe de perto"; }
    else { out.nivel = "ok"; out.faixa = "Poucos sinais"; }
    if (flag) { out.nivel = "alert"; out.faixa = "Procure o pediatra logo"; }
  }
  out.parcial = r < n;
  out.rotulo = out.parcial ? `${r} de ${n}` : out.faixa!;
  if (out.parcial) out.nivel = "none";
  return out;
}


export default function OlharAtento() {
  const [store, setStore] = useState<Store | null>(null);
  const [aba, setAba] = useState<Aba>("fichas");
  const [ficha, setFicha] = useState<string | null>(null);
  const [remover, setRemover] = useState(false);
  const { criancas } = useAtlas();
  const nomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setStore(ler()); }, []);
  useEffect(() => { if (store) { try { localStorage.setItem(CHAVE, JSON.stringify(store)); } catch {} } }, [store]);
  // Quem tem conta no Atlas já vê as crianças cadastradas aqui (uma vez só, sem duplicar nomes).
  useEffect(() => {
    if (!store || store.importou || !criancas.length) return;
    setStore((st) => {
      if (!st) return st;
      let lista = [...st.lista];
      const tem = (n: string) => lista.some((c) => c.nome.trim().toLowerCase() === n.trim().toLowerCase());
      const novos = criancas.filter((n) => !tem(n)).map((n) => novaCrianca(n));
      if (lista.length === 1 && vazia(lista[0]) && novos.length) lista = novos; else lista = [...lista, ...novos];
      return { ...st, lista, ativa: lista.some((c) => c.id === st.ativa) ? st.ativa : lista[0].id, importou: true };
    });
  }, [store, criancas]);

  if (!store) return <div className="kit"><p className="meta">Carregando…</p></div>;
  const S = store.lista.find((c) => c.id === store.ativa) || store.lista[0];
  const muda: Muda = (fn) => setStore((st) => st && ({ ...st, lista: st.lista.map((c) => (c.id === (st.ativa || st.lista[0].id) ? fn(c) : c)) }));
  const escolher = (id: string) => { setStore((st) => st && ({ ...st, ativa: id })); setRemover(false); };
  const adicionar = () => {
    const c = novaCrianca();
    setStore((st) => st && ({ ...st, lista: [...st.lista, c], ativa: c.id }));
    setRemover(false); setFicha(null);
    setTimeout(() => nomeRef.current?.focus(), 50);
  };
  const removerAtiva = () => {
    setStore((st) => {
      if (!st || st.lista.length < 2) return st;
      const lista = st.lista.filter((c) => c.id !== S.id);
      return { ...st, lista, ativa: lista[0].id };
    });
    setRemover(false);
  };
  const topo = () => { const el = document.getElementById("kit"); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); };
  const abrir = (id: string) => { setAba("fichas"); setFicha(id); topo(); };

  return (
    <div className="kit" id="kit">
      <section className="card kit-crianca no-print">
        <div className="kit-kids" role="group" aria-label="Criança observada">
          <span className="eyebrow-i">Criança</span>
          {store.lista.map((c) => {
            const feitas = FICHAS.filter((f) => avaliar(f, c).r > 0).length;
            return <button key={c.id} type="button" className="chip" aria-pressed={c.id === S.id} onClick={() => escolher(c.id)}>{nomeDe(c)}{feitas ? <small> · {feitas}/{FICHAS.length}</small> : null}</button>;
          })}
          <button type="button" className="chip kit-add" onClick={adicionar}>+ Adicionar criança</button>
        </div>
        <div className="row" style={{ alignItems: "end", gap: 14 }}>
          <label className="f">Nome ou apelido<input ref={nomeRef} maxLength={30} value={S.nome} onChange={(e) => { const v = e.target.value; muda((s) => ({ ...s, nome: v })); }} placeholder="Ex.: Lia" /></label>
          <label className="f">Ano escolar
            <select value={S.serie} onChange={(e) => { const v = e.target.value; muda((s) => ({ ...s, serie: v })); }}>
              <option value="">Escolha</option>
              {SERIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          {store.lista.length > 1 && (remover
            ? <span className="row"><button type="button" className="btn danger small" onClick={removerAtiva}>Remover {nomeDe(S)} e as respostas</button><button type="button" className="link-btn meta" onClick={() => setRemover(false)}>Cancelar</button></span>
            : <button type="button" className="link-btn meta" onClick={() => setRemover(true)}>Remover esta criança</button>)}
        </div>
        <p className="note" style={{ margin: 0 }}><b>Isto não é um diagnóstico.</b> O Olhar Atento ajuda a família a organizar o que observa. Autismo, TDAH, dislexia, discalculia e outras condições só podem ser diagnosticados por profissionais habilitados. As respostas ficam guardadas só neste navegador.</p>
      </section>

      <div className="seg kit-abas no-print" role="tablist">
        {ABAS.map(([k, l]) => <button key={k} role="tab" type="button" aria-pressed={aba === k} aria-selected={aba === k} onClick={() => { setAba(k); if (k === "fichas") setFicha(null); }}>{l}</button>)}
      </div>

      {aba === "fichas" && (ficha ? <FichaView key={S.id} f={FICHAS.find((x) => x.id === ficha)!} S={S} muda={muda} voltar={() => setFicha(null)} abrir={abrir} /> : <Grade S={S} abrir={abrir} />)}
      {aba === "jogos" && <JogosView key={S.id} S={S} muda={muda} />}
      {aba === "relatorio" && <Relatorio S={S} muda={muda} abrir={abrir} />}
      {aba === "ajuda" && <Ajuda />}
    </div>
  );
}

function Grade({ S, abrir }: { S: Estado; abrir: (id: string) => void }) {
  return (
    <>
      <p className="meta" style={{ margin: 0 }}>Escolha uma ficha. Uma por semana é o ideal. Observe por 2 a 4 semanas antes de marcar, e marque o que você viu acontecer, não o que teme.</p>
      <div className="kit-grade">
        {FICHAS.map((f, i) => {
          const a = avaliar(f, S), p = Math.round((100 * a.r) / total(f));
          return (
            <button key={f.id} type="button" className="card kit-fcard" onClick={() => abrir(f.id)}>
              <span className="eyebrow-i">Ficha {i + 1}</span>
              <h3>{f.titulo}</h3>
              <span className="meta">{f.sub}</span>
              <span className="kit-foot"><span className="bar"><i style={{ width: `${p}%` }} /></span><span className={`kit-chip ${a.nivel}`}>{a.rotulo}</span></span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function FichaView({ f, S, muda, voltar, abrir }: { f: Ficha; S: Estado; muda: Muda; voltar: () => void; abrir: (id: string) => void }) {
  const idx = FICHAS.indexOf(f), prox = FICHAS[idx + 1];
  const serie = S.serie === "" ? null : Number(S.serie);
  const res = S.resp[f.id] || {};
  const marca = (i: number, v: number) => muda((s) => {
    const r = { ...(s.resp[f.id] || {}) };
    if (r[i] === v) delete r[i]; else r[i] = v;
    return { ...s, resp: { ...s.resp, [f.id]: r } };
  });
  const conta = (i: number, d: number) => muda((s) => ({ ...s, ditado: { ...s.ditado, [i]: Math.max(0, (s.ditado[i] || 0) + d) } }));
  const limpar = () => muda((s) => {
    const resp = { ...s.resp }, notas = { ...s.notas }; delete resp[f.id]; delete notas[f.id];
    return { ...s, resp, notas, ditado: f.tipo === "ditado" ? {} : s.ditado };
  });

  return (
    <>
      <p className="meta" style={{ margin: 0 }}><button type="button" className="link-btn" onClick={voltar}>← Todas as fichas</button></p>
      <div>
        <p className="eyebrow-i">Ficha {idx + 1} · {f.sub}</p>
        <h2>{f.titulo}</h2>
      </div>
      {serie !== null && serie < f.minSerie && <p className="diag-aviso">Esta ficha foi pensada a partir do {f.minSerie}º ano. Na série escolhida, muitos destes sinais ainda fazem parte do caminho normal da aprendizagem.</p>}
      <p className="lead">{f.intro}</p>
      <div className="kit-layout">
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          {f.tipo === "ditado" ? (
            <>
              <section className="card">
                <h3>Palavras para ditar</h3>
                <div className="kit-palavras">{f.palavras!.map((p) => <span key={p}>{p}</span>)}</div>
                <h3>Frase para ditar</h3>
                <p>{f.frase}</p>
              </section>
              <section className="card kit-tabela">
                <table>
                  <thead><tr><th>Tipo de erro</th><th>Exemplo</th><th>Quantas vezes</th></tr></thead>
                  <tbody>{f.erros!.map((e, i) => (
                    <tr key={i}>
                      <td>{e.t}<span className="meta" style={{ display: "block" }}>{e.som ? "erro de som" : "erro de regra"}</span></td>
                      <td className="meta">{e.ex}</td>
                      <td><span className="kit-step"><button type="button" aria-label="Menos" onClick={() => conta(i, -1)}>−</button><output>{S.ditado[i] || 0}</output><button type="button" aria-label="Mais" onClick={() => conta(i, 1)}>+</button></span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </section>
            </>
          ) : (
            <ol className={`kit-itens${f.positivo || f.tipo === "pref" ? " pos" : ""}`}>
              {f.itens!.map((it, i) => (
                <li key={i} className={`kit-item${typeof it === "object" && it.flag ? " flag" : ""}`}>
                  <span className="kit-q"><span className="kit-n">{i + 1}</span>{itemText(it)}</span>
                  <span className="kit-seg" role="group" aria-label="Frequência">
                    {ESCALA.map((l, v) => <button key={v} type="button" data-v={v} aria-pressed={res[i] === v} onClick={() => marca(i, v)}>{l}</button>)}
                  </span>
                </li>
              ))}
            </ol>
          )}
          <label className="f card">Exemplos e anotações (uma palavra escrita, uma situação, uma frase dita)
            <textarea rows={3} value={S.notas[f.id] || ""} onChange={(e) => { const v = e.target.value; muda((s) => ({ ...s, notas: { ...s.notas, [f.id]: v } })); }} />
          </label>
          <div className="row">
            <button type="button" className="btn ghost small" onClick={limpar}>Limpar esta ficha</button>
            {prox && <button type="button" className="btn small" onClick={() => abrir(prox.id)}>Próxima ficha: {prox.titulo} →</button>}
          </div>
        </div>
        <Resultado f={f} S={S} />
      </div>
    </>
  );
}

function Resultado({ f, S }: { f: Ficha; S: Estado }) {
  const a = avaliar(f, S);
  const cor = a.nivel === "alert" ? "var(--por)" : a.nivel === "warn" ? "var(--jog)" : a.nivel === "ok" ? "var(--cie)" : "var(--mat)";
  const res = S.resp[f.id] || {};
  return (
    <aside className="card kit-res" aria-live="polite">
      <p className="eyebrow-i">Resultado</p>
      {f.tipo === "ditado" ? (
        a.r ? <><span className={`kit-chip ${a.nivel}`}>{a.faixa}</span><p><b>{a.som}</b> erros de som · <b>{a.regra}</b> erros de regra</p><p className="meta">Erros de regra são comuns até o 5º ano. Erros de som que continuam depois do 3º ano merecem atenção, ainda mais com sinais na ficha de Leitura.</p></>
          : <p className="meta">Marque quantas vezes cada erro apareceu. Se não houve erro, toque em + e depois em − para registrar zero.</p>
      ) : f.tipo === "pref" ? (
        a.r ? <div className="kit-pref">{f.itens!.map((it, i) => ({ cat: typeof it === "object" ? it.cat : "", v: res[i] ?? 0 })).sort((x, y) => y.v - x.v).map((x) => (
          <div key={x.cat}><span>{x.cat}</span><span className="bar"><i style={{ width: `${x.v * 50}%`, background: "var(--mat)" }} /></span></div>
        ))}</div> : <p className="meta">Responda os itens para ver as preferências.</p>
      ) : a.r ? (
        <>
          <p className="kit-big">{a.soma}<small> de {a.max} pontos</small></p>
          <span className="bar"><i style={{ width: `${Math.round(a.pct * 100)}%`, background: cor }} /></span>
          <p className="meta">{a.r} de {a.n} itens respondidos</p>
          <span className={`kit-chip ${a.parcial ? "none" : a.nivel}`}>{a.parcial ? "Responda todos os itens" : a.faixa}</span>
          {a.flag && <p><b>Perda de habilidades que a criança já tinha é motivo para procurar o pediatra logo, em qualquer idade.</b></p>}
          {a.fortes.length > 0 && <><p><b>{f.positivo ? "Pontos fortes" : "Marcados como quase sempre"}</b></p><ul>{a.fortes.map((t) => <li key={t}>{t}</li>)}</ul></>}
        </>
      ) : <p className="meta">Toque numa resposta em cada item. O resultado aparece aqui na hora.</p>}
      <p><b>No Atlas:</b> {f.atlas}</p>
      {f.tipo !== "pref" && <p><b>Quem procurar:</b> {f.quem}</p>}
      <p className="meta">{f.dica}</p>
    </aside>
  );
}

/* ---------- Jogos ---------- */

function sortearCores() {
  const blocos: number[] = [], palavras: { w: number; c: number }[] = [];
  let ult = -1;
  for (let i = 0; i < 20; i++) { let c; do { c = Math.floor(Math.random() * 4); } while (c === ult); ult = c; blocos.push(c); }
  ult = -1;
  for (let j = 0; j < 20; j++) { const w = Math.floor(Math.random() * 4); let k; do { k = Math.floor(Math.random() * 4); } while (k === w || k === ult); ult = k; palavras.push({ w, c: k }); }
  return { blocos, palavras };
}

function JogosView({ S, muda }: { S: Estado; muda: Muda }) {
  return (
    <>
      <p className="meta" style={{ margin: 0 }}>Brincadeiras curtas para fazer junto. Anote e repita daqui a alguns meses para comparar com ela mesma, sem buscar um número ideal.</p>
      <div className="kit-jogos">
        <Digitos S={S} muda={muda} />
        <Cores S={S} muda={muda} />
      </div>
      <Comandos S={S} muda={muda} />
    </>
  );
}

function Digitos({ S, muda }: { S: Estado; muda: Muda }) {
  const [modo, setModo] = useState<"direta" | "inversa">("direta");
  const [voz, setVoz] = useState(false);
  const [len, setLen] = useState(2);
  const [erros, setErros] = useState(0);
  const [maior, setMaior] = useState(0);
  const [seq, setSeq] = useState<number[]>([]);
  const [fase, setFase] = useState<"pronto" | "mostrando" | "responder" | "fim">("pronto");
  const [atual, setAtual] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const reiniciar = () => { setLen(2); setErros(0); setMaior(0); setFase("pronto"); };
  const falar = (t: string) => { if (!voz) return; try { const u = new SpeechSynthesisUtterance(t); u.lang = "pt-BR"; u.rate = 0.9; window.speechSynthesis.speak(u); } catch {} };
  const mostrar = () => {
    const s: number[] = []; let ult = -1;
    for (let i = 0; i < len; i++) { let d; do { d = Math.floor(Math.random() * 10); } while (d === ult); ult = d; s.push(d); }
    setSeq(s); setFase("mostrando");
    s.forEach((d, k) => {
      timers.current.push(window.setTimeout(() => { setAtual(String(d)); falar(String(d)); }, k * 1300));
      timers.current.push(window.setTimeout(() => setAtual(""), k * 1300 + 1000));
    });
    timers.current.push(window.setTimeout(() => setFase("responder"), s.length * 1300));
  };
  const responde = (ok: boolean) => {
    let m = maior, l = len, e = erros, f: typeof fase = "pronto";
    if (ok) { m = Math.max(m, len); l = len + 1; e = 0; if (l > 9) f = "fim"; } else { e = erros + 1; if (e >= 2) f = "fim"; }
    setMaior(m); setLen(l); setErros(e); setFase(f);
    if (f === "fim") muda((s) => ({ ...s, jogos: { ...s.jogos, [modo === "direta" ? "digDireta" : "digInversa"]: m } }));
  };
  const esperado = modo === "inversa" ? [...seq].reverse() : seq;
  const como = modo === "inversa" ? "de trás para frente" : "na mesma ordem";

  return (
    <section className="card">
      <h3>Memória de números</h3>
      <p className="meta">A criança olha (ou ouve) os números e repete em voz alta. Você confere e marca. A sequência cresce a cada acerto, e o jogo termina depois de dois erros no mesmo tamanho.</p>
      <div className="row">
        <div className="seg">
          <button type="button" aria-pressed={modo === "direta"} onClick={() => { setModo("direta"); reiniciar(); }}>Mesma ordem</button>
          <button type="button" aria-pressed={modo === "inversa"} onClick={() => { setModo("inversa"); reiniciar(); }}>De trás para frente</button>
        </div>
        <label className="kit-voz"><input type="checkbox" checked={voz} onChange={(e) => setVoz(e.target.checked)} /> Falar os números em voz</label>
      </div>
      <div className="kit-palco" aria-live="polite">
        {fase === "pronto" && <span className="meta">Toque em Mostrar para começar com {len} números.</span>}
        {fase === "mostrando" && <span className="kit-digito">{atual}</span>}
        {fase === "responder" && <div style={{ textAlign: "center" }}><p>Peça para a criança repetir {como}.</p><p className="meta">Resposta certa (só para o adulto): <b className="kit-resp">{esperado.join(" ")}</b></p></div>}
        {fase === "fim" && <div style={{ textAlign: "center" }}><span className="kit-digito" style={{ fontSize: "3rem" }}>{maior}</span><p>números {como}</p></div>}
      </div>
      <div className="row">
        {fase === "pronto" && <button type="button" className="btn" onClick={mostrar}>Mostrar {len} números</button>}
        {fase === "mostrando" && <span className="meta">Olhe com atenção…</span>}
        {fase === "responder" && <><button type="button" className="btn" onClick={() => responde(true)}>Acertou</button><button type="button" className="btn ghost" onClick={() => responde(false)}>Errou</button></>}
        {fase === "fim" && <button type="button" className="btn" onClick={reiniciar}>Jogar de novo</button>}
      </div>
      <p className="meta">Registrado: mesma ordem <b>{S.jogos.digDireta || "—"}</b> · de trás para frente <b>{S.jogos.digInversa || "—"}</b> números</p>
    </section>
  );
}

function Cores({ S, muda }: { S: Estado; muda: Muda }) {
  const [itens, setItens] = useState<ReturnType<typeof sortearCores> | null>(null);
  const [rodando, setRodando] = useState<null | "1" | "2">(null);
  const [agora, setAgora] = useState(0);
  const inicio = useRef(0);
  useEffect(() => { setItens(sortearCores()); }, []);
  useEffect(() => {
    if (!rodando) return;
    const id = window.setInterval(() => setAgora(Date.now() - inicio.current), 100);
    return () => clearInterval(id);
  }, [rodando]);
  const st = S.jogos.stroop || {};
  const setSt = (p: Stroop) => muda((s) => ({ ...s, jogos: { ...s.jogos, stroop: { ...(s.jogos.stroop || {}), ...p } } }));
  const cron = (r: "1" | "2") => {
    if (rodando === r) { setSt({ [`t${r}`]: Date.now() - inicio.current } as Stroop); setRodando(null); }
    else { inicio.current = Date.now(); setAgora(0); setRodando(r); }
  };
  const linha = (r: "1" | "2") => {
    const t = st[`t${r}` as "t1"], e = st[`e${r}` as "e1"] || 0;
    return (
      <div className="row">
        <span className="kit-timer">{rodando === r ? fmt(agora) : t ? fmt(t) : "0,0 s"}</span>
        <button type="button" className="btn small" onClick={() => cron(r)}>{rodando === r ? "Parar" : t ? "Refazer" : "Começar"}</button>
        <span className="meta">Erros</span>
        <span className="kit-step"><button type="button" aria-label="Menos erros" onClick={() => setSt({ [`e${r}`]: Math.max(0, e - 1) } as Stroop)}>−</button><output>{e}</output><button type="button" aria-label="Mais erros" onClick={() => setSt({ [`e${r}`]: e + 1 } as Stroop)}>+</button></span>
      </div>
    );
  };
  return (
    <section className="card">
      <h3>Cores trocadas</h3>
      <p className="meta">Para quem já lê. Rodada 1: a criança diz a cor de cada bloco. Rodada 2: diz a <b>cor da tinta</b>, não a palavra escrita. Cronometre e conte os erros.</p>
      <p className="eyebrow-i">Rodada 1 · blocos</p>
      <div className="kit-palco"><div className="kit-stroop">{itens?.blocos.map((c, i) => <span key={i} className="b" style={{ background: CORES[c].c }} />)}</div></div>
      {linha("1")}
      <p className="eyebrow-i">Rodada 2 · palavras</p>
      <div className="kit-palco"><div className="kit-stroop">{itens?.palavras.map((p, i) => <span key={i} className="w" style={{ color: CORES[p.c].c }}>{CORES[p.w].n}</span>)}</div></div>
      {linha("2")}
      {st.t1 && st.t2 ? <p>A rodada 2 levou <b>{fmt(st.t2 - st.t1)}</b> a mais. É normal a segunda ser mais lenta: ela mede o esforço de segurar a leitura automática.</p> : null}
      <div className="row"><button type="button" className="btn ghost small" onClick={() => { setItens(sortearCores()); setRodando(null); muda((s) => ({ ...s, jogos: { ...s.jogos, stroop: {} } })); }}>Sortear outras cores</button></div>
    </section>
  );
}

function Comandos({ S, muda }: { S: Estado; muda: Muda }) {
  const cm = S.jogos.comandos || {};
  const marca = (i: number, v: boolean) => muda((s) => {
    const c = { ...(s.jogos.comandos || {}) };
    if (c[i] === v) delete c[i]; else c[i] = v;
    return { ...s, jogos: { ...s.jogos, comandos: c } };
  });
  const marcados = Object.keys(cm).length, feitos = Object.values(cm).filter(Boolean).length;
  return (
    <section className="card">
      <h3>Siga o comando</h3>
      <p className="meta">Coloque na mesa um copo, uma colher, um lápis, uma folha de papel e um brinquedo pequeno. Leia cada comando <b>uma vez só</b>, sem apontar nem olhar para os objetos. Marque se a criança fez tudo certo.</p>
      <ol className="kit-itens">
        {COMANDOS.map((c, i) => (
          <li key={i} className="kit-item">
            <span className="kit-q"><span className="kit-n">{i + 1}</span>{c}</span>
            <span className="kit-seg">
              <button type="button" data-v={0} aria-pressed={cm[i] === true} onClick={() => marca(i, true)}>Fez</button>
              <button type="button" data-v={2} aria-pressed={cm[i] === false} onClick={() => marca(i, false)}>Não fez</button>
            </span>
          </li>
        ))}
      </ol>
      <p>{marcados ? <><b>{feitos} de {marcados}</b> comandos feitos corretamente. </> : null}Os comandos ficam mais longos e trazem palavras como <i>antes, depois, embaixo, menos</i>. Se ela erra os primeiros ou trava sempre nos de dois passos, veja também a ficha Escuta e compreensão.</p>
    </section>
  );
}

/* ---------- Relatório ---------- */

const AREAS = ["leitura", "escrita", "matematica", "atencao", "social", "convivencia", "escuta"];

function Relatorio({ S, muda, abrir }: { S: Estado; muda: Muda; abrir: (id: string) => void }) {
  const [confirma, setConfirma] = useState(false);
  const nome = S.nome.trim() || "a criança";
  const serie = SERIES.find((s) => s[0] === S.serie)?.[1];
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const fichas = FICHAS.map((f) => ({ f, a: avaliar(f, S) }));
  const areas = fichas.filter(({ f }) => AREAS.includes(f.id));
  const feitas = fichas.filter(({ a }) => a.r > 0);
  const dit = fichas.find(({ f }) => f.id === "ditado")!;
  const tal = fichas.find(({ f }) => f.id === "talentos")!;
  const pref = fichas.find(({ f }) => f.id === "preferencias")!;
  const passos = fichas.filter(({ f, a }) => !a.parcial && a.r > 0 && (a.nivel === "alert" || a.nivel === "warn") && f.tipo !== "pref" && !f.positivo);
  const J = S.jogos, cm = J.comandos || {};
  const temJogo = !!(J.digDireta || J.digInversa || J.stroop?.t1 || J.stroop?.t2 || Object.keys(cm).length);
  const imprimir = () => { (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => window.print()) ?? window.print(); };

  return (
    <div className="oa-rel">
      <header className="oa-cab">
        <div>
          <p className="eyebrow-i">Olhar Atento · Atlas do Aprender</p>
          <h2>Relatório de observação de {nome}</h2>
          <p className="meta">{serie ? `${serie} · ` : ""}{hoje} · {feitas.length} de {FICHAS.length} fichas preenchidas</p>
        </div>
        <button type="button" className="btn no-print" onClick={imprimir} disabled={!feitas.length && !temJogo}>Gerar PDF</button>
      </header>
      <p className="oa-aviso">Observação feita pela família, em casa. <b>Não é diagnóstico.</b> Serve para conversar com a escola e com profissionais de saúde.</p>

      {!feitas.length && !temJogo ? (
        <section className="card no-print"><p>Ainda não há respostas para {nome}. Comece pelas <button type="button" className="link-btn" onClick={() => abrir(FICHAS[0].id)}>fichas</button>: o relatório se monta sozinho conforme você marca.</p></section>
      ) : (
        <>
          <section className="card oa-bloco">
            <h3>Visão geral</h3>
            <p className="meta">Quanto mais longa a barra, mais sinais foram marcados na área.</p>
            <div className="oa-graf">
              {areas.map(({ f, a }) => {
                const pct = Math.round(a.pct * 100);
                return (
                  <div key={f.id} className="oa-linha">
                    <span className="oa-nome">{f.titulo}</span>
                    <span className="oa-trilho">
                      <span className="oa-faixa" style={{ left: "30%" }} /><span className="oa-faixa" style={{ left: "55%" }} />
                      {a.r > 0 && <i style={{ width: `${Math.max(pct, 2)}%`, background: a.parcial ? "var(--soft)" : COR[a.nivel] }} />}
                    </span>
                    <span className="oa-val">{a.r === 0 ? "não preenchida" : a.parcial ? `${pct}% · incompleta` : `${pct}%`}</span>
                  </div>
                );
              })}
            </div>
            <div className="oa-legenda">
              <span><i style={{ background: "var(--cie)" }} />Até 30%: poucos sinais</span>
              <span><i style={{ background: "var(--jog)" }} />30% a 55%: acompanhe de perto</span>
              <span><i style={{ background: "var(--por)" }} />Acima de 55%: converse com um profissional</span>
            </div>
          </section>

          {passos.length > 0 && (
            <section className="card oa-bloco">
              <h3>Próximos passos</h3>
              <ol className="oa-passos">
                {passos.sort((x, y) => (x.a.nivel === "alert" ? 0 : 1) - (y.a.nivel === "alert" ? 0 : 1)).map(({ f, a }) => (
                  <li key={f.id}><span className={`kit-chip ${a.nivel}`}>{f.titulo}</span> {a.nivel === "alert" ? f.quem : f.atlas}</li>
                ))}
              </ol>
            </section>
          )}

          <div className="oa-duas">
            {dit.a.r > 0 && (
              <section className="card oa-bloco">
                <h3>Ditado</h3>
                <div className="oa-stats">
                  <div><b>{dit.a.som}</b><span>erros de som</span></div>
                  <div><b>{dit.a.regra}</b><span>erros de regra</span></div>
                </div>
                <span className={`kit-chip ${dit.a.nivel}`}>{dit.a.faixa}</span>
                <p className="meta">Erros de regra são comuns até o 5º ano. Erros de som depois do 3º ano merecem atenção.</p>
              </section>
            )}
            {(tal.a.r > 0 || pref.a.r > 0) && (
              <section className="card oa-bloco">
                <h3>Pontos fortes</h3>
                {tal.a.r > 0 && <><p><span className={`kit-chip ${tal.a.parcial ? "none" : tal.a.nivel}`}>{tal.a.parcial ? "Talentos: incompleta" : tal.a.faixa}</span></p>
                  {tal.a.fortes.length > 0 && <ul className="oa-lista">{tal.a.fortes.map((t) => <li key={t}>{t}</li>)}</ul>}</>}
                {pref.a.r > 0 && <><p className="meta">Como {nome} gosta de aprender</p><div className="kit-pref">{pref.f.itens!.map((it, i) => ({ cat: typeof it === "object" ? it.cat : "", v: (S.resp.preferencias || {})[i] ?? 0 })).filter((x) => x.v > 0).sort((x, y) => y.v - x.v).map((x) => (
                  <div key={x.cat}><span>{x.cat}</span><span className="bar"><i style={{ width: `${x.v * 50}%`, background: "var(--mat)" }} /></span></div>
                ))}</div></>}
              </section>
            )}
            {temJogo && (
              <section className="card oa-bloco">
                <h3>Jogos de observação</h3>
                <div className="oa-stats">
                  {(J.digDireta || J.digInversa) ? <div><b>{J.digDireta || "—"} / {J.digInversa || "—"}</b><span>números lembrados (mesma ordem / de trás para frente)</span></div> : null}
                  {J.stroop?.t1 && J.stroop?.t2 ? <div><b>{fmt(J.stroop.t1)} / {fmt(J.stroop.t2)}</b><span>cores trocadas (blocos / palavras), {(J.stroop.e1 || 0) + (J.stroop.e2 || 0)} erros</span></div> : null}
                  {Object.keys(cm).length ? <div><b>{Object.values(cm).filter(Boolean).length} de {Object.keys(cm).length}</b><span>comandos seguidos corretamente</span></div> : null}
                </div>
              </section>
            )}
          </div>

          <section className="oa-det">
            <h3>Detalhes por área</h3>
            <div className="oa-cards">
              {areas.filter(({ a }) => a.r > 0).map(({ f, a }) => (
                <article key={f.id} className="card oa-card" style={{ borderTop: `5px solid ${a.parcial ? "var(--line)" : COR[a.nivel]}` }}>
                  <div className="oa-card-cab"><h4>{f.titulo}</h4><span className={`kit-chip ${a.parcial ? "none" : a.nivel}`}>{a.parcial ? `${a.r} de ${a.n} itens` : a.faixa}</span></div>
                  <p className="meta">{a.soma} de {a.max} pontos · {f.sub}</p>
                  {a.flag && <p><b>Perdeu habilidades que já tinha: procurar o pediatra logo.</b></p>}
                  {a.fortes.length > 0 ? <><p className="oa-mini">Acontece quase sempre</p><ul className="oa-lista">{a.fortes.map((t) => <li key={t}>{t}</li>)}</ul></> : <p className="meta">Nenhum item marcado como quase sempre.</p>}
                  {S.notas[f.id] && <><p className="oa-mini">Anotações da família</p><p className="oa-nota">{S.notas[f.id]}</p></>}
                </article>
              ))}
            </div>
            {(["ditado", "talentos", "preferencias"] as const).some((id) => S.notas[id]) && (
              <div className="card oa-bloco" style={{ marginTop: 12 }}>
                <p className="oa-mini">Outras anotações</p>
                {(["ditado", "talentos", "preferencias"] as const).filter((id) => S.notas[id]).map((id) => <p key={id}><b>{FICHAS.find((f) => f.id === id)!.titulo}:</b> {S.notas[id]}</p>)}
              </div>
            )}
          </section>
        </>
      )}

      <div className="oa-rod">
        <span>Olhar Atento · Atlas do Aprender · atlasdoaprender.com.br/olhar-atento</span>
        <span>Criado por Stephanie Kamarry. Material gratuito de observação pedagógica; não substitui avaliação profissional.</span>
      </div>

      <div className="row no-print">
        {confirma
          ? <><button type="button" className="btn danger small" onClick={() => { muda((s) => ({ ...s, resp: {}, notas: {}, ditado: {}, jogos: {} })); setConfirma(false); }}>Sim, apagar as respostas de {nome}</button><button type="button" className="link-btn meta" onClick={() => setConfirma(false)}>Cancelar</button></>
          : <button type="button" className="btn ghost small" onClick={() => setConfirma(true)}>Apagar as respostas de {nome}</button>}
      </div>
    </div>
  );
}

const QUEM: [string, string][] = [
  ["Leitura, escrita, ortografia", "Fonoaudiólogo, psicopedagogo"],
  ["Traçado, coordenação fina", "Terapeuta ocupacional"],
  ["Matemática", "Psicopedagogo, neuropsicólogo"],
  ["Atenção e agitação", "Pediatra, neuropediatra, psiquiatra infantil, psicólogo"],
  ["Comunicação e interação", "Pediatra, neuropediatra, psiquiatra infantil"],
  ["Convivência e comportamento", "Psicólogo infantil"],
  ["Escuta e compreensão", "Otorrino (audição), fonoaudiólogo"],
  ["Altas habilidades", "Psicólogo, escola (AEE)"],
];

function Ajuda() {
  return (
    <div className="kit-layout">
      <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
        <h2>Quando e a quem procurar</h2>
        <p><b>Procure ajuda sem esperar</b> se a criança perdeu habilidades que já tinha, se há sofrimento forte (choro, medo, recusa de ir à escola) ou se você está preocupada. Sua percepção conta.</p>
        <p>Na dúvida, comece pelo <b>pediatra</b> ou pela <b>Unidade Básica de Saúde</b>: eles fazem o primeiro olhar e encaminham. Converse também com a escola, que pode oferecer apoio e atendimento educacional especializado.</p>
        <section className="card kit-tabela">
          <table><thead><tr><th>O que preocupa</th><th>Quem pode ajudar</th></tr></thead>
            <tbody>{QUEM.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
        </section>
        <p>Os profissionais usam instrumentos próprios, padronizados e com normas para cada idade. Alguns exemplos: o <b>M-CHAT-R/F</b>, aplicado pelo pediatra entre 16 e 30 meses para rastrear sinais de autismo; escalas de atenção respondidas por pais e professores, como o <b>SNAP-IV</b>; a avaliação do processamento auditivo, feita pelo fonoaudiólogo; e a avaliação neuropsicológica. No Brasil, testes psicológicos só podem ser aplicados por psicólogos.</p>
        <p>Leve o <b>Resumo</b> do Olhar Atento e as folhas de escrita e ditado com data. Exemplos concretos ajudam muito na consulta.</p>
      </div>
      <aside className="card kit-res">
        <h3>Antes de tudo, confira</h3>
        <ul><li>Exame de vista</li><li>Exame de audição</li><li>Sono suficiente para a idade</li><li>Tempo de tela</li><li>Mudanças recentes na família ou na escola</li></ul>
        <p className="meta">Muitas dificuldades melhoram quando essas bases são ajustadas. As lacunas de conteúdo, o <Link href="/diagnostico">Diagnóstico</Link> do Atlas ajuda a encontrar.</p>
      </aside>
    </div>
  );
}
