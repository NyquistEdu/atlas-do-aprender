"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COMANDOS, CORES, ESCALA, FICHAS, itemText, type Ficha } from "@/lib/olharAtento";

type Stroop = { t1?: number; e1?: number; t2?: number; e2?: number };
type Jogos = { digDireta?: number; digInversa?: number; stroop?: Stroop; comandos?: Record<string, boolean> };
type Estado = { nome: string; serie: string; resp: Record<string, Record<string, number>>; notas: Record<string, string>; ditado: Record<string, number>; jogos: Jogos };
type Nivel = "none" | "ok" | "warn" | "alert" | "info";
type Aval = { r: number; n: number; soma: number; max: number; pct: number; fortes: string[]; flag: boolean; nivel: Nivel; rotulo: string; faixa?: string; parcial?: boolean; som?: number; regra?: number };

const CHAVE = "atlas-kit-observacao";
const VAZIO: Estado = { nome: "", serie: "", resp: {}, notas: {}, ditado: {}, jogos: {} };
const SERIES: [string, string][] = [["0", "Educação infantil"], ["1", "1º ano"], ["2", "2º ano"], ["3", "3º ano"], ["4", "4º ano"], ["5", "5º ano"], ["6", "6º ano ou mais"]];
type Aba = "fichas" | "jogos" | "resumo" | "ajuda";
const ABAS: [Aba, string][] = [["fichas", "Fichas"], ["jogos", "Jogos de observação"], ["resumo", "Resumo"], ["ajuda", "Quando procurar ajuda"]];

const total = (f: Ficha) => (f.tipo === "ditado" ? f.erros!.length : f.itens!.length);
const fmt = (ms: number) => (ms / 1000).toFixed(1).replace(".", ",") + " s";

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

function textoResumo(S: Estado) {
  const serie = SERIES.find((s) => s[0] === S.serie)?.[1];
  const l: string[] = ["Olhar Atento · Atlas do Aprender", `Criança: ${S.nome || "(sem nome)"}${serie ? " · " + serie : ""}`, `Data: ${new Date().toLocaleDateString("pt-BR")}`, "Observação feita pela família. Não é diagnóstico.", ""];
  FICHAS.forEach((f) => {
    const a = avaliar(f, S); if (!a.r) return;
    if (f.tipo === "ditado") l.push(`• ${f.titulo}: ${a.faixa} (${a.som} erros de som, ${a.regra} de regra)`);
    else if (f.tipo === "pref") {
      const res = S.resp[f.id] || {}, top = f.itens!.filter((_, i) => res[i] === 2).map((it) => (typeof it === "object" ? it.cat : ""));
      l.push(`• ${f.titulo}: ${top.length ? top.join(", ") : "sem preferência forte marcada"}`);
    } else {
      l.push(`• ${f.titulo}: ${a.parcial ? `incompleta (${a.r}/${a.n})` : a.faixa} · ${a.soma}/${a.max} pontos`);
      a.fortes.forEach((t) => l.push(`   - quase sempre: ${t}`));
    }
    if (S.notas[f.id]) l.push(`   Anotações: ${S.notas[f.id].replace(/\s+/g, " ")}`);
  });
  const J = S.jogos;
  if (J.digDireta || J.digInversa) l.push(`• Memória de números: mesma ordem ${J.digDireta || "—"}, de trás para frente ${J.digInversa || "—"}`);
  if (J.stroop?.t1 && J.stroop?.t2) l.push(`• Cores trocadas: rodada 1 ${fmt(J.stroop.t1)} (${J.stroop.e1 || 0} erros), rodada 2 ${fmt(J.stroop.t2)} (${J.stroop.e2 || 0} erros)`);
  const c = J.comandos || {};
  if (Object.keys(c).length) l.push(`• Siga o comando: ${Object.values(c).filter(Boolean).length} de ${Object.keys(c).length} corretos`);
  return l.join("\n");
}

