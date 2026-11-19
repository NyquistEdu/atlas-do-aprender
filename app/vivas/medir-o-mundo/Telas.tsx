"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Caixa, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Regua, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import type { CasoBalanca, Objeto, Pesos } from "@/components/viva/Balanca3D";

const Jarra3D = dynamic(() => import("@/components/viva/Jarra3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 300 }}>carregando a jarra 3D…</div> });
const Balanca3D = dynamic(() => import("@/components/viva/Balanca3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando a cena 3D…</div> });

export const fmtG = (g: number) => (g >= 1000 && g % 1000 === 0 ? `${g / 1000} kg` : g > 1000 ? `${Math.floor(g / 1000)} kg e ${g % 1000} g` : `${g} g`);
const massa = (p: Pesos) => p.kg1 * 1000 + p.g500 * 500 + p.g100 * 100;

const DESC: Record<number, string> = { 2: "régua, balança e jarra", 3: "4 jogos relâmpago", 4: "a receita do bolo", 5: "estime antes de medir", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoBalanca[]>(() => [
    { objeto: "melancia", gramas: 3000, pesos: { kg1: 2, g500: 0, g100: 0 }, legenda: "3 kg de um lado, 2 kg do outro: a melancia pesa mais e desce" },
    { objeto: "melancia", gramas: 3000, pesos: { kg1: 3, g500: 0, g100: 0 }, legenda: "3 kg = 3 kg: a balança fica reta, as massas são iguais" },
    { objeto: "arroz", gramas: 1000, pesos: { kg1: 0, g500: 2, g100: 0 }, legenda: "500 g + 500 g = 1 kg: dois meios quilos fazem um quilo" },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Matemática · 3º ano · Fase 3</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Medir o Mundo</span></h1>
        <p className="viva-formula">1 m = 100 cm · 1 kg = 1000 g</p>
        <p className="viva-mao">comprimento, massa e capacidade</p>
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
        <span className="viva-ao-vivo">● Ao vivo em 3D · a balança compara as massas</span>
        <span className="viva-post">⚖️ = ?</span>
        <Balanca3D objeto="melancia" gramas={3000} pesos={{ kg1: 3, g500: 0, g100: 0 }} casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={420} />
        {leg && <span className="viva-legenda">{leg}</span>}
        <small className="viva-girar">arraste para girar</small>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- desenhos */
const OBJ_REGUA = [
  { nome: "o lápis", cm: 13, cor: "#f2b33d" }, { nome: "a borracha", cm: 5, cor: "#e98fb8" },
  { nome: "o giz de cera", cm: 8, cor: "#5fae7b" }, { nome: "a tesoura", cm: 15, cor: "#6f93e0" }, { nome: "o clipe", cm: 3, cor: "#9aa6c4" },
];
export function ReguaSVG({ cm, cor, desloc }: { cm: number; cor: string; desloc: number }) {
  const px = 26, x0 = 40, W = 640;
  const zero = x0 + desloc * px;
  return (
    <svg viewBox={`0 0 ${W} 210`} className="viva-cenario" role="img" aria-label="Objeto em cima da régua">
      <rect width={W} height="210" fill="#f3ead8" />
      {/* objeto */}
      <g>
        <rect x={x0} y="40" width={cm * px} height="34" rx="9" fill={cor} stroke="#1d2433" strokeWidth="2.5" />
        {cm >= 8 && <polygon points={`${x0 + cm * px},40 ${x0 + cm * px + 0},74 ${x0 + cm * px},57`} fill="#1d2433" />}
        <line x1={x0} y1="30" x2={x0} y2="200" stroke="#c4483b" strokeDasharray="4 4" strokeWidth="2" />
        <line x1={x0 + cm * px} y1="30" x2={x0 + cm * px} y2="200" stroke="#2a5db0" strokeDasharray="4 4" strokeWidth="2" />
      </g>
      {/* régua */}
      <g>
        <rect x={zero - 18} y="96" width={18 * px + 36} height="70" rx="6" fill="#fff6c9" stroke="#b9a14a" strokeWidth="2" />
        {Array.from({ length: 181 }, (_, i) => {
          const x = zero + (i / 10) * px, cmCheio = i % 10 === 0, meio = i % 5 === 0;
          return <g key={i}><line x1={x} y1="96" x2={x} y2={96 + (cmCheio ? 26 : meio ? 17 : 10)} stroke="#1d2433" strokeWidth={cmCheio ? 1.6 : 0.8} />{cmCheio && <text x={x} y="138" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1d2433">{i / 10}</text>}</g>;
        })}
        <text x={zero + 9 * px} y="158" textAnchor="middle" fontSize="11" fill="#7a6a2a" fontWeight="700">centímetros</text>
      </g>
    </svg>
  );
}

export function Jarra({ ml, max = 1000, cor = "#7fc3f0", alt = 260, rotulo }: { ml: number; max?: number; cor?: string; alt?: number; rotulo?: string }) {
  const H = 200, top = 30, larg = 150, x = 70;
  const nivel = Math.min(ml, max) / max;
  const transbordou = ml > max;
  return (
    <svg viewBox="0 0 300 260" width="100%" style={{ maxHeight: alt }} role="img" aria-label={`Jarra com ${ml} mililitros`}>
      <rect width="300" height="260" fill="none" />
      <rect x={x} y={top + H * (1 - nivel)} width={larg} height={H * nivel} fill={cor} opacity=".85" />
      {transbordou && <path d={`M ${x + larg} ${top} q 18 10 14 60 q -2 40 18 70`} fill="none" stroke={cor} strokeWidth="9" strokeLinecap="round" />}
      <path d={`M ${x} ${top - 6} V ${top + H} H ${x + larg} V ${top - 6}`} fill="none" stroke="#1d2433" strokeWidth="4" />
      <path d={`M ${x + larg} ${top + 30} q 46 10 40 60 q -4 40 -40 50`} fill="none" stroke="#1d2433" strokeWidth="4" />
      {[250, 500, 750, 1000].filter((m) => m <= max).map((m) => {
        const y = top + H * (1 - m / max);
        return <g key={m}><line x1={x} y1={y} x2={x + 26} y2={y} stroke="#1d2433" strokeWidth="2" /><text x={x - 6} y={y + 4} fontSize="12" textAnchor="end" fontWeight="800" fill="#c7cfe2">{m === 1000 ? "1 L" : `${m} mL`}</text></g>;
      })}
      {rotulo && <text x={x + larg / 2} y={top + H + 24} textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">{rotulo}</text>}
    </svg>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
type Aba = "comprimento" | "massa" | "capacidade";
const OBJ_MASSA: { o: Objeto; nome: string; g: number }[] = [
  { o: "melancia", nome: "a melancia", g: 3000 }, { o: "arroz", nome: "o pacote de arroz", g: 1000 }, { o: "abacaxi", nome: "o abacaxi", g: 1500 },
  { o: "livro", nome: "a pilha de livros", g: 800 }, { o: "abobora", nome: "a abóbora", g: 2500 }, { o: "pacote", nome: "a caixa do correio", g: 600 },
];
type Missao = { id: string; aba: Aba; txt: string; dica: string };
const MISSOES: Missao[] = [
  { id: "d1", aba: "comprimento", txt: "Arraste a régua até o zero ficar bem no começo do lápis.", dica: "O traço vermelho marca o começo do objeto. Mova a régua até o 0 ficar em cima dele." },
  { id: "d2", aba: "comprimento", txt: "Com a régua no zero, meça o objeto e escreva quantos centímetros ele tem.", dica: "Leia o número da régua embaixo do traço azul, onde o objeto termina." },
  { id: "d3", aba: "massa", txt: "Descubra quanto pesa a melancia: coloque pesos até a balança ficar reta.", dica: "Se o lado da melancia está mais baixo, ela pesa mais: coloque mais pesos." },
  { id: "d4", aba: "massa", txt: "Equilibre o pacote de arroz de 1 kg sem usar o peso de 1 kg.", dica: "Quantos pesos de 500 g fazem 1 kg? E de 100 g?" },
  { id: "d5", aba: "capacidade", txt: "Encha a jarra de 1 litro, sem derramar, com copos de 250 mL.", dica: "Conte de 250 em 250: 250, 500, 750…" },
  { id: "d6", aba: "capacidade", txt: "Agora encha a jarra de 1 litro com copos de 200 mL.", dica: "Conte de 200 em 200 até chegar em 1000 mL." },
];

export function Laboratorio() {
  const v = useViva();
  const [mi, setMi] = useState(() => Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id])));
  const [aba, setAba] = useState<Aba>(MISSOES[Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id]))].aba);
  const [dica, setDica] = useState(false);
  // comprimento
  const [obj, setObj] = useState(0);
  const [desloc, setDesloc] = useState(3);
  const [mediu, setMediu] = useState(false);
  // massa
  const [om, setOm] = useState(0);
  const [pesos, setPesos] = useState<Pesos>({ kg1: 0, g500: 0, g100: 0 });
  // capacidade
  const [copo, setCopo] = useState(250);
  const [copos, setCopos] = useState(0);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;
  const o = OBJ_REGUA[obj], m = OBJ_MASSA[om];
  const total = massa(pesos), equilibrou = total === m.g;
  const ml = copos * copo;

  useEffect(() => { setAba(missao.aba); if (missao.id === "d3") { setOm(0); setPesos({ kg1: 0, g500: 0, g100: 0 }); } if (missao.id === "d4") { setOm(1); setPesos({ kg1: 0, g500: 0, g100: 0 }); } if (missao.id === "d5") { setCopo(250); setCopos(0); } if (missao.id === "d6") { setCopo(200); setCopos(0); } if (missao.id === "d1") { setObj(0); setDesloc(3); } }, [mi]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setMediu(false); }, [obj]);

  const ok: Record<string, boolean> = {
    d1: aba === "comprimento" && obj === 0 && desloc === 0,
    d2: mediu,
    d3: aba === "massa" && om === 0 && equilibrou,
    d4: aba === "massa" && om === 1 && equilibrou && pesos.kg1 === 0,
    d5: aba === "capacidade" && copo === 250 && ml === 1000,
    d6: aba === "capacidade" && copo === 200 && ml === 1000,
  };
  // a missão só vale quando a criança aperta "Enviar": pode experimentar à vontade antes
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (ok[missao.id]) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não é isso. Mexa mais um pouco ou peça a dica.");
  };
  useEffect(() => { if (aba === "massa" && equilibrou) v.aviso(`Equilibrou! ${m.nome} tem ${fmtG(m.g)}.`, "ok"); }, [equilibrou]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: régua, balança e jarra</h2>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-bolinhas">
              {MISSOES.map((x, i) => <button key={x.id} type="button" className={`${v.e.missoes[x.id] ? "feita" : ""} ${i === mi ? "atual" : ""}`} onClick={() => { setMi(i); setDica(false); }} aria-label={`Missão ${i + 1}`}>{v.e.missoes[x.id] ? "★" : i + 1}</button>)}
            </div>
            <p className="viva-missao"><b>Missão {mi + 1}/{MISSOES.length}</b> · {missao.txt}</p>
            {dica && <p className="viva-dica-box">💡 {missao.dica}</p>}
            <div className="viva-row">
              <button type="button" className="viva-btn" onClick={enviar}>Enviar ✓</button>
              <button type="button" className="viva-btn ghost" onClick={() => setDica(true)} disabled={dica}>Dica</button>
              <span className="viva-prog"><small>{feitas === MISSOES.length ? "Todas as missões cumpridas! ⭐" : `${feitas} de ${MISSOES.length} missões`}</small><i style={{ width: `${(feitas / MISSOES.length) * 100}%` }} /></span>
            </div>
          </div>

          <div className="viva-card">
            <div className="viva-seg" role="group" aria-label="Medida" style={{ justifySelf: "start" }}>
              {(["comprimento", "massa", "capacidade"] as Aba[]).map((a) => <button key={a} type="button" aria-pressed={aba === a} onClick={() => setAba(a)}>{a === "comprimento" ? "📏 Comprimento" : a === "massa" ? "⚖️ Massa" : "🥛 Capacidade"}</button>)}
            </div>
            {aba === "comprimento" && (
              <>
                <div className="viva-row">{OBJ_REGUA.map((x, i) => <button key={x.nome} type="button" className={`viva-chip ${i === obj ? "on" : ""}`} onClick={() => setObj(i)}>{x.nome.replace(/^o |^a /, "")}</button>)}</div>
                <Regua rotulo="Mover a régua" cor="var(--v-amarelo)" v={desloc} min={-3} max={4} muda={setDesloc} mostra={desloc === 0 ? "no 0" : desloc > 0 ? `${desloc} →` : `← ${-desloc}`} />
                <div className="viva-linhas" key={`${obj}-${desloc}`}>
                  <p>{o.nome[0].toUpperCase() + o.nome.slice(1)} mede <Caixa certo={o.cm} rotulo="centímetros" onCerto={() => { setMediu(true); v.acertou("comprimento", 15, "Medida certa!"); }}
                    dica={desloc !== 0 ? `A régua não está no zero! O começo está no ${-desloc}. Arraste a régua até o 0 ou faça a conta: fim menos começo.` : "Leia o número embaixo do traço azul."} /> cm</p>
                </div>
              </>
            )}
            {aba === "massa" && (
              <>
                <div className="viva-row">{OBJ_MASSA.map((x, i) => <button key={x.nome} type="button" className={`viva-chip ${i === om ? "on" : ""}`} onClick={() => { setOm(i); setPesos({ kg1: 0, g500: 0, g100: 0 }); }}>{x.nome.replace(/^o |^a /, "")}</button>)}</div>
                <Regua rotulo="Pesos de 1 kg" cor="#c9a23a" v={pesos.kg1} min={0} max={5} muda={(n) => setPesos({ ...pesos, kg1: n })} />
                <Regua rotulo="Pesos de 500 g" cor="#9aa6c4" v={pesos.g500} min={0} max={6} muda={(n) => setPesos({ ...pesos, g500: n })} />
                <Regua rotulo="Pesos de 100 g" cor="#c27a4a" v={pesos.g100} min={0} max={9} muda={(n) => setPesos({ ...pesos, g100: n })} />
                <p className="viva-eq" style={{ fontSize: "1.4rem" }}>pesos: <b>{fmtG(total)}</b> {equilibrou ? <span style={{ color: "var(--v-verde)" }}>= {m.nome.replace(/^o |^a /, "")} ✓</span> : <small>{total < m.g ? "· o objeto ainda pesa mais" : "· os pesos passaram"}</small>}</p>
              </>
            )}
            {aba === "capacidade" && (
              <>
                <div className="viva-row">{[100, 200, 250].map((c) => <button key={c} type="button" className={`viva-chip ${c === copo ? "on" : ""}`} onClick={() => { setCopo(c); setCopos(0); }}>copo de {c} mL</button>)}</div>
                <Regua rotulo="Copos" cor="var(--v-azul)" v={copos} min={0} max={12} muda={setCopos} />
                <p className="viva-eq" style={{ fontSize: "1.4rem" }}>{copos} × {copo} mL = <b>{ml} mL</b> {ml === 1000 ? <span style={{ color: "var(--v-verde)" }}>= 1 litro ✓</span> : ml > 1000 ? <small style={{ color: "var(--v-verm)" }}>· derramou!</small> : null}</p>
              </>
            )}
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            {aba === "massa" ? (
              <>
                <span className="viva-ao-vivo">● Balança de pratos em 3D · descubra a massa</span>
                <Balanca3D objeto={m.o} gramas={m.g} pesos={pesos} oculto={!equilibrou} altura={360} />
              </>
            ) : aba === "comprimento" ? (
              <>
                <span className="viva-ao-vivo">● A régua de verdade · 1 tracinho = 1 milímetro</span>
                <ReguaSVG cm={o.cm} cor={o.cor} desloc={desloc} />
                <p className="viva-oculto">Traço vermelho: onde o objeto começa. Traço azul: onde termina.</p>
              </>
            ) : (
              <>
                <span className="viva-ao-vivo">● Jarra de 1 litro em 3D · 1 L = 1000 mL</span>
                <Jarra3D ml={ml} cor={0x7fc3f0} altura={340} />
                <p className="viva-oculto">{ml} mL{ml > 1000 ? " · derramou na mesa!" : ""}</p>
              </>
            )}
          </div>
          <div className="viva-raiox">
            <div><small>QUADRO DAS TROCAS</small><b className="mini">1 real = 100 centavos</b></div>
            <div><small>COMPRIMENTO</small><b className="mini">1 m = 100 cm · 1 km = 1000 m</b></div>
            <div><small>MASSA</small><b className="mini">1 kg = 1000 g</b></div>
            <div><small>CAPACIDADE</small><b className="mini">1 L = 1000 mL</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const UNIDADES: { item: string; e: string; certa: string; tipo: "c" | "m" | "v" }[] = [
  { item: "a altura de uma porta", e: "🚪", certa: "metro (m)", tipo: "c" }, { item: "o comprimento de uma formiga", e: "🐜", certa: "milímetro (mm)", tipo: "c" },
  { item: "a distância entre duas cidades", e: "🛣️", certa: "quilômetro (km)", tipo: "c" }, { item: "o tamanho de um lápis", e: "✏️", certa: "centímetro (cm)", tipo: "c" },
  { item: "a massa de um saco de cimento", e: "🧱", certa: "quilograma (kg)", tipo: "m" }, { item: "a massa de uma folha de papel", e: "📄", certa: "grama (g)", tipo: "m" },
  { item: "a água de uma piscina", e: "🏊", certa: "litro (L)", tipo: "v" }, { item: "o remédio numa colher", e: "🥄", certa: "mililitro (mL)", tipo: "v" },
];
const OPC: Record<string, string[]> = { c: ["milímetro (mm)", "centímetro (cm)", "metro (m)", "quilômetro (km)"], m: ["grama (g)", "quilograma (kg)", "litro (L)"], v: ["mililitro (mL)", "litro (L)", "quilograma (kg)"] };
const INSTR = [
  ["o comprimento de um lápis", "Régua"], ["a altura de uma criança", "Fita métrica"], ["a massa de um saco de arroz", "Balança"],
  ["o leite de uma receita", "Copo medidor"], ["a febre de uma pessoa", "Termômetro"], ["a largura da sala", "Fita métrica"], ["a massa de uma melancia", "Balança"],
];
const gerar = {
  unidade: (): RodadaTexto => { const u = UNIDADES[sorteio(0, UNIDADES.length - 1)]; return { enunciado: <><p className="viva-conta" style={{ fontSize: "2.8rem" }}>{u.e}</p><p className="viva-pergunta">Que unidade usar para medir {u.item}?</p></>, opcoes: OPC[u.tipo], certa: u.certa, explica: `Para ${u.item}, o melhor é o ${u.certa}.` }; },
  converte: (): RodadaTexto => {
    const t = sorteio(0, 5);
    const casos: [string, number, string, number[]][] = [
      [`${sorteio(2, 9)} m`, 0, "cm", []], [`${sorteio(2, 9)} kg`, 0, "g", []], [`${sorteio(2, 9)} L`, 0, "mL", []],
      ["meio quilo", 500, "g", [50, 5000, 250]], ["meio metro", 50, "cm", [500, 5, 25]], [`1 m e ${sorteio(1, 9) * 10} cm`, 0, "cm", []],
    ];
    const [txt, fixo, un, dist] = casos[t];
    let certa = fixo;
    if (!fixo) { if (txt.startsWith("1 m e")) certa = 100 + Number(txt.match(/e (\d+)/)![1]); else { const n = Number(txt.split(" ")[0]); certa = n * (un === "cm" ? 100 : 1000); } }
    const op = embaralhar([...new Set([certa, ...(dist.length ? dist : [certa / 10, certa * 10, certa + (un === "cm" ? 10 : 100)])])].slice(0, 4)).map((x) => `${x} ${un}`);
    return { enunciado: <><p className="viva-conta">{txt} = <b className="viva-q">?</b> {un}</p></>, opcoes: op, certa: `${certa} ${un}`, explica: un === "cm" ? `1 metro tem 100 centímetros, como 1 real tem 100 centavos. ${txt} = ${certa} cm.` : `1 ${un === "g" ? "quilo tem 1000 gramas" : "litro tem 1000 mililitros"}. ${txt} = ${certa} ${un}.` };
  },
  compara: (): RodadaTexto => {
    const pares: [string, number, string, number, string][] = [
      ["800 g", 800, "1 kg", 1000, "massa"], ["1000 mL", 1000, "1 L", 1000, "capacidade"], ["150 cm", 150, "1 m", 100, "comprimento"],
      ["2 kg", 2000, "1500 g", 1500, "massa"], ["500 mL", 500, "meio litro", 500, "capacidade"], ["90 cm", 90, "1 m", 100, "comprimento"], ["3 L", 3000, "2500 mL", 2500, "capacidade"],
    ];
    const [a, va, b, vb] = pares[sorteio(0, pares.length - 1)];
    const certa = va === vb ? "São iguais" : va > vb ? a : b;
    return { enunciado: <><p className="viva-conta" style={{ fontSize: "1.9rem" }}>{a} <span style={{ color: "#9aa6c4" }}>ou</span> {b}</p><p className="viva-pergunta">Qual é maior?</p></>, opcoes: [a, b, "São iguais"], certa, explica: `Passe tudo para a mesma unidade: ${a} e ${b}. ${certa === "São iguais" ? "São a mesma quantidade!" : `${certa} é maior.`}` };
  },
  instrumento: (): RodadaTexto => { const [it, c] = INSTR[sorteio(0, INSTR.length - 1)]; return { enunciado: <><p className="viva-conta" style={{ fontSize: "2.6rem" }}>🧰</p><p className="viva-pergunta">O que usar para medir {it}?</p></>, opcoes: ["Régua", "Fita métrica", "Balança", "Copo medidor", "Termômetro"], certa: c, explica: `Para ${it}, use ${c.toLowerCase()}.` }; },
};

export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos relâmpago</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">A cada acerto vem uma rodada nova. No modo juntos, aperte <b>Valendo!</b> e o acerto vale ponto para o time da vez.</p>
      </header>
      <div className="viva-jogos">
        <JogoTexto id="unidade" titulo="Qual unidade?" sub="Cada coisa com a sua medida." icone="📐" hab="unidades" gerar={gerar.unidade} />
        <JogoTexto id="converte" titulo="Troca rápida" sub="Como o real e os centavos." icone="🔁" hab="conversoes" gerar={gerar.converte} />
        <JogoTexto id="compara" titulo="Qual é maior?" sub="Mesma unidade antes de comparar." icone="⚖️" hab="comparar" gerar={gerar.compara} />
        <JogoTexto id="instrumento" titulo="Qual instrumento?" sub="A ferramenta certa para medir." icone="🧰" hab="instrumentos" gerar={gerar.instrumento} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Receita do bolo */
const BOLOS = ["Bolo de cenoura", "Bolo de fubá", "Bolo de chocolate", "Bolo de laranja", "Bolo de milho"];
function novaReceita() { return { nome: BOLOS[sorteio(0, BOLOS.length - 1)], leite: sorteio(3, 10) * 50, farinha: sorteio(2, 8) * 50 }; }

export function Receita() {
  const v = useViva();
  const [r, setR] = useState(novaReceita);
  const [leite, setLeite] = useState(0);
  const [far, setFar] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const L = leite * 50, F = far * 50;
  const misturar = () => {
    setValendo(false);
    const okL = L === r.leite, okF = F === r.farinha;
    setPlacar((p) => ({ certas: p.certas + (okL && okF ? 1 : 0), tent: p.tent + 1 }));
    if (okL && okF) { setMsg({ ok: true, txt: `${r.nome} no forno! ${r.leite} mL de leite e ${r.farinha} g de farinha, certinho.` }); v.acertou("receita", 25, "Bolo perfeito!"); return; }
    const p: string[] = [];
    if (!okL) p.push(L < r.leite ? `faltaram ${r.leite - L} mL de leite` : `passou ${L - r.leite} mL de leite`);
    if (!okF) p.push(F < r.farinha ? `faltaram ${r.farinha - F} g de farinha` : `passou ${F - r.farinha} g de farinha`);
    setMsg({ ok: false, txt: `O bolo solou: ${p.join(" e ")}.` });
    v.errou("receita");
  };
  const nova = () => { setR(novaReceita()); setLeite(0); setFar(0); setMsg(null); setRod((x) => x + 1); };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: a receita do bolo</h2>
        <p className="viva-sub">A vovó deixou a receita. Meça o leite na jarra e a farinha na balança da cozinha. Errou a medida? O bolo sola!</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <div className="viva-cozinha">
            <div className="viva-receita-card">
              <p className="viva-mao escuro" style={{ fontSize: "1.6rem" }}>{r.nome}</p>
              <ul><li>🥛 <b>{r.leite} mL</b> de leite</li><li>🌾 <b>{r.farinha} g</b> de farinha</li><li>🥚 3 ovos</li><li>🧈 1 colher de manteiga</li></ul>
              <small>receita da vovó</small>
            </div>
            <div className="viva-jarra-box"><Jarra3D ml={L} altura={230} /><small>leite: <b>{L} mL</b></small></div>
            <div className="viva-balanca-dig">
              <div className="viva-tigela">{far > 0 ? "🌾".repeat(Math.min(6, Math.ceil(far / 2))) : "🥣"}</div>
              <div className="viva-visor">{F} g</div>
              <small>balança da cozinha</small>
            </div>
          </div>
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🎂</span><div><b>Mãos à obra</b><small>Cada toque põe 50 mL de leite ou 50 g de farinha.</small></div></div>
          <Regua rotulo="Leite" cor="#7fc3f0" v={leite} min={0} max={14} muda={(n) => { setLeite(n); setMsg(null); }} mostra={`${L} mL`} />
          <Regua rotulo="Farinha" cor="#d9b26a" v={far} min={0} max={12} muda={(n) => { setFar(n); setMsg(null); }} mostra={`${F} g`} />
          <button type="button" className="viva-btn grande" onClick={msg?.ok ? nova : misturar}>{msg?.ok ? "Outra receita" : "Misturar e assar! 🔥"}</button>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Que cheiro bom!" : "Ih!"}</b> {msg.txt}</p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>bolos perfeitos</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={45} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("receita", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (45 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. Estime antes de medir */
const ESTIMATIVAS = [
  { id: "porta", e: "🚪", p: "Qual é a altura de uma porta de casa?", real: 21, min: 5, max: 40, fmt: (n: number) => `${n * 10} cm`, extra: "Uma porta tem uns 2 metros e 10 centímetros: mais alta que um adulto." },
  { id: "garrafao", e: "🚰", p: "Quanta água cabe no garrafão do bebedouro?", real: 20, min: 1, max: 40, fmt: (n: number) => `${n} L`, extra: "O garrafão de bebedouro tem 20 litros: 80 copos de 250 mL!" },
  { id: "arroz", e: "🍚", p: "Quanto pesa o saco de arroz grande do mercado?", real: 5, min: 1, max: 20, fmt: (n: number) => `${n} kg`, extra: "O saco grande costuma ter 5 kg, ou 5000 gramas." },
  { id: "crianca", e: "🧒", p: "Qual é a altura de uma criança de 8 anos, mais ou menos?", real: 13, min: 6, max: 20, fmt: (n: number) => `${n * 10} cm`, extra: "Uma criança de 8 anos mede, em geral, perto de 1 metro e 30. Cada criança cresce no seu ritmo!" },
];
function Estimar({ x }: { x: (typeof ESTIMATIVAS)[number] }) {
  const v = useViva();
  const [n, setN] = useState(x.min);
  const [ok, setOk] = useState<number | null>(null);
  return (
    <div className="viva-card">
      <div className="viva-jogo-topo"><span className="viva-jogo-ic">{x.e}</span><div><b>{x.p}</b><small>Arraste o seu palpite e confira.</small></div></div>
      <Regua rotulo="Palpite" cor="var(--v-rosa)" v={n} min={x.min} max={x.max} muda={(k) => { setN(k); setOk(null); }} mostra={x.fmt(n)} />
      {ok === null ? <button type="button" className="viva-btn" onClick={() => {
        const erro = Math.abs(n - x.real) / x.real; const est = erro <= 0.1 ? 3 : erro <= 0.25 ? 2 : 1;
        setOk(est); v.missao(`est-${x.id}`, est);
        if (est >= 2) v.acertou("estimar", est * 5, est === 3 ? "Palpite de craque!" : "Chegou perto!"); else v.errou("estimar");
      }}>Conferir</button> : (
        <p className={`viva-feed ${ok >= 2 ? "ok" : "erro"}`}><b>{"⭐".repeat(ok)} Medida real: {x.fmt(x.real)}.</b> {x.extra}</p>
      )}
    </div>
  );
}
export function Estime() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: estime antes de medir</h2>
        <p className="viva-sub">Quem mede muito aprende a adivinhar bem. Dê o seu palpite e veja a medida de verdade: perto de até 10% vale 3 estrelas. Depois, meça em casa com a fita métrica, a balança e o copo medidor!</p>
      </header>
      <div className="viva-jogos">{ESTIMATIVAS.map((x) => <Estimar key={x.id} x={x} />)}</div>
    </div>
  );
}
