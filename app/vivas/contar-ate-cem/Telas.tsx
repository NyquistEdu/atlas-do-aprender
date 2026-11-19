"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, Regua, falar, type RodadaTexto } from "@/components/viva/Comuns";
import { alternativas, embaralhar, sorteio } from "@/lib/viva";
import type { CasoDezena } from "@/components/viva/Dezenas3D";

const Dezenas3D = dynamic(() => import("@/components/viva/Dezenas3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando a cena 3D…</div> });

/* ---------------------------------------------------------------- números por extenso */
const UN = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const DZ = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
export function extenso(n: number) {
  if (n === 100) return "cem";
  if (n < 20) return UN[n];
  const d = Math.floor(n / 10), u = n % 10;
  return u ? `${DZ[d]} e ${UN[u]}` : DZ[d];
}
const dezStr = (d: number) => (d === 1 ? "1 dezena" : `${d} dezenas`);
const uniStr = (u: number) => (u === 1 ? "1 unidade" : `${u} unidades`);

/* ---------------------------------------------------------------- quadro dos 100 */
export function QuadroCem({ destaque, pintados = [], errado = null, onToque, rotulo = "Quadro dos 100" }: { destaque?: number; pintados?: number[]; errado?: number | null; onToque?: (n: number) => void; rotulo?: string }) {
  return (
    <div className="viva-cem" role="group" aria-label={rotulo}>
      {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" tabIndex={onToque ? 0 : -1} disabled={!onToque && n !== destaque}
          className={`${n === destaque ? "on" : ""} ${pintados.includes(n) ? "pint" : ""} ${n === errado ? "erro" : ""}`}
          onClick={() => onToque?.(n)}>{n}</button>
      ))}
    </div>
  );
}

