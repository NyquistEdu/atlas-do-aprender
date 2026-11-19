"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, Regua, type RodadaTexto } from "@/components/viva/Comuns";
import { alternativas, embaralhar, sorteio } from "@/lib/viva";
import type { CasoFracao, Forma } from "@/components/viva/Fracoes3D";

const Fracoes3D = dynamic(() => import("@/components/viva/Fracoes3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando a cena 3D…</div> });

/* ---------------------------------------------------------------- nomes das frações */
const CARD = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
const ORD = ["", "inteiro", "meio", "terço", "quarto", "quinto", "sexto", "sétimo", "oitavo", "nono", "décimo"];
export function nomeFracao(k: number, n: number) {
  if (k === 0) return n === 1 ? "nada" : `zero ${ORD[n]}s`;
  if (n === 1) return k === 1 ? "um inteiro" : `${CARD[k]} inteiros`;
  if (k === n) return `${CARD[k]} ${ORD[n]}s, o inteiro`;
  if (n === 2 && k === 1) return "um meio, a metade";
  return `${CARD[k]} ${ORD[n]}${k > 1 ? "s" : ""}`;
}
export function Frac({ a, b, grande = false }: { a: number | string; b: number | string; grande?: boolean }) {
  return <span className={`viva-frac ${grande ? "grande" : ""}`} aria-label={`${a} sobre ${b}`}><b>{a}</b><b>{b}</b></span>;
}

/* ---------------------------------------------------------------- desenhos 2D */
const COR = "#f2b33d";
export function PizzaSVG({ n, k, partes, tam = 110, cor = COR }: { n: number; k: number; partes?: number[]; tam?: number; cor?: string }) {
  const r = 46, c = 50;
  const fr = partes ?? Array.from({ length: n }, () => 1 / n);
  let ac = 0;
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} aria-hidden="true">
      <circle cx={c} cy={c} r={r + 2} fill="#d49048" />
      {fr.map((f, i) => {
        const a0 = ac * 2 * Math.PI - Math.PI / 2, a1 = (ac + f) * 2 * Math.PI - Math.PI / 2; ac += f;
        const fill = i < k ? cor : "#fbf6ea";
        if (n === 1) return <circle key={i} cx={c} cy={c} r={r} fill={fill} stroke="#1d2433" strokeWidth={2} />;
        const g = f > 0.5 ? 1 : 0;
        const d = `M${c},${c} L${c + r * Math.cos(a0)},${c + r * Math.sin(a0)} A${r},${r} 0 ${g} 1 ${c + r * Math.cos(a1)},${c + r * Math.sin(a1)} Z`;
        return <path key={i} d={d} fill={fill} stroke="#1d2433" strokeWidth={2} strokeLinejoin="round" />;
      })}
    </svg>
  );
}
export function BarraSVG({ n, k, partes, larg = 220, alt = 56, cor = COR }: { n: number; k: number; partes?: number[]; larg?: number; alt?: number; cor?: string }) {
  const fr = partes ?? Array.from({ length: n }, () => 1 / n);
  let ac = 0;
  return (
    <svg viewBox={`0 0 ${larg} ${alt}`} width={larg} height={alt} aria-hidden="true" style={{ maxWidth: "100%" }}>
      {fr.map((f, i) => { const x = 2 + ac * (larg - 4), w = f * (larg - 4); ac += f; return <rect key={i} x={x} y={2} width={w} height={alt - 4} fill={i < k ? cor : "#fbf6ea"} stroke="#1d2433" strokeWidth={2} />; })}
    </svg>
  );
}

