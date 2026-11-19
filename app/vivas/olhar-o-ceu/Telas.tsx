"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Regua, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import { DIA_LUA, Lua, SolPalito, TerraDN, momento, nomeFase, sombra, type NomeFase } from "./ceu";

const Ceu3D = dynamic(() => import("@/components/viva/Ceu3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando a cena 3D…</div> });

const DESC: Record<number, string> = {
  2: "gire a Terra e mova a Lua", 3: "4 jogos relâmpago", 4: "o relógio de sol do quintal",
  5: "o céu da noite", 6: "5 desafios do chefão", 7: "resumo e pegadinhas",
};

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Ciências · 3º ano · Fase 4</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Olhar o Céu</span></h1>
        <p className="viva-formula">1 volta da Terra <b>=</b> 1 dia</p>
        <p className="viva-mao">o Sol, a Lua, as sombras e as estrelas</p>
        <div className="viva-mapa">
          {telas.filter((t) => t.n > 1).map((t) => (
            <button key={t.n} type="button" onClick={() => v.irPara(t.n)}>
              <span className="viva-mapa-ic">{t.icone}</span><span><b>{t.nome}</b><small>{DESC[t.n]}</small></span>
            </button>
          ))}
        </div>
        <div className="viva-escolha">
          <button type="button" className={`viva-modo-card ${v.modo === "sozinho" && v.e.modo ? "on" : ""}`} onClick={() => { v.definirModo("sozinho"); v.irPara(2); }}>
            <b>Vou jogar sozinho</b><span>No meu ritmo: ganho XP, cumpro missões e subo de nível. O progresso fica salvo.</span>
          </button>
          <button type="button" className={`viva-modo-card escuro ${v.modo === "juntos" ? "on" : ""}`} onClick={() => { v.definirModo("juntos"); v.irPara(2); }}>
            <b>Vamos jogar juntos</b><span>Time Sol contra Time Lua: irmãos, adulto e criança ou a turma toda na TV.</span>
          </button>
        </div>
      </div>
      <div className="viva-capa-3d">
        <span className="viva-ao-vivo">● Ao vivo em 3D · a Terra gira e a Lua dá a volta</span>
        <span className="viva-post">☀️ → 🌍 → 🌙</span>
        <Ceu3D hora={6} fase={0.1} auto altura={420} onTempo={(h, f) => {
          const m = momento(h);
          setLeg(`Na casinha amarela: ${m.e} ${m.nome} · Lua ${nomeFase(f).toLowerCase()}`);
        }} />
        {leg && <span className="viva-legenda">{leg}</span>}
        <small className="viva-girar">fora de escala · arraste para girar</small>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
type Missao = { id: string; txt: string; dica: string; ok: (h: number, d: number) => boolean };
const MISSOES: Missao[] = [
  { id: "c1", txt: "Deixe a casinha amarela no meio-dia, bem de frente para o Sol.", dica: "Meio-dia é 12 horas. A casinha fica no centro do lado iluminado.", ok: (h) => h === 12 },
  { id: "c2", txt: "Agora gire a Terra até a meia-noite na casinha.", dica: "Meia-noite é 0 hora: a casinha fica no meio do lado escuro, de costas para o Sol.", ok: (h) => h === 0 || h === 24 },
  { id: "c3", txt: "Coloque a casinha bem na hora do nascer do Sol.", dica: "O Sol nasce perto das 6 horas: a casinha está chegando no lado iluminado.", ok: (h) => h === 6 },
  { id: "c4", txt: "Mova a Lua até ela ficar cheia.", dica: "A Lua cheia acontece quando ela está do outro lado da Terra, longe do Sol: perto do dia 15.", ok: (_, d) => nomeFase(d / DIA_LUA) === "Cheia" },
  { id: "c5", txt: "Agora faça a Lua Nova, aquela que a gente quase não vê.", dica: "Na Lua Nova, a Lua fica entre a Terra e o Sol: o lado iluminado fica virado para o Sol, não para nós.", ok: (_, d) => nomeFase(d / DIA_LUA) === "Nova" },
  { id: "c6", txt: "Mostre a Lua minguante pela metade (o quarto minguante).", dica: "É uma semana depois da cheia: perto do dia 22.", ok: (_, d) => d >= 21 && d <= 23 },
];

export function Laboratorio() {
  const v = useViva();
  const [h, setH] = useState(9);
  const [d, setD] = useState(4);
  const [prever, setPrever] = useState(false);
  const [palpite, setPalpite] = useState<NomeFase | null>(null);
  const [mi, setMi] = useState(() => Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id])));
  const [dica, setDica] = useState(false);
  const feito = useRef<string | null>(null);
  const f = d / DIA_LUA, nome = nomeFase(f), m = momento(h);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((x) => v.e.missoes[x.id]).length;
  const escondida = prever && palpite !== nome;

  useEffect(() => { setPalpite(null); }, [d]);
  useEffect(() => {
    if (feito.current === missao.id) return;
    if (missao.ok(h, d)) {
      feito.current = missao.id;
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    }
  }, [h, d, missao, mi, dica, v]);

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: gire a Terra e mova a Lua</h2>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-bolinhas">
              {MISSOES.map((x, i) => (
                <button key={x.id} type="button" className={`${v.e.missoes[x.id] ? "feita" : ""} ${i === mi ? "atual" : ""}`} onClick={() => { setMi(i); setDica(false); feito.current = null; }} aria-label={`Missão ${i + 1}`}>{v.e.missoes[x.id] ? "★" : i + 1}</button>
              ))}
            </div>
            <p className="viva-missao"><b>Missão {mi + 1}/{MISSOES.length}</b> · {missao.txt}</p>
            {dica && <p className="viva-dica-box">💡 {missao.dica}</p>}
            <div className="viva-row">
              <button type="button" className="viva-btn ghost" onClick={() => setDica(true)} disabled={dica}>Dica</button>
              <span className="viva-prog"><small>{feitas === MISSOES.length ? "Todas as missões cumpridas! ⭐" : `${feitas} de ${MISSOES.length} missões`}</small><i style={{ width: `${(feitas / MISSOES.length) * 100}%` }} /></span>
            </div>
          </div>
          <div className="viva-card">
            <h3 className="viva-h3">Controles do céu</h3>
            <Regua rotulo="Hora" cor="var(--v-laranja)" v={h} min={0} max={24} muda={setH} mostra={`${h}h`} />
            <Regua rotulo="Dia da Lua" cor="var(--v-azul)" v={d} min={0} max={29} muda={setD} />
            <label className="viva-check"><input type="checkbox" checked={prever} onChange={(e) => { setPrever(e.target.checked); setPalpite(null); }} /> Esconder a Lua: adivinhar a fase antes de ver</label>
          </div>
          <div className="viva-raiox">
            <div><small>NA CASINHA AMARELA</small><b className="mini">{m.e} {m.nome}</b><span className="viva-sub" style={{ color: "#56607a", fontSize: ".85rem" }}>{m.dia ? "A casinha está no lado virado para o Sol." : "A casinha está no lado de costas para o Sol."}</span></div>
            <div><small>A SOMBRA DO PALITO</small><SolPalito h={Math.max(6, Math.min(18, h))} w={220} alto={120} semSombra={!m.dia} /></div>
          </div>
        </div>
        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Sol, Terra e Lua em 3D · fora de escala</span>
            <Ceu3D hora={h} fase={f} altura={340} />
          </div>
          <div className="viva-card viva-lua-card">
            <div><small className="viva-kick" style={{ color: "#56607a" }}>A LUA VISTA DAQUI DO BRASIL</small>
              {escondida ? (
                <>
                  <p className="viva-missao">Que fase é? Olhe onde a Lua está na cena 3D.</p>
                  <div className="viva-opcoes txt">
                    {(["Nova", "Crescente", "Cheia", "Minguante"] as NomeFase[]).map((o) => (
                      <button key={o} type="button" onClick={() => { setPalpite(o); if (o === nome) v.acertou("fases", 15, "Previu certinho!"); else v.errou("fases", `Não é ${o.toLowerCase()}.`); }}>{o}</button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="viva-fase-nome">Lua <b>{nome.toLowerCase()}</b><small>dia {d} do ciclo de 29 dias e meio</small></p>
              )}
            </div>
            {escondida ? <div className="viva-lua-oculta">?</div> : <Lua f={f} r={62} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const FASES: [number, NomeFase][] = [[0, "Nova"], [0.12, "Crescente"], [0.25, "Crescente"], [0.37, "Crescente"], [0.5, "Cheia"], [0.63, "Minguante"], [0.75, "Minguante"], [0.88, "Minguante"]];
const CORPOS: [string, string, string][] = [
  ["☀️", "O Sol", "Estrela"], ["🌙", "A Lua", "Satélite"], ["🌍", "A Terra", "Planeta"], ["🔴", "Marte", "Planeta"],
  ["✨", "Vênus, a “estrela-d’alva”", "Planeta"], ["⭐", "Sírius, a estrela mais brilhante da noite", "Estrela"],
  ["🪐", "Júpiter", "Planeta"], ["✳️", "Acrux, do Cruzeiro do Sul", "Estrela"], ["🛰️", "Um satélite de GPS", "Satélite"], ["🪐", "Saturno", "Planeta"],
];
const EXPL: Record<string, string> = {
  Estrela: "Estrela tem luz própria, como o Sol.", Planeta: "Planeta gira em volta do Sol e não tem luz própria.", Satélite: "Satélite gira em volta de um planeta, como a Lua em volta da Terra.",
};
const gerar = {
  dia: (): RodadaTexto => {
    const ang = [0, 30, 45, 135, 150, 180, 210, 225, 315, 330][sorteio(0, 9)];
    const dia = Math.cos((ang * Math.PI) / 180) < 0;
    return { enunciado: <><TerraDN ang={ang} /><p className="viva-pergunta">Na casinha amarela é dia ou noite?</p></>, opcoes: ["Dia ☀️", "Noite 🌙"], certa: dia ? "Dia ☀️" : "Noite 🌙",
      explica: dia ? "A casinha está no lado virado para o Sol: é dia." : "A casinha está no lado de costas para o Sol: é noite." };
  },
  fase: (): RodadaTexto => {
    const [f, n] = FASES[sorteio(0, FASES.length - 1)];
    return { enunciado: <><Lua f={f} r={46} /><p className="viva-pergunta">Que fase da Lua é esta?</p></>, opcoes: ["Nova", "Crescente", "Cheia", "Minguante"], certa: n,
      explica: n === "Nova" ? "Na Lua Nova, o lado iluminado está de costas para nós: quase não a vemos." : n === "Cheia" ? "Redondinha e toda iluminada: é a Lua Cheia." : n === "Crescente" ? "Aqui no Brasil, a crescente tem o lado iluminado à esquerda, e ela vai crescendo até a cheia." : "Aqui no Brasil, a minguante tem o lado iluminado à direita, e ela vai diminuindo até a nova." };
  },
  sombra: (): RodadaTexto => {
    const h = [7, 8, 9, 12, 15, 16, 17][sorteio(0, 6)];
    const certa = h === 12 ? "Curtinha, quase embaixo" : h < 12 ? "Comprida, para o oeste" : "Comprida, para o leste";
    return { enunciado: <><SolPalito h={h} w={240} alto={124} semSombra /><p className="viva-pergunta">São {h}h. Como fica a sombra do palito?</p></>, opcoes: ["Comprida, para o oeste", "Curtinha, quase embaixo", "Comprida, para o leste"], certa,
      explica: h === 12 ? "Perto do meio-dia o Sol está alto: a sombra fica curtinha." : `A sombra aponta para o lado oposto ao Sol. Às ${h}h o Sol está no ${h < 12 ? "leste" : "oeste"}, então a sombra vai para o ${h < 12 ? "oeste" : "leste"}.` };
  },
  corpo: (): RodadaTexto => {
    const [e, n, c] = CORPOS[sorteio(0, CORPOS.length - 1)];
    return { enunciado: <><p className="viva-conta" style={{ fontSize: "3rem" }}>{e}</p><p className="viva-pergunta">{n} é…</p></>, opcoes: ["Estrela", "Planeta", "Satélite"], certa: c, explica: `${n} é ${c.toLowerCase()}. ${EXPL[c]}` };
  },
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
        <JogoTexto id="dia" titulo="Dia ou noite?" sub="Onde está a casinha?" icone="🌗" hab="dia-noite" gerar={gerar.dia} />
        <JogoTexto id="fase" titulo="Qual é a fase?" sub="A Lua vista daqui do Brasil." icone="🌔" hab="fases" gerar={gerar.fase} />
        <JogoTexto id="sombra" titulo="Para onde vai a sombra?" sub="Olhe onde o Sol está." icone="📏" hab="sombras" gerar={gerar.sombra} />
        <JogoTexto id="corpo" titulo="Estrela, planeta ou satélite?" sub="Quem é quem no céu." icone="🔭" hab="corpos" gerar={gerar.corpo} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Relógio de sol */
const HORAS = [7, 8, 9, 10, 14, 15, 16, 17];
export function RelogioSol() {
  const v = useViva();
  const [alvo, setAlvo] = useState(() => HORAS[sorteio(0, HORAS.length - 1)]);
  const [h, setH] = useState(12);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const W = 720, A = 330;
  const conferir = () => {
    setValendo(false);
    setPlacar((p) => ({ certas: p.certas + (h === alvo ? 1 : 0), tent: p.tent + 1 }));
    if (h === alvo) { setMsg({ ok: true, txt: `Eram ${alvo}h! A ponta da sombra caiu bem na pedra.` }); v.acertou("sombras", 25, "Relógio de sol acertado!"); return; }
    const manhaAlvo = alvo < 12, manha = h < 12;
    let txt: string;
    if (h === 12) txt = "Ao meio-dia a sombra quase some. A pedra está longe do palito: o Sol estava mais baixo.";
    else if (manhaAlvo !== manha) txt = `A sombra está do lado errado. A pedra está no ${manhaAlvo ? "oeste" : "leste"}: a sombra aponta para o lado oposto ao Sol, então o Sol estava no ${manhaAlvo ? "leste" : "oeste"} (${manhaAlvo ? "de manhã" : "à tarde"}).`;
    else if (Math.abs(h - 12) > Math.abs(alvo - 12)) txt = "A sombra passou da pedra: está comprida demais. O Sol estava mais alto, mais perto do meio-dia.";
    else txt = "A sombra não chegou até a pedra: está curta demais. O Sol estava mais baixo, mais longe do meio-dia.";
    setMsg({ ok: false, txt });
    v.errou("sombras");
  };
  const nova = () => { setAlvo((a) => { let n = a; while (n === a) n = HORAS[sorteio(0, HORAS.length - 1)]; return n; }); setH(12); setMsg(null); setRod((x) => x + 1); };
  const s = sombra(h, W / 2, A - 60, 225, 70);
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a ciência num lugar de verdade</p>
        <h2>Jogo de contexto: o relógio de sol do quintal</h2>
        <p className="viva-sub">A Nina fincou um cabo de vassoura no quintal. Quando o bolo saiu do forno, ela pôs uma <b>pedrinha</b> na ponta da sombra. Mexa no Sol e descubra que horas eram.</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro sem-pad">
          <svg viewBox={`0 0 ${W} ${A}`} className="viva-cenario" role="img" aria-label="Quintal com um cabo de vassoura e a sombra">
            <rect width={W} height={A - 60} fill={h > 6 && h < 18 ? "#bfe0ff" : "#1b2340"} />
            {[[110, 60], [420, 40], [600, 80]].map(([x, y], i) => <g key={i} fill="#fff" opacity=".85"><ellipse cx={x} cy={y} rx="40" ry="13" /><ellipse cx={x + 22} cy={y - 8} rx="24" ry="12" /></g>)}
            <path d={`M ${W / 2 - 225} ${A - 60} A 225 225 0 0 1 ${W / 2 + 225} ${A - 60}`} fill="none" stroke="#8fb6e0" strokeDasharray="6 7" />
            {s.visivel && <circle cx={s.sx} cy={s.sy} r="22" fill="#ffc94a" stroke="#f0a92e" strokeWidth="4" />}
            {/* casa e cerca */}
            <rect x="24" y={A - 150} width="120" height="90" fill="#f6d9b4" stroke="#c9a173" strokeWidth="3" />
            <polygon points={`16,${A - 148} 84,${A - 196} 152,${A - 148}`} fill="#c4483b" />
            <rect x="70" y={A - 110} width="28" height="50" fill="#8a5a3b" />
            {Array.from({ length: 14 }, (_, i) => <rect key={i} x={430 + i * 20} y={A - 100} width="12" height="40" fill="#fff" stroke="#d8d2c2" />)}
            <rect y={A - 60} width={W} height="60" fill="#8cc56b" />
            <rect y={A - 60} width={W} height="6" fill="#77b157" />
            <text x="14" y={A - 14} fontSize="16" fontWeight="800" fill="#2c4a1f">OESTE · onde o Sol se põe</text>
            <text x={W - 14} y={A - 14} fontSize="16" fontWeight="800" fill="#2c4a1f" textAnchor="end">LESTE · onde o Sol nasce</text>
            {(() => { const p = sombra(alvo, W / 2, A - 60, 225, 70).ponta; return <g><ellipse cx={p} cy={A - 54} rx="14" ry="7" fill="#7d828c" stroke="#5b6070" /><text x={p} y={A - 32} fontSize="13" fontWeight="800" textAnchor="middle" fill="#1d2433">pedrinha</text></g>; })()}
            {s.visivel && <line x1={W / 2} y1={A - 55} x2={s.ponta} y2={A - 55} stroke="#2a3050" strokeWidth="9" strokeLinecap="round" opacity=".5" />}
            <rect x={W / 2 - 4} y={A - 130} width="8" height="72" rx="3" fill="#8a5a3b" />
            <rect x="12" y="12" width="150" height="36" rx="18" fill="#1d2433" opacity=".85" />
            <text x="87" y="36" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">{h}h no relógio</text>
          </svg>
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🕰️</span><div><b>Relógio de sol</b><small>Mexa a hora até a sombra tocar a pedrinha.</small></div></div>
          <Regua rotulo="Hora" cor="var(--v-laranja)" v={h} min={7} max={17} muda={(n) => { setH(n); setMsg(null); }} mostra={`${h}h`} />
          <button type="button" className="viva-btn grande" onClick={msg?.ok ? nova : conferir}>{msg?.ok ? "Nova pedrinha" : "Era essa hora!"}</button>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Acertou!" : "Ainda não."}</b> {msg.txt}</p>}
          <div className="viva-tracejado">
            <small>DICAS DO CÉU</small>
            <p style={{ margin: "4px 0 0", fontSize: ".92rem" }}>A sombra aponta para o lado <b>oposto</b> ao Sol. Ela é <b>comprida</b> quando o Sol está baixo (cedo ou no fim da tarde) e <b>curtinha</b> perto do meio-dia.</p>
          </div>
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>acertos</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={40} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("sombras", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (40 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. O céu da noite */
type Estrela = { id: string; x: number; y: number; r: number; grupo?: "cruz" | "marias" };
const CRUZ: Estrela[] = [
  { id: "gacrux", x: 700, y: 120, r: 6, grupo: "cruz" }, { id: "acrux", x: 708, y: 280, r: 7.5, grupo: "cruz" },
  { id: "mimosa", x: 640, y: 195, r: 6.5, grupo: "cruz" }, { id: "delta", x: 768, y: 208, r: 5, grupo: "cruz" },
];
const MARIAS: Estrela[] = [
  { id: "m1", x: 230, y: 170, r: 6, grupo: "marias" }, { id: "m2", x: 266, y: 186, r: 6, grupo: "marias" }, { id: "m3", x: 302, y: 202, r: 6, grupo: "marias" },
];
function fundoEstrelas(): Estrela[] {
  let s = 11; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const l: Estrela[] = [];
  while (l.length < 120) {
    const e = { id: `f${l.length}`, x: r() * 940 + 10, y: r() * 380 + 10, r: 0.8 + r() * 2.2 };
    if ([...CRUZ, ...MARIAS].every((c) => Math.hypot(c.x - e.x, c.y - e.y) > 34)) l.push(e);
  }
  // Intrometida e as outras estrelas de Órion, mais fracas
  l.push({ id: "intrometida", x: 738, y: 250, r: 3 }, { id: "betelgeuse", x: 196, y: 70, r: 4 }, { id: "rigel", x: 330, y: 300, r: 4.5 }, { id: "bellatrix", x: 310, y: 90, r: 3.5 }, { id: "saiph", x: 200, y: 290, r: 3.5 });
  return l;
}
const CARTOES_CEU = [
  { e: "🌕", fundo: "linear-gradient(160deg,#3a4a82,#1d2433)", t: "O calendário da Lua", p: "De uma Lua Cheia até a próxima passam mais ou menos…", op: ["7 dias", "15 dias", "29 dias"], certa: "29 dias", ex: "O ciclo da Lua dura cerca de 29 dias e meio: quase um mês. A palavra “mês” vem dessa conta antiga com a Lua." },
  { e: "🧭", fundo: "linear-gradient(160deg,#7fb2e8,#3a6fd8)", t: "Navegar pelo céu", p: "Antigamente, os navegadores usavam o Cruzeiro do Sul para achar…", op: ["o sul", "o norte", "a Lua"], certa: "o sul", ex: "O braço maior da cruz aponta para o polo sul do céu. Assim os navegadores achavam o sul à noite." },
  { e: "🌤️", fundo: "linear-gradient(160deg,#ffd77a,#f08a5d)", t: "Estrelas de dia", p: "Por que não vemos as estrelas durante o dia?", op: ["Elas se apagam", "A luz do Sol é forte demais", "Elas vão para outro lugar"], certa: "A luz do Sol é forte demais", ex: "As estrelas continuam lá! A luz do Sol clareia o céu e esconde o brilho delas." },
];

function CartaoCeu({ c }: { c: (typeof CARTOES_CEU)[number] }) {
  const v = useViva();
  const [esc, setEsc] = useState<string | null>(null);
  return (
    <div className="viva-cartao">
      <div className="viva-cartao-img" style={{ background: c.fundo }}><span>{c.e}</span></div>
      <div className="viva-cartao-txt">
        <b>{c.t}</b><p>{c.p}</p>
        <div className="viva-opcoes peq txt">
          {c.op.map((o) => <button key={o} type="button" className={esc === null ? "" : o === c.certa ? "certa" : o === esc ? "errada" : "apaga"} onClick={() => { if (esc !== null) return; setEsc(o); if (o === c.certa) v.acertou("mundo", 10); else v.errou("mundo"); }}>{o}</button>)}
        </div>
        {esc !== null && <small className="viva-explica" style={{ color: esc === c.certa ? "#2f7d4f" : undefined }}>{c.ex}</small>}
      </div>
    </div>
  );
}

export function CeuNoite() {
  const v = useViva();
  const fundo = useMemo(fundoEstrelas, []);
  const [tocadas, setTocadas] = useState<string[]>([]);
  const [erros, setErros] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const cruzOk = CRUZ.every((e) => tocadas.includes(e.id));
  const mariasOk = MARIAS.every((e) => tocadas.includes(e.id));
  const ordem = useMemo(() => embaralhar([...CRUZ, ...MARIAS, ...fundo]), [fundo]);
  const tocar = (e: Estrela) => {
    if (tocadas.includes(e.id)) return;
    if (!e.grupo) { setErros((x) => x + 1); setFlash(e.id); setTimeout(() => setFlash(null), 500); return; }
    const novas = [...tocadas, e.id];
    setTocadas(novas);
    const grupo = e.grupo === "cruz" ? CRUZ : MARIAS;
    if (grupo.every((x) => novas.includes(x.id))) v.acertou("constelacoes", 25, e.grupo === "cruz" ? "Achou o Cruzeiro do Sul!" : "Achou as Três Marias!");
  };
  const [g, a, mi, de] = CRUZ;
  const sulY = a.y + (a.y - g.y) * 0.95;
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: o céu da noite</h2>
        <p className="viva-sub">Saia no quintal numa noite sem nuvens. Toque nas estrelas para achar o <b>Cruzeiro do Sul</b> (4 estrelas em cruz) e as <b>Três Marias</b> (3 estrelas em fila).</p>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card escuro sem-pad">
            <svg viewBox="0 0 960 480" className="viva-cenario viva-noite" role="img" aria-label="Céu noturno com estrelas para tocar">
              <defs>
                <radialGradient id="ceuN" cx="50%" cy="100%" r="100%"><stop offset="0" stopColor="#24305a" /><stop offset="1" stopColor="#0c1124" /></radialGradient>
                <filter id="brilhoE"><feGaussianBlur stdDeviation="2.5" /></filter>
              </defs>
              <rect width="960" height="480" fill="url(#ceuN)" />
              {cruzOk && <g stroke="#f6d35b" strokeWidth="3" opacity=".9"><line x1={g.x} y1={g.y} x2={a.x} y2={a.y} /><line x1={mi.x} y1={mi.y} x2={de.x} y2={de.y} /></g>}
              {cruzOk && <g><line x1={a.x} y1={a.y} x2={a.x + (a.x - g.x) * 0.95} y2={sulY} stroke="#f6d35b" strokeWidth="2.5" strokeDasharray="8 8" /><text x={a.x + 14} y={sulY - 6} fontSize="16" fontWeight="800" fill="#f6d35b">para o SUL ↓</text></g>}
              {mariasOk && <polyline points={MARIAS.map((e) => `${e.x},${e.y}`).join(" ")} fill="none" stroke="#9fd3ff" strokeWidth="3" />}
              {ordem.map((e) => {
                const ok = tocadas.includes(e.id);
                return (
                  <g key={e.id} onClick={() => tocar(e)} style={{ cursor: "pointer" }}>
                    <circle cx={e.x} cy={e.y} r={Math.max(14, e.r * 3)} fill="transparent" />
                    {e.r > 3 && <circle cx={e.x} cy={e.y} r={e.r * 1.8} fill="#fff" opacity=".25" filter="url(#brilhoE)" />}
                    <circle cx={e.x} cy={e.y} r={e.r} fill={ok ? (e.grupo === "cruz" ? "#f6d35b" : "#9fd3ff") : flash === e.id ? "#e2574c" : "#f4f6ff"} />
                  </g>
                );
              })}
              <path d="M0 455 Q 120 430 240 448 T 480 444 T 720 450 T 960 440 V 480 H 0 Z" fill="#0a0e1c" />
              <text x="480" y="472" textAnchor="middle" fontSize="13" fill="#7d89b3" fontWeight="700">horizonte</text>
            </svg>
          </div>
          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <span>{cruzOk ? "✅" : "⬜"} Cruzeiro do Sul {cruzOk ? "" : `(${CRUZ.filter((e) => tocadas.includes(e.id)).length}/4)`}</span>
              <span>{mariasOk ? "✅" : "⬜"} Três Marias {mariasOk ? "" : `(${MARIAS.filter((e) => tocadas.includes(e.id)).length}/3)`}</span>
              <small className="viva-sub">toques errados: {erros}</small>
              <button type="button" className="link-btn" onClick={() => { setTocadas([]); setErros(0); }}>recomeçar</button>
            </div>
            <p className="viva-sub" style={{ margin: 0 }}>{cruzOk ? "Prolongue o braço maior da cruz para baixo, umas quatro vezes e meia o tamanho dele: ali fica o polo sul do céu. O desenho aqui está encurtado." : "Dica: a cruz tem uma estrela fraquinha no meio, a Intrometida, que não conta. Procure as 4 mais brilhantes."}</p>
          </div>
        </div>
        <div className="viva-col">
          <h3 className="viva-h3 claro">Onde mais o céu aparece</h3>
          {CARTOES_CEU.map((c) => <CartaoCeu key={c.t} c={c} />)}
        </div>
      </div>
    </div>
  );
}
