"use client";

import { useState } from "react";
import { ESTAGIOS, HABILIDADES, JOGOS } from "@/lib/data";
import { ParaDiario } from "@/components/Registrar";
import { AmazonJogo } from "@/components/Amazon";

export default function Jogos() {
  const [k, setK] = useState("all");
  return (
    <div className="wrap">
      <h2>Jogos que formam</h2>
      <p className="lead">Do jogo da memória aos jogos de estratégia e geografia. Cada um traz o que desenvolve, por que isso importa e como tirar mais proveito dele.</p>
      <div className="seg">
        {[["all", "Todas as habilidades"], ...Object.entries(HABILIDADES)].map(([v, l]) => (
          <button key={v} type="button" aria-pressed={k === v} onClick={() => setK(v)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {ESTAGIOS.map(([sid, sn, sa]) => {
          const gs = JOGOS.filter((g) => g.s === sid && (k === "all" || g.k.includes(k)));
          if (!gs.length) return null;
          return (
            <div key={sid} style={{ display: "grid", gap: 12 }}>
              <div className="stage-h"><h3>{sn}</h3><span className="meta">{sa}</span></div>
              <div className="grid2">
                {gs.map((g) => (
                  <article className="card" key={g.n}>
                    <h3>{g.n}</h3>
                    <div className="tags">{g.k.map((x) => <span className="tag" key={x}>{HABILIDADES[x]}</span>)}<span className="meta">{g.i} anos</span></div>
                    <dl>
                      <dt>O que trabalha</dt><dd>{g.w}</dd>
                      <dt>Por que importa</dt><dd>{g.y}</dd>
                      <dt>Como aproveitar</dt><dd>{g.h}</dd>
                    </dl>
                    <div className="row"><ParaDiario area="jog" tipo="Jogo" titulo={g.n} texto="Registrar partida" /><AmazonJogo nome={g.n} /></div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
