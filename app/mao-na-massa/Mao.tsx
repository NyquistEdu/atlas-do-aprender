"use client";

import { useState } from "react";
import { ANOS, EXPERIMENTOS, MATERIAS, anoCurto } from "@/lib/data";
import { ParaDiario } from "@/components/Registrar";
import { ConviteConta } from "@/components/Acesso";

export default function Mao() {
  const [a, setA] = useState("all");
  const [y, setY] = useState("all");
  const xs = EXPERIMENTOS.filter((x) => (a === "all" || x.a === a) && (y === "all" || x.y === y)).sort((p, q) => +p.y - +q.y);
  return (
    <div className="wrap largo">
      <h1>Mão na massa</h1>
      <p className="lead">Experimentos e atividades práticas com material de casa. Primeiro a criança prevê o que vai acontecer, depois testa, observa e explica com as próprias palavras.</p>
      <ConviteConta origem="mao-na-massa" titulo="Guarde o que a criança descobriu"
        texto="Anote as frases e perguntas dela em um minuto e releia quando quiser."
        acao="Ver como funciona o diário" href="/diario" />
      <div className="seg subj">
        {[["all", "Todas"], ...Object.entries(MATERIAS)].map(([v, l]) => <button key={v} type="button" data-s={v} aria-pressed={a === v} onClick={() => setA(v)}>{l}</button>)}
      </div>
      <div className="seg yr">
        {[["all", "Todos os anos"], ...ANOS.map(([v, l]) => [v, anoCurto(l)])].map(([v, l]) => <button key={v} type="button" aria-pressed={y === v} onClick={() => setY(v)}>{l}</button>)}
      </div>
      {a === "all" && y === "all" && <p className="dica">Para começar nesta semana: o Leite mágico, logo abaixo, leva 15 minutos e usa o que tem na cozinha.</p>}
      <div className="grid2">
        {xs.length ? xs.map((x) => (
          <article className="card" key={x.n}>
            <h3>{x.n}</h3>
            <div className="tags"><span className={`tag ${x.a}`}>{MATERIAS[x.a]}</span><span className="meta">a partir do {x.y}º ano · {x.tm}</span></div>
            <dl>
              <dt>Materiais</dt><dd>{x.mat.join(" · ")}</dd>
              <dt>Como fazer</dt><dd><ol>{x.st.map((s) => <li key={s}>{s}</li>)}</ol></dd>
              <dt>O que aprende</dt><dd>{x.l}</dd>
            </dl>
            {x.c && <p className="warn"><b>Cuidado:</b> {x.c}</p>}
            <div><ParaDiario area={x.a} tipo="Experimento" titulo={x.n} texto="Guardar a descoberta no diário" /></div>
          </article>
        )) : <div className="empty">Nenhuma atividade com esse filtro.</div>}
      </div>
    </div>
  );
}
