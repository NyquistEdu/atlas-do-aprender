"use client";
/**
 * Gráfico de barras 2D feito de quadradinhos, como no caderno quadriculado.
 * Cada voto é um quadradinho que cai na barra; com escala 2, cada quadradinho vale 2 (meio vale 1).
 * Barras em "erradas" ficam vermelhas e tremem. Com "casos", passa sozinho de um caso a outro (capa).
 */
import { useEffect, useState } from "react";

export type Barra = { rot: string; v: number; e?: string };
export type CasoGrafico = { dados: Barra[]; escala?: number; legenda?: string; titulo?: string };
export const CORES_CSS = ["#f2b33d", "#5b8def", "#ef6f5e", "#4fb37a", "#b07fe0"];

const NIVEIS = 10;

export default function Grafico2D({ dados, escala = 1, erradas = [], titulo, casos, onCaso, altura = 380 }: {
  dados: Barra[]; escala?: number; erradas?: number[]; titulo?: string; casos?: CasoGrafico[]; onCaso?: (c: CasoGrafico) => void; altura?: number;
}) {
  const [ci, setCi] = useState(0);
  useEffect(() => {
    if (!casos?.length) return;
    onCaso?.(casos[0]);
    const id = setInterval(() => setCi((i) => { const n = (i + 1) % casos.length; onCaso?.(casos[n]); return n; }), 2800);
    return () => clearInterval(id);
  }, [casos]); // eslint-disable-line react-hooks/exhaustive-deps

  const caso = casos?.length ? casos[ci % casos.length] : null;
  const d = caso ? caso.dados : dados;
  const esc = caso ? caso.escala ?? 1 : escala;
  const tit = caso ? caso.titulo : titulo;
  const err = caso ? [] : erradas;
  const niveis = Array.from({ length: NIVEIS + 1 }, (_, k) => k);

  return (
    <figure className="g2" style={{ height: altura }} aria-label={`Gráfico de barras${tit ? `: ${tit}` : ""}. ${d.map((b) => `${b.rot}: ${b.v}`).join("; ")}${esc > 1 ? `. Cada quadradinho vale ${esc}.` : ""}`}>
      <figcaption className="g2-topo">
        <b>{tit || "Pesquisa da turma"}</b>
        <span className="g2-leg"><i /> = {esc === 1 ? "1 voto" : `${esc} votos`}</span>
      </figcaption>
      <div className="g2-area">
        <div className="g2-eixo" aria-hidden="true">
          {niveis.map((k) => <span key={k} style={{ bottom: `${(k / NIVEIS) * 100}%` }}>{k * esc}</span>)}
        </div>
        <div className="g2-plot">
          {niveis.map((k) => <i key={k} className="g2-linha" style={{ bottom: `${(k / NIVEIS) * 100}%` }} aria-hidden="true" />)}
          {d.map((b, i) => {
            const v = Math.max(0, Math.min(NIVEIS * esc, Math.round(b.v)));
            const cheios = Math.floor(v / esc), meio = v % esc !== 0;
            const alt = (cheios + (meio ? 0.5 : 0)) / NIVEIS;
            const errada = err.includes(i);
            return (
              <div key={b.rot} className={`g2-col ${errada ? "errada" : ""}`} style={{ ["--c" as string]: CORES_CSS[i % CORES_CSS.length] }}>
                <div className="g2-pilha">
                  {Array.from({ length: cheios }, (_, k) => <span key={k} className="g2-q" style={{ bottom: `calc(${(k / NIVEIS) * 100}% + 1.5px)`, animationDelay: `${(k % 4) * 40}ms` }} />)}
                  {meio && <span key={`m${cheios}`} className="g2-q meio" style={{ bottom: `calc(${(cheios / NIVEIS) * 100}% + 1.5px)` }} />}
                  <span className="g2-valor" style={{ bottom: `calc(${alt * 100}% + 6px)` }}>{v}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="g2-nomes">
          {d.map((b, i) => <span key={b.rot} className={err.includes(i) ? "errada" : ""}>{b.e && <em>{b.e}</em>}{b.rot}</span>)}
        </div>
      </div>
    </figure>
  );
}
