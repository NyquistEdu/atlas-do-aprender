"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useViva, Cronometro } from "@/components/viva/Shell";
import { Regua } from "./CapaLab";
import { NIVEIS, TIMES, div, nivelDe, quemTime } from "@/lib/viva";

const Cena3D = dynamic(() => import("@/components/viva/Cena3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 360 }}>carregando a cena 3D…</div> });

/* ---------------------------------------------------------------- No mundo */
const CARTOES = [
  { e: "🍕", fundo: "linear-gradient(160deg,#ffcf7a,#f08a5d)", t: "Pizza de sexta", p: "A pizza tem 8 fatias e 4 pessoas vão comer o mesmo tanto. Quantas fatias para cada uma?", op: [2, 4, 12], certa: 2, ex: "8 ÷ 4 = 2. É repartir: 2 fatias para cada." },
  { e: "🗓️", fundo: "linear-gradient(160deg,#a8d5ff,#6f93e0)", t: "Calendário", p: "Faltam 21 dias para o aniversário. Quantas semanas são?", op: [3, 14, 28], certa: 3, ex: "21 ÷ 7 = 3. É agrupar: cabem 3 grupos de 7 dias." },
  { e: "⚽", fundo: "linear-gradient(160deg,#b8efc6,#4fae73)", t: "Times no recreio", p: "22 crianças vão jogar, com 11 em cada time. Quantos times?", op: [2, 11, 33], certa: 2, ex: "22 ÷ 11 = 2. Em 22 cabem 2 times de 11." },
];

function Cartao({ c }: { c: (typeof CARTOES)[number] }) {
  const v = useViva();
  const [esc, setEsc] = useState<number | null>(null);
  return (
    <div className="viva-cartao">
      <div className="viva-cartao-img" style={{ background: c.fundo }}><span>{c.e}</span></div>
      <div className="viva-cartao-txt">
        <b>{c.t}</b>
        <p>{c.p}</p>
        <div className="viva-opcoes peq">
          {c.op.map((o) => (
            <button key={o} type="button" className={esc === null ? "" : o === c.certa ? "certa" : o === esc ? "errada" : "apaga"}
              onClick={() => { if (esc !== null) return; setEsc(o); if (o === c.certa) v.acertou("mundo", 10); else v.errou("mundo"); }}>{o}</button>
          ))}
        </div>
        {esc !== null && <small className="viva-explica">{c.ex}</small>}
      </div>
    </div>
  );
}

export function Mundo() {
  const [n, setN] = useState(30);
  const [g, setG] = useState(6);
  const { q, r } = div(n, g);
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 5 · cadê isso na vida</p>
        <h2>No mundo: a fábrica de caixas de ovos</h2>
        <p className="viva-sub">Na granja, os ovos vão para as caixinhas. Mude o tamanho da caixa e veja quantas caixas enchem e quantos ovos sobram.</p>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Granja em 3D · cada caixa leva o mesmo tanto</span>
            <Cena3D n={n} k={g} modo="agrupar" item="ovo" altura={360} />
          </div>
          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <h3 className="viva-h3">Tamanho da caixa</h3>
              <span className="viva-formula-p">{n} ÷ {g} = {q}{r ? ` e sobra ${r}` : ""}</span>
            </div>
            <Regua rotulo="Ovos" cor="var(--v-rosa)" v={n} min={6} max={36} muda={setN} />
            <Regua rotulo="Por caixa" cor="var(--v-laranja)" v={g} min={2} max={12} muda={setG} />
            <p className="viva-sub" style={{ margin: 0 }}><b>{q} {q === 1 ? "caixa cheia" : "caixas cheias"}</b>{r ? <> e <b style={{ color: "var(--v-verm)" }}>{r} {r === 1 ? "ovo solto" : "ovos soltos"}</b>, que não completam uma caixa</> : ", sem sobrar nenhum ovo"}. Caixas de verdade costumam levar 6, 10, 12 ou 30 ovos.</p>
          </div>
        </div>
        <div className="viva-col">
          <h3 className="viva-h3 claro">Onde mais a divisão aparece</h3>
          {CARTOES.map((c) => <Cartao key={c.t} c={c} />)}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Desafio do chefão */
type Q = { cena: string; texto: string; op: string[]; certa: number; passos: string[]; hab: string };
const QUESTOES: Q[] = [
  { cena: "👵🧀🧀🧀🍽️🍽️🍽️🍽️", texto: "Vovó fez 24 pães de queijo e quer colocar o mesmo tanto em 4 pratos. Quantos pães de queijo vão em cada prato?", op: ["4", "6", "8", "20"], certa: 1, hab: "repartir",
    passos: ["É repartir: 24 em 4 partes iguais.", "Que número vezes 4 dá 24? 6 × 4 = 24.", "Então 24 ÷ 4 = 6: são 6 em cada prato."] },
  { cena: "🏃‍♀️🏃🛍️🛍️🏁", texto: "Na corrida do saco, 18 crianças vão correr em duplas. Quantas duplas vão se formar?", op: ["9", "16", "20", "36"], certa: 0, hab: "agrupar",
    passos: ["É agrupar: grupos de 2 dentro de 18.", "9 × 2 = 18.", "Então 18 ÷ 2 = 9 duplas. Formar duplas é o mesmo que achar a metade."] },
  { cena: "🧒👧🧒👧🧒🚐🚐🏛️", texto: "29 crianças vão ao museu em vans de 6 lugares. Quantas vans a escola precisa chamar?", op: ["4", "5", "6", "23"], certa: 1, hab: "resto-problema",
    passos: ["29 ÷ 6: 4 × 6 = 24 e sobram 5 crianças.", "4 vans levam só 24. As 5 que sobram também precisam ir.", "Então são 5 vans (a última vai com 5 crianças)."] },
  { cena: "👧💰📚📚📚", texto: "Malu tem 50 reais. Cada livro da feira custa 10 reais. Quantos livros ela pode comprar?", op: ["4", "5", "40", "60"], certa: 1, hab: "numeros-grandes",
    passos: ["É agrupar: quantos 10 cabem em 50?", "Dividir por 10 é tirar o zero: 50 ÷ 10 = 5.", "Ela pode comprar 5 livros."] },
  { cena: "👦🃏🃏🃏🃏🧒🧒🧒", texto: "Téo repartiu 17 figurinhas entre 3 amigos e disse: “4 para cada e sobram 5”. Qual é a resposta certa?", op: ["Ele está certo", "5 para cada e sobram 2", "6 para cada", "4 para cada e sobra 1"], certa: 1, hab: "resto",
    passos: ["Se sobram 5 e são 3 amigos, ainda dá mais uma rodada: o resto é sempre menor que 3.", "5 × 3 = 15 e 17 − 15 = 2.", "Então são 5 figurinhas para cada e sobram 2."] },
];

export function Desafio() {
  const v = useViva();
  const [i, setI] = useState(0);
  const [esc, setEsc] = useState<number | null>(null);
  const [passo, setPasso] = useState(0);
  const [acertos, setAcertos] = useState<boolean[]>([]);
  const [valendo, setValendo] = useState(false);
  const fim = acertos.length === QUESTOES.length;
  const q = QUESTOES[Math.min(i, QUESTOES.length - 1)];
  const juntos = v.modo === "juntos";
  const venceu = acertos.length === QUESTOES.length && acertos.filter(Boolean).length >= 4;
  useEffect(() => { if (venceu) v.venceuChefao(acertos.filter(Boolean).length, QUESTOES.length); }, [venceu]); // eslint-disable-line react-hooks/exhaustive-deps

  const responder = (o: number) => {
    if (esc !== null) return;
    setEsc(o); setValendo(false);
    const ok = o === q.certa;
    setAcertos((a) => [...a, ok]);
    if (ok) v.acertou(q.hab, 20, "Acertou!"); else v.errou(q.hab);
    setPasso(juntos ? 0 : q.passos.length);
  };
  const proxima = () => { setI((x) => x + 1); setEsc(null); setPasso(0); };
  const reiniciar = () => { setI(0); setEsc(null); setPasso(0); setAcertos([]); };
  const total = acertos.filter(Boolean).length;

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 6 · hora do desafio</p>
        <h2>Desafio do chefão: o Polvo Pega-Sobra 🐙</h2>
        <p className="viva-sub">Ele rouba tudo o que sobra das divisões. Acerte pelo menos 4 das 5 questões para derrotá-lo.</p>
      </header>
      {fim ? (
        <div className="viva-card viva-fim">
          <p className="viva-fim-e">{total >= 4 ? "🏆" : "🐙"}</p>
          <h3 className="viva-h3">{total >= 4 ? "Você derrotou o Polvo Pega-Sobra!" : "O polvo escapou desta vez…"}</h3>
          <p>{total} de {QUESTOES.length} questões certas.</p>
          <p className="viva-bolinhas fim">{acertos.map((a, k) => <span key={k} className={a ? "feita" : "erro"}>{a ? "✓" : "✕"}</span>)}</p>
          <div className="viva-row" style={{ justifyContent: "center" }}>
            <button type="button" className="viva-btn" onClick={reiniciar}>Jogar de novo</button>
            <button type="button" className="viva-btn ghost" onClick={() => v.irPara(7)}>Ver o resumo</button>
          </div>
        </div>
      ) : (
        <div className="viva-desafio">
          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <small className="viva-kick">Questão {i + 1} de {QUESTOES.length}</small>
              {juntos && (esc === null
                ? (valendo ? <Cronometro segundos={90} rodando={valendo} chaveReinicio={i} onFim={() => { setValendo(false); setEsc(-1); setAcertos((a) => [...a, false]); v.errou(q.hab, "Acabou o tempo!"); }} />
                  : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (90 s)</button>)
                : null)}
            </div>
            <div className="viva-q-cena" aria-hidden="true">{q.cena}</div>
            <p className="viva-q-texto">{q.texto}</p>
            <div className="viva-alts">
              {q.op.map((o, k) => (
                <button key={o} type="button" onClick={() => responder(k)}
                  className={esc === null ? "" : k === q.certa ? "certa" : k === esc ? "errada" : "apaga"}>
                  <i>{"ABCD"[k]}</i>{o}
                </button>
              ))}
            </div>
          </div>
          <div className="viva-card viva-resol">
            <h3 className="viva-h3">Resolução</h3>
            {esc === null ? <p className="viva-sub">Escolha uma alternativa. {juntos ? "Depois, revele a resolução um passo de cada vez com a turma." : "A resolução aparece logo depois."}</p> : (
              <>
                <ol>{q.passos.slice(0, passo).map((p) => <li key={p}>{p}</li>)}</ol>
                <div className="viva-row">
                  {passo < q.passos.length && <button type="button" className="viva-btn" onClick={() => setPasso(passo + 1)}>Revelar próximo passo</button>}
                  {passo >= q.passos.length && <button type="button" className="viva-btn" onClick={proxima}>{i + 1 < QUESTOES.length ? "Próxima questão →" : "Ver o resultado"}</button>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Resumo */
const RESUMO = [
  { n: 1, t: "Repartir", f: "quanto para cada um?", ex: "12 balas entre 3 crianças: 12 ÷ 3 = 4 para cada." },
  { n: 2, t: "Agrupar", f: "quantos grupos cabem?", ex: "20 ovos em caixas de 4: 20 ÷ 4 = 5 caixas." },
  { n: 3, t: "O sinal ÷", f: "lê-se “dividido por”", ex: "12 ÷ 3 = 4: doze dividido por três é igual a quatro." },
  { n: 4, t: "Parceira da multiplicação", f: "para dividir, pense na tabuada", ex: "24 ÷ 6 = 4 porque 4 × 6 = 24." },
  { n: 5, t: "O resto", f: "sempre menor que o divisor", ex: "13 ÷ 3 = 4 e sobra 1. Confere: 4 × 3 + 1 = 13." },
  { n: 6, t: "Números maiores", f: "separe em partes fáceis", ex: "36 ÷ 3: 30 ÷ 3 = 10 e 6 ÷ 3 = 2. Total 12." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", t: "Resto grande demais", d: "14 ÷ 3 não é “3 e sobram 5”. Se sobra 3 ou mais, ainda dá mais uma rodada: 4 e sobram 2." },
  { cor: "#f4a6c0", t: "Esqueceu quem sobrou", d: "26 crianças, vans de 4: 26 ÷ 4 = 6 e sobram 2. São 7 vans, não 6!" },
  { cor: "#a9d3f5", t: "Ordem importa", d: "12 ÷ 3 não é igual a 3 ÷ 12. O primeiro número é sempre o que vai ser dividido." },
];
const HABS: Record<string, string> = { repartir: "Repartir em partes iguais", agrupar: "Agrupar", tabuada: "Dividir pela tabuada", resto: "Achar o resto", "resto-problema": "O que fazer com o resto", "numeros-grandes": "Números maiores", mundo: "Divisão no dia a dia", lab: "Laboratório", "lab-conta": "Fazer a conta" };

export function Resumo() {
  const v = useViva();
  const nv = nivelDe(v.e.xp);
  const missoes = Object.keys(v.e.missoes).length;
  const estrelas = Object.values(v.e.missoes).reduce((a, b) => a + b, 0);
  const treinar = Object.entries(v.e.erros).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const { sol, lua } = v.e.placar;
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 7 · para revisar antes da prova</p>
        <h2>Resumo da fase e as pegadinhas</h2>
      </header>
      <div className="viva-resumo">
        <div className="viva-caderno-resumo">
          <p className="viva-mao escuro">Divide Aí! · tudo o que você precisa lembrar</p>
          <div className="viva-res-grid">
            {RESUMO.map((r) => (
              <div key={r.n} className="viva-res">
                <b><i>{r.n}</i>{r.t}</b>
                <span>{r.f}</span>
                <small>{r.ex}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="viva-col">
          {v.modo === "juntos" ? (
            <div className="viva-card">
              <h3 className="viva-h3">Placar da partida</h3>
              {(["sol", "lua"] as const).map((t) => <p key={t} className="viva-placar-l"><span>{TIMES[t].icone} {quemTime(v.e, t, false)}</span><b style={{ color: TIMES[t].cor }}>{v.e.placar[t]}</b></p>)}
              <p className="viva-vencedor">{sol === lua ? (sol === 0 ? "Ainda sem pontos. Bora jogar!" : "Empate! Rodada extra?") : `${TIMES[sol > lua ? "sol" : "lua"].icone} ${quemTime(v.e, sol > lua ? "sol" : "lua", false)} venceu!`}</p>
              <button type="button" className="viva-btn" onClick={v.zerarPlacar}>Zerar placar</button>
            </div>
          ) : (
            <div className="viva-card">
              <h3 className="viva-h3">Meu progresso</h3>
              <p className="viva-nivel-g">{nv.icone} <b>{nv.nome}</b> <small>{v.e.xp} XP</small></p>
              <div className="viva-niveis">{NIVEIS.map((n, k) => <span key={n.nome} className={k <= nv.i ? "on" : ""}><b>{n.icone}</b>{n.nome}</span>)}</div>
              <p className="viva-sub">{missoes} de 6 missões · {estrelas} ⭐{nv.prox ? ` · faltam ${nv.prox.xp - v.e.xp} XP para ${nv.prox.nome}` : ""}</p>
              {treinar.length > 0 && <><small className="viva-kick">Para treinar mais</small><ul className="viva-treinar">{treinar.map(([h, n]) => <li key={h}>{HABS[h] || h} <small>({n} {n === 1 ? "erro" : "erros"})</small></li>)}</ul></>}
              <button type="button" className="link-btn" onClick={() => { if (window.confirm("Apagar o progresso desta fase neste aparelho?")) v.recomecar(); }}>recomeçar a fase</button>
            </div>
          )}
          <div className="viva-notas">
            {PEGADINHAS.map((p, k) => <div key={p.t} className="viva-nota" style={{ background: p.cor, transform: `rotate(${[-1.5, 1.2, -0.8][k]}deg)` }}><b>Pegadinha {k + 1}</b><span>{p.d}</span></div>)}
          </div>
          <div className="viva-card">
            <h3 className="viva-h3">Para continuar</h3>
            <ul className="viva-links">
              <li><Link href="/apostilas/divide-ai">📘 Apostila Divide Aí! em PDF (grátis)</Link></li>
              <li><Link href="/trilhas/matematica/3-ano#tema-2">🗺️ A fase 2 na trilha de Matemática do 3º ano</Link></li>
              <li><Link href="/vivas">✨ Outras Fases Vivas</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
