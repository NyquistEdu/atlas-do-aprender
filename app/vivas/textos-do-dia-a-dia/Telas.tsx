"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Cronometro, type Tela } from "@/components/viva/Shell";
import { JogoTexto, Ouvir, type RodadaTexto } from "@/components/viva/Comuns";
import { embaralhar, sorteio } from "@/lib/viva";
import type { CasoPapel } from "@/components/viva/Papel3D";
import type { Envio } from "@/components/viva/Correio3D";
import { GEN, TEXTOS, type Genero } from "./textos";

const carregando = (h: number, txt: string) => function Carregando() { return <div className="viva-3d carregando" style={{ height: h }}>{txt}</div>; };
const Papel3D = dynamic(() => import("@/components/viva/Papel3D"), { ssr: false, loading: carregando(420, "carregando a mesa 3D…") });
const Correio3D = dynamic(() => import("@/components/viva/Correio3D"), { ssr: false, loading: carregando(380, "carregando o correio 3D…") });

const DESC: Record<number, string> = { 2: "monte notícia, carta e receita", 3: "4 jogos relâmpago", 4: "o correio da escola em 3D", 5: "e-mail, embalagem e rádio", 6: "5 desafios do chefão", 7: "resumo e pegadinhas" };
const folhaDe = (ti: number, feitas: number, destaque = true) => ({ genero: TEXTOS[ti].genero, partes: TEXTOS[ti].partes, feitas, destaque });