const DESC: Record<number, string> = { 2: "corte, pegue e compare", 3: "4 jogos relâmpago", 4: "a pizzaria em 3D", 5: "meia dúzia, meia hora…", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoFracao[]>(() => [
    { n: 1, k: 0, legenda: "Uma pizza inteira, ainda sem cortar" },
    { n: 2, k: 1, legenda: "2 partes iguais: cada uma é a metade, 1/2" },
    { n: 2, k: 1, desiguais: [0.7, 0.3], legenda: "Cortou torto? Partes diferentes não são metades!" },
    { n: 4, k: 1, legenda: "4 partes iguais: cada uma é um quarto, 1/4" },
    { n: 3, k: 2, legenda: "Peguei 2 de 3 partes iguais: dois terços, 2/3" },
    { n: 8, k: 4, legenda: "4/8 é o mesmo tanto que a metade!" },
    { n: 5, k: 2, forma: "chocolate", legenda: "Chocolate em 5 partes iguais: peguei 2/5" },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Matemática · 3º ano · Fase 5</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Pedaço por Pedaço</span></h1>
        <p className="viva-formula">partes iguais = fração</p>
        <p className="viva-mao">metade, terço, quarto e as frações do dia a dia</p>
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
      <div className="viva-capa-3d">
        <span className="viva-ao-vivo">● Ao vivo em 3D · a pizza vira fração</span>
        <span className="viva-post">1/2 · 1/3 · 1/4</span>
        <Fracoes3D n={1} k={0} casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={420} />
        {leg && <span className="viva-legenda">{leg}</span>}
        <small className="viva-girar">arraste para girar</small>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
type Missao = { id: string; txt: string; dica: string };
const MISSOES: Missao[] = [
  { id: "f1", txt: "Mostre a metade da pizza.", dica: "Metade é cortar em 2 partes iguais e pegar 1." },
  { id: "f2", txt: "Corte o chocolate em 4 partes iguais e pegue um quarto.", dica: "Troque para 🍫 Chocolate, ponha 4 partes e 1 pedaço no prato." },
  { id: "f3", txt: "Mostre dois terços: 2/3.", dica: "O número de baixo diz em quantas partes cortar (3). O de cima, quantas pegar (2)." },
  { id: "f4", txt: "Corte em 5 partes e coloque todos os pedaços no prato. Que fração é a pizza inteira?", dica: "5 partes, 5 pedaços no prato: 5/5 é o inteiro." },
  { id: "f5", txt: "Mostre um décimo: 1/10. Ele é maior ou menor que 1/2?", dica: "10 partes iguais e 1 pedaço. Quanto mais partes, menor cada uma!" },
  { id: "f6", txt: "Mostre a metade de outro jeito, sem cortar em 2 partes.", dica: "Corte em 4, 6, 8 ou 10 partes e pegue a metade delas. 2/4 é a metade!" },
];

export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id]));
  const [mi, setMi] = useState(primeira);
  const [dica, setDica] = useState(false);
  const [forma, setForma] = useState<Forma>("pizza");
  const [n, setN] = useState(1);
  const [k, setK] = useState(0);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;
  const mudaN = (x: number) => { setN(x); setK((kk) => Math.min(kk, x)); };

  const ok: Record<string, boolean> = {
    f1: forma === "pizza" && n === 2 && k === 1, f2: forma === "chocolate" && n === 4 && k === 1, f3: n === 3 && k === 2,
    f4: n === 5 && k === 5, f5: n === 10 && k === 1, f6: n > 2 && n % 2 === 0 && k * 2 === n,
  };
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (ok[missao.id]) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não. Confira em quantas partes iguais cortou e quantos pedaços estão no prato, ou peça a dica.");
  };

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: corte, pegue e veja a fração</h2>
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
            <div className="viva-seg" role="group" aria-label="O que cortar" style={{ justifySelf: "start" }}>
              <button type="button" aria-pressed={forma === "pizza"} onClick={() => setForma("pizza")}>🍕 Pizza</button>
              <button type="button" aria-pressed={forma === "chocolate"} onClick={() => setForma("chocolate")}>🍫 Chocolate</button>
            </div>
            <Regua rotulo="Partes iguais" cor="#c4483b" v={n} min={1} max={10} muda={mudaN} mostra={`${n}`} />
            <Regua rotulo="No prato" cor="#f2b33d" v={k} min={0} max={n} muda={setK} mostra={`${k}`} />
            <div className="viva-frac-linha">
              <Frac a={k} b={n} grande />
              <div>
                <p><b>{nomeFracao(Math.max(k, 0), n)}</b> <Ouvir texto={`${nomeFracao(k, n)}. Cortei em ${n} ${n === 1 ? "parte" : "partes iguais"} e peguei ${k}.`} /></p>
                <small>de cima: quantos peguei ({k}) · de baixo: em quantas partes iguais cortei ({n})</small>
              </div>
            </div>
            <BarraSVG n={n} k={k} larg={360} alt={40} />
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Em 3D · os pedaços pegos vão para o prato</span>
            <Fracoes3D n={n} k={k} forma={forma} altura={400} />
          </div>
          <div className="viva-raiox">
            <div><small>PARTES</small><b>{n}</b></div>
            <div><small>NO PRATO</small><b>{k}</b></div>
            <div><small>FICOU NA TÁBUA</small><b>{n - k}/{n}</b></div>
            <div><small>CADA PEDAÇO</small><b>1/{n}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const fs = (a: number, b: number) => `${a}/${b}`;
