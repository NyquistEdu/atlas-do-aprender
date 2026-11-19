"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useViva, Caixa, type Tela } from "@/components/viva/Shell";
import type { Caso, ModoDiv } from "@/components/viva/Cena3D";
import { div } from "@/lib/viva";

const Cena3D = dynamic(() => import("@/components/viva/Cena3D"), { ssr: false, loading: () => <div className="viva-3d carregando" style={{ height: 380 }}>carregando a cena 3D…</div> });

export const DESC_TELAS: Record<number, string> = {
  2: "mexa nos biscoitos e nos pratos",
  3: "4 jogos relâmpago",
  4: "a van do passeio",
  5: "ovos, pizza e calendário",
  6: "5 desafios do chefão",
  7: "resumo e pegadinhas",
};

export function Capa({ telas }: { telas: Tela[] }) {
  const v = useViva();
  const [leg, setLeg] = useState("");
  const casos = useMemo<Caso[]>(() => [
    { n: 12, k: 3, modo: "repartir", legenda: "12 ÷ 3 = 4 · cada prato fica com 4" },
    { n: 13, k: 3, modo: "repartir", legenda: "13 ÷ 3 = 4 e sobra 1 · a sobra fica no anel vermelho" },
    { n: 12, k: 4, modo: "agrupar", legenda: "12 ÷ 4 = 3 · cabem 3 caixinhas de 4" },
  ], []);
  return (
    <div className="viva-capa">
      <div className="viva-capa-txt">
        <p className="viva-kick">Matemática · 3º ano · Fase 2</p>
        <h1 className="viva-h1"><span className="viva-marca-txt">Divide Aí!</span></h1>
        <p className="viva-formula">12 <b>÷</b> 3 = 4</p>
        <p className="viva-mao">reparta, agrupe e descubra o que sobra</p>
        <div className="viva-mapa">
          {telas.filter((t) => t.n > 1).map((t) => (
            <button key={t.n} type="button" onClick={() => v.irPara(t.n)}>
              <span className="viva-mapa-ic">{t.icone}</span>
              <span><b>{t.nome}</b><small>{DESC_TELAS[t.n]}</small></span>
            </button>
          ))}
        </div>
        <div className="viva-escolha">
          <button type="button" className={`viva-modo-card ${v.modo === "sozinho" && v.e.modo ? "on" : ""}`} onClick={() => { v.definirModo("sozinho"); v.irPara(2); }}>
            <b>Vou jogar sozinho</b>
            <span>No meu ritmo: ganho XP, cumpro missões e subo de nível. O progresso fica salvo.</span>
          </button>
          <button type="button" className={`viva-modo-card escuro ${v.modo === "juntos" ? "on" : ""}`} onClick={() => { v.definirModo("juntos"); v.irPara(2); }}>
            <b>Vamos jogar juntos</b>
            <span>Time Sol contra Time Lua: irmãos, adulto e criança ou a turma toda na TV.</span>
          </button>
        </div>
      </div>
      <div className="viva-capa-3d">
        <span className="viva-ao-vivo">● Ao vivo em 3D · os biscoitos vão para os pratos</span>
        <span className="viva-post">a ÷ b = c</span>
        <Cena3D n={12} k={3} modo="repartir" casos={casos} onCaso={(c) => setLeg(c.legenda || "")} altura={420} />
        {leg && <span className="viva-legenda">{leg}</span>}
        <small className="viva-girar">arraste para girar</small>
      </div>
    </div>
  );
}

export function Regua({ rotulo, cor, v, min, max, muda, sufixo }: { rotulo: string; cor: string; v: number; min: number; max: number; muda: (n: number) => void; sufixo?: string }) {
  return (
    <div className="viva-regua" style={{ ["--rc" as string]: cor }}>
      <span className="viva-regua-r">{rotulo}</span>
      <button type="button" onClick={() => muda(Math.max(min, v - 1))} aria-label={`menos ${rotulo}`}>−</button>
      <input type="range" min={min} max={max} value={v} onChange={(e) => muda(Number(e.target.value))} aria-label={rotulo}
        style={{ background: `linear-gradient(90deg, var(--rc) ${((v - min) / (max - min)) * 100}%, #e3e1da 0)` }} />
      <button type="button" onClick={() => muda(Math.min(max, v + 1))} aria-label={`mais ${rotulo}`}>+</button>
      <output>{v}{sufixo}</output>
    </div>
  );
}

