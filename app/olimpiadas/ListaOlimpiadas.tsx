"use client";

import { useEffect, useState } from "react";
import { INDIVIDUAIS, type Olimpiada } from "@/lib/olimpiadas";

type Area = Olimpiada["area"];
const AREAS: [Area, string][] = [["por", "Português"], ["lin", "Inglês e Espanhol"], ["mat", "Matemática"], ["cie", "Ciências"]];
const cor = (a: Area) => (a === "lin" ? "var(--jog)" : `var(--${a})`);
const hojeISO = () => new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });
const dataBR = (iso: string) => iso.split("-").reverse().slice(0, 2).join("/");

/** Lista de olimpíadas com filtro por área; as que estão com inscrições abertas aparecem primeiro. */
export default function ListaOlimpiadas() {
  const [area, setArea] = useState<Area | null>(null);
  const [soAbertas, setSoAbertas] = useState(false);
  const [hoje, setHoje] = useState<string | null>(null);
  useEffect(() => setHoje(hojeISO()), []);

  const aberta = (o: Olimpiada) => Boolean(hoje && o.inscricoesAte && o.inscricoesAte >= hoje);
  const nAbertas = INDIVIDUAIS.filter(aberta).length;
  const lista = INDIVIDUAIS
    .filter((o) => (!area || o.area === area) && (!soAbertas || aberta(o)))
    .sort((a, b) => Number(aberta(b)) - Number(aberta(a)) || (aberta(a) ? a.inscricoesAte!.localeCompare(b.inscricoesAte!) : 0));

  return (
    <>
      <div className="filters">
        <div className="seg subj" role="group" aria-label="Área">
          <button type="button" aria-pressed={!area} onClick={() => setArea(null)}>Todas <span className="conta">{INDIVIDUAIS.length}</span></button>
          {AREAS.map(([a, n]) => (
            <button key={a} type="button" data-s={a === "lin" ? "gerais" : a} aria-pressed={area === a} onClick={() => setArea(a)}>
              {n} <span className="conta">{INDIVIDUAIS.filter((o) => o.area === a).length}</span>
            </button>
          ))}
        </div>
        {nAbertas > 0 && (
          <div className="seg yr" role="group" aria-label="Inscrições">
            <button type="button" aria-pressed={!soAbertas} onClick={() => setSoAbertas(false)}>Todas</button>
            <button type="button" aria-pressed={soAbertas} onClick={() => setSoAbertas(true)}>Inscrições abertas <span className="conta">{nAbertas}</span></button>
          </div>
        )}
      </div>
      <div className="list">
        {lista.map((o) => (
          <article className="card olimp" key={o.nome} style={{ ["--sc" as string]: cor(o.area) }}>
            <div className="tags">
              {aberta(o) && <span className="tag cie">Inscrições até {dataBR(o.inscricoesAte!)}</span>}
              <span className="tag">{o.series}</span>
            </div>
            <h3>{o.nome}</h3>
            <dl>
              <dt>Quem pode</dt><dd>{o.quem}</dd>
              <dt>Inscrição</dt><dd>{o.inscricao}</dd>
              <dt>Valor</dt><dd>{o.custo}</dd>
              <dt>Datas</dt><dd>{o.quando}</dd>
              <dt>Como é</dt><dd>{o.como}</dd>
            </dl>
            <div className="row"><a className="btn small" href={o.site} target="_blank" rel="noopener noreferrer">Site oficial</a></div>
          </article>
        ))}
      </div>
    </>
  );
}