export default function OlharAtento() {
  const [S, setS] = useState<Estado>(VAZIO);
  const [aba, setAba] = useState<Aba>("fichas");
  const [ficha, setFicha] = useState<string | null>(null);
  const carregado = useRef(false);

  useEffect(() => {
    try { const o = JSON.parse(localStorage.getItem(CHAVE) || "null"); if (o && typeof o === "object") setS({ ...VAZIO, ...o }); } catch {}
    carregado.current = true;
  }, []);
  useEffect(() => { if (carregado.current) { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch {} } }, [S]);

  const muda = (fn: (s: Estado) => Estado) => setS((s) => fn(s));
  const abrir = (id: string) => { setAba("fichas"); setFicha(id); topo(); };
  const topo = () => { const el = document.getElementById("kit"); if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); };

  return (
    <div className="kit" id="kit">
      <section className="card kit-crianca">
        <div className="row" style={{ alignItems: "end", gap: 14 }}>
          <label className="f">Nome ou apelido da criança (opcional)<input maxLength={30} value={S.nome} onChange={(e) => { const v = e.target.value; muda((s) => ({ ...s, nome: v })); }} placeholder="Ex.: Lia" /></label>
          <label className="f">Ano escolar
            <select value={S.serie} onChange={(e) => { const v = e.target.value; muda((s) => ({ ...s, serie: v })); }}>
              <option value="">Escolha</option>
              {SERIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
        </div>
        <p className="note" style={{ margin: 0 }}><b>Isto não é um diagnóstico.</b> O Olhar Atento ajuda a família a organizar o que observa. Autismo, TDAH, dislexia, discalculia e outras condições só podem ser diagnosticados por profissionais habilitados. As respostas ficam guardadas só neste navegador.</p>
      </section>

      <div className="seg kit-abas" role="tablist">
        {ABAS.map(([k, l]) => <button key={k} role="tab" type="button" aria-pressed={aba === k} aria-selected={aba === k} onClick={() => { setAba(k); if (k === "fichas") setFicha(null); }}>{l}</button>)}
      </div>

      {aba === "fichas" && (ficha ? <FichaView f={FICHAS.find((x) => x.id === ficha)!} S={S} muda={muda} voltar={() => setFicha(null)} abrir={abrir} /> : <Grade S={S} abrir={abrir} />)}
      {aba === "jogos" && <JogosView S={S} muda={muda} />}
      {aba === "resumo" && <Resumo S={S} muda={muda} abrir={abrir} />}
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

function FichaView({ f, S, muda, voltar, abrir }: { f: Ficha; S: Estado; muda: (fn: (s: Estado) => Estado) => void; voltar: () => void; abrir: (id: string) => void }) {
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

function JogosView({ S, muda }: { S: Estado; muda: (fn: (s: Estado) => Estado) => void }) {
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

function Digitos({ S, muda }: { S: Estado; muda: (fn: (s: Estado) => Estado) => void }) {
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

function Cores({ S, muda }: { S: Estado; muda: (fn: (s: Estado) => Estado) => void }) {
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

function Comandos({ S, muda }: { S: Estado; muda: (fn: (s: Estado) => Estado) => void }) {
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

/* ---------- Resumo e ajuda ---------- */

function Resumo({ S, muda, abrir }: { S: Estado; muda: (fn: (s: Estado) => Estado) => void; abrir: (id: string) => void }) {
  const [msg, setMsg] = useState("");
  const [confirma, setConfirma] = useState(false);
  const texto = textoResumo(S);
  const copiar = async () => { try { await navigator.clipboard.writeText(texto); setMsg("Copiado."); } catch { setMsg("Não consegui copiar. Selecione o texto e copie."); } };
  return (
    <div className="kit-layout">
      <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
        <h2>Resumo de {S.nome.trim() || "seu filho"}</h2>
        {FICHAS.map((f, i) => {
          const a = avaliar(f, S);
          const det = f.tipo === "ditado" && a.r ? `${a.som} erros de som · ${a.regra} de regra` : f.tipo !== "pref" && a.r ? `${a.soma} de ${a.max} pontos · ${a.r}/${a.n} itens` : f.sub;
          return (
            <button key={f.id} type="button" className="card kit-sum" onClick={() => abrir(f.id)}>
              <span><b>{i + 1}. {f.titulo}</b><span className="meta" style={{ display: "block" }}>{det}</span></span>
              <span className={`kit-chip ${a.nivel}`}>{a.rotulo}</span>
            </button>
          );
        })}
      </div>
      <aside className="card kit-res">
        <h3>Texto para levar</h3>
        <p className="meta">Cole numa mensagem para a escola ou mostre na consulta.</p>
        <textarea readOnly rows={12} value={texto} onFocus={(e) => e.target.select()} />
        <div className="row"><button type="button" className="btn small" onClick={copiar}>Copiar resumo</button><span className="meta">{msg}</span></div>
        <div className="row">
          {confirma
            ? <><button type="button" className="btn danger small" onClick={() => { muda(() => VAZIO); setConfirma(false); }}>Sim, apagar tudo</button><button type="button" className="link-btn meta" onClick={() => setConfirma(false)}>Cancelar</button></>
            : <button type="button" className="btn ghost small" onClick={() => setConfirma(true)}>Apagar todas as respostas</button>}
        </div>
      </aside>
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
