"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useViva, Caixa, Cronometro } from "@/components/viva/Shell";
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
  const cores = useMemo(() => embaralhar(Array.from({ length: t.N }, (_, i) => CORES_CRIANCA[i % CORES_CRIANCA.length])), [t]);

  const partir = () => {
    setValendo(false);
    setFase("embarque");
    const dur = Math.min(t.N, vans * t.C) * 70 + 700;
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

  // posições (unidades do desenho 960 × 430)
  const posCrianca = (i: number) => ({ x: 40 + (i % 10) * 33, y: 300 + Math.floor(i / 10) * 34 });
  const posVan = (j: number) => ({ x: 410 + (j % 5) * 106, y: j < 5 ? 150 : 250 });
  const assento = (i: number) => {
    const j = Math.floor(i / t.C), s = i % t.C, p = posVan(j);
    return { x: p.x + 18 + (s % 5) * 14, y: p.y + 20 + Math.floor(s / 5) * 13, van: j };
  };

  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 4 · a matemática num lugar de verdade</p>
        <h2>Jogo de contexto: a van do passeio</h2>
        <p className="viva-sub">A turma vai ao museu. Cada van leva um número de crianças. Quantas vans a escola precisa chamar para <b>ninguém ficar na calçada</b> e <b>nenhuma van ir vazia</b>?</p>
      </header>
      <div className="viva-van">
        <div className="viva-card escuro sem-pad">
          <svg viewBox="0 0 960 430" className="viva-cenario" role="img" aria-label={`${t.N} crianças e vans de ${t.C} lugares`}>
            <defs>
              <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe0ff" /><stop offset="1" stopColor="#eef7ff" /></linearGradient>
            </defs>
            <rect width="960" height="430" fill="url(#ceu)" />
            <circle cx="880" cy="60" r="34" fill="#ffd36b" />
            {[[120, 70], [560, 50], [760, 95]].map(([x, y], i) => <g key={i} fill="#fff" opacity=".9"><ellipse cx={x} cy={y} rx="46" ry="16" /><ellipse cx={x + 26} cy={y - 10} rx="28" ry="14" /></g>)}
            {/* escola */}
            <g>
              <rect x="30" y="120" width="330" height="160" fill="#f6d9b4" stroke="#c9a173" strokeWidth="3" rx="6" />
              <polygon points="20,124 195,62 370,124" fill="#c4483b" />
              <rect x="160" y="200" width="70" height="80" fill="#8a5a3b" rx="4" />
              {[50, 105, 260, 305].map((x) => <rect key={x} x={x} y="150" width="38" height="34" fill="#9fd0f0" stroke="#fff" strokeWidth="3" />)}
              <rect x="120" y="96" width="150" height="26" rx="5" fill="#fff" /><text x="195" y="114" textAnchor="middle" fontSize="15" fontWeight="800" fill="#1d2433">ESCOLA</text>
            </g>
            {/* chão */}
            <rect y="280" width="960" height="150" fill="#cfd6df" />
            <rect x="380" y="132" width="580" height="210" fill="#5b6273" />
            {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={400 + i * 100} y="236" width="50" height="6" fill="#f2f2f2" />)}
            {/* vans */}
            {Array.from({ length: vans }, (_, j) => {
              const p = posVan(j);
              const anda = fase === "partiu" ? 700 : 0;
              return (
                <g key={j} style={{ transform: `translate(${anda}px, 0)`, transition: `transform 1.4s ${j * 0.08}s ease-in` }}>
                  <rect x={p.x} y={p.y} width="94" height="62" rx="12" fill={["#f2b33d", "#6f93e0", "#5fae7b", "#e8786d", "#b48ad9"][j % 5]} stroke="#1d2433" strokeWidth="2.5" />
                  <rect x={p.x + 8} y={p.y + 8} width="78" height="30" rx="5" fill="#dff1ff" stroke="#1d2433" strokeWidth="1.5" />
                  <circle cx={p.x + 22} cy={p.y + 64} r="9" fill="#1d2433" /><circle cx={p.x + 74} cy={p.y + 64} r="9" fill="#1d2433" />
                  <text x={p.x + 47} y={p.y + 54} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1d2433">{t.C} lugares</text>
                </g>
              );
            })}
            {/* crianças */}
            {Array.from({ length: t.N }, (_, i) => {
              const de = posCrianca(i);
              const vai = fase !== "escolher" && i < vans * t.C;
              const a = assento(i);
              const anda = fase === "partiu" && vai ? 700 : 0;
              const x = vai ? a.x : de.x, y = vai ? a.y : de.y;
              return (
                <g key={i} style={{ transform: `translate(${x + anda}px, ${y}px) scale(${vai ? 0.55 : 1})`, transition: fase === "partiu" ? `transform 1.4s ${a.van * 0.08}s ease-in` : `transform .5s ${i * 0.07}s ease-out` }}>
                  <circle cx="0" cy="0" r="9" fill="#f0c9a4" />
                  <rect x="-9" y="9" width="18" height="16" rx="7" fill={cores[i]} />
                  {!vai && fase === "partiu" && <text x="0" y="-14" textAnchor="middle" fontSize="13">😟</text>}
                </g>
              );
            })}
            <rect x="12" y="12" width="260" height="34" rx="17" fill="#1d2433" opacity=".85" />
            <text x="142" y="35" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">{t.N} crianças · vans de {t.C} lugares</text>
          </svg>
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
