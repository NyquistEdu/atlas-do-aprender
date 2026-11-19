"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, Regua, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import type { EstrelaCeu } from "@/components/viva/CeuNoite3D";
import { DIA_LUA, Lua, SolPalito, TerraDN, momento, nomeFase, sombra, type NomeFase } from "./ceu";

const CeuNoite3D = dynamic(() => import("@/components/viva/CeuNoite3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 430 }}>carregando o céu 3D…</div> });
const Quintal3D = dynamic(() => import("@/components/viva/Quintal3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 400 }}>carregando o quintal 3D…</div> });
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
  const f = d / DIA_LUA, nome = nomeFase(f), m = momento(h);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((x) => v.e.missoes[x.id]).length;
  const escondida = prever && palpite !== nome;

  useEffect(() => { setPalpite(null); }, [d]);
  // a missão só vale quando a criança aperta "Enviar": pode experimentar à vontade antes
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (missao.ok(h, d)) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não é isso. Mexa mais um pouco ou peça a dica.");
  };

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
                <button key={x.id} type="button" className={`${v.e.missoes[x.id] ? "feita" : ""} ${i === mi ? "atual" : ""}`} onClick={() => { setMi(i); setDica(false); }} aria-label={`Missão ${i + 1}`}>{v.e.missoes[x.id] ? "★" : i + 1}</button>
              ))}
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
                  <p className="viva-missao">Que fase é? Olhe onde a Lua está na cena 3D. <Ouvir texto="Que fase é? Olhe onde a Lua está na cena 3D." /></p>
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
    return { enunciado: <><TerraDN ang={ang} /><p className="viva-pergunta">Na casinha amarela é dia ou noite? <Ouvir texto="Na casinha amarela é dia ou noite?" /></p></>, opcoes: ["Dia ☀️", "Noite 🌙"], certa: dia ? "Dia ☀️" : "Noite 🌙",
      explica: dia ? "A casinha está no lado virado para o Sol: é dia." : "A casinha está no lado de costas para o Sol: é noite." };
  },
  fase: (): RodadaTexto => {
    const [f, n] = FASES[sorteio(0, FASES.length - 1)];
    return { enunciado: <><Lua f={f} r={46} /><p className="viva-pergunta">Que fase da Lua é esta? <Ouvir texto="Que fase da Lua é esta?" /></p></>, opcoes: ["Nova", "Crescente", "Cheia", "Minguante"], certa: n,
      explica: n === "Nova" ? "Na Lua Nova, o lado iluminado está de costas para nós: quase não a vemos." : n === "Cheia" ? "Redondinha e toda iluminada: é a Lua Cheia." : n === "Crescente" ? "Aqui no Brasil, a crescente tem o lado iluminado à esquerda, e ela vai crescendo até a cheia." : "Aqui no Brasil, a minguante tem o lado iluminado à direita, e ela vai diminuindo até a nova." };
  },
  sombra: (): RodadaTexto => {
    const h = [7, 8, 9, 12, 15, 16, 17][sorteio(0, 6)];
    const certa = h === 12 ? "Curtinha, quase embaixo" : h < 12 ? "Comprida, para o oeste" : "Comprida, para o leste";
    return { enunciado: <><SolPalito h={h} w={240} alto={124} semSombra /><p className="viva-pergunta">São {h}h. Como fica a sombra do palito? <Ouvir texto={`São ${h} horas. Como fica a sombra do palito?`} /></p></>, opcoes: ["Comprida, para o oeste", "Curtinha, quase embaixo", "Comprida, para o leste"], certa,
      explica: h === 12 ? "Perto do meio-dia o Sol está alto: a sombra fica curtinha." : `A sombra aponta para o lado oposto ao Sol. Às ${h}h o Sol está no ${h < 12 ? "leste" : "oeste"}, então a sombra vai para o ${h < 12 ? "oeste" : "leste"}.` };
  },
  corpo: (): RodadaTexto => {
    const [e, n, c] = CORPOS[sorteio(0, CORPOS.length - 1)];
    return { enunciado: <><p className="viva-conta" style={{ fontSize: "3rem" }}>{e}</p><p className="viva-pergunta">{n} é… <Ouvir texto={`${n} é estrela, planeta ou satélite?`} /></p></>, opcoes: ["Estrela", "Planeta", "Satélite"], certa: c, explica: `${n} é ${c.toLowerCase()}. ${EXPL[c]}` };
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
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a ciência num lugar de verdade</p>
        <h2>Jogo de contexto: o relógio de sol do quintal</h2>
        <p className="viva-sub">A Nina fincou um cabo de vassoura no quintal. Quando o bolo saiu do forno, ela pôs uma <b>pedrinha</b> na ponta da sombra. Mexa a hora, veja o Sol andar e descubra que horas eram. Arraste a cena para olhar de outro lado. <Ouvir texto="A Nina fincou um cabo de vassoura no quintal. Quando o bolo saiu do forno, ela pôs uma pedrinha na ponta da sombra. Mexa a hora, veja o Sol andar e descubra que horas eram." /></p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro sem-pad" style={{ position: "relative" }}>
          <span className="viva-ao-vivo" style={{ position: "absolute", margin: 10 }}>● Quintal em 3D · a sombra é feita pela luz do Sol</span>
          <span className="viva-hora-tag">{h}h no relógio</span>
          <Quintal3D hora={h} alvo={alvo} altura={400} />
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🕰️</span><div><b>Relógio de sol</b><small>Mexa a hora até a sombra tocar a pedrinha.</small></div></div>
          <Regua rotulo="Hora" cor="var(--v-laranja)" v={h} min={7} max={17} muda={(n) => { setH(n); setMsg(null); }} mostra={`${h}h`} />
          <button type="button" className="viva-btn grande" onClick={msg?.ok ? nova : conferir}>{msg?.ok ? "Nova pedrinha" : "Era essa hora!"}</button>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Acertou!" : "Ainda não."}</b> {msg.txt} <Ouvir texto={msg.txt} /></p>}
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
// azimute: 0 norte, 90 leste, 180 sul. O Cruzeiro fica alto no sul; prolongando o braço maior 4 vezes e meia, chega ao polo sul do céu.
const CRUZ: EstrelaCeu[] = [
  { id: "gacrux", az: 172, alt: 60.5, mag: 1.2, grupo: "cruz" }, { id: "acrux", az: 172, alt: 51.5, mag: 0.5, grupo: "cruz" },
  { id: "mimosa", az: 166.5, alt: 56.5, mag: 0.9, grupo: "cruz" }, { id: "delta", az: 177.5, alt: 56, mag: 2.2, grupo: "cruz" },
];
const MARIAS: EstrelaCeu[] = [
  { id: "mintaka", az: 112, alt: 44, mag: 1.9, grupo: "marias" }, { id: "alnilam", az: 115, alt: 42, mag: 1.6, grupo: "marias" }, { id: "alnitak", az: 118, alt: 40, mag: 1.7, grupo: "marias" },
];
function estrelasDoCeu(): EstrelaCeu[] {
  let s = 17; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const outras: EstrelaCeu[] = [
    { id: "intrometida", az: 174.5, alt: 53.5, mag: 3.4 }, { id: "betelgeuse", az: 108, alt: 52, mag: 0.6 }, { id: "rigel", az: 121, alt: 33, mag: 0.3 },
    { id: "bellatrix", az: 116, alt: 51, mag: 1.6 }, { id: "saiph", az: 109, alt: 33, mag: 2.1 }, { id: "sirius", az: 135, alt: 28, mag: -1.2 },
    { id: "canopus", az: 150, alt: 42, mag: -0.5 }, { id: "alfa-centauro", az: 186, alt: 46, mag: 0 }, { id: "hadar", az: 182, alt: 46, mag: 0.6 },
  ];
  while (outras.length < 60) {
    const e = { id: `e${outras.length}`, az: 60 + r() * 180, alt: 12 + r() * 60, mag: 2 + r() * 2 };
    if ([...CRUZ, ...MARIAS].every((c) => Math.hypot(c.az - e.az, c.alt - e.alt) > 9)) outras.push(e);
  }
  return [...CRUZ, ...MARIAS, ...outras];
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
  const todas = useMemo(estrelasDoCeu, []);
  const [tocadas, setTocadas] = useState<string[]>([]);
  const [erros, setErros] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const cruzOk = CRUZ.every((e) => tocadas.includes(e.id));
  const mariasOk = MARIAS.every((e) => tocadas.includes(e.id));
  const tocar = (e: EstrelaCeu) => {
    if (tocadas.includes(e.id)) return;
    if (!e.grupo) { setErros((x) => x + 1); setFlash(e.id); setTimeout(() => setFlash(null), 500); return; }
    const novas = [...tocadas, e.id];
    setTocadas(novas);
    const grupo = e.grupo === "cruz" ? CRUZ : MARIAS;
    if (grupo.every((x) => novas.includes(x.id))) v.acertou("constelacoes", 25, e.grupo === "cruz" ? "Achou o Cruzeiro do Sul!" : "Achou as Três Marias!");
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: o céu da noite</h2>
        <p className="viva-sub">Saia no quintal numa noite sem nuvens. Arraste para olhar o céu em volta e toque nas estrelas para achar o <b>Cruzeiro do Sul</b> (4 estrelas em cruz, olhando para o sul) e as <b>Três Marias</b> (3 estrelas em fila, para o leste). <Ouvir texto="Saia no quintal numa noite sem nuvens. Arraste para olhar o céu em volta e toque nas estrelas para achar o Cruzeiro do Sul, 4 estrelas em cruz, olhando para o sul, e as Três Marias, 3 estrelas em fila, para o leste." /></p>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card escuro sem-pad" style={{ position: "relative" }}>
            <span className="viva-ao-vivo" style={{ position: "absolute", margin: 10, zIndex: 2 }}>● Céu em 3D · arraste para olhar em volta</span>
            <CeuNoite3D estrelas={todas} tocadas={tocadas} erradas={flash} cruzOk={cruzOk} mariasOk={mariasOk} onTocar={(id) => { const e = todas.find((x) => x.id === id); if (e) tocar(e); }} altura={430} />
          </div>
          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <span>{cruzOk ? "✅" : "⬜"} Cruzeiro do Sul {cruzOk ? "" : `(${CRUZ.filter((e) => tocadas.includes(e.id)).length}/4)`}</span>
              <span>{mariasOk ? "✅" : "⬜"} Três Marias {mariasOk ? "" : `(${MARIAS.filter((e) => tocadas.includes(e.id)).length}/3)`}</span>
              <small className="viva-sub">toques errados: {erros}</small>
              <button type="button" className="link-btn" onClick={() => { setTocadas([]); setErros(0); }}>recomeçar</button>
            </div>
            <p className="viva-sub" style={{ margin: 0 }}>{cruzOk ? "Prolongue o braço maior da cruz para baixo, umas quatro vezes e meia o tamanho dele: ali fica o polo sul do céu. A linha amarela mostra o caminho." : "Dica: a cruz tem uma estrela fraquinha no meio, a Intrometida, que não conta. Procure as 4 mais brilhantes."}</p>
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
