"use client";
import { useMemo, useState } from "react";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, type RodadaTexto } from "@/components/viva/Comuns";
import { alternativas, embaralhar, sorteio } from "@/lib/viva";
import Grafico2D, { CORES_CSS, type Barra, type CasoGrafico } from "@/components/viva/Grafico2D";



/* ---------------------------------------------------------------- desenhos 2D */
export function Risquinhos({ n, cor = "#1d2433", alt = 26 }: { n: number; cor?: string; alt?: number }) {
  const feixes = Math.floor(n / 5), resto = n % 5;
  const w = feixes * 40 + resto * 8 + 4;
  return (
    <svg viewBox={`0 0 ${Math.max(w, 10)} ${alt + 4}`} width={Math.max(w, 10)} height={alt + 4} aria-label={`${n} risquinhos`} role="img">
      {Array.from({ length: feixes }, (_, f) => (
        <g key={f} stroke={cor} strokeWidth={2.6} strokeLinecap="round">
          {[0, 1, 2, 3].map((k) => <line key={k} x1={4 + f * 40 + k * 8} y1={3} x2={4 + f * 40 + k * 8} y2={alt + 1} />)}
          <line x1={0 + f * 40} y1={alt - 2} x2={30 + f * 40} y2={6} />
        </g>
      ))}
      {Array.from({ length: resto }, (_, k) => <line key={k} x1={4 + feixes * 40 + k * 8} y1={3} x2={4 + feixes * 40 + k * 8} y2={alt + 1} stroke={cor} strokeWidth={2.6} strokeLinecap="round" />)}
    </svg>
  );
}
export function GraficoSVG({ dados, maxV, passo = 1, larg = 300, alt = 190, valores = false }: { dados: Barra[]; maxV?: number; passo?: number; larg?: number; alt?: number; valores?: boolean }) {
  const M = maxV ?? Math.max(10, Math.ceil(Math.max(...dados.map((d) => d.v)) / passo) * passo);
  const x0 = 30, y0 = alt - 34, h = y0 - 10, bw = (larg - x0 - 10) / dados.length;
  const marcas = Array.from({ length: Math.floor(M / passo) + 1 }, (_, i) => i * passo);
  const mostrar = marcas.length > 12 ? marcas.filter((_, i) => i % 2 === 0) : marcas;
  return (
    <svg viewBox={`0 0 ${larg} ${alt}`} width={larg} height={alt} style={{ maxWidth: "100%" }} aria-label={`Gráfico de barras: ${dados.map((d) => `${d.rot} ${d.v}`).join(", ")}`} role="img">
      <rect x={0} y={0} width={larg} height={alt} rx={10} fill="#fbf6ea" />
      {marcas.map((m) => <line key={m} x1={x0} x2={larg - 8} y1={y0 - (m / M) * h} y2={y0 - (m / M) * h} stroke="#c9d6ee" strokeWidth={1} />)}
      {mostrar.map((m) => <text key={m} x={x0 - 5} y={y0 - (m / M) * h + 4} fontSize={10} textAnchor="end" fill="#56607a" fontWeight={700}>{m}</text>)}
      {dados.map((d, i) => (
        <g key={d.rot}>
          <rect x={x0 + i * bw + bw * 0.2} y={y0 - (d.v / M) * h} width={bw * 0.6} height={(d.v / M) * h} fill={CORES_CSS[i % 5]} stroke="#1d2433" strokeWidth={1.5} />
          {valores && <text x={x0 + i * bw + bw / 2} y={y0 - (d.v / M) * h - 4} fontSize={11} textAnchor="middle" fill="#1d2433" fontWeight={800}>{d.v}</text>}
          <text x={x0 + i * bw + bw / 2} y={y0 + 15} fontSize={10.5} textAnchor="middle" fill="#1d2433" fontWeight={800}>{d.rot}</text>
        </g>
      ))}
      <line x1={x0} x2={x0} y1={6} y2={y0} stroke="#1d2433" strokeWidth={2} />
      <line x1={x0} x2={larg - 8} y1={y0} y2={y0} stroke="#1d2433" strokeWidth={2} />
    </svg>
  );
}