/* ---------------------------------------------------------------- 1. Capa */
export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<CasoPapel[]>(() => [
    { folha: folhaDe(0, 1), legenda: "📰 A notícia começa pela manchete…" },
    { folha: folhaDe(0, 3), legenda: "📰 …e o lide conta o quê, quem, quando e onde." },
    { folha: folhaDe(0, 4, false), legenda: "📰 Notícia: informa o que aconteceu." },
    { folha: folhaDe(1, 2), legenda: "✉️ A carta tem local e data, saudação…" },
    { folha: folhaDe(1, 5, false), legenda: "✉️ …mensagem, despedida e assinatura." },
    { folha: folhaDe(2, 3), legenda: "🍳 A receita separa os ingredientes…" },
    { folha: folhaDe(2, 4, false), legenda: "🍳 …e ensina o passo a passo." },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Português · 4º ano · Fase 1</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Textos do Dia a Dia</span></h1>
        <p className="viva-formula">cada texto tem um <b>jeito</b> e uma <b>função</b></p>
        <p className="viva-mao">notícia, carta e receita, parte por parte</p>
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
        <Papel3D folha={folhaDe(0, 0)} casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={400} />
        <div className="nd-capa-leg" style={{ minHeight: 60 }}><b>{leg || " "}</b></div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Laboratório */
export function Laboratorio() {
  const v = useViva();
  const primeira = Math.max(0, TEXTOS.findIndex((t) => !v.e.missoes[t.id]));
  const [ti, setTi] = useState(primeira);
  const [postas, setPostas] = useState<string[]>([]);
  const [erros, setErros] = useState(0);
  const [errada, setErrada] = useState<string | null>(null);
  const tx = TEXTOS[ti], g = GEN[tx.genero];
  const cartas = useMemo(() => { let l = embaralhar(tx.partes); while (l.length > 1 && l[0].id === tx.partes[0].id) l = embaralhar(tx.partes); return l; }, [ti]); // eslint-disable-line react-hooks/exhaustive-deps
  const feitas = TEXTOS.filter((t) => v.e.missoes[t.id]).length;
  const pronto = postas.length === tx.partes.length;
  const trocar = (i: number) => { setTi(i); setPostas([]); setErros(0); setErrada(null); };
  const escolher = (id: string) => {
    if (pronto || postas.includes(id)) return;
    const prox = tx.partes[postas.length];
    if (id === prox.id) {
      const np = [...postas, id]; setPostas(np); setErrada(null);
      if (np.length === tx.partes.length) {
        const est = erros === 0 ? 3 : erros <= 2 ? 2 : 1;
        if (!v.e.missoes[tx.id]) { v.missao(tx.id, est); v.acertou("lab", 20, `${g.nome} montada! ${"⭐".repeat(est)}`); }
        else v.aviso(`${g.nome} montada de novo!`, "ok");
      }
    } else { setErros((e) => e + 1); setErrada(id); v.errou("lab", prox.dica); }
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: monte o texto na ordem certa</h2>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card">
            <div className="viva-bolinhas">
              {TEXTOS.map((t, i) => <button key={t.id} type="button" className={`${v.e.missoes[t.id] ? "feita" : ""} ${i === ti ? "atual" : ""}`} onClick={() => trocar(i)} aria-label={`Missão ${i + 1}: ${GEN[t.genero].nome}`}>{v.e.missoes[t.id] ? "★" : GEN[t.genero].e}</button>)}
            </div>
            <p className="viva-missao"><b>Missão {ti + 1}/{TEXTOS.length}</b> · Monte a {g.nome.toLowerCase()} “{tx.titulo}”: toque nas partes na ordem em que elas aparecem. <Ouvir texto={`Monte a ${g.nome.toLowerCase()}: toque nas partes na ordem em que elas aparecem no texto.`} /></p>
            <div className="viva-row">
              <span className="tx-serve" style={{ ["--c" as string]: g.cor }}>{g.e} {g.nome} serve para <b>{g.serve}</b>.</span>
              <span className="viva-prog"><small>{feitas === TEXTOS.length ? "Todas as missões cumpridas! ⭐" : `${feitas} de ${TEXTOS.length} missões`}</small><i style={{ width: `${(feitas / TEXTOS.length) * 100}%` }} /></span>
            </div>
          </div>
          <div className="viva-card">
            <h3 className="nd-h">Partes embaralhadas · próxima: <span className="tx-prox">{pronto ? "pronto!" : `parte ${postas.length + 1} de ${tx.partes.length}`}</span></h3>
            <div className="tx-cartas">
              {cartas.map((p) => {
                const usada = postas.includes(p.id);
                return (
                  <button key={p.id} type="button" disabled={usada || pronto} className={`tx-carta ${usada ? "usada" : ""} ${errada === p.id ? "errada" : ""}`} onClick={() => escolher(p.id)} style={{ ["--c" as string]: g.cor }}>
                    <small>{usada ? `✓ ${p.nome}` : "?"}</small>
                    <span>{p.txt.split("\n").slice(0, 3).join(" ")}{p.txt.split("\n").length > 3 ? " …" : ""}</span>
                  </button>
                );
              })}
            </div>
            <div className="viva-row">
              {pronto && <button type="button" className="viva-btn" onClick={() => trocar((ti + 1) % TEXTOS.length)}>Próximo texto →</button>}
              <button type="button" className="viva-btn ghost" onClick={() => trocar(ti)}>Recomeçar</button>
              <small className="viva-sub">erros: {erros}</small>
            </div>
          </div>
        </div>
        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Mesa em 3D · o texto vai se montando</span>
            <Papel3D folha={folhaDe(ti, postas.length)} altura={520} />
          </div>
          <div className="viva-raiox">
            {tx.partes.map((p, i) => <div key={p.id}><small>PARTE {i + 1}</small><b className="mini">{i < postas.length ? p.nome : "?"}</b></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Treino */
const TRECHOS: [string, Genero][] = [
  ...TEXTOS.flatMap((t) => t.partes.filter((p) => !["local", "assinatura", "rtitulo"].includes(p.id)).map((p) => [p.txt.split("\n")[0], t.genero] as [string, Genero])),
  ["Bata as claras em neve e misture devagar.", "receita"], ["Oi, Pedro! Como vão as férias aí no sítio?", "carta"],
  ["Ônibus escolar ganha nova rota no bairro Siqueira Campos", "noticia"], ["• 3 bananas maduras • 1 xícara de aveia", "receita"],
  ["Com carinho, sua tia Rosa", "carta"], ["Segundo os moradores, a ponte será reaberta na segunda-feira.", "noticia"],
];
const FATOS: [string, boolean][] = [
  ["A escola recebeu 500 livros na sexta-feira.", true], ["Essa foi a festa mais bonita do ano.", false], ["Choveu durante toda a madrugada em Aracaju.", true],
  ["O time azul jogou muito melhor que o vermelho.", false], ["A feira começa às 8 horas e vai até o meio-dia.", true], ["Todo mundo vai adorar o novo parquinho.", false],
  ["82 filhotes de tartaruga chegaram ao mar.", true], ["Cuscuz é a comida mais gostosa do mundo.", false], ["A ponte ficou fechada por três dias.", true], ["O desenho novo é chato demais.", false],
];
const FORMAIS: [string, boolean][] = [
  ["Prezado senhor diretor,", true], ["Oi, Bia! Tudo joia?", false], ["Atenciosamente,", true], ["Beijão, até mais!", false],
  ["Venho por meio desta solicitar uma nova quadra.", true], ["Tô morrendo de saudade, vó!", false], ["Respeitosamente,", true], ["E aí, primo, bora jogar bola?", false],
  ["Senhora secretária de Educação,", true], ["Fica com Deus e manda um abraço pra todo mundo!", false],
];
const gerar = {
  genero: (): RodadaTexto => {
    const [txt, gnr] = TRECHOS[sorteio(0, TRECHOS.length - 1)];
    return {
      enunciado: <><p className="tx-trecho">“{txt}”</p><p className="viva-pergunta">De que gênero é este trecho? <Ouvir texto={`${txt}. De que gênero é este trecho?`} /></p></>,
      opcoes: ["📰 Notícia", "✉️ Carta", "🍳 Receita"], certa: `${GEN[gnr].e} ${GEN[gnr].nome}`,
      explica: gnr === "noticia" ? "Informa um fato: o que aconteceu, quando e onde. É notícia." : gnr === "carta" ? "Conversa com alguém: tem saudação, mensagem ou despedida. É carta." : "Ensina a fazer algo: ingredientes ou passos com verbos de ordem. É receita.",
    };
  },
  parte: (): RodadaTexto => {
    const tx = TEXTOS[sorteio(0, TEXTOS.length - 1)], p = tx.partes[sorteio(0, tx.partes.length - 1)];
    const nomes = tx.partes.map((x) => x.nome);
    return {
      enunciado: <><p className="tx-trecho">“{p.txt.split("\n").slice(0, 2).join(" ")}{p.txt.split("\n").length > 2 ? " …" : ""}”</p><p className="viva-pergunta">Nesta {GEN[tx.genero].nome.toLowerCase()}, que parte é essa? <Ouvir texto={`${p.txt}. Nesta ${GEN[tx.genero].nome.toLowerCase()}, que parte é essa?`} /></p></>,
      opcoes: embaralhar([p.nome, ...embaralhar(nomes.filter((x) => x !== p.nome)).slice(0, 3)]),
      certa: p.nome, explica: p.dica,
    };
  },
  fato: (): RodadaTexto => {
    const [txt, f] = FATOS[sorteio(0, FATOS.length - 1)];
    return {
      enunciado: <><p className="tx-trecho">“{txt}”</p><p className="viva-pergunta">É fato ou opinião? <Ouvir texto={`${txt}. É fato ou opinião?`} /></p></>,
      opcoes: ["Fato", "Opinião"], certa: f ? "Fato" : "Opinião",
      explica: f ? "Dá para conferir se é verdade (contar, olhar o relógio, perguntar). É fato, e a notícia é feita de fatos." : "É o que alguém acha; outra pessoa pode achar diferente. É opinião.",
    };
  },
  formal: (): RodadaTexto => {
    const [txt, f] = FORMAIS[sorteio(0, FORMAIS.length - 1)];
    return {
      enunciado: <><p className="tx-trecho">“{txt}”</p><p className="viva-pergunta">Linguagem formal ou informal? <Ouvir texto={`${txt}. É linguagem formal ou informal?`} /></p></>,
      opcoes: ["Formal", "Informal"], certa: f ? "Formal" : "Informal",
      explica: f ? "Jeito cuidadoso, para quem a gente não tem intimidade: diretor, prefeito, empresa. É formal." : "Jeito de falar com família e amigos, cheio de carinho e gírias. É informal.",
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
        <JogoTexto id="genero" titulo="Que gênero é?" sub="Notícia, carta ou receita?" icone="🗂️" hab="genero" gerar={gerar.genero} />
        <JogoTexto id="parte" titulo="Que parte é essa?" sub="Cada texto tem suas partes." icone="🧩" hab="parte" gerar={gerar.parte} />
        <JogoTexto id="fato" titulo="Fato ou opinião?" sub="A notícia conta fatos." icone="🔍" hab="fato" gerar={gerar.fato} />
        <JogoTexto id="formal" titulo="Formal ou informal?" sub="Depende de quem vai ler." icone="🎩" hab="formal" gerar={gerar.formal} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. O correio da escola */
const DESTS: { g: Genero; rot: string }[] = [{ g: "noticia", rot: "📰 Banca do jornal" }, { g: "carta", rot: "✉️ Caixa de cartas" }, { g: "receita", rot: "🍳 Caixa de receitas" }];
const PISTA: Record<Genero, string> = { noticia: "conta um fato que aconteceu, com quando e onde", carta: "conversa com alguém, com saudação ou despedida", receita: "ensina a fazer, com ingredientes ou passos de ordem" };
export function Correio() {
  const v = useViva();
  const fila = useMemo(() => embaralhar(TRECHOS), []);
  const [i, setI] = useState(0);
  const [rodada, setRodada] = useState(0);
  const [envio, setEnvio] = useState<Envio>(null);
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0, seq: 0 });
  const [valendo, setValendo] = useState(false);
  const [txt, gnr] = fila[i % fila.length];
  const ocupado = msg?.ok === true;
  const mandar = (d: 0 | 1 | 2) => {
    if (ocupado) return;
    setValendo(false);
    const ok = DESTS[d].g === gnr;
    setEnvio({ dest: d, ok, n: Date.now() });
    setPlacar((p) => ({ certas: p.certas + (ok ? 1 : 0), tent: p.tent + 1, seq: ok ? p.seq + 1 : 0 }));
    if (ok) {
      setMsg({ ok: true, txt: `É ${GEN[gnr].nome.toLowerCase()}: ${PISTA[gnr]}.` }); v.acertou("correio", 15, placar.seq + 1 >= 3 ? `${placar.seq + 1} seguidas! 🔥` : "Entregue no lugar certo!");
      setTimeout(() => { setI((x) => x + 1); setRodada((r) => r + 1); setMsg(null); setEnvio(null); }, 1500);
    } else { setMsg({ ok: false, txt: `Não é ${GEN[DESTS[d].g].nome.toLowerCase()}. Pista: este texto ${PISTA[gnr]}.` }); v.errou("correio"); }
  };
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a língua num lugar de verdade</p>
        <h2>Jogo de contexto: o correio da escola</h2>
        <p className="viva-sub">Chegou uma folha! Leia o trecho e mande para o lugar certo: banca do jornal, caixa de cartas ou caixa de receitas.</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro">
          <span className="viva-ao-vivo">● Correio em 3D</span>
          <Correio3D rodada={rodada} envio={envio} altura={380} />
        </div>
        <div className="viva-card">
          <div className="nd-papel" style={{ transform: "rotate(-.6deg)" }}><b>📄 TRECHO {i + 1}</b><p>“{txt}”</p></div>
          <Ouvir texto={txt} />
          <div className="tx-destinos">
            {DESTS.map((d, k) => <button key={d.g} type="button" className="viva-btn" disabled={ocupado} onClick={() => mandar(k as 0 | 1 | 2)}>{d.rot}</button>)}
          </div>
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Entregue!" : "Voltou!"}</b> {msg.txt} <Ouvir texto={msg.txt} /></p>}
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>entregas certas</small></span>
            <span><b>{placar.seq}</b><small>seguidas</small></span>
            {v.modo === "juntos" && !ocupado && (valendo
              ? <span><Cronometro segundos={25} rodando={valendo} chaveReinicio={i} onFim={() => { setValendo(false); v.errou("correio", "Acabou o tempo!"); }} /><small>valendo</small></span>
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
  { id: "email", e: "📧", titulo: "O e-mail da tia", lido: "Assunto: Saudade! Oi, tia Neide! Hoje ganhei medalha na corrida da escola. Quando a senhora vem? Beijos, Davi.",
    texto: <div className="nd-papel tx-email"><small>De: davi@… · Para: tia Neide · Assunto: Saudade!</small><p>Oi, tia Neide!<br />Hoje ganhei medalha na corrida da escola. Quando a senhora vem?<br />Beijos,<br />Davi</p></div>,
    p: "Este e-mail é parecido com qual gênero?", op: ["Carta", "Notícia", "Receita", "Nenhum"], certa: "Carta", explica: "Tem saudação (Oi, tia Neide!), mensagem, despedida (Beijos) e assinatura (Davi): o e-mail é a carta dos dias de hoje." },
  { id: "pacote", e: "🍝", titulo: "A embalagem do macarrão", lido: "Modo de preparo: 1. Ferva 2 litros de água com sal. 2. Coloque o macarrão e cozinhe por 8 minutos. 3. Escorra e sirva com o molho.",
    texto: <div className="nd-papel"><b>MODO DE PREPARO</b><p>1. Ferva 2 litros de água com sal.<br />2. Coloque o macarrão e cozinhe por 8 minutos.<br />3. Escorra e sirva com o molho.</p></div>,
    p: "Que palavras dão ordem, como numa receita?", op: ["ferva, coloque, escorra", "macarrão, água, sal", "2 litros, 8 minutos", "modo, preparo"], certa: "ferva, coloque, escorra", explica: "Na receita, os verbos dão ordem: ferva, coloque, cozinhe, escorra, sirva. Até a embalagem do macarrão tem uma receita!" },
  { id: "radio", e: "📻", titulo: "A notícia no rádio", lido: "Choveu forte em Aracaju nesta madrugada, e ruas do centro ficaram alagadas, contaram os moradores.",
    texto: <div className="nd-papel"><b>📻 NOTÍCIA DA MANHÃ</b><p>Choveu forte em Aracaju nesta madrugada, e ruas do centro ficaram alagadas, contaram os moradores.</p></div>,
    p: "Quando aconteceu o fato da notícia?", op: ["nesta madrugada", "em Aracaju", "ruas alagadas", "os moradores"], certa: "nesta madrugada", explica: "O lide responde: o quê (choveu forte), onde (em Aracaju), quando (nesta madrugada) e quem conta (os moradores)." },
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
        <h2>No mundo: e-mail, embalagem e rádio</h2>
        <p className="viva-sub">Os gêneros aparecem em todo lugar, às vezes com roupa nova. Acertar de primeira vale 3 estrelas.</p>
      </header>
      <div className="viva-seg" role="group" aria-label="Situações" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {SITUS.map((x) => <button key={x.id} type="button" aria-pressed={aba === x.id} onClick={() => setAba(x.id)}>{x.e} {x.titulo}{v.e.missoes[`mundo-${x.id}`] ? " ★" : ""}</button>)}
      </div>
      <div className="viva-lab">
        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">{s.e}</span><div><b>{s.titulo}</b><small>texto da vida real</small></div></div>
          {s.texto}
          <Ouvir texto={s.lido} />
        </div>
        <div className="viva-card">
          <p className="viva-missao">{s.p} <Ouvir texto={s.p} /></p>
          <div className="viva-opcoes txt peq">
            {s.op.map((o) => <button key={o} type="button" className={resp[s.id] === o ? (o === s.certa ? "certa" : "errada") : ""} onClick={() => responder(o)}>{o}</button>)}
          </div>
          {resp[s.id] && <p className={`viva-feed ${resp[s.id] === s.certa ? "ok" : "erro"}`}><b>{resp[s.id] === s.certa ? "Certo!" : "Tente de novo."}</b> {resp[s.id] === s.certa ? s.explica : "Leia o texto de novo e pense: para que ele serve?"}</p>}
          <div className="viva-tracejado">
            <small>MÃO NA MASSA</small>
            <p style={{ margin: "4px 0 0", fontSize: ".92rem" }}>Escreva com a família: uma <b>notícia</b> do que aconteceu na semana, uma <b>carta</b> para alguém que mora longe e a <b>receita</b> preferida da casa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