type Missao = { id: string; txt: string; dica: string; ok: (n: number, k: number, m: ModoDiv) => boolean };
const MISSOES: Missao[] = [
  { id: "m1", txt: "Reparta 12 biscoitos entre 3 pratos.", dica: "Biscoitos em 12 e pratos em 3, no modo Repartir.", ok: (n, k, m) => m === "repartir" && n === 12 && k === 3 },
  { id: "m2", txt: "Use 4 pratos e faça cada um ficar com 5 biscoitos, sem sobrar nenhum.", dica: "Se são 4 pratos com 5 em cada, quantos biscoitos são? 4 × 5.", ok: (n, k, m) => m === "repartir" && n === 20 && k === 4 },
  { id: "m3", txt: "Com 3 pratos, faça sobrar exatamente 2 biscoitos.", dica: "Comece numa conta exata, como 9 ÷ 3, e acrescente 2 biscoitos.", ok: (n, k, m) => m === "repartir" && k === 3 && n > 3 && n % 3 === 2 },
  { id: "m4", txt: "Com 4 pratos, faça sobrar o máximo de biscoitos possível.", dica: "O resto é sempre menor que o número de pratos. Qual é o maior resto com 4 pratos?", ok: (n, k, m) => m === "repartir" && k === 4 && n > 4 && n % 4 === 3 },
  { id: "m5", txt: "Mude para Agrupar e monte 6 caixinhas de 4 biscoitos, sem sobra.", dica: "6 caixinhas com 4 em cada: 6 × 4 biscoitos.", ok: (n, k, m) => m === "agrupar" && k === 4 && n === 24 },
  { id: "m6", txt: "Encontre uma quantidade que dá para repartir em 2, em 3 e em 6 pratos sem sobrar nada. Teste com 6 pratos.", dica: "Pense na tabuada do 6: 6, 12, 18, 24, 30… todos servem!", ok: (n, k, m) => m === "repartir" && k === 6 && n >= 6 && n % 6 === 0 },
];