const DESC: Record<number, string> = { 2: "vote e veja o gráfico crescer", 3: "4 jogos relâmpago", 4: "o mural da cantina", 5: "tabelas e gráficos da vida", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoGrafico[]>(() => {
    const d = (a: number, b: number, c: number, e: number): Barra[] => [{ rot: "Banana", e: "🍌", v: a }, { rot: "Manga", e: "🥭", v: b }, { rot: "Uva", e: "🍇", v: c }, { rot: "Melancia", e: "🍉", v: e }];
    const T = "Qual é a sua fruta preferida?";
    return [
      { dados: d(1, 1, 0, 1), titulo: T, legenda: "Cada criança da turma vota na fruta preferida." },
      { dados: d(3, 2, 1, 2), titulo: T, legenda: "Cada voto é um quadradinho na barra…" },
      { dados: d(5, 3, 2, 4), titulo: T, legenda: "…e as barras vão crescendo." },
      { dados: d(8, 5, 3, 6), titulo: T, legenda: "Banana venceu com 8 votos. Uva teve só 3." },
      { dados: d(8, 5, 3, 6), escala: 2, titulo: T, legenda: "Agora cada quadradinho vale 2. Meio quadradinho vale 1!" },
    ];
  }, []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Matemática · 3º ano · Fase 4</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Detetives de Dados</span></h1>
        <p className="viva-formula">perguntar → contar → tabela → gráfico</p>
        <p className="viva-mao">pesquisa, risquinhos, tabelas e gráficos de barras</p>
        <div className="viva-mapa">
          {telas.filter((t) => t.n > 1).map((t) => (
            <button key={t.n} type="button" onClick={() => v.irPara(t.n)}><span className="viva-mapa-ic">{t.icone}</span><span><b>{t.nome}</b><small>{DESC[t.n]}</small></span></button>
          ))}
        </div>
        <div className="viva-escolha">
          <button type="button" className="viva-modo-card" onClick={() => { v.definirModo("sozinho"); v.irPara(2); }}><b>Vou jogar sozinho</b><span>No meu ritmo: ganho XP, cumpro missões e subo de nível. O progresso fica salvo.</span></button>
          <button type="button" className="viva-modo-card escuro" onClick={() => { v.definirModo("juntos"); v.irPara(2); }}><b>Vamos jogar juntos</b><span>Time Sol contra Time Lua: irmãos, adulto e criança ou a turma toda na TV.</span></button>
        </div>
      </div>
      <div className="viva-capa-3d g2-capa">
        <Grafico2D dados={[]} casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={400} />
        <p className="g2-capa-leg" aria-live="polite">{leg || "\u00a0"}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
const PESQUISAS = [
  { id: "fruta", curto: "Fruta preferida", p: "Qual é a sua fruta preferida?", ops: [["🍌", "Banana"], ["🥭", "Manga"], ["🍇", "Uva"], ["🍉", "Melancia"]] },
  { id: "bicho", curto: "Bicho de estimação", p: "Que bicho de estimação você queria ter?", ops: [["🐶", "Cachorro"], ["🐱", "Gato"], ["🐟", "Peixe"], ["🐦", "Pássaro"]] },
  { id: "recreio", curto: "Brincadeira do recreio", p: "Qual é a sua brincadeira preferida no recreio?", ops: [["⚽", "Bola"], ["🪢", "Corda"], ["🏃", "Pega-pega"], ["🙈", "Esconde"]] },
];
type Missao = { id: string; txt: string; dica: string };
const MISSOES: Missao[] = [
  { id: "d1", txt: "Dê 5 votos para a mesma opção e veja os 5 risquinhos virarem um feixe.", dica: "Aperte +1 voto cinco vezes na mesma linha. O quinto risquinho atravessa os outros quatro." },
  { id: "d2", txt: "Faça uma opção ganhar sozinha com 8 votos.", dica: "Uma opção com 8 e todas as outras com menos de 8." },
  { id: "d3", txt: "Faça um empate no primeiro lugar: duas opções com o mesmo número de votos, as duas na frente.", dica: "As duas barras mais altas precisam ter a mesma altura." },
  { id: "d4", txt: "Faça a pesquisa ter 20 votos no total.", dica: "Some os votos de todas as opções: a tabela mostra o total embaixo." },
  { id: "d5", txt: "Troque para 1 quadradinho = 2 votos e deixe uma barra com 7 votos. Quanto vale o meio quadradinho?", dica: "7 = 2 + 2 + 2 + 1: três quadradinhos inteiros e meio quadradinho." },
  { id: "d6", txt: "Deixe a mais votada com 10 votos e a menos votada com 1.", dica: "Ajuste as quatro opções: uma com 10, uma com 1 e as outras no meio." },
];

export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id]));
  const [mi, setMi] = useState(primeira);
  const [dica, setDica] = useState(false);
  const [pi, setPi] = useState(0);
  const [votos, setVotos] = useState([0, 0, 0, 0]);
  const [esc, setEsc] = useState(1);
  const pesq = PESQUISAS[pi];
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;
  const max = Math.max(...votos), min = Math.min(...votos), total = votos.reduce((a, b) => a + b, 0);
  const lim = 10 * esc;
  const votar = (i: number, d: number) => setVotos((l) => l.map((x, j) => (j === i ? Math.max(0, Math.min(lim, x + d)) : x)));
  const trocarEsc = (e: number) => { setEsc(e); if (e === 1) setVotos((l) => l.map((x) => Math.min(10, x))); };
  const dados = pesq.ops.map(([e, r], i) => ({ rot: r, e, v: votos[i] }));
  const ganhadores = pesq.ops.filter((_, i) => votos[i] === max && max > 0).map(([, r]) => r);

  const ok: Record<string, boolean> = {
    d1: votos.some((x) => x >= 5), d2: max === 8 && votos.filter((x) => x === 8).length === 1, d3: max > 0 && votos.filter((x) => x === max).length >= 2,
    d4: total === 20, d5: esc === 2 && votos.includes(7), d6: max === 10 && min === 1,
  };
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (ok[missao.id]) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não. Confira os votos na tabela e no gráfico, ou peça a dica.");
  };

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: faça a pesquisa e veja o gráfico crescer</h2>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-bolinhas">
              {MISSOES.map((x, i) => <button key={x.id} type="button" className={`${v.e.missoes[x.id] ? "feita" : ""} ${i === mi ? "atual" : ""}`} onClick={() => { setMi(i); setDica(false); }} aria-label={`Missão ${i + 1}`}>{v.e.missoes[x.id] ? "★" : i + 1}</button>)}
            </div>
            <p className="viva-missao"><b>Missão {mi + 1}/{MISSOES.length}</b> · {missao.txt} <Ouvir texto={missao.txt} /></p>
            {dica && <p className="viva-dica-box">💡 {missao.dica}</p>}
            <div className="viva-row">
              <button type="button" className="viva-btn" onClick={enviar}>Enviar ✓</button>
              <button type="button" className="viva-btn ghost" onClick={() => setDica(true)} disabled={dica}>Dica</button>
              <span className="viva-prog"><small>{feitas === MISSOES.length ? "Todas as missões cumpridas! ⭐" : `${feitas} de ${MISSOES.length} missões`}</small><i style={{ width: `${(feitas / MISSOES.length) * 100}%` }} /></span>
            </div>
          </div>

          <div className="viva-card">
            <div className="viva-seg" role="group" aria-label="Pesquisa" style={{ flexWrap: "wrap" }}>
              {PESQUISAS.map((x, i) => <button key={x.id} type="button" aria-pressed={pi === i} onClick={() => { setPi(i); setVotos([0, 0, 0, 0]); }}>{x.ops[0][0]} {x.curto}</button>)}
            </div>
            <p className="viva-pedido">🗣️ {pesq.p} <Ouvir texto={pesq.p} /></p>
            <div className="viva-votos">
              {pesq.ops.map(([e, r], i) => (
                <div key={r} className="viva-voto" style={{ ["--c" as string]: CORES_CSS[i] }}>
                  <span className="viva-voto-nome">{e} {r}</span>
                  <span className="viva-voto-risc"><Risquinhos n={votos[i]} /></span>
                  <button type="button" className="viva-btn mini ghost" aria-label={`menos um voto ${r}`} onClick={() => votar(i, -1)}>−</button>
                  <button type="button" className="viva-btn mini" aria-label={`mais um voto ${r}`} onClick={() => votar(i, 1)}>+1 voto</button>
                </div>
              ))}
            </div>
            <table className="viva-tabela">
              <thead><tr><th>{pesq.curto}</th><th>Votos</th></tr></thead>
              <tbody>{pesq.ops.map(([e, r], i) => <tr key={r} className={votos[i] === max && max > 0 ? "top" : ""}><td>{e} {r}</td><td>{votos[i]}</td></tr>)}</tbody>
              <tfoot><tr><td>Total</td><td>{total}</td></tr></tfoot>
            </table>
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <span className="viva-ao-vivo">● Gráfico · cada quadradinho = {esc === 1 ? "1 voto" : "2 votos"}</span>
              <div className="viva-seg" role="group" aria-label="Escala">
                <button type="button" aria-pressed={esc === 1} onClick={() => trocarEsc(1)}>1 quadradinho = 1</button>
                <button type="button" aria-pressed={esc === 2} onClick={() => trocarEsc(2)}>1 quadradinho = 2</button>
              </div>
            </div>
            <Grafico2D dados={dados} escala={esc} titulo={pesq.p} altura={400} />
          </div>
          <div className="viva-raiox">
            <div><small>TOTAL</small><b>{total}</b></div>
            <div><small>MAIS VOTADA</small><b className="mini">{ganhadores.length === 0 ? "—" : ganhadores.length > 1 ? `empate (${max})` : `${ganhadores[0]} (${max})`}</b></div>
            <div><small>MENOS VOTOS</small><b>{min}</b></div>
            <div><small>DIFERENÇA</small><b className="mini">{max - min} {max - min === 1 ? "voto" : "votos"}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const POOL = ["Bola", "Pipa", "Boneca", "Carrinho", "Lego", "Patins", "Bicicleta", "Livro"];