function opcoesTxt(certa: string, outras: string[], total = 4) {
  const l = [certa]; for (const o of outras) if (!l.includes(o) && l.length < total) l.push(o);
  return embaralhar(l);
}
const DESIGUAIS = [[0.5, 0.3, 0.2], [0.7, 0.3], [0.4, 0.35, 0.25], [0.3, 0.2, 0.25, 0.25], [0.15, 0.35, 0.5]];
const gerar = {
  qual: (): RodadaTexto => {
    const n = sorteio(2, 8), k = sorteio(1, n - 1), piz = Math.random() < 0.55;
    const certa = fs(k, n);
    return {
      enunciado: <><div className="viva-figs">{piz ? <PizzaSVG n={n} k={k} /> : <BarraSVG n={n} k={k} />}</div><p className="viva-pergunta">Que fração está pintada? <Ouvir texto="Que fração está pintada?" /></p></>,
      opcoes: opcoesTxt(certa, [fs(n - k, n), fs(n, k), fs(k, n + 1), fs(k + 1, n)]), certa,
      explica: `São ${n} partes iguais (o número de baixo) e ${k} ${k === 1 ? "está pintada" : "estão pintadas"} (o número de cima): ${certa}.`,
    };
  },
  iguais: (): RodadaTexto => {
    const igual = Math.random() < 0.5, piz = Math.random() < 0.5;
    const des = DESIGUAIS[sorteio(0, DESIGUAIS.length - 1)];
    const n = igual ? sorteio(2, 6) : des.length;
    const fig = piz ? <PizzaSVG n={n} k={0} partes={igual ? undefined : des} /> : <BarraSVG n={n} k={0} partes={igual ? undefined : des} />;
    const certa = igual ? "Sim, são iguais" : "Não, são diferentes";
    return {
      enunciado: <><div className="viva-figs">{fig}</div><p className="viva-pergunta">Foi dividido em partes iguais? <Ouvir texto="Foi dividido em partes iguais?" /></p></>,
      opcoes: ["Sim, são iguais", "Não, são diferentes"], certa,
      explica: igual ? `As ${n} partes têm o mesmo tamanho: cada uma é 1/${n}.` : "Tem pedaço maior e pedaço menor. Para ser fração, as partes precisam ser iguais.",
    };
  },
  maior: (): RodadaTexto => {
    const a = sorteio(2, 10); let b = sorteio(2, 10); if (b === a) b = a === 10 ? 3 : a + 1;
    const [x, y] = embaralhar([a, b]);
    const certa = fs(1, Math.min(x, y));
    return {
      enunciado: <><div className="viva-figs dois"><span><PizzaSVG n={x} k={1} tam={92} /><Frac a={1} b={x} /></span><span><PizzaSVG n={y} k={1} tam={92} /><Frac a={1} b={y} /></span></div><p className="viva-pergunta">Qual pedaço é maior? <Ouvir texto={`Qual pedaço é maior: um ${ORD[x]} ou um ${ORD[y]}?`} /></p></>,
      opcoes: [fs(1, x), fs(1, y)], certa,
      explica: `Quanto mais partes, menor cada pedaço. Cortando em ${Math.min(x, y)} o pedaço fica maior do que cortando em ${Math.max(x, y)}.`,
    };
  },
  quantidade: (): RodadaTexto => {
    const d = [2, 2, 3, 4, 5][sorteio(0, 4)], q = sorteio(2, 6), tot = d * q;
    const e = ["🍬", "🧁", "⚽", "🖍️", "🍓"][sorteio(0, 4)];
    const nome = d === 2 ? "a metade" : `1/${d}`;
    const p = `Quanto é ${nome} de ${tot}?`;
    return {
      enunciado: <><div className="viva-grupos" style={{ gridTemplateColumns: `repeat(${Math.min(tot, 10)}, 1.4em)` }}>{Array.from({ length: tot }, (_, i) => <i key={i}>{e}</i>)}</div><p className="viva-pergunta">{p} <Ouvir texto={d === 2 ? `Quanto é a metade de ${tot}?` : `Quanto é um ${ORD[d]} de ${tot}?`} /></p></>,
      opcoes: alternativas(q, [d, q + 1, q * 2, tot - q].filter((x) => x > 0 && x !== q)).map(String), certa: String(q),
      explica: `Para achar ${nome} de ${tot}, reparta em ${d} grupos iguais: cada grupo fica com ${q}.`,
    };
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
        <JogoTexto id="qual" titulo="Que fração é?" sub="Conte as partes e as pintadas." icone="🍕" hab="fracao" gerar={gerar.qual} />
        <JogoTexto id="iguais" titulo="Partes iguais?" sub="Sem partes iguais, não é fração." icone="⚖️" hab="partes" gerar={gerar.iguais} />
        <JogoTexto id="maior" titulo="Qual pedaço é maior?" sub="Mais partes, pedaço menor." icone="🔍" hab="comparar" gerar={gerar.maior} />
        <JogoTexto id="quantidade" titulo="Fração de um tanto" sub="Metade de 12, 1/3 de 15…" icone="🍬" hab="quantidade" gerar={gerar.quantidade} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. A pizzaria */
const PEDIDOS: { txt: string; a: number; b: number }[] = [
  { txt: "meia pizza", a: 1, b: 2 }, { txt: "um quarto de pizza", a: 1, b: 4 }, { txt: "três quartos da pizza", a: 3, b: 4 },
  { txt: "um terço da pizza", a: 1, b: 3 }, { txt: "dois terços da pizza", a: 2, b: 3 }, { txt: "cinco oitavos da pizza", a: 5, b: 8 },
  { txt: "dois quintos da pizza", a: 2, b: 5 }, { txt: "sete décimos da pizza", a: 7, b: 10 }, { txt: "três oitavos da pizza", a: 3, b: 8 },
  { txt: "cinco sextos da pizza", a: 5, b: 6 }, { txt: "um sexto da pizza", a: 1, b: 6 },
];
const CLIENTES = ["Seu Jorge", "Dona Cida", "a mesa 3", "Tia Neném", "o pessoal do futebol", "Vó Zefa", "a Júlia"];
function novoPedido(ant?: string) {
  let p = PEDIDOS[sorteio(0, PEDIDOS.length - 1)];
  while (p.txt === ant) p = PEDIDOS[sorteio(0, PEDIDOS.length - 1)];
  return { ...p, quem: CLIENTES[sorteio(0, CLIENTES.length - 1)] };
}

export function Pizzaria() {
  const v = useViva();
  const [ped, setPed] = useState(() => novoPedido());
  const [n, setN] = useState(1);
  const [k, setK] = useState(0);
  const [servido, setServido] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const fala = `${ped.quem[0].toUpperCase() + ped.quem.slice(1)} pediu ${ped.txt}.`;
  const servir = () => {
    setValendo(false);
    if (k === 0) { setMsg({ ok: false, txt: "A caixa está vazia! Ponha os pedaços do pedido na caixa." }); return; }
    const certo = k * ped.b === ped.a * n;
    setPlacar((p) => ({ certas: p.certas + (certo ? 1 : 0), tent: p.tent + 1 }));
    if (certo) {
      setServido(true);
      const equiv = n !== ped.b;
      setMsg({ ok: true, txt: equiv ? `Você mandou ${k}/${n}, que é o mesmo tanto que ${ped.a}/${ped.b}. Frações equivalentes!` : `${k}/${n}: ${k} ${k === 1 ? "pedaço" : "pedaços"} de uma pizza cortada em ${n} partes iguais.` });
      v.acertou("pizzaria", equiv ? 30 : 25, equiv ? "Pedido certo, e com fração equivalente!" : "Pedido certinho!");
      return;
    }
    const mais = k * ped.b > ped.a * n;
    setMsg({ ok: false, txt: `${k}/${n} é ${mais ? "mais" : "menos"} pizza do que ${ped.a}/${ped.b}. ${n !== ped.b ? `Dica: corte em ${ped.b} partes iguais.` : `Ponha ${ped.a} ${ped.a === 1 ? "pedaço" : "pedaços"} na caixa.`}` });
    v.errou("pizzaria");
  };
  const nova = () => { setServido(false); setPed((p) => novoPedido(p.txt)); setN(1); setK(0); setMsg(null); setRod((x) => x + 1); };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: a Pizzaria Atlas</h2>
        <p className="viva-sub">Os pedidos chegam por fração. Corte a pizza em partes iguais, ponha na caixa os pedaços do pedido e mande entregar.</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● A pizzaria em 3D · a caixa fecha e sai para entrega</span>
          <Fracoes3D n={n} k={k} destino="caixa" servido={servido} altura={390} />
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🛵</span><div><b>Pedido: {ped.txt}</b><small>para {ped.quem}</small></div></div>
          <p className="viva-pedido">🧾 {fala} <Frac a={ped.a} b={ped.b} /> <Ouvir texto={fala} /></p>
          <Regua rotulo="Cortar em" cor="#c4483b" v={n} min={1} max={10} muda={(x) => { if (!servido) { setN(x); setK((kk) => Math.min(kk, x)); setMsg(null); } }} mostra={`${n}`} />
          <Regua rotulo="Na caixa" cor="#f2b33d" v={k} min={0} max={n} muda={(x) => { if (!servido) { setK(x); setMsg(null); } }} mostra={`${k}`} />
          <p className="viva-eq" style={{ fontSize: "1.3rem" }}>na caixa: <Frac a={k} b={n} /></p>
          <button type="button" className="viva-btn grande" onClick={msg?.ok ? nova : servir}>{msg?.ok ? "Próximo pedido" : "Entregar! 🛵"}</button>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Saiu para entrega!" : "Ih!"}</b> {msg.txt}</p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>entregas certas</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={45} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("pizzaria", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (45 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. No mundo */
function Relogio() {
  return (
    <svg viewBox="0 0 100 100" width={120} height={120} aria-hidden="true">
      <circle cx={50} cy={50} r={46} fill="#fff" stroke="#1d2433" strokeWidth={3} />
      <path d="M50,50 L50,6 A44,44 0 0 1 50,94 Z" fill="#bfe7cf" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 2 * Math.PI; return <line key={i} x1={50 + 38 * Math.sin(a)} y1={50 - 38 * Math.cos(a)} x2={50 + 44 * Math.sin(a)} y2={50 - 44 * Math.cos(a)} stroke="#1d2433" strokeWidth={i % 3 ? 1.5 : 3} />; })}
      <line x1={50} y1={50} x2={50} y2={14} stroke="#1d2433" strokeWidth={3} strokeLinecap="round" />
      <line x1={50} y1={50} x2={72} y2={50} stroke="#c4483b" strokeWidth={4} strokeLinecap="round" />
      <circle cx={50} cy={50} r={3} fill="#1d2433" />
    </svg>
  );
}
function Garrafa() {
  return (
    <svg viewBox="0 0 70 130" width={74} height={130} aria-hidden="true">
      <rect x={26} y={2} width={18} height={12} rx={2} fill="#6f93e0" />
      <path d="M24,14 L46,14 L50,30 L60,40 L60,124 Q60,128 56,128 L14,128 Q10,128 10,124 L10,40 L20,30 Z" fill="#e8f3ff" stroke="#1d2433" strokeWidth={2.5} />
      <rect x={12} y={62} width={46} height={64} fill="#a9d3f5" />
      {[1, 2, 3].map((i) => <line key={i} x1={10} y1={40 + i * 22} x2={22} y2={40 + i * 22} stroke="#1d2433" strokeWidth={2} />)}
      <text x={35} y={55} fontSize={9} textAnchor="middle" fill="#c4483b" fontWeight={700}>bebeu</text>
    </svg>
  );
}
type Situ = { id: string; e: string; titulo: string; txt: string; vis: React.ReactNode; op: string[]; certa: string; explica: string };
const SITUS: Situ[] = [
  { id: "hora", e: "⏰", titulo: "Meia hora", txt: "O desenho começa às 3 horas e dura meia hora. O ponteiro grande dá meia volta. Que horas o desenho termina?", vis: <Relogio />, op: ["3 e meia (3h30)", "3h15", "4 horas", "3h50"], certa: "3 e meia (3h30)", explica: "Uma hora tem 60 minutos. Meia hora é a metade: 30 minutos. 3h + 30 min = 3h30." },
  { id: "litro", e: "🧃", titulo: "Um quarto de litro", txt: "A garrafa tinha 1 litro de suco (1000 mL). A mamãe bebeu um quarto. Quantos mL ela bebeu?", vis: <Garrafa />, op: ["250 mL", "500 mL", "400 mL", "750 mL"], certa: "250 mL", explica: "1 litro = 1000 mL. Um quarto é repartir em 4 partes iguais: 1000 ÷ 4 = 250 mL. Sobraram 750 mL." },
  { id: "dinheiro", e: "💵", titulo: "Metade do dinheiro", txt: "Você tinha R$ 20 e gastou a metade na feira. Quanto dinheiro sobrou?", vis: <div className="viva-notas"><span>R$ 10</span><span>R$ 10</span></div>, op: ["R$ 10", "R$ 5", "R$ 2", "R$ 15"], certa: "R$ 10", explica: "Metade é repartir em 2 partes iguais: 20 ÷ 2 = 10. Gastou R$ 10 e sobraram R$ 10." },
];

