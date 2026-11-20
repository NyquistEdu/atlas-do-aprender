"use client";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, falar, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import type { CasoTrem } from "@/components/viva/Trem3D";
import { P, PALAVRAS, RIMAS, rotulo, silabado, type Palavra } from "./palavras";

const Trem3D = dynamic(() => import("@/components/viva/Trem3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando o trem 3D…</div> });

const DESC: Record<number, string> = { 2: "uma palma, um vagão", 3: "4 jogos para ouvir", 4: "a estação das rimas", 5: "parlenda, trava-língua e lista", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };
const PALMAS = ["👏", "👏👏", "👏👏👏", "👏👏👏👏", "👏👏👏👏👏"];
const nPalmas = (n: number) => (n === 1 ? "uma palma" : `${["", "", "duas", "três", "quatro", "cinco"][n]} palmas`);

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoTrem[]>(() => [
    { silabas: ["SOL"], placa: "☀️ sol", legenda: "SOL: uma palma, um vagão.", partiu: true },
    { silabas: ["BO", "LA"], placa: "⚽ bola", legenda: "BO-LA: duas palmas, dois vagões.", partiu: true },
    { silabas: ["MA", "CA", "CO"], placa: "🐒 macaco", legenda: "MA-CA-CO: três pedaços!", partiu: true },
    { silabas: ["BOR", "BO", "LE", "TA"], placa: "🦋 borboleta", legenda: "BOR-BO-LE-TA tem quatro pedaços.", partiu: true },
    { silabas: ["BOI"], placa: "🐂 boi", legenda: "O boi é grande, mas a palavra BOI é curtinha!", partiu: true },
    { silabas: ["FOR", "MI", "GUI", "NHA"], placa: "🐜 formiguinha", legenda: "A formiguinha é pequena, mas a palavra é comprida!", partiu: true },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Português · Alfabetização · Fase 1</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Brincar com as Palavras</span></h1>
        <p className="viva-formula">uma palma 👏 = um pedaço da palavra</p>
        <p className="viva-mao">sílabas e rimas para ouvir, bater palmas e brincar</p>
        <div className="viva-mapa">
          {telas.filter((t) => t.n > 1).map((t) => (
            <button key={t.n} type="button" onClick={() => v.irPara(t.n)}><span className="viva-mapa-ic">{t.icone}</span><span><b>{t.nome}</b><small>{DESC[t.n]}</small></span></button>
          ))}
        </div>
        <div className="viva-escolha">
          <button type="button" className="viva-modo-card" onClick={() => { v.definirModo("sozinho"); v.irPara(2); }}><b>Vou jogar sozinho</b><span>Com um adulto por perto para ler e ouvir junto. Ganho XP e cumpro missões.</span></button>
          <button type="button" className="viva-modo-card escuro" onClick={() => { v.definirModo("juntos"); v.irPara(2); }}><b>Vamos jogar juntos</b><span>Time Sol contra Time Lua: irmãos, adulto e criança ou a turma toda na TV.</span></button>
        </div>
      </div>
      <div className="viva-capa-3d nd-capa">
        <span className="viva-ao-vivo">● Ao vivo em 3D</span>
        <Trem3D silabas={[]} chave="capa" casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={380} />
        <div className="nd-capa-leg" style={{ minHeight: 60 }}><b>{leg || " "}</b></div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório: o trem das sílabas */
const MISSOES = ["sol", "bola", "macaco", "borboleta", "pão", "abacaxi"].map(P);

export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[`p-${m.p}`]));
  const [mi, setMi] = useState(primeira);
  const [livre, setLivre] = useState<Palavra | null>(null);
  const [k, setK] = useState(0);
  const [erros, setErros] = useState(0);
  const [partiu, setPartiu] = useState(false);
  const [rod, setRod] = useState(0);
  const pal = livre ?? MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[`p-${m.p}`]).length;
  const sil = Array.from({ length: k }, (_, i) => pal.s[i] ?? "?");
  const zerar = () => { setK(0); setErros(0); setPartiu(false); setRod((r) => r + 1); };
  const ir = (i: number) => { setLivre(null); setMi(i); zerar(); };
  const palma = () => { if (partiu || k >= 6) return; const nk = k + 1; setK(nk); if (pal.s[k]) falar(pal.s[k].toLowerCase()); };
  const conferir = () => {
    if (partiu) return;
    if (k === pal.s.length) {
      setPartiu(true);
      falar(`${silabado(pal)}. ${pal.p}: ${nPalmas(pal.s.length)}!`);
      const est = erros === 0 ? 3 : erros === 1 ? 2 : 1;
      if (!livre && !v.e.missoes[`p-${pal.p}`]) { v.missao(`p-${pal.p}`, est); v.acertou("lab", 20, `${pal.p}: ${pal.s.length} pedaço${pal.s.length > 1 ? "s" : ""}! ${"⭐".repeat(est)}`); }
      else v.acertou("silabas", 5, "Piuí! Certinho!");
    } else {
      setErros((e) => e + 1);
      v.errou("lab", k < pal.s.length ? `Faltou vagão! Fale devagar e bata palmas de novo: ${silabado(pal)}.` : `Sobrou vagão! Fale devagar e bata palmas de novo: ${silabado(pal)}.`);
      setK(0);
    }
  };
  const surpresa = () => { setLivre(PALAVRAS[sorteio(0, PALAVRAS.length - 1)]); zerar(); };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: o trem das sílabas</h2>
        <p className="viva-sub">Ouça a palavra, fale devagar e bata uma palma para cada pedaço. Cada palma traz um vagão. Quando estiver certo, aperte <b>Partiu!</b></p>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-bolinhas">
              {MISSOES.map((x, i) => <button key={x.p} type="button" className={`${v.e.missoes[`p-${x.p}`] ? "feita" : ""} ${!livre && i === mi ? "atual" : ""}`} onClick={() => ir(i)} aria-label={`Missão ${i + 1}: ${x.p}`}>{v.e.missoes[`p-${x.p}`] ? "★" : x.e}</button>)}
              <button type="button" className={livre ? "atual" : ""} onClick={surpresa} aria-label="Palavra surpresa">🎲</button>
            </div>
            <div className="bp-palavra">
              <span className="bp-fig" aria-hidden="true">{pal.e}</span>
              <div>
                <b className="bp-nome">{pal.p}</b>
                <div className="viva-row" style={{ gap: 6 }}>
                  <button type="button" className="viva-ouvir" onClick={() => falar(pal.p)}>🔊 ouvir</button>
                  <button type="button" className="viva-ouvir" onClick={() => falar(silabado(pal))}>🐢 bem devagar</button>
                </div>
              </div>
            </div>
            <div className="bp-palmas">
              <button type="button" className="bp-palma" onClick={palma} disabled={partiu} aria-label="Bater palma">👏<small>palma</small></button>
              <div className="bp-contas" aria-live="polite">{k ? "👏".repeat(k) : "bata palmas!"}<small>{k} {k === 1 ? "palma" : "palmas"}</small></div>
            </div>
            <div className="viva-row">
              {partiu
                ? <button type="button" className="viva-btn" onClick={() => (livre ? surpresa() : ir((mi + 1) % MISSOES.length))}>Próxima palavra →</button>
                : <button type="button" className="viva-btn" onClick={conferir} disabled={!k}>Partiu! 🚂</button>}
              <button type="button" className="viva-btn ghost" onClick={() => setK((x) => Math.max(0, x - 1))} disabled={!k || partiu}>Tirar um vagão</button>
              <span className="viva-prog"><small>{feitas === MISSOES.length ? "Todas as missões! ⭐" : `${feitas} de ${MISSOES.length} missões`}</small><i style={{ width: `${(feitas / MISSOES.length) * 100}%` }} /></span>
            </div>
          </div>
        </div>
        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Trem em 3D · uma palma, um vagão</span>
            <Trem3D silabas={sil} placa={`${pal.e} ${pal.p}`} chave={`${pal.p}-${rod}`} partiu={partiu} altura={380} />
          </div>
          <div className="viva-raiox">
            <div><small>PALAVRA</small><b className="mini">{pal.e} {pal.p}</b></div>
            <div><small>PALMAS</small><b>{k}</b></div>
            <div><small>PEDAÇOS</small><b className="mini">{partiu ? pal.s.join("-") : "?"}</b></div>
            <div><small>ERROS</small><b>{erros}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const umaDe = <T,>(l: T[]) => l[sorteio(0, l.length - 1)];
const comecos = (() => {
  const m = new Map<string, Palavra[]>(); PALAVRAS.forEach((x) => { const k = x.s[0]; m.set(k, [...(m.get(k) || []), x]); });
  return [...m.values()].filter((l) => l.length >= 2);
})();
const gerar = {
  silabas: (): RodadaTexto => {
    const x = umaDe(PALAVRAS.filter((p) => p.s.length <= 4));
    return {
      enunciado: <><p className="bp-grande">{x.e}</p><p className="viva-pergunta">{x.p} · quantas palmas? <Ouvir texto={`${x.p}. Quantas palmas?`} /></p></>,
      opcoes: PALMAS.slice(0, 4), certa: PALMAS[x.s.length - 1], explica: `${x.s.join("-")}: ${nPalmas(x.s.length)}.`,
    };
  },
  rima: (): RodadaTexto => {
    const g = umaDe(RIMAS); const [a, b] = embaralhar(g).slice(0, 2).map(P);
    const outros = embaralhar(PALAVRAS.filter((p) => !RIMAS.some((r) => r.includes(p.p) && r.includes(a.p)) && p.p !== a.p)).slice(0, 2);
    const ops = embaralhar([b, ...outros]);
    return {
      enunciado: <><p className="bp-grande">{a.e}</p><p className="viva-pergunta">O que rima com <b>{a.p}</b>? <Ouvir texto={`O que rima com ${a.p}? ${ops.map((o) => o.p).join("? ")}?`} /></p></>,
      opcoes: ops.map(rotulo), certa: rotulo(b), explica: `${a.p} e ${b.p} terminam com o mesmo som: rimam!`,
    };
  },
  comeco: (): RodadaTexto => {
    const l = umaDe(comecos); const [a, b] = embaralhar(l).slice(0, 2);
    const outros = embaralhar(PALAVRAS.filter((p) => p.s[0] !== a.s[0])).slice(0, 2);
    const ops = embaralhar([b, ...outros]);
    return {
      enunciado: <><p className="bp-grande">{a.e}</p><p className="viva-pergunta">Qual começa igual a <b>{a.p}</b>? <Ouvir texto={`Qual começa com o mesmo pedaço de ${a.p}? ${ops.map((o) => o.p).join("? ")}?`} /></p></>,
      opcoes: ops.map(rotulo), certa: rotulo(b), explica: `${a.s[0]}… ${a.p} e ${b.p} começam com o mesmo pedaço: ${a.s[0]}.`,
    };
  },
  tamanho: (): RodadaTexto => {
    const pares: [string, string][] = [["boi", "formiguinha"], ["sol", "borboleta"], ["pé", "helicóptero"], ["mar", "abacaxi"], ["leão", "bicicleta"]];
    let a: Palavra, b: Palavra;
    if (Math.random() < 0.5) { const [x, y] = umaDe(pares); [a, b] = [P(x), P(y)]; }
    else { do { [a, b] = embaralhar(PALAVRAS).slice(0, 2); } while (a.s.length === b.s.length); }
    const ops = embaralhar([a, b]); const maior = a.s.length > b.s.length ? a : b;
    return {
      enunciado: <><p className="bp-grande">{ops[0].e} <small>ou</small> {ops[1].e}</p><p className="viva-pergunta">Qual palavra é mais comprida? <Ouvir texto={`Qual palavra é mais comprida, com mais pedaços: ${ops[0].p} ou ${ops[1].p}?`} /></p></>,
      opcoes: ops.map(rotulo), certa: rotulo(maior), explica: `${maior.p} tem ${maior.s.length} pedaços (${maior.s.join("-")}). O tamanho do bicho ou da coisa não importa: o que conta são as palmas!`,
    };
  },
};
export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos para ouvir</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">Toque em 🔊 e escute antes de responder. Um adulto pode ler as opções junto. No modo juntos, aperte <b>Valendo!</b></p>
      </header>
      <div className="viva-jogos">
        <JogoTexto id="silabas" titulo="Quantas palmas?" sub="Uma palma para cada pedaço." icone="👏" hab="silabas" gerar={gerar.silabas} />
        <JogoTexto id="rima" titulo="O que rima?" sub="O fim soa igual." icone="🎵" hab="rima" gerar={gerar.rima} />
        <JogoTexto id="comeco" titulo="Começa igual" sub="O primeiro pedaço é o mesmo." icone="🔤" hab="comeco" gerar={gerar.comeco} />
        <JogoTexto id="tamanho" titulo="Palavra comprida" sub="Bicho grande, palavra curta?" icone="📏" hab="tamanho" gerar={gerar.tamanho} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. A estação das rimas */
function novaRodada(ant?: string) {
  let g = umaDe(RIMAS), a = P(umaDe(g));
  while (a.p === ant) { g = umaDe(RIMAS); a = P(umaDe(g)); }
  const b = P(umaDe(g.filter((x) => x !== a.p)));
  const outros = embaralhar(PALAVRAS.filter((p) => !g.includes(p.p))).slice(0, 2);
  const pax = embaralhar([b, ...outros]);
  return { a, b, pax, certo: pax.indexOf(b) };
}
export function Estacao() {
  const v = useViva();
  const [r, setR] = useState(() => novaRodada());
  const [rod, setRod] = useState(0);
  const [embarca, setEmbarca] = useState<number | null>(null);
  const [partiu, setPartiu] = useState(false);
  const [errado, setErrado] = useState<{ i: number; n: number } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, seq: 0 });
  const [valendo, setValendo] = useState(false);
  const travado = useRef(false);
  const pergunta = `Qual passageiro rima com ${r.a.p}? ${r.pax.map((x) => x.p).join("? ")}?`;
  const tocar = (i: number) => {
    if (travado.current) return;
    setValendo(false);
    const x = r.pax[i];
    if (i === r.certo) {
      travado.current = true; setEmbarca(i); setMsg({ ok: true, txt: `${r.a.p} e ${x.p}: rima!` }); falar(`${r.a.p}, ${x.p}. Rima!`);
      setPlacar((p) => ({ certas: p.certas + 1, seq: p.seq + 1 })); v.acertou("estacao", 20, placar.seq + 1 >= 3 ? `${placar.seq + 1} seguidas! 🔥` : "Rimou! Pode embarcar!");
      setTimeout(() => setPartiu(true), 900);
      setTimeout(() => { setR((old) => novaRodada(old.a.p)); setRod((k) => k + 1); setEmbarca(null); setPartiu(false); setMsg(null); travado.current = false; }, 3200);
    } else {
      setErrado({ i, n: Date.now() }); setPlacar((p) => ({ ...p, seq: 0 })); setMsg({ ok: false, txt: `${r.a.p} e ${x.p} não rimam. Escute o fim das palavras.` }); falar(`${r.a.p}, ${x.p}. Não rima.`); v.errou("estacao");
    }
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a língua num lugar de verdade</p>
        <h2>Jogo de contexto: a estação das rimas</h2>
        <p className="viva-sub">O trem só leva quem rima com a palavra da locomotiva! Toque no passageiro certo na plataforma.</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● Estação em 3D · toque no passageiro</span>
          <Trem3D silabas={r.a.s} chave={`e${rod}`} partiu={partiu} passageiros={r.pax.map(rotulo)} onToque={tocar} embarca={embarca} errado={errado} altura={400} />
        </div>
        <div className="viva-card">
          <div className="bp-palavra">
            <span className="bp-fig" aria-hidden="true">{r.a.e}</span>
            <div><small className="viva-kick" style={{ color: "#56607a" }}>a locomotiva diz</small><b className="bp-nome">{r.a.p}</b><Ouvir texto={pergunta} /></div>
          </div>
          <div className="viva-opcoes txt peq">
            {r.pax.map((x, i) => <button key={x.p} type="button" onClick={() => tocar(i)}>{rotulo(x)}</button>)}
          </div>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Embarcou!" : "Ih!"}</b> {msg.txt}</p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>embarcaram</small></span>
            <span><b>{placar.seq}</b><small>seguidas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={25} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("estacao", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (25 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. No mundo */
type Situ = { id: string; e: string; titulo: string; texto: React.ReactNode; lido: string; p: string; op: string[]; certa: string; explica: string };
const SITUS: Situ[] = [
  { id: "parlenda", e: "🏺", titulo: "Parlenda", lido: "Hoje é domingo, pede cachimbo. O cachimbo é de barro, bate no jarro.",
    texto: <div className="nd-papel"><b>PARLENDA (da tradição oral)</b><p>Hoje é domingo, pede cachimbo.<br />O cachimbo é de barro, bate no jarro.</p></div>,
    p: "Que palavra rima com BARRO?", op: ["🏺 jarro", "☀️ domingo", "🙏 pede", "🏠 casa"], certa: "🏺 jarro", explica: "Barro e jarro terminam igual: -arro. As parlendas são cheias de rimas, por isso é tão gostoso repetir!" },
  { id: "trava", e: "🐭", titulo: "Trava-língua", lido: "O rato roeu a roupa do rei de Roma.",
    texto: <div className="nd-papel"><b>TRAVA-LÍNGUA (da tradição oral)</b><p>O rato roeu a roupa do rei de Roma.</p></div>,
    p: "Que som se repete no começo das palavras?", op: ["rrr, de rato", "mmm, de mão", "sss, de sapo", "lll, de lua"], certa: "rrr, de rato", explica: "Rato, roeu, roupa, rei, Roma: todas começam com o mesmo som, rrr. Fale bem rápido três vezes!" },
  { id: "lista", e: "🛒", titulo: "Lista do mercado", lido: "Lista do mercado: banana, pão, ovo e chocolate.",
    texto: <div className="nd-papel"><b>LISTA DO MERCADO</b><p>🍌 banana<br />🍞 pão<br />🥚 ovo<br />🍫 chocolate</p></div>,
    p: "Qual item tem 4 pedaços (4 palmas)?", op: ["🍫 chocolate", "🍌 banana", "🍞 pão", "🥚 ovo"], certa: "🍫 chocolate", explica: "CHO-CO-LA-TE: quatro palmas. BA-NA-NA tem três, O-VO tem duas e PÃO tem só uma." },
];
export function NoMundo() {
  const v = useViva();
  const [aba, setAba] = useState(SITUS[0].id);
  const [erros, setErros] = useState<Record<string, number>>({});
  const [resp, setResp] = useState<Record<string, string>>({});
  const s = SITUS.find((x) => x.id === aba)!;
  const est = (id: string) => ((erros[id] ?? 0) === 0 ? 3 : (erros[id] ?? 0) === 1 ? 2 : 1);
  const responder = (o: string) => {
    if (resp[s.id] === s.certa) return;
    setResp((r) => ({ ...r, [s.id]: o }));
    if (o === s.certa) { v.missao(`mundo-${s.id}`, est(s.id)); v.acertou("mundo", est(s.id) * 5, `${s.titulo}: certo! ${"⭐".repeat(est(s.id))}`); }
    else { setErros((e) => ({ ...e, [s.id]: (e[s.id] ?? 0) + 1 })); v.errou("mundo"); }
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: parlenda, trava-língua e lista</h2>
        <p className="viva-sub">Os sons das palavras estão nas brincadeiras de sempre. Ouça, repita e responda. Acertar de primeira vale 3 estrelas.</p>
      </header>
      <div className="viva-seg" role="group" aria-label="Situações" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {SITUS.map((x) => <button key={x.id} type="button" aria-pressed={aba === x.id} onClick={() => setAba(x.id)}>{x.e} {x.titulo}{v.e.missoes[`mundo-${x.id}`] ? " ★" : ""}</button>)}
      </div>
      <div className="viva-lab">
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">{s.e}</span><div><b>{s.titulo}</b><small>para ouvir e repetir</small></div></div>
          {s.texto}
          <Ouvir texto={s.lido} />
        </div>
        <div className="viva-card">
          <p className="viva-missao">{s.p} <Ouvir texto={s.p} /></p>
          <div className="viva-opcoes txt peq">
            {s.op.map((o) => <button key={o} type="button" className={resp[s.id] === o ? (o === s.certa ? "certa" : "errada") : ""} onClick={() => responder(o)}>{o}</button>)}
          </div>
          {resp[s.id] && <p className={`viva-feed ${resp[s.id] === s.certa ? "ok" : "erro"}`}><b>{resp[s.id] === s.certa ? "Certo!" : "Tente de novo."}</b> {resp[s.id] === s.certa ? s.explica : "Ouça de novo, bem devagar."}</p>}
          <div className="viva-tracejado">
            <small>MÃO NA MASSA</small>
            <p style={{ margin: "4px 0 0", fontSize: ".92rem" }}>Na hora do banho ou no carro: um adulto fala uma palavra e a criança diz outra que rima. Depois, batam palmas no nome de cada pessoa da família!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