function sortearDados(esc: number): Barra[] {
  const nomes = embaralhar(POOL).slice(0, 4);
  return nomes.map((rot) => ({ rot, v: esc === 1 ? sorteio(1, 10) : sorteio(1, 10) * 2 }));
}
const gerar = {
  ler: (): RodadaTexto => {
    const esc = Math.random() < 0.35 ? 2 : 1, d = sortearDados(esc), alvo = d[sorteio(0, 3)];
    const p = `Quantos votos teve ${alvo.rot}?`;
    return {
      enunciado: <><div className="viva-figs"><GraficoSVG dados={d} passo={esc} maxV={esc === 1 ? 10 : 20} /></div><p className="viva-pergunta">{p} <Ouvir texto={`Brinquedo preferido. ${p}`} /></p></>,
      opcoes: alternativas(alvo.v, [alvo.v + esc, alvo.v - esc, alvo.v + 1].filter((x) => x > 0)).map(String), certa: String(alvo.v),
      explica: `Siga o topo da barra de ${alvo.rot} até a linha do eixo: ${alvo.v}.${esc === 2 ? " Repare que o eixo conta de 2 em 2." : ""}`,
    };
  },
  comparar: (): RodadaTexto => {
    const d = sortearDados(1);
    if (Math.random() < 0.45) {
      while (d.filter((x) => x.v === Math.max(...d.map((y) => y.v))).length > 1) d[sorteio(0, 3)].v = sorteio(1, 10);
      const certa = d.reduce((a, b) => (b.v > a.v ? b : a)).rot;
      return { enunciado: <><div className="viva-figs"><GraficoSVG dados={d} maxV={10} /></div><p className="viva-pergunta">Qual foi o mais votado? <Ouvir texto="Qual foi o brinquedo mais votado?" /></p></>, opcoes: d.map((x) => x.rot), certa, explica: `A barra mais alta é a de ${certa}.` };
    }
    let [a, b] = embaralhar([0, 1, 2, 3]).slice(0, 2); if (d[a].v === d[b].v) d[a].v = d[a].v === 10 ? 9 : d[a].v + 1; if (d[a].v < d[b].v) [a, b] = [b, a];
    const dif = d[a].v - d[b].v; const p = `Quantos votos ${d[a].rot} teve a mais que ${d[b].rot}?`;
    return { enunciado: <><div className="viva-figs"><GraficoSVG dados={d} /></div><p className="viva-pergunta">{p} <Ouvir texto={p} /></p></>, opcoes: alternativas(dif, [d[a].v + d[b].v, dif + 1, d[a].v].filter((x) => x > 0 && x !== dif)).map(String), certa: String(dif), explica: `${d[a].v} − ${d[b].v} = ${dif}. "A mais" é a diferença: subtrair.` };
  },
  riscos: (): RodadaTexto => {
    const n = sorteio(4, 23);
    return { enunciado: <><div className="viva-figs"><Risquinhos n={n} alt={34} /></div><p className="viva-pergunta">Quantos votos estão marcados? <Ouvir texto="Quantos votos estão marcados com risquinhos?" /></p></>, opcoes: alternativas(n, [n + 1, n - 1, n + 5, n - 5].filter((x) => x > 0)).map(String), certa: String(n), explica: `Conte os feixes de 5 em 5 (${Math.floor(n / 5)} ${Math.floor(n / 5) === 1 ? "feixe" : "feixes"} = ${Math.floor(n / 5) * 5}) e some os risquinhos soltos: ${n}.` };
  },
  picto: (): RodadaTexto => {
    const [e, nome, q] = [["🐶", "cachorros", "Quantos"], ["⭐", "estrelas", "Quantas"], ["🍎", "maçãs", "Quantas"], ["⚽", "bolas", "Quantas"]][sorteio(0, 3)];
    const k = [2, 2, 5, 10][sorteio(0, 3)], c = sorteio(2, 6), certa = c * k;
    const p = `Cada ${e} vale ${k}. ${q} ${nome} são?`;
    return { enunciado: <><p className="viva-conta" style={{ fontSize: "2rem", letterSpacing: 4 }}>{e.repeat(c)}</p><p className="viva-legenda-picto">legenda: {e} = {k}</p><p className="viva-pergunta">{p} <Ouvir texto={`Num pictograma, cada figura vale ${k}. Tem ${c} figuras. ${q} ${nome} são?`} /></p></>, opcoes: alternativas(certa, [c, certa + k, c + k, certa - k].filter((x) => x > 0 && x !== certa)).map(String), certa: String(certa), explica: `São ${c} figuras e cada uma vale ${k}: conte de ${k} em ${k} até ${certa}. Esquecer a legenda dá ${c}, que está errado!` };
  },
};

