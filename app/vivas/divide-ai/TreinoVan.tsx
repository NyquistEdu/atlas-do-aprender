"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Caixa, Cronometro } from "@/components/viva/Shell";

const Rua3D = dynamic(() => import("@/components/viva/Rua3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 420 }}>carregando a rua 3D…</div> });
import { alternativas, div, embaralhar, sorteio } from "@/lib/viva";

type Rodada = { enunciado: React.ReactNode; opcoes: number[]; certa: number; explica: string };

function Triangulo({ topo, a, b }: { topo: string | number; a: string | number; b: string | number }) {
  return (
    <svg viewBox="0 0 120 104" width="120" height="104" aria-hidden="true">
      <polygon points="60,4 116,100 4,100" fill="#f0ecf8" stroke="#6b4fa0" strokeWidth="3" strokeLinejoin="round" />
      <line x1="26" y1="62" x2="94" y2="62" stroke="#6b4fa0" strokeWidth="2" />
      <text x="60" y="50" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1d2433">{topo}</text>
      <text x="38" y="90" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1d2433">{a}</text>
      <text x="82" y="90" textAnchor="middle" fontSize="20" fontWeight="800" fill={b === "?" ? "#c4483b" : "#1d2433"}>{b}</text>
    </svg>
  );
}

const EMO = ["🍪", "🍓", "🐟", "⭐", "🍋", "🌸", "🐞", "🎈"];

const GERADORES: Record<string, () => Rodada> = {
  pratos: () => {
    const k = sorteio(2, 6), q = sorteio(2, 9), n = k * q;
    return {
      enunciado: <><p className="viva-conta">{n} ÷ {k} = <b className="viva-q">?</b></p><p className="viva-mini">{"🍽️".repeat(k)}</p></>,
      opcoes: alternativas(q, [q + 1, q - 1, n - k, k]), certa: q,
      explica: `${n} ÷ ${k} = ${q}, porque ${q} × ${k} = ${n}.`,
    };
  },
  grupos: () => {
    const g = sorteio(2, 5), q = sorteio(2, Math.floor(24 / g)), n = g * q, e = EMO[sorteio(0, EMO.length - 1)];
    return {
      enunciado: <><p className="viva-grade" style={{ gridTemplateColumns: `repeat(${Math.min(n, g * Math.max(1, Math.floor(8 / g)))}, auto)` }}>{Array.from({ length: n }, (_, i) => <span key={i}>{e}</span>)}</p><p className="viva-pergunta">{n} em grupos de <b>{g}</b>: quantos grupos?</p></>,
      opcoes: alternativas(q, [q + 1, g, n - g]), certa: q,
      explica: `Em ${n} cabem ${q} grupos de ${g}: ${q} × ${g} = ${n}.`,
    };
  },
  familia: () => {
    const a = sorteio(2, 9), b = sorteio(3, 9), p = a * b;
    return {
      enunciado: <><Triangulo topo={p} a={a} b="?" /><p className="viva-pergunta">{p} ÷ {a} = ?</p></>,
      opcoes: alternativas(b, [a, p - a, b + 1]), certa: b,
      explica: `${a} × ${b} = ${p}, então ${p} ÷ ${a} = ${b}.`,
    };
  },
  resto: () => {
    const k = sorteio(2, 6), q = sorteio(2, 8), r = sorteio(0, k - 1), n = k * q + r;
    return {
      enunciado: <><p className="viva-conta">{n} ÷ {k}</p><p className="viva-pergunta">Quanto sobra?</p></>,
      opcoes: Array.from({ length: k }, (_, i) => i), certa: r,
      explica: `${q} × ${k} = ${q * k} e ${n} − ${q * k} = ${r}. Sobra ${r}.`,
    };
  },
};

function Jogo({ id, titulo, sub, icone, hab }: { id: keyof typeof GERADORES; titulo: string; sub: string; icone: string; hab: string }) {
  const v = useViva();
  const [r, setR] = useState<Rodada | null>(null);
  const [esc, setEsc] = useState<number | null>(null);
  const [seq, setSeq] = useState(0);
  const [grande, setGrande] = useState(false);
  const [valendo, setValendo] = useState(false);
  const [rod, setRod] = useState(0);
  const nova = useCallback(() => { setR(GERADORES[id]()); setEsc(null); setRod((x) => x + 1); }, [id]);
  useEffect(() => { nova(); }, [nova]);
  if (!r) return null;
  const responder = (o: number) => {
    if (esc !== null) return;
    setEsc(o); setValendo(false);
    if (o === r.certa) {
      const s = seq + 1; setSeq(s); v.sequencia(id, s);
      v.acertou(hab, 10);
      setTimeout(nova, 900);
    } else { setSeq(0); v.errou(hab, r.explica); }
  };
  const corpo = (
    <div className={`viva-jogo ${grande ? "grande" : ""}`}>
      <div className="viva-jogo-topo">
        <span className="viva-jogo-ic">{icone}</span>
        <div><b>{titulo}</b><small>{sub}</small></div>
        <button type="button" className="viva-ico" onClick={() => setGrande(!grande)} aria-label={grande ? "Fechar" : "Ampliar"}>{grande ? "✕" : "⤢"}</button>
      </div>
      <div className="viva-jogo-corpo">{r.enunciado}</div>
      <div className="viva-opcoes">
        {r.opcoes.map((o) => (
          <button key={o} type="button" onClick={() => responder(o)}
            className={esc === null ? "" : o === r.certa ? "certa" : o === esc ? "errada" : "apaga"}>{o}</button>
        ))}
      </div>
      <div className="viva-jogo-pe">
        {esc !== null && esc !== r.certa ? <span className="viva-explica">{r.explica}</span> : <span className="viva-seq">🔥 {seq} seguidos · melhor {v.e.melhor[id] || 0}</span>}
        {v.modo === "juntos" && esc === null && (valendo
          ? <Cronometro segundos={20} rodando={valendo} chaveReinicio={rod} onFim={() => { setValendo(false); setEsc(-1); setSeq(0); v.errou(hab, "Acabou o tempo!"); }} />
          : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (20 s)</button>)}
        {esc !== null && esc !== r.certa && <button type="button" className="viva-btn mini" onClick={nova}>Nova rodada</button>}
      </div>
    </div>
  );
  return grande ? <div className="viva-overlay" onClick={(e) => { if (e.target === e.currentTarget) setGrande(false); }}>{corpo}</div> : corpo;
}

export function Treino() {
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 3 · 4 jogos relâmpago</p>
        <h2>Treino: quatro jogos, rodadas infinitas</h2>
        <p className="viva-sub">A cada acerto vem uma conta nova. No modo juntos, aperte <b>Valendo!</b> e o acerto vale ponto para o time da vez.</p>
      </header>
      <div className="viva-jogos">
        <Jogo id="pratos" titulo="Pratos iguais" sub="Quanto fica em cada prato?" icone="🍽️" hab="repartir" />
        <Jogo id="grupos" titulo="Quantos grupos?" sub="Conte os grupos que cabem." icone="🧺" hab="agrupar" />
        <Jogo id="familia" titulo="Família de contas" sub="A multiplicação ajuda a dividir." icone="🔺" hab="tabuada" />
        <Jogo id="resto" titulo="Caça à sobra" sub="Quanto sobra nesta divisão?" icone="🔍" hab="resto" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- A van do passeio */
const CORES_CRIANCA = ["#e8786d", "#f2b33d", "#5fae7b", "#6f93e0", "#b48ad9", "#e98fb8", "#4fb3b8", "#d98c4f"];

function novaTurma() {
  const C = [4, 5, 6, 8, 10][sorteio(0, 4)];
  let N = sorteio(13, 38);
  if (Math.ceil(N / C) > 10) N = C * 9 + sorteio(1, C - 1);
  return { N, C };
}

export function Van() {
  const v = useViva();
  const [t, setT] = useState(novaTurma);
  const [vans, setVans] = useState(1);
  const [fase, setFase] = useState<"escolher" | "embarque" | "partiu">("escolher");
  const [msg, setMsg] = useState<{ ok: boolean; txt: string } | null>(null);
  const [conta, setConta] = useState(0);
  const [placar, setPlacar] = useState({ certas: 0, tent: 0 });
  const [valendo, setValendo] = useState(false);
  const { q, r } = div(t.N, t.C);
  const precisa = q + (r ? 1 : 0);

  const partir = () => {
    setValendo(false);
    setFase("embarque");
    const dur = Math.min(t.N, vans * t.C) * 120 + 900;
    setTimeout(() => {
      setFase("partiu");
      const ok = vans === precisa;
      const sobraram = Math.max(0, t.N - vans * t.C);
      setPlacar((p) => ({ certas: p.certas + (ok ? 1 : 0), tent: p.tent + 1 }));
      if (ok) {
        setMsg({ ok, txt: `Todo mundo foi! ${t.N} ÷ ${t.C} = ${q}${r ? ` e sobram ${r}: as ${r} crianças que sobraram precisaram de mais uma van. ${precisa} vans.` : `, sem sobra. ${q} vans cheias.`}` });
        v.acertou("resto-problema", 25, "Passeio garantido!");
      } else if (sobraram > 0) {
        setMsg({ ok, txt: `Ficaram ${sobraram} ${sobraram === 1 ? "criança" : "crianças"} na calçada! ${t.N} ÷ ${t.C} = ${q} e sobram ${r}. Quem sobra também precisa de lugar.` });
        v.errou("resto-problema");
      } else {
        setMsg({ ok, txt: `Sobrou van vazia. Bastavam ${precisa}: ${t.N} ÷ ${t.C} = ${q}${r ? ` e sobram ${r}` : ""}.` });
        v.errou("resto-problema");
      }
    }, dur);
  };
  const nova = () => { setT(novaTurma()); setVans(1); setFase("escolher"); setMsg(null); setConta((x) => x + 1); };

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: a van do passeio</h2>
        <p className="viva-sub">A turma vai ao museu. Cada van leva um número de crianças. Quantas vans a escola precisa chamar para <b>ninguém ficar na calçada</b> e <b>nenhuma van ir vazia</b>?</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro sem-pad" style={{ position: "relative" }}>
          <span className="viva-ao-vivo" style={{ position: "absolute", margin: 10, zIndex: 2 }}>● Rua da escola em 3D · {t.N} crianças · vans de {t.C} lugares</span>
          <Rua3D N={t.N} C={t.C} vans={vans} fase={fase} altura={420} />
        </div>

        <div className="viva-card">
          <div className="viva-jogo-topo"><span className="viva-jogo-ic">🚐</span><div><b>A van do passeio</b><small>Chame as vans certas e mande a turma.</small></div></div>
          <div className="viva-tracejado">
            <small>O PROBLEMA</small>
            <p className="viva-conta" style={{ margin: "4px 0" }}><span style={{ color: "var(--v-rosa)" }}>{t.N}</span> crianças ÷ <span style={{ color: "var(--v-azul)" }}>{t.C}</span> lugares</p>
          </div>
          <div className="viva-regua" style={{ ["--rc" as string]: "var(--v-azul)" }}>
            <span className="viva-regua-r">Vans</span>
            <button type="button" disabled={fase !== "escolher"} onClick={() => setVans(Math.max(1, vans - 1))}>−</button>
            <span className="viva-vans">{"🚐".repeat(vans)}</span>
            <button type="button" disabled={fase !== "escolher"} onClick={() => setVans(Math.min(10, vans + 1))}>+</button>
            <output>{vans}</output>
          </div>
          {fase === "escolher"
            ? <button type="button" className="viva-btn grande" onClick={partir}>Partiu! 🚐</button>
            : <button type="button" className="viva-btn grande ghost" onClick={nova}>Nova turma</button>}
          {msg && <p className={`viva-feed ${msg.ok ? "ok" : "erro"}`}><b>{msg.ok ? "Deu certo!" : "Quase!"}</b> {msg.txt}</p>}
          <details className="viva-caderno-d" key={conta}>
            <summary>✏️ Fazer a conta: quantas vans?</summary>
            <p>{t.N} ÷ {t.C} = <Caixa certo={q} rotulo="quociente" dica={`Que número vezes ${t.C} chega perto de ${t.N} sem passar?`} /> e sobram <Caixa certo={r} rotulo="resto" dica={`Tire de ${t.N} as crianças das vans cheias.`} /></p>
            <p>Vans necessárias: <Caixa certo={precisa} rotulo="vans" onCerto={() => v.acertou("resto-problema", 15, "Resolveu pela conta!")} dica={r ? "As que sobram também precisam ir: mais uma van!" : "Sem sobra: as vans cheias bastam."} /></p>
          </details>
          <div className="viva-contadores">
            <span><b>{placar.certas}</b><small>passeios certos</small></span>
            <span><b>{placar.tent}</b><small>tentativas</small></span>
            {v.modo === "juntos" && fase === "escolher" && (valendo
              ? <span><Cronometro segundos={45} rodando={valendo} chaveReinicio={conta} onFim={() => { setValendo(false); v.errou("resto-problema", "Acabou o tempo!"); }} /><small>valendo</small></span>
              : <button type="button" className="viva-btn mini" onClick={() => setValendo(true)}>Valendo! (45 s)</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
