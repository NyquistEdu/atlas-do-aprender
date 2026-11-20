"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import type { CasoPersonagem, Config, Nome } from "@/components/viva/Personagem3D";
import { ARTIGO, GRUPOS, NOMES, flex, frase, fraseTxt, nAdj } from "./palavras";

const Personagem3D = dynamic(() => import("@/components/viva/Personagem3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 400 }}>carregando a fábrica 3D…</div> });

export function Frase({ cfg, q = 1, grande = false }: { cfg: Config; q?: number; grande?: boolean }) {
  const partes = frase(cfg, q);
  return (
    <p className={`nd-frase ${grande ? "grande" : ""}`}>
      {partes.map((p, i) => p.tipo === "liga" ? <span key={i} className="liga">{p.txt === "," ? ", " : ` ${p.txt} `}</span>
        : <span key={i} className={p.tipo}>{i > 0 && partes[i - 1].tipo !== "liga" ? " " : ""}{p.txt}</span>)}
    </p>
  );
}

const DESC: Record<number, string> = { 2: "monte e descreva personagens", 3: "4 jogos relâmpago", 4: "achados e perdidos em 3D", 5: "cartazes, anúncios e placas", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [caso, setCaso] = useState<CasoPersonagem | null>(null);
  const casos = useMemo<CasoPersonagem[]>(() => [
    { itens: [{ nome: "monstro" }], legenda: "Monstro é um substantivo: é o nome." },
    { itens: [{ nome: "monstro", tam: "grande" }], legenda: "Grande é adjetivo: diz como ele é." },
    { itens: [{ nome: "monstro", tam: "grande", cor: "verde" }], legenda: "Cada adjetivo muda o personagem." },
    { itens: [{ nome: "monstro", tam: "grande", cor: "verde", jeito: "peludo" }], legenda: "Mais um adjetivo…" },
    { itens: [{ nome: "monstro", tam: "grande", cor: "verde", jeito: "peludo", humor: "feliz" }], legenda: "…e ele ficou feliz!" },
    { itens: Array(3).fill({ nome: "coruja", tam: "pequeno", cor: "roxo" }), legenda: "No plural e no feminino, o adjetivo combina." },
    { itens: [{ nome: "robo", cor: "azul", humor: "triste" }], legenda: "Tudo tem um nome. E cada coisa tem um jeito." },
  ], []);
  const q = caso?.itens.length ?? 1;
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Português · 3º ano · Fase 5</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Nomear e Descrever</span></h1>
        <p className="viva-formula">substantivo dá o <b>nome</b> · adjetivo dá o <b>jeito</b></p>
        <p className="viva-mao">monte personagens com palavras e veja tudo mudar</p>
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
      <div className="viva-capa-3d nd-capa">
        <span className="viva-ao-vivo">● Ao vivo em 3D</span>
        <Personagem3D itens={[{ nome: "monstro" }]} casos={casos} onCaso={setCaso} altura={360} />
        <div className="nd-capa-leg">
          {caso && <Frase cfg={caso.itens[0]} q={q} grande />}
          <small>{caso?.legenda ?? " "}</small>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
type Missao = { id: string; txt: string; dica: string };
const MISSOES: Missao[] = [
  { id: "s1", txt: "Faça um monstro grande e peludo.", dica: "Escolha o substantivo monstro. Depois os adjetivos grande (tamanho) e peludo (jeito)." },
  { id: "s2", txt: "Agora faça três corujas. Veja como a palavra muda: coruja vira corujas!", dica: "Toque em coruja e depois em três." },
  { id: "s3", txt: "Faça uma coruja brava. Repare: bravo vira brava para combinar com coruja.", dica: "Uma coruja e o humor bravo. O adjetivo muda sozinho para o feminino." },
  { id: "s4", txt: "Faça um robô azul e triste.", dica: "Substantivo robô, cor azul e humor triste." },
  { id: "s5", txt: "Descreva um monstro com 4 adjetivos, um de cada grupo.", dica: "Escolha tamanho, cor, jeito e humor para o monstro." },
  { id: "s6", txt: "Faça dois monstros verdes e felizes.", dica: "Monstro, dois, cor verde e humor feliz. Os adjetivos vão para o plural!" },
];

export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id]));
  const [mi, setMi] = useState(primeira);
  const [dica, setDica] = useState(false);
  const [cfg, setCfg] = useState<Config>({ nome: "monstro" });
  const [q, setQ] = useState(1);
  const missao = MISSOES[mi];
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;
  const n = NOMES[cfg.nome];
  const itens = useMemo(() => Array.from({ length: q }, () => cfg), [cfg, q]);
  const toggle = (k: "tam" | "cor" | "jeito" | "humor", val: string) => setCfg((c) => ({ ...c, [k]: c[k] === val ? undefined : val }));
  const ok: Record<string, boolean> = {
    s1: cfg.nome === "monstro" && q === 1 && cfg.tam === "grande" && cfg.jeito === "peludo",
    s2: cfg.nome === "coruja" && q === 3,
    s3: cfg.nome === "coruja" && q === 1 && cfg.humor === "bravo",
    s4: cfg.nome === "robo" && q === 1 && cfg.cor === "azul" && cfg.humor === "triste",
    s5: cfg.nome === "monstro" && nAdj(cfg) === 4,
    s6: cfg.nome === "monstro" && q === 2 && cfg.cor === "verde" && cfg.humor === "feliz",
  };
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (ok[missao.id]) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não. Leia a frase que você montou e compare com a missão, ou peça a dica.");
  };
  const txt = fraseTxt(cfg, q);

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: a fábrica de personagens</h2>
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
            <h3 className="nd-h"><span className="nd-tag subst">substantivo</span> quem é?</h3>
            <div className="nd-fichas">
              {(Object.keys(NOMES) as Nome[]).map((k) => <button key={k} type="button" className="nd-ficha subst" aria-pressed={cfg.nome === k} onClick={() => setCfg((c) => ({ ...c, nome: k }))}><em>{NOMES[k].e}</em>{NOMES[k].g === "f" ? "a" : "o"} {NOMES[k].s}</button>)}
            </div>
            <div className="nd-fichas">
              {[1, 2, 3].map((x) => <button key={x} type="button" className="nd-ficha art" aria-pressed={q === x} onClick={() => setQ(x)}>{ARTIGO(n.g, x)}</button>)}
            </div>
            <h3 className="nd-h"><span className="nd-tag adj">adjetivos</span> como é?</h3>
            {GRUPOS.map((g) => (
              <div key={g.id} className="nd-grupo">
                <small>{g.nome}</small>
                <div className="nd-fichas">
                  {g.ops.map((a) => <button key={a} type="button" className="nd-ficha adj" aria-pressed={cfg[g.id] === a} onClick={() => toggle(g.id, a)}>{flex(a, n.g, q > 1)}</button>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Fábrica em 3D · arraste para girar</span>
            <Personagem3D itens={itens} altura={380} />
          </div>
          <div className="viva-card">
            <Frase cfg={cfg} q={q} grande />
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <small className="nd-legenda"><span className="nd-tag subst">substantivo</span> <span className="nd-tag adj">adjetivo</span></small>
              <Ouvir texto={txt} />
            </div>
          </div>
          <div className="viva-raiox">
            <div><small>SUBSTANTIVO</small><b className="mini">{q > 1 ? n.p : n.s}</b></div>
            <div><small>GÊNERO</small><b className="mini">{n.g === "f" ? "feminino" : "masculino"}</b></div>
            <div><small>NÚMERO</small><b className="mini">{q > 1 ? "plural" : "singular"}</b></div>
            <div><small>ADJETIVOS</small><b>{nAdj(cfg)}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const SUBST = ["gato", "escola", "mesa", "alegria", "praia", "bola", "menina", "livro", "janela", "bolo", "amizade", "árvore", "sapato", "chuva"];
const ADJS = ["bonito", "alto", "gelado", "cheiroso", "rápido", "colorido", "quentinho", "barulhento", "macio", "corajoso", "pesado", "alegre", "salgado", "brilhante"];
const PROPRIOS: [string, string][] = [["cidade", "Aracaju"], ["rio", "São Francisco"], ["menina", "Ana"], ["cachorro", "Totó"], ["país", "Brasil"], ["planeta", "Marte"], ["menino", "Davi"], ["praia", "Atalaia"], ["mês", "Junho"]];
const FORMAS: Record<string, [string, string, string, string]> = {
  bonito: ["bonito", "bonita", "bonitos", "bonitas"], cheiroso: ["cheiroso", "cheirosa", "cheirosos", "cheirosas"], gelado: ["gelado", "gelada", "gelados", "geladas"],
  divertido: ["divertido", "divertida", "divertidos", "divertidas"], alegre: ["alegre", "alegre", "alegres", "alegres"], quentinho: ["quentinho", "quentinha", "quentinhos", "quentinhas"],
};
const SUJ: { t: string; g: 0 | 1; p: 0 | 2 }[] = [
  { t: "O bolo", g: 0, p: 0 }, { t: "A casa", g: 1, p: 0 }, { t: "Os sapatos", g: 0, p: 2 }, { t: "As flores", g: 1, p: 2 },
  { t: "A sopa", g: 1, p: 0 }, { t: "Os meninos", g: 0, p: 2 }, { t: "As meninas", g: 1, p: 2 }, { t: "O suco", g: 0, p: 0 },
];
const FRASES: [string, string, string[]][] = [
  ["O cachorro bagunceiro rasgou a almofada.", "bagunceiro", ["cachorro", "rasgou", "almofada"]],
  ["A Lua cheia iluminou o quintal.", "cheia", ["Lua", "iluminou", "quintal"]],
  ["Minha avó fez um bolo delicioso.", "delicioso", ["avó", "fez", "bolo"]],
  ["O menino corajoso subiu na árvore.", "corajoso", ["menino", "subiu", "árvore"]],
  ["A girafa comeu folhas verdes.", "verdes", ["girafa", "comeu", "folhas"]],
  ["Ganhei uma bola nova no aniversário.", "nova", ["bola", "ganhei", "aniversário"]],
  ["O mar estava calmo naquela manhã.", "calmo", ["mar", "estava", "manhã"]],
  ["A professora contou uma história engraçada.", "engraçada", ["professora", "contou", "história"]],
];
const gerar = {
  classe: (): RodadaTexto => {
    const sub = Math.random() < 0.5, w = sub ? SUBST[sorteio(0, SUBST.length - 1)] : ADJS[sorteio(0, ADJS.length - 1)];
    return {
      enunciado: <><p className="viva-conta" style={{ fontSize: "2.4rem" }}>{w}</p><p className="viva-pergunta">Substantivo ou adjetivo? <Ouvir texto={`${w}. É substantivo ou adjetivo?`} /></p></>,
      opcoes: ["Substantivo", "Adjetivo"], certa: sub ? "Substantivo" : "Adjetivo",
      explica: sub ? `“${w}” é nome de alguma coisa: dá para dizer “o” ou “a” ${w}. É substantivo.` : `“${w}” diz como uma coisa é: “um bolo ${w}”. É adjetivo.`,
    };
  },
  proprio: (): RodadaTexto => {
    const l = embaralhar(PROPRIOS).slice(0, 4), alvo = l[0][1];
    const ops = embaralhar([alvo, l[1][0], l[2][0], l[3][0]]);
    return {
      enunciado: <><p className="viva-conta" style={{ fontSize: "1.6rem" }}>🔤</p><p className="viva-pergunta">Qual é o substantivo próprio? <Ouvir texto="Qual destas palavras é um substantivo próprio?" /></p></>,
      opcoes: ops, certa: alvo, explica: `“${alvo}” é o nome de um só, com letra maiúscula: é substantivo próprio. ${l[0][0][0].toUpperCase() + l[0][0].slice(1)} é o substantivo comum.`,
    };
  },
  concorda: (): RodadaTexto => {
    const adj = Object.keys(FORMAS)[sorteio(0, Object.keys(FORMAS).length - 1)], s = SUJ[sorteio(0, SUJ.length - 1)];
    const f = FORMAS[adj], certa = f[s.g + s.p];
    const verbo = s.p ? "estão" : "está";
    return {
      enunciado: <><p className="viva-conta" style={{ fontSize: "1.7rem" }}>{s.t} {verbo} <b className="viva-q">?</b></p><p className="viva-pergunta">Complete com <b>{adj}</b> do jeito certo. <Ouvir texto={`${s.t} ${verbo}… Complete com a palavra ${adj} do jeito certo.`} /></p></>,
      opcoes: embaralhar([...new Set(f)]), certa,
      explica: `${s.t.split(" ")[1]} é ${s.g ? "feminino" : "masculino"} e ${s.p ? "plural" : "singular"}: ${s.t} ${verbo} ${certa}. O adjetivo combina com o substantivo.`,
    };
  },
  achar: (): RodadaTexto => {
    const [fr, adj, outros] = FRASES[sorteio(0, FRASES.length - 1)];
    return {
      enunciado: <><p className="nd-frase-treino">{fr}</p><p className="viva-pergunta">Qual palavra é o adjetivo? <Ouvir texto={`${fr} Qual palavra é o adjetivo?`} /></p></>,
      opcoes: embaralhar([adj, ...outros]), certa: adj, explica: `“${adj}” diz como é o substantivo que está perto dele. As outras são nomes ou ações.`,
    };
  },
};

export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos relâmpago</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">Toque em 🔊 para ouvir. No modo juntos, aperte <b>Valendo!</b> e o acerto vale ponto para o time da vez.</p>
      </header>
      <div className="viva-jogos">
        <JogoTexto id="classe" titulo="Nome ou jeito?" sub="Substantivo ou adjetivo?" icone="🏷️" hab="adjetivo" gerar={gerar.classe} />
        <JogoTexto id="proprio" titulo="Comum ou próprio?" sub="O próprio tem letra maiúscula." icone="🔤" hab="proprio" gerar={gerar.proprio} />
        <JogoTexto id="concorda" titulo="Combina?" sub="O adjetivo combina com o nome." icone="🧩" hab="concordancia" gerar={gerar.concorda} />
        <JogoTexto id="achar" titulo="Caça ao adjetivo" sub="Ache a palavra que descreve." icone="🔎" hab="substantivo" gerar={gerar.achar} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Achados e perdidos */
const CORES_L = ["azul", "verde", "roxo", "amarelo", "vermelho"];
const HUMORES = ["feliz", "triste", "bravo", "assustado"] as const;
function sortearCfg(): Config {
  const nomes: Nome[] = ["monstro", "coruja", "robo"];
  return { nome: nomes[sorteio(0, 2)], tam: Math.random() < 0.5 ? "pequeno" : "grande", cor: CORES_L[sorteio(0, 4)], jeito: (["peludo", "listrado", undefined] as const)[sorteio(0, 2)], humor: HUMORES[sorteio(0, 3)] };
}
function novoCartaz() {
  const alvo = sortearCfg();
  const muda: ((c: Config) => Config)[] = [
    (c) => ({ ...c, tam: c.tam === "grande" ? "pequeno" : "grande" }),
    (c) => ({ ...c, cor: embaralhar(CORES_L.filter((x) => x !== c.cor))[0] }),
    (c) => ({ ...c, jeito: c.jeito === "peludo" ? "listrado" : "peludo" }),
    (c) => ({ ...c, humor: embaralhar(HUMORES.filter((x) => x !== c.humor))[0] }),
  ];
  const outros = embaralhar(muda).slice(0, 3).map((f) => f(alvo));
  const fila = embaralhar([alvo, ...outros]);
  return { alvo, fila, certo: fila.indexOf(alvo) };
}
export function Achados() {
  const v = useViva();
  const [c, setC] = useState(novoCartaz);
  const [marcado, setMarcado] = useState<{ i: number; ok: boolean } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const texto = `Procura-se ${fraseTxt(c.alvo)}.`;
  const tocar = (i: number) => {
    if (msg?.ok) return;
    setValendo(false);
    setMarcado({ i, ok: i === c.certo });
    setPlacar((p) => ({ certas: p.certas + (i === c.certo ? 1 : 0), tent: p.tent + 1 }));
    if (i === c.certo) { setMsg({ ok: true, txt: `É ${fraseTxt(c.alvo)}! Cada adjetivo do cartaz combina.` }); v.acertou("achados", 25, "Achou o personagem perdido!"); }
    else { setMsg({ ok: false, txt: `Esse é ${fraseTxt(c.fila[i])}. Leia o cartaz de novo, adjetivo por adjetivo.` }); v.errou("achados"); }
  };
  const nova = () => { setC(novoCartaz()); setMarcado(null); setMsg(null); setRod((x) => x + 1); };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a língua num lugar de verdade</p>
        <h2>Jogo de contexto: achados e perdidos da fábrica</h2>
        <p className="viva-sub">Alguém perdeu um personagem! Leia o cartaz e toque, na esteira, no personagem que combina com <b>todos</b> os adjetivos.</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● Esteira em 3D · toque no personagem</span>
          <Personagem3D itens={c.fila} onToque={tocar} marcado={marcado} altura={380} />
        </div>
        <div className="viva-card">
          <div className="nd-cartaz">
            <small>PROCURA-SE</small>
            <Frase cfg={c.alvo} grande />
            <Ouvir texto={texto} />
          </div>
          {msg?.ok ? <button type="button" className="viva-btn grande" onClick={nova}>Próximo cartaz</button> : <p className="viva-sub" style={{ margin: 0 }}>Os quatro são parecidos: só um tem todos os adjetivos do cartaz.</p>}
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Achou!" : "Não é esse."}</b> {msg.txt} <Ouvir texto={msg.txt} /></p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>achados</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && !msg?.ok && (valendo
              ? <span><Cronometro segundos={40} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); v.errou("achados", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (40 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5. No mundo */
type Situ = { id: string; e: string; titulo: string; texto: React.ReactNode; lido: string; p: string; op: string[]; certa: string; explica: string };
const SITUS: Situ[] = [
  { id: "cartaz", e: "🐶", titulo: "Cartaz de cachorro perdido", texto: <div className="nd-papel"><b>PROCURA-SE</b><p>Bolinha, um cachorro pequeno, branco e muito brincalhão. Ele usa uma coleira vermelha.</p></div>,
    lido: "Procura-se Bolinha, um cachorro pequeno, branco e muito brincalhão. Ele usa uma coleira vermelha.", p: "Quais palavras do cartaz são adjetivos?",
    op: ["pequeno, branco, brincalhão, vermelha", "Bolinha, cachorro, coleira", "procura, usa", "um, uma, muito"], certa: "pequeno, branco, brincalhão, vermelha", explica: "Pequeno, branco e brincalhão dizem como é o cachorro; vermelha diz como é a coleira. Bolinha é substantivo próprio!" },
  { id: "bolo", e: "🍰", titulo: "Anúncio da padaria", texto: <div className="nd-papel"><b>BOLO DE CHOCOLATE</b><p>Massa fofinha, cobertura cremosa e granulado colorido. Feito hoje!</p></div>,
    lido: "Bolo de chocolate. Massa fofinha, cobertura cremosa e granulado colorido. Feito hoje!", p: "Que palavra diz como é a cobertura?",
    op: ["cremosa", "fofinha", "colorido", "chocolate"], certa: "cremosa", explica: "O adjetivo fica perto do substantivo que ele descreve: cobertura cremosa. Fofinha descreve a massa, e colorido, o granulado." },
  { id: "placa", e: "🏖️", titulo: "Placa da cidade", texto: <div className="nd-papel placa"><b>BEM-VINDO A ARACAJU</b><p>cidade ensolarada e acolhedora</p></div>,
    lido: "Bem-vindo a Aracaju, cidade ensolarada e acolhedora.", p: "Na placa, qual é o substantivo próprio?",
    op: ["Aracaju", "cidade", "ensolarada", "acolhedora"], certa: "Aracaju", explica: "Aracaju é o nome de uma cidade só: substantivo próprio, sempre com letra maiúscula. Cidade é comum; ensolarada e acolhedora são adjetivos." },
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
        <h2>No mundo: cartazes, anúncios e placas</h2>
        <p className="viva-sub">Quem escreve um cartaz ou um anúncio escolhe bem os adjetivos. Acertar de primeira vale 3 estrelas.</p>
      </header>
      <div className="viva-seg" role="group" aria-label="Situações" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {SITUS.map((x) => <button key={x.id} type="button" aria-pressed={aba === x.id} onClick={() => setAba(x.id)}>{x.e} {x.titulo}{v.e.missoes[`mundo-${x.id}`] ? " ★" : ""}</button>)}
      </div>
      <div className="viva-lab">
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">{s.e}</span><div><b>{s.titulo}</b><small>texto do dia a dia</small></div></div>
          {s.texto}
          <Ouvir texto={s.lido} />
        </div>
        <div className="viva-card">
          <p className="viva-missao">{s.p} <Ouvir texto={s.p} /></p>
          <div className="viva-opcoes txt peq">
            {s.op.map((o) => <button key={o} type="button" className={resp[s.id] === o ? (o === s.certa ? "certa" : "errada") : ""} onClick={() => responder(o)}>{o}</button>)}
          </div>
          {resp[s.id] && <p className={`viva-feed ${resp[s.id] === s.certa ? "ok" : "erro"}`}><b>{resp[s.id] === s.certa ? "Certo!" : "Tente de novo."}</b> {resp[s.id] === s.certa ? s.explica : "Lembre: substantivo é o nome; adjetivo diz como é."}</p>}
          <div className="viva-tracejado">
            <small>MÃO NA MASSA</small>
            <p style={{ margin: "4px 0 0", fontSize: ".92rem" }}>Caixa misteriosa: um adulto esconde um objeto numa caixa e a criança descobre só com pistas de adjetivos (é <b>pequeno</b>, <b>redondo</b>, <b>macio</b>…). Depois trocam!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