export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos relâmpago</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">Cada jogo sorteia uma rodada nova. No modo juntos, aperte <b>Valendo!</b> e o acerto vale ponto para o time da vez.</p>
      </header>
      <div className="viva-jogos">
        <JogoTexto id="ler" titulo="Ler o gráfico" sub="Do topo da barra até o eixo." icone="📊" hab="ler" gerar={gerar.ler} />
        <JogoTexto id="comparar" titulo="Mais e menos" sub="Quem ganhou? Quantos a mais?" icone="⚖️" hab="comparar" gerar={gerar.comparar} />
        <JogoTexto id="riscos" titulo="Risquinhos" sub="Conte os feixes de 5 em 5." icone="✏️" hab="contagem" gerar={gerar.riscos} />
        <JogoTexto id="picto" titulo="Pictograma" sub="Leia a legenda primeiro!" icone="🐶" hab="escala" gerar={gerar.picto} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. O mural da cantina */
const LANCHES = ["Pastel", "Pão de queijo", "Tapioca", "Bolo", "Cuscuz", "Fruta", "Sanduíche"];
function novaPesquisa(rod: number) {
  const esc = rod % 2 === 1 ? 2 : 1;
  const nomes = embaralhar(LANCHES).slice(0, 4);
  let vs: number[];
  do { vs = nomes.map(() => sorteio(1, esc === 1 ? 10 : 19)); } while (vs.filter((x) => x === Math.max(...vs)).length > 1);
  return { esc, dados: nomes.map((rot, i) => ({ rot, v: vs[i] })) };
}
export function Cantina() {
  const v = useViva();
  const [rod, setRod] = useState(0);
  const [pq, setPq] = useState(() => novaPesquisa(0));
  const [alt, setAlt] = useState([0, 0, 0, 0]);
  const [erradas, setErradas] = useState<number[]>([]);
  const [fase, setFase] = useState<"montar" | "pergunta" | "fim">("montar");
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const lim = 10 * pq.esc;
  const mexer = (i: number, d: number) => { if (fase !== "montar") return; setAlt((l) => l.map((x, j) => (j === i ? Math.max(0, Math.min(lim, x + d)) : x))); setErradas([]); setMsg(null); };
  const mural = () => {
    setValendo(false);
    const err = pq.dados.map((d, i) => (alt[i] !== d.v ? i : -1)).filter((i) => i >= 0);
    setPlacar((p) => ({ certas: p.certas + (err.length ? 0 : 1), tent: p.tent + 1 }));
    if (err.length) { setErradas(err); setMsg({ ok: false, txt: `${err.length === 1 ? "Uma barra está" : `${err.length} barras estão`} diferente${err.length > 1 ? "s" : ""} da tabela (em vermelho). Confira de novo!` }); v.errou("cantina"); return; }
    setMsg({ ok: true, txt: "Gráfico igualzinho à tabela. Foi para o mural!" }); v.acertou("cantina", 25, "Gráfico no mural!"); setFase("pergunta");
  };
  const maior = pq.dados.reduce((a, b) => (b.v > a.v ? b : a)).rot;
  const responder = (r: string) => {
    if (r === maior) { v.acertou("cantina", 10, "Boa decisão de detetive!"); setMsg({ ok: true, txt: `Isso! ${maior} teve mais votos: é o lanche que a cantina deve comprar mais.` }); setFase("fim"); }
    else { v.errou("cantina", `Olhe a barra mais alta do gráfico.`); }
  };
  const nova = () => { const r = rod + 1; setRod(r); setPq(novaPesquisa(r)); setAlt([0, 0, 0, 0]); setErradas([]); setFase("montar"); setMsg(null); };
  const txtPesq = `Os alunos votaram no lanche preferido. Monte o gráfico de barras para o mural da cantina, igual à tabela.${pq.esc === 2 ? " Atenção: neste gráfico cada quadradinho vale 2 votos." : ""}`;
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: o mural da cantina</h2>
        <p className="viva-sub">A cantina da escola fez uma pesquisa para saber que lanche comprar. Transforme a tabela num gráfico e ajude a decidir!</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● Mural · cada quadradinho = {pq.esc === 1 ? "1 voto" : "2 votos"}</span>
          <Grafico2D dados={pq.dados.map((d, i) => ({ rot: d.rot, v: alt[i] }))} escala={pq.esc} erradas={erradas} titulo="Qual é o seu lanche preferido?" altura={400} />
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🥪</span><div><b>Pesquisa da cantina</b><small>{pq.esc === 2 ? "cada quadradinho vale 2 votos" : "cada quadradinho vale 1 voto"}</small></div></div>
          <p className="viva-pedido">📋 {txtPesq} <Ouvir texto={txtPesq} /></p>
          <table className="viva-tabela">
            <thead><tr><th>Lanche</th><th>Votos</th><th>No gráfico</th></tr></thead>
            <tbody>{pq.dados.map((d, i) => (
              <tr key={d.rot} className={erradas.includes(i) ? "erro" : ""}>
                <td><i className="viva-bolinha-cor" style={{ background: CORES_CSS[i] }} /> {d.rot}</td><td><b>{d.v}</b></td>
                <td className="viva-ajuste"><button type="button" aria-label={`menos ${d.rot}`} onClick={() => mexer(i, -1)} disabled={fase !== "montar"}>−</button><output>{alt[i]}</output><button type="button" aria-label={`mais ${d.rot}`} onClick={() => mexer(i, 1)} disabled={fase !== "montar"}>+</button></td>
              </tr>
            ))}</tbody>
          </table>
          {fase === "montar" && <button type="button" className="viva-btn grande" onClick={mural}>Pôr no mural 📌</button>}
          {fase === "pergunta" && (
            <div className="viva-tracejado">
              <small>AGORA DECIDA</small>
              <p style={{ margin: "4px 0 8px", fontWeight: 700 }}>Que lanche a cantina deve comprar mais? <Ouvir texto="Que lanche a cantina deve comprar mais?" /></p>
              <div className="viva-opcoes txt peq">{pq.dados.map((d) => <button key={d.rot} type="button" onClick={() => responder(d.rot)}>{d.rot}</button>)}</div>
            </div>
          )}
          {fase === "fim" && <button type="button" className="viva-btn grande" onClick={nova}>Nova pesquisa</button>}
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Muito bem!" : "Ih!"}</b> {msg.txt} <Ouvir texto={msg.txt} /></p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>gráficos certos</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && fase === "montar" && (valendo
              ? <span><Cronometro segundos={60} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("cantina", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (60 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. No mundo */
type Situ = { id: string; e: string; titulo: string; txt: string; vis: React.ReactNode; op: string[]; certa: string; explica: string };
const SITUS: Situ[] = [
  {
    id: "dupla", e: "🏫", titulo: "Tabela de dupla entrada", txt: "A escola perguntou a brincadeira preferida das duas turmas do 3º ano. Quantas crianças do 3º B preferem bola?",
    vis: <table className="viva-tabela dupla"><thead><tr><th>Brincadeira</th><th>3º A</th><th>3º B</th></tr></thead><tbody><tr><td>🏃 Pega-pega</td><td>8</td><td>5</td></tr><tr><td>⚽ Bola</td><td>6</td><td>9</td></tr><tr><td>🪢 Pular corda</td><td>7</td><td>4</td></tr></tbody></table>,
    op: ["9", "6", "15", "5"], certa: "9", explica: "Ache a linha da Bola e desça pela coluna do 3º B: no cruzamento está o 9.",
  },
  {
    id: "chuva", e: "🌧️", titulo: "Gráfico da chuva", txt: "O jornal mostrou quantos dias choveu em cada mês numa cidade do Nordeste. Quantos dias de chuva maio teve a mais que março?",
    vis: <GraficoSVG dados={[{ rot: "Jan", v: 5 }, { rot: "Fev", v: 6 }, { rot: "Mar", v: 9 }, { rot: "Abr", v: 14 }, { rot: "Mai", v: 17 }, { rot: "Jun", v: 15 }]} maxV={18} passo={2} larg={330} valores />,
    op: ["8", "17", "26", "9"], certa: "8", explica: "Maio teve 17 dias de chuva e março, 9. A diferença é 17 − 9 = 8 dias a mais.",
  },
  {
    id: "precos", e: "🏷️", titulo: "Tabela de preços", txt: "Na cantina tem uma tabela de preços. Quanto custam 1 pastel e 1 suco juntos?",
    vis: <table className="viva-tabela"><thead><tr><th>Lanche</th><th>Preço</th></tr></thead><tbody><tr><td>🥟 Pastel</td><td>R$ 4</td></tr><tr><td>🧃 Suco</td><td>R$ 3</td></tr><tr><td>🧀 Pão de queijo</td><td>R$ 2</td></tr><tr><td>🍰 Bolo</td><td>R$ 3</td></tr></tbody></table>,
    op: ["R$ 7", "R$ 4", "R$ 12", "R$ 1"], certa: "R$ 7", explica: "Pastel custa R$ 4 e suco, R$ 3. Juntos: 4 + 3 = R$ 7.",
  },
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
        <h2>No mundo: tabelas e gráficos de verdade</h2>
        <p className="viva-sub">Eles estão na escola, no jornal e na cantina. Acertar de primeira vale 3 estrelas. Depois faça uma pesquisa de verdade com a família!</p>
      </header>
      <div className="viva-seg" role="group" aria-label="Situações" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {SITUS.map((x) => <button key={x.id} type="button" aria-pressed={aba === x.id} onClick={() => setAba(x.id)}>{x.e} {x.titulo}{v.e.missoes[`mundo-${x.id}`] ? " ★" : ""}</button>)}
      </div>
      <div className="viva-lab">
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">{s.e}</span><div><b>{s.titulo}</b><small>do dia a dia</small></div></div>
          <div className="viva-figs">{s.vis}</div>
        </div>
        <div className="viva-card">
          <p className="viva-missao">{s.txt} <Ouvir texto={s.txt} /></p>
          <div className="viva-opcoes txt">
            {s.op.map((o) => <button key={o} type="button" className={resp[s.id] === o ? (o === s.certa ? "certa" : "errada") : ""} onClick={() => responder(o)}>{o}</button>)}
          </div>
          {resp[s.id] && <p className={`viva-feed ${resp[s.id] === s.certa ? "ok" : "erro"}`}><b>{resp[s.id] === s.certa ? "Certo!" : "Tente de novo."}</b> {resp[s.id] === s.certa ? s.explica : "Leia de novo a pergunta e ache o número certo na tabela ou no gráfico."}</p>}
          <div className="viva-tracejado">
            <small>PESQUISA EM CASA</small>
            <p style={{ margin: "4px 0 0", fontSize: ".92rem" }}>Pergunte para 10 pessoas da família e dos vizinhos: <b>qual é a sua comida preferida?</b> Marque com risquinhos, faça a tabela e desenhe o gráfico no caderno quadriculado.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