export function NoMundo() {
  const v = useViva();
  const [aba, setAba] = useState<string>("ovos");
  const [erros, setErros] = useState<Record<string, number>>({});
  const [resp, setResp] = useState<Record<string, string>>({});
  const [ovos, setOvos] = useState<boolean[]>(Array(12).fill(false));
  const pegos = ovos.filter(Boolean).length;
  const est = (id: string) => ((erros[id] ?? 0) === 0 ? 3 : (erros[id] ?? 0) === 1 ? 2 : 1);
  useEffect(() => { setOvos(Array(12).fill(false)); }, []);
  const prontoOvos = () => {
    if (pegos === 6) { v.missao("mundo-ovos", est("ovos")); v.acertou("mundo", est("ovos") * 5, `Meia dúzia! ${"⭐".repeat(est("ovos"))}`); setResp((r) => ({ ...r, ovos: "ok" })); }
    else { setErros((e) => ({ ...e, ovos: (e.ovos ?? 0) + 1 })); v.errou("mundo", `Você pegou ${pegos}. Uma dúzia são 12 ovos; meia dúzia é a metade de 12.`); }
  };
  const responder = (s: Situ, o: string) => {
    if (resp[s.id] === s.certa) return;
    if (o === s.certa) { setResp((r) => ({ ...r, [s.id]: o })); v.missao(`mundo-${s.id}`, est(s.id)); v.acertou("mundo", est(s.id) * 5, `${s.titulo}: certo! ${"⭐".repeat(est(s.id))}`); }
    else { setErros((e) => ({ ...e, [s.id]: (e[s.id] ?? 0) + 1 })); setResp((r) => ({ ...r, [s.id]: o })); v.errou("mundo"); }
  };
  const s = SITUS.find((x) => x.id === aba);
  const ABAS = [{ id: "ovos", e: "🥚", titulo: "Meia dúzia" }, ...SITUS];
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: meia dúzia, meia hora e mais</h2>
        <p className="viva-sub">A fração aparece na cozinha, no relógio e no dinheiro. Acertar de primeira vale 3 estrelas.</p>
      </header>
      <div className="viva-seg" role="group" aria-label="Situações" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {ABAS.map((x) => <button key={x.id} type="button" aria-pressed={aba === x.id} onClick={() => setAba(x.id)}>{x.e} {x.titulo}{v.e.missoes[`mundo-${x.id}`] ? " ★" : ""}</button>)}
      </div>
      {aba === "ovos" ? (
        <div className="viva-lab">
          <div className="viva-card">
            <p className="viva-missao">A receita de bolo pede <b>meia dúzia</b> de ovos. A caixa tem uma dúzia. Toque nos ovos para pegar meia dúzia. <Ouvir texto="A receita de bolo pede meia dúzia de ovos. A caixa tem uma dúzia. Toque nos ovos para pegar meia dúzia." /></p>
            <div className="viva-ovos" role="group" aria-label="Caixa com 12 ovos">
              {ovos.map((o, i) => <button key={i} type="button" className={o ? "pego" : ""} aria-pressed={o} onClick={() => resp.ovos !== "ok" && setOvos((l) => l.map((x, j) => (j === i ? !x : x)))}>🥚</button>)}
            </div>
            <div className="viva-row">
              <p className="viva-eq" style={{ margin: 0 }}>pegou <b>{pegos}</b> de 12 {pegos > 0 && <>· <Frac a={pegos} b={12} /></>}</p>
              {resp.ovos === "ok" ? <p className="viva-feed ok" style={{ flex: 1 }}><b>Isso!</b> Meia dúzia = 6 ovos = 6/12, a metade da caixa.</p> : <button type="button" className="viva-btn" onClick={prontoOvos}>Pronto ✓</button>}
            </div>
          </div>
          <div className="viva-raiox">
            <div><small>1 DÚZIA</small><b>12</b></div>
            <div><small>MEIA DÚZIA</small><b>6</b></div>
            <div><small>1 HORA</small><b className="mini">60 min</b></div>
            <div><small>1 LITRO</small><b className="mini">1000 mL</b></div>
          </div>
        </div>
      ) : s && (
        <div className="viva-lab">
          <div className="viva-card">
            <div className="viva-jogo-topo"><span className="viva-jogo-ic">{s.e}</span><div><b>{s.titulo}</b><small>situação do dia a dia</small></div></div>
            <div className="viva-figs">{s.vis}</div>
            <p className="viva-missao">{s.txt} <Ouvir texto={s.txt} /></p>
          </div>
          <div className="viva-card">
            <div className="viva-opcoes txt">
              {s.op.map((o) => <button key={o} type="button" className={resp[s.id] === o ? (o === s.certa ? "certa" : "errada") : ""} onClick={() => responder(s, o)}>{o}</button>)}
            </div>
            {resp[s.id] && <p className={`viva-feed ${resp[s.id] === s.certa ? "ok" : "erro"}`}><b>{resp[s.id] === s.certa ? "Certo!" : "Tente de novo."}</b> {resp[s.id] === s.certa ? s.explica : "Pense: em quantas partes iguais estou repartindo?"}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
