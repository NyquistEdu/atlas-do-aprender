"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useAtlas } from "@/components/Providers";

export type Fase = { id: string; titulo: string; obj: string; emoji: string };

const XS = [26, 62, 76, 40, 22, 58, 78];
const LINHA = 150; // distância vertical entre as fases (px)
const TOPO = 96;
const FIM = 170;

/** Mapa de jogo da trilha: cada tema é uma fase no caminho. Ao escolher uma fase, abre o painel com tudo do tema. */
export default function Mapa({ fases, cor, enfeites, regiao, children }: { fases: Fase[]; cor: string; enfeites: string[]; regiao: string; children: ReactNode }) {
  const { user, feito } = useAtlas();
  const paineis = Children.toArray(children);
  const [sel, setSel] = useState<number | null>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<HTMLDivElement>(null);
  const n = fases.length;
  const feitas = fases.map((f) => !!user && feito(f.id));
  const atual = user ? (feitas.indexOf(false) === -1 ? -1 : feitas.indexOf(false)) : 0;

  // Fase pelo endereço (#tema-3), para os links que já apontam para um tema.
  useEffect(() => {
    const ler = () => {
      const m = window.location.hash.match(/^#tema-(\d+)$/);
      if (m) {
        const i = Number(m[1]) - 1;
        if (i >= 0 && i < n) {
          setSel(i);
          setTimeout(() => painelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
      }
    };
    ler();
    window.addEventListener("hashchange", ler);
    return () => window.removeEventListener("hashchange", ler);
  }, [n]);

  const abrir = (i: number) => {
    setSel(i);
    try { window.history.replaceState(null, "", `#tema-${i + 1}`); } catch {}
    setTimeout(() => painelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const voltarMapa = () => {
    try { window.history.replaceState(null, "", window.location.pathname); } catch {}
    mapaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pts = fases.map((_, i) => ({ x: XS[i % XS.length], y: TOPO + i * LINHA }));
  const ini = { x: 8, y: 34 };
  const fim = { x: pts.length ? (pts[pts.length - 1].x > 50 ? 26 : 60) : 50, y: TOPO + (n - 1) * LINHA + FIM - 20 };
  const todos = [ini, ...pts, fim];
  const altura = TOPO + (n - 1) * LINHA + FIM;
  let d = `M ${ini.x} ${ini.y}`;
  for (let i = 1; i < todos.length; i++) {
    const a = todos[i - 1], b = todos[i];
    const m = (b.y - a.y) / 2;
    d += ` C ${a.x} ${a.y + m}, ${b.x} ${b.y - m}, ${b.x} ${b.y}`;
  }

  return (
    <>
      <div className="mapa" ref={mapaRef} style={{ height: altura, ["--sc" as string]: cor }}>
        <span className="mapa-regiao">{regiao}</span>
        <span className="mapa-rosa" aria-hidden="true">🧭</span>
        <svg className="mapa-caminho" viewBox={`0 0 100 ${altura}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={d} className="estrada" vectorEffect="non-scaling-stroke" />
          <path d={d} className="trilha" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((p, i) => (
          <span key={"e" + i} className="mapa-enfeite" aria-hidden="true" style={{ left: `${p.x > 50 ? p.x - 46 : p.x + 40}%`, top: p.y - 30 }}>{enfeites[i % enfeites.length]}</span>
        ))}
        <span className="mapa-marco" style={{ left: `${ini.x}%`, top: ini.y }} aria-hidden="true">🚩<b>Partida</b></span>
        <span className="mapa-marco" style={{ left: `${fim.x}%`, top: fim.y }} aria-hidden="true">🏆<b>Fim do ano</b></span>
        {fases.map((f, i) => {
          const p = pts[i];
          const estado = feitas[i] ? "feita" : i === atual ? "atual" : "";
          return (
            <button key={f.id} type="button" className={`fase-no ${estado}${sel === i ? " sel" : ""} ${p.x > 66 ? "dir" : p.x < 34 ? "esq" : ""}`}
              style={{ left: `${p.x}%`, top: p.y }} onClick={() => abrir(i)} aria-label={`Fase ${i + 1}: ${f.titulo}`} aria-pressed={sel === i}>
              {i === atual && <span className="pin">{user ? "Você está aqui" : "Comece aqui"}</span>}
              <span className="circ"><span className="em" aria-hidden="true">{f.emoji}</span><span className="num">{i + 1}</span>{feitas[i] && <span className="ok" aria-label="concluída">✓</span>}</span>
              <span className="rot"><small>Fase {i + 1}</small>{f.titulo}</span>
            </button>
          );
        })}
      </div>

      <div ref={painelRef} className="fase-painel-ancora">
        {sel === null ? (
          <p className="fase-dica">Toque numa fase do mapa para ver tudo o que tem dentro dela: livros, apostila, jogos, filmes e atividades.</p>
        ) : null}
        {fases.map((f, i) => (
          <section key={f.id} id={`tema-${i + 1}`} className="fase-painel" hidden={sel !== i} style={{ ["--sc" as string]: cor }}>
            <div className="fase-topo">
              <span className="fase-em" aria-hidden="true">{f.emoji}</span>
              <div>
                <p className="fase-n">Fase {i + 1} de {n}{feitas[i] ? " · concluída ✓" : ""}</p>
                <h2>{f.titulo}</h2>
                <p className="fase-obj">{f.obj}</p>
              </div>
            </div>
            {paineis[i]}
            <div className="fase-nav">
              <button type="button" className="btn small ghost" disabled={i === 0} onClick={() => abrir(i - 1)}>← Fase anterior</button>
              <button type="button" className="btn small ghost" onClick={voltarMapa}>Ver o mapa</button>
              <button type="button" className="btn small" disabled={i === n - 1} onClick={() => abrir(i + 1)}>Próxima fase →</button>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