export function Laboratorio() {
  const v = useViva();
  const [modo, setModo] = useState<ModoDiv>("repartir");
  const [n, setN] = useState(10);
  const [k, setK] = useState(3);
  const [prever, setPrever] = useState(false);
  const [revelado, setRevelado] = useState(false);
  const [okQ, setOkQ] = useState(false);
  const [okR, setOkR] = useState(false);
  const [mi, setMi] = useState(() => Math.max(0, MISSOES.findIndex((m) => !v.e.missoes[m.id])));
  const [dica, setDica] = useState(false);
  const { q, r } = div(n, k);
  const missao = MISSOES[Math.min(mi, MISSOES.length - 1)];
  const todas = MISSOES.every((m) => v.e.missoes[m.id]);
  const feitas = MISSOES.filter((m) => v.e.missoes[m.id]).length;

  useEffect(() => { setRevelado(false); setOkQ(false); setOkR(false); }, [n, k, modo]);
  useEffect(() => {
    if (okQ && okR && !revelado) { setRevelado(true); v.acertou("lab-conta", 15, "Resolveu pela conta!"); }
  }, [okQ, okR, revelado, v]);
  // a missão só vale quando a criança aperta "Enviar": pode experimentar à vontade antes
  const enviar = () => {
    if (v.e.missoes[missao.id]) { v.aviso("Essa missão já está cumprida. Vamos para a próxima!", "info"); setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); return; }
    if (missao.ok(n, k, modo) && !(prever && !revelado)) {
      v.missao(missao.id, dica ? 2 : 3);
      v.acertou("lab", 20, `Missão ${mi + 1} cumprida!`);
      setTimeout(() => { setMi((x) => Math.min(MISSOES.length - 1, x + 1)); setDica(false); }, 1400);
    } else v.errou("lab", "Ainda não é isso. Mexa mais um pouco ou peça a dica.");
  };

  const escondido = prever && !revelado;
  const rot = modo === "repartir" ? "Pratos" : "Em cada caixinha";
  return (
    <div className="viva-tela">
      <header className="viva-th">
        <p className="viva-kick">Tela 2 · onde a mão aprende</p>
        <h2>Laboratório: mexa e veja a divisão acontecer</h2>
      </header>
      <div className="viva-lab">
        <div className="viva-col">
          <div className="viva-card viva-missoes">
            <div className="viva-bolinhas">
              {MISSOES.map((m, i) => (
                <button key={m.id} type="button" className={`${v.e.missoes[m.id] ? "feita" : ""} ${i === mi ? "atual" : ""}`} onClick={() => { setMi(i); setDica(false); }} aria-label={`Missão ${i + 1}`}>
                  {v.e.missoes[m.id] ? "★".repeat(v.e.missoes[m.id]).slice(0, 1) : i + 1}
                </button>
              ))}
            </div>
            <p className="viva-missao"><b>Missão {mi + 1}/{MISSOES.length}</b> · {missao.txt}</p>
            {dica && <p className="viva-dica-box">💡 {missao.dica}</p>}
            <div className="viva-row">
              <button type="button" className="viva-btn" onClick={enviar}>Enviar ✓</button>
              <button type="button" className="viva-btn ghost" onClick={() => setDica(true)} disabled={dica}>Dica</button>
              <span className="viva-prog"><small>{todas ? "Todas as missões cumpridas! ⭐" : `${feitas} de ${MISSOES.length} missões`}</small><i style={{ width: `${(feitas / MISSOES.length) * 100}%` }} /></span>
            </div>
          </div>

          <div className="viva-card">
            <div className="viva-row" style={{ justifyContent: "space-between" }}>
              <h3 className="viva-h3">Laboratório da divisão</h3>
              <div className="viva-seg" role="group" aria-label="Tipo de divisão">
                <button type="button" aria-pressed={modo === "repartir"} onClick={() => setModo("repartir")}>Repartir</button>
                <button type="button" aria-pressed={modo === "agrupar"} onClick={() => { setModo("agrupar"); if (k < 2) setK(2); }}>Agrupar</button>
              </div>
            </div>
            <p className="viva-eq" aria-live="polite">
              <span style={{ color: "var(--v-rosa)" }}>{n}</span> ÷ <span style={{ color: "var(--v-azul)" }}>{k}</span> = {escondido ? <b className="viva-q">?</b> : <b>{q}</b>}
              {(escondido || r > 0) && <> <small>e sobra</small> {escondido ? <b className="viva-q">?</b> : <b style={{ color: "var(--v-verm)" }}>{r}</b>}</>}
            </p>
            <Regua rotulo="Biscoitos" cor="var(--v-rosa)" v={n} min={0} max={30} muda={setN} />
            <Regua rotulo={rot} cor="var(--v-azul)" v={k} min={modo === "agrupar" ? 2 : 1} max={modo === "agrupar" ? 10 : 6} muda={setK} />
            <label className="viva-check"><input type="checkbox" checked={prever} onChange={(e) => setPrever(e.target.checked)} /> Esconder a resposta: prever pela conta antes de ver</label>
          </div>

          <div className="viva-card viva-caderno">
            <h3 className="viva-h3">✏️ Fazer a conta</h3>
            <div key={`${n}-${k}-${modo}`} className="viva-linhas">
              <p>{modo === "repartir" ? "Em cada prato:" : `Caixinhas de ${k}:`} <Caixa certo={q} onCerto={() => setOkQ(true)} rotulo="quociente"
                dica={`Que número vezes ${k} chega mais perto de ${n}, sem passar?`} /></p>
              <p>Sobra: <Caixa certo={r} onCerto={() => setOkR(true)} rotulo="resto" dica={`Tire de ${n} o que já foi ${modo === "repartir" ? "para os pratos" : "para as caixinhas"}. A sobra é menor que ${k}.`} /></p>
              {okQ && okR && <p className="viva-ok">✓ {q} × {k} + {r} = {n}. Bateu!</p>}
            </div>
          </div>
        </div>

        <div className="viva-col">
          <div className="viva-card escuro">
            <span className="viva-ao-vivo">● Gêmeo 3D · a mesma conta, com biscoitos de verdade</span>
            <Cena3D n={n} k={k} modo={modo} oculto={escondido} altura={340} />
            {escondido && <p className="viva-oculto">Resolva no caderno para ver os biscoitos irem para {modo === "repartir" ? "os pratos" : "as caixinhas"}.</p>}
          </div>
          <div className="viva-raiox">
            <div><small>{modo === "repartir" ? "CADA PRATO" : "CAIXINHAS"}</small><b>{escondido ? "?" : q}</b></div>
            <div><small>SOBRA</small><b style={{ color: r ? "var(--v-verm)" : undefined }}>{escondido ? "?" : r}</b></div>
            <div><small>CONFERINDO</small><b className="mini">{escondido ? "?" : `${q} × ${k} + ${r} = ${n}`}</b></div>
            <div><small>FAMÍLIA DE CONTAS</small><b className="mini">{escondido ? "?" : r ? `${q} × ${k} = ${q * k}, mais ${r}` : `${k} × ${q} = ${n}`}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