const DESC: Record<number, string> = { 2: "cubinhos que viram dezena", 3: "4 jogos relâmpago", 4: "o caminhão da feira", 5: "saltos no quadro dos 100", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoDezena[]>(() => [
    { d: 0, u: 7, legenda: "7 cubinhos soltos: 7 unidades" },
    { d: 0, u: 10, legenda: "Juntei 10 cubinhos soltos…" },
    { d: 1, u: 0, legenda: "…e eles viraram 1 barra: 1 dezena!" },
    { d: 2, u: 3, legenda: "2 dezenas e 3 unidades: o número 23" },
    { d: 3, u: 2, legenda: "3 dezenas e 2 unidades: 32, outro número!" },
    { d: 10, u: 0, legenda: "10 dezenas: chegamos no 100!" },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Matemática · Alfabetização · Fase 1</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Contar até Cem</span></h1>
        <p className="viva-formula">10 unidades = 1 dezena</p>
        <p className="viva-mao">contar, juntar de 10 em 10 e o quadro dos 100</p>
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
        <span className="viva-ao-vivo">● Ao vivo em 3D · 10 cubinhos viram 1 barra</span>
        <span className="viva-post">10 = 1 dezena</span>
        <Dezenas3D d={0} u={7} casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={420} />
        {leg && <span className="viva-legenda">{leg}</span>}
        <small className="viva-girar">arraste para girar</small>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
type Missao = { id: string; txt: string; dica: string };
const MISSOES: Missao[] = [
  { id: "c1", txt: "Mostre o número 7.", dica: "Só cubinhos azuis: coloque 7 unidades e nenhuma barra." },
  { id: "c2", txt: "Coloque 10 cubinhos soltos e aperte Trocar. Veja os 10 virarem 1 barra!", dica: "Leve os cubinhos até 10. Aí aparece o botão Trocar 10 por 1 barra." },
  { id: "c3", txt: "Mostre o número 23.", dica: "O 2 da frente diz quantas barras. O 3 diz quantos cubinhos." },
  { id: "c4", txt: "Agora mostre o 32. É igual ao 23?", dica: "No 32 o 3 vem na frente: são 3 barras e 2 cubinhos." },
  { id: "c5", txt: "Mostre o número 50.", dica: "50 é cinco dezenas: 5 barras e nenhum cubinho." },
  { id: "c6", txt: "Chegue no 100!", dica: "Quantas barras de 10 fazem 100? Conte de 10 em 10 até 100." },
];

export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id]));
  const [mi, setMi] = useState(primeira);
  const [dica, setDica] = useState(false);
  const [d, setD] = useState(0);
  const [u, setU] = useState(0);
  const [trocou, setTrocou] = useState(false);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;
  const n = d * 10 + u;
  const maxU = Math.min(19, 100 - d * 10), maxD = Math.min(10, Math.floor((100 - u) / 10));

  useEffect(() => { if (missao.id === "c2") setTrocou(false); }, [mi]); // eslint-disable-line react-hooks/exhaustive-deps

  const ok: Record<string, boolean> = {
    c1: d === 0 && u === 7, c2: trocou && d >= 1 && u < 10, c3: d === 2 && u === 3, c4: d === 3 && u === 2, c5: d === 5 && u === 0, c6: d === 10 && u === 0,
  };
  // a missão só vale no "Enviar": antes disso a criança mexe à vontade
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (u >= 10 && missao.id !== "c2") { v.errou("lab", "Tem 10 cubinhos soltos ou mais! Troque 10 por 1 barra antes de enviar."); return; }
    if (ok[missao.id]) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não é esse número. Confira as barras e os cubinhos, ou peça a dica.");
  };
  const trocar = () => { setD(d + 1); setU(u - 10); setTrocou(true); v.aviso("10 cubinhos viraram 1 barra: 1 dezena!", "ok"); };
  const desmanchar = () => { setD(d - 1); setU(u + 10); };
  const leitura = u >= 10 ? `${d * 10 + u}: tem ${u} cubinhos soltos. Dá para trocar 10 por 1 barra!` : n === 100 ? "Cem! Dez dezenas." : `${extenso(n)}: ${dezStr(d)} e ${uniStr(u)}`;

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: cubinhos, barras e o quadro dos 100</h2>
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
            <Regua rotulo="Barras de 10" cor="#f2b33d" v={d} min={0} max={maxD} muda={setD} mostra={`${d}`} />
            <Regua rotulo="Cubinhos" cor="#6f93e0" v={u} min={0} max={maxU} muda={setU} mostra={`${u}`} />
            <div className="viva-row" style={{ justifyContent: "center" }}>
              {u >= 10 && d < 10 && <button type="button" className="viva-btn" onClick={trocar}>Trocar 10 cubinhos por 1 barra 🔁</button>}
              {d >= 1 && u <= 9 && n <= 100 && <button type="button" className="viva-btn ghost" onClick={desmanchar}>Desmanchar 1 barra</button>}
            </div>
            <p className="viva-numero-grande">{n}<small>{leitura}</small></p>
            <p className="viva-eq" style={{ fontSize: "1.3rem" }}>{d * 10} + {u} = <b>{n}</b> <Ouvir texto={n === 100 ? "cem" : u >= 10 ? leitura : `${extenso(n)}. ${dezStr(d)} e ${uniStr(u)}.`} /></p>
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Material dourado em 3D · barra = 10 cubinhos</span>
            <Dezenas3D d={d} u={u} altura={360} />
          </div>
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● O quadro dos 100 · toque num número</span>
            <QuadroCem destaque={n} onToque={(k) => { setD(Math.floor(k / 10)); setU(k % 10); falar(extenso(k)); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const FRUTAS = ["🍎", "🍊", "🍓", "⭐", "🐟", "🎈", "🧸", "🍪", "🌼", "🚗"];
function Dez({ n, e }: { n: number; e: string }) {
  const linhas = Array.from({ length: Math.ceil(n / 10) }, (_, l) => Math.min(10, n - l * 10));
  return <div className="viva-dez" aria-label={`${n} figuras`}>{linhas.map((k, l) => <div key={l}>{Array.from({ length: k }, (_, i) => <i key={i}>{e}</i>)}</div>)}</div>;
}
function MiniDourado({ d, u }: { d: number; u: number }) {
  return (
    <div className="viva-mini-dourado" aria-label={`${d} barras e ${u} cubinhos`}>
      {Array.from({ length: d }, (_, i) => <span key={i} className="b" />)}
      {u > 0 && <span className="us">{Array.from({ length: u }, (_, i) => <span key={i} className="u" />)}</span>}
    </div>
  );
}
const strs = (l: number[]) => l.map(String);
const gerar = {
  quantos: (): RodadaTexto => {
    const n = sorteio(6, 34), e = FRUTAS[sorteio(0, FRUTAS.length - 1)];
    return { enunciado: <><Dez n={n} e={e} /><p className="viva-pergunta">Quantos tem? <Ouvir texto="Quantos tem? Cada fileira cheia tem dez." /></p></>, opcoes: strs(alternativas(n, [n + 10, n - 10, n + 1])), certa: String(n), explica: `Cada fileira cheia tem 10. Conte as fileiras de 10 em 10 e depois os que sobram: são ${n}.` };
  },
  vizinhos: (): RodadaTexto => {
    const depois = Math.random() < 0.5;
    const virada = Math.random() < 0.45;
    const n = depois ? (virada ? sorteio(1, 9) * 10 + 9 : sorteio(1, 98)) : (virada ? sorteio(2, 9) * 10 : sorteio(2, 99));
    const certa = depois ? n + 1 : n - 1;
    const p = depois ? `Que número vem logo depois do ${n}?` : `Que número vem logo antes do ${n}?`;
    const dist = depois ? [n % 10 === 9 ? n - 9 : n + 10, n - 1, n + 2] : [n % 10 === 0 ? n + 9 : n - 10, n + 1, n - 2];
    return {
      enunciado: <><p className="viva-conta">{depois ? <>{n}, <b className="viva-q">?</b></> : <><b className="viva-q">?</b>, {n}</>}</p><p className="viva-pergunta">{p} <Ouvir texto={p} /></p></>,
      opcoes: strs(alternativas(certa, dist.filter((x) => x > 0 && x <= 100))), certa: String(certa),
      explica: depois && n % 10 === 9 ? `Depois do ${n} vem o ${certa}: o 9 vira 0 e a dezena aumenta.` : depois ? `Depois do ${n} vem o ${certa}: é só andar 1 para a frente.` : n % 10 === 0 ? `Antes do ${n} vem o ${certa}: a dezena diminui e o 0 vira 9.` : `Antes do ${n} vem o ${certa}: é só voltar 1.`,
    };
  },
  dezenas: (): RodadaTexto => {
    const d = sorteio(1, 9), u = sorteio(0, 9), n = d * 10 + u;
    const ops = [n, u * 10 + d, d + u, n + 10].filter((x, i, a) => x > 0 && x <= 100 && a.indexOf(x) === i);
    return { enunciado: <><MiniDourado d={d} u={u} /><p className="viva-pergunta">Que número é esse? <Ouvir texto="Que número é esse? Cada barra vale dez." /></p></>, opcoes: strs(alternativas(n, ops.slice(1))), certa: String(n), explica: `${dezStr(d)} e ${uniStr(u)}: ${d * 10} + ${u} = ${n}.` };
  },
  maior: (): RodadaTexto => {
    const d1 = sorteio(1, 9); let u1 = sorteio(1, 9); if (u1 === d1) u1 = (u1 % 9) + 1;
    const troca = Math.random() < 0.55;
    const a = d1 * 10 + u1, b = troca ? u1 * 10 + d1 : Math.min(99, a + sorteio(-9, 9) || a + 1);
    const [x, y] = embaralhar([a, b === a ? a + 1 : b]);
    const certa = Math.max(x, y);
    const p = `Qual é maior: ${x} ou ${y}?`;
    return { enunciado: <><p className="viva-conta" style={{ fontSize: "2.2rem" }}>{x} <span style={{ color: "#9aa6c4" }}>ou</span> {y}</p><p className="viva-pergunta">Qual é maior? <Ouvir texto={p} /></p></>, opcoes: strs([x, y]), certa: String(certa), explica: Math.floor(x / 10) === Math.floor(y / 10)
      ? `As dezenas são iguais (${Math.floor(x / 10)}). Então olhe as unidades: ${certa % 10} é mais que ${Math.min(x, y) % 10}. O ${certa} é maior.`
      : `Olhe primeiro as dezenas (o algarismo da frente). ${certa} tem ${dezStr(Math.floor(certa / 10))}, por isso é maior.` };
  },
};

export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos relâmpago</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">Toque em 🔊 para ouvir a pergunta. No modo juntos, aperte <b>Valendo!</b> e o acerto vale ponto para o time da vez.</p>
      </header>
      <div className="viva-jogos">
        <JogoTexto id="quantos" titulo="Quantos tem?" sub="Fileiras de 10 ajudam a contar." icone="🍎" hab="contagem" gerar={gerar.quantos} />
        <JogoTexto id="vizinhos" titulo="Antes e depois" sub="Os vizinhos de cada número." icone="🏠" hab="vizinhos" gerar={gerar.vizinhos} />
        <JogoTexto id="dezenas" titulo="Barras e cubinhos" sub="Cada barra vale 10." icone="🧱" hab="dezenas" gerar={gerar.dezenas} />
        <JogoTexto id="maior" titulo="Qual é maior?" sub="Olhe primeiro a dezena." icone="🐊" hab="comparar" gerar={gerar.maior} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. A feira */
const CLIENTES = ["Dona Rosa", "Seu Tião", "a cantina da escola", "Tia Bia", "o restaurante da praça", "Vó Lurdes", "a padaria"];
function novoPedido() { return { quem: CLIENTES[sorteio(0, CLIENTES.length - 1)], n: sorteio(11, 99) }; }

export function Feira() {
  const v = useViva();
  const [ped, setPed] = useState(novoPedido);
  const [cx, setCx] = useState(0);
  const [so, setSo] = useState(0);
  const [partiu, setPartiu] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const total = cx * 10 + so;
  const fala = `${ped.quem[0].toUpperCase() + ped.quem.slice(1)} quer ${ped.n} laranjas.`;
  const entregar = () => {
    setValendo(false);
    if (total === ped.n && so >= 10) { setMsg({ ok: false, txt: `O total está certo, mas tem ${so} laranjas soltas rolando no caminhão! Feche mais uma caixa de 10.` }); v.aviso("Quase! Feche uma caixa.", "info"); return; }
    setPlacar((p) => ({ certas: p.certas + (total === ped.n ? 1 : 0), tent: p.tent + 1 }));
    if (total === ped.n) {
      setPartiu(true);
      setMsg({ ok: true, txt: `${ped.n} = ${dezStr(cx)} e ${uniStr(so)}. ${cx === 1 ? "1 caixa" : `${cx} caixas`} de 10 e ${so} ${so === 1 ? "solta" : "soltas"}: o caminhão saiu!` });
      v.acertou("feira", 25, "Entrega certinha!");
      return;
    }
    setMsg({ ok: false, txt: total < ped.n ? `Faltaram ${ped.n - total} laranjas.` : `Passaram ${total - ped.n} laranjas.` });
    v.errou("feira");
  };
  const nova = () => { setPartiu(false); setPed(novoPedido()); setCx(0); setSo(0); setMsg(null); setRod((x) => x + 1); };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: o caminhão da feira</h2>
        <p className="viva-sub">O Seu Zé vende laranjas em caixas de 10. Arrume o pedido no caminhão com caixas cheias e laranjas soltas. Acertou? O caminhão parte!</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● A feira em 3D · cada caixa leva 10 laranjas</span>
          <Dezenas3D estilo="feira" d={cx} u={so} partiu={partiu} altura={380} />
        </div>
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🍊</span><div><b>Pedido: {ped.n} laranjas</b><small>para {ped.quem}</small></div></div>
          <p className="viva-pedido">🧾 {fala} <Ouvir texto={fala} /></p>
          <Regua rotulo="Caixas de 10" cor="#c9935a" v={cx} min={0} max={9} muda={(k) => { if (!partiu) { setCx(k); setMsg(null); } }} mostra={`${cx}`} />
          <Regua rotulo="Laranjas soltas" cor="#f28c28" v={so} min={0} max={19} muda={(k) => { if (!partiu) { setSo(k); setMsg(null); } }} mostra={`${so}`} />
          {so >= 10 && cx < 9 && !partiu && <button type="button" className="viva-btn ghost" onClick={() => { setCx(cx + 1); setSo(so - 10); setMsg(null); }}>Fechar 1 caixa com 10 soltas 📦</button>}
          <p className="viva-eq" style={{ fontSize: "1.3rem" }}>no caminhão: <b>{total}</b> {total === ped.n ? <span style={{ color: "var(--v-verde)" }}>✓</span> : null}</p>
          <button type="button" className="viva-btn grande" onClick={msg?.ok ? nova : entregar}>{msg?.ok ? "Próximo pedido" : "Entregar! 🚚"}</button>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Lá vai o caminhão!" : "Ih!"}</b> {msg.txt}</p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>entregas certas</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={45} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("feira", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (45 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. No mundo: saltos */
const SALTOS = [
  { id: "sapatos", e: "👟", nome: "Sapatos", txt: "Cada pessoa da casa tem 2 sapatos. Conte os sapatos de 2 em 2, até 20.", passo: 2, ate: 20 },
  { id: "maos", e: "🖐️", nome: "Dedos", txt: "Cada mão tem 5 dedos. Conte os dedos de 5 em 5, até 50.", passo: 5, ate: 50 },
  { id: "notas", e: "💵", nome: "Notas de 10", txt: "No cofrinho só tem notas de 10 reais. Conte o dinheiro de 10 em 10, até 100.", passo: 10, ate: 100 },
];
export function Saltos() {
  const v = useViva();
  const [si, setSi] = useState(0);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [erros, setErros] = useState(0);
  const [errado, setErrado] = useState<number | null>(null);
  const s = SALTOS[si];
  const prox = (feitos.length + 1) * s.passo;
  const fim = feitos.length * s.passo >= s.ate;
  useEffect(() => { setFeitos([]); setErros(0); setErrado(null); }, [si]);
  const tocar = (n: number) => {
    if (fim) return;
    if (n === prox) {
      const f = [...feitos, n]; setFeitos(f); setErrado(null); falar(extenso(n));
      if (n >= s.ate) {
        const est = erros === 0 ? 3 : erros <= 2 ? 2 : 1;
        v.missao(`salto-${s.id}`, est);
        v.acertou("saltos", est * 5, `Contou de ${s.passo} em ${s.passo}! ${"⭐".repeat(est)}`);
      }
    } else {
      setErros((e) => e + 1); setErrado(n);
      v.errou("saltos", `Depois do ${prox - s.passo || 0} vem o ${prox}: some mais ${s.passo}.`);
    }
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: contar em saltos</h2>
        <p className="viva-sub">Em casa a gente conta de 2 em 2, de 5 em 5 e de 10 em 10 o tempo todo. Toque no quadro dos 100 o próximo número da contagem. Sem errar vale 3 estrelas!</p>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-seg" role="group" aria-label="Contagem" style={{ justifySelf: "start" }}>
              {SALTOS.map((x, i) => <button key={x.id} type="button" aria-pressed={si === i} onClick={() => setSi(i)}>{x.e} {x.nome}{v.e.missoes[`salto-${x.id}`] ? " ★" : ""}</button>)}
            </div>
            <p className="viva-missao">{s.txt} <Ouvir texto={s.txt} /></p>
            <div className="viva-saltos-fig" aria-hidden="true">{feitos.map((n) => <span key={n}>{s.id === "maos" ? "🖐️" : s.id === "sapatos" ? "👟👟" : "💵"}</span>)}</div>
            <p className="viva-eq" style={{ fontSize: "1.5rem" }}>{feitos.length ? feitos.join(", ") : "…"}{!fim && <>, <b className="viva-q">?</b></>}</p>
            {fim ? (
              <div className="viva-row">
                <p className="viva-feed ok" style={{ flex: 1 }}><b>{"⭐".repeat(erros === 0 ? 3 : erros <= 2 ? 2 : 1)} Chegou no {s.ate}!</b> {s.id === "notas" ? "10 notas de 10 reais são 100 reais." : s.id === "maos" ? `${s.ate / 5} mãos têm ${s.ate} dedos.` : `${s.ate / 2} pessoas têm ${s.ate} sapatos.`}</p>
                <button type="button" className="viva-btn" onClick={() => (si < SALTOS.length - 1 ? setSi(si + 1) : (setFeitos([]), setErros(0)))}>{si < SALTOS.length - 1 ? "Próxima contagem →" : "Contar de novo"}</button>
              </div>
            ) : <small className="viva-sub">Erros: {erros}</small>}
          </div>
          <div className="viva-raiox">
            <div><small>DE 2 EM 2</small><b className="mini">2, 4, 6, 8, 10…</b></div>
            <div><small>DE 5 EM 5</small><b className="mini">5, 10, 15, 20…</b></div>
            <div><small>DE 10 EM 10</small><b className="mini">10, 20, 30… 100</b></div>
            <div><small>EM CASA</small><b className="mini">meias, dedos, moedas</b></div>
          </div>
        </div>
        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Quadro dos 100 · toque no próximo número</span>
            <QuadroCem pintados={feitos} errado={errado} onToque={tocar} rotulo="Quadro dos 100 para contar em saltos" />
          </div>
        </div>
      </div>
    </div>
  );
}
