"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APOSTILAS, anoNome } from "@/lib/apostilas";
import { ANOS, DE_SLUG, MATERIAS, SLUG, anoDeSlug, anoSlug, type Materia } from "@/lib/data";
import Comprar from "@/components/Comprar";

type Filtro = { m: Materia | null; y: string | null };

/** Vitrine com filtro de matéria e ano, guardado no endereço (?materia=…&ano=…) para poder compartilhar. */
export default function Vitrine() {
  const [f, setF] = useState<Filtro>({ m: null, y: null });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const m = DE_SLUG[q.get("materia") || ""] || null;
    const a = q.get("ano");
    let y = a && ANOS.some(([k]) => k === anoDeSlug(a)) ? anoDeSlug(a) : null;
    if (y && !APOSTILAS.some((x) => x.ano === y && (!m || x.materia === m))) y = null;
    setF({ m, y });
  }, []);

  const mudar = (n: Filtro) => {
    // se a série escolhida não tem apostila na matéria nova, volta para "todas as séries"
    if (n.y && !APOSTILAS.some((a) => a.ano === n.y && (!n.m || a.materia === n.m))) n = { ...n, y: null };
    setF(n);
    const q = new URLSearchParams();
    if (n.m) q.set("materia", SLUG[n.m]);
    if (n.y) q.set("ano", anoSlug(n.y));
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  };

  const conta = (m: Materia | null, y: string | null) => APOSTILAS.filter((a) => (!m || a.materia === m) && (!y || a.ano === y)).length;
  const lista = APOSTILAS.filter((a) => (!f.m || a.materia === f.m) && (!f.y || a.ano === f.y));

  return (
    <>
      <div className="filters">
        <div className="seg subj" role="group" aria-label="Matéria">
          <button type="button" aria-pressed={!f.m} onClick={() => mudar({ ...f, m: null })}>Todas</button>
          {(Object.keys(MATERIAS) as Materia[]).map((m) => (
            <button key={m} type="button" data-s={m} aria-pressed={f.m === m} onClick={() => mudar({ ...f, m })}>
              {MATERIAS[m]} <span className="conta">{conta(m, null)}</span>
            </button>
          ))}
        </div>
        <div className="seg yr" role="group" aria-label="Série">
          <button type="button" aria-pressed={!f.y} onClick={() => mudar({ ...f, y: null })}>Todas as séries</button>
          {ANOS.map(([y]) => {
            const n = conta(f.m, y);
            return (
              <button key={y} type="button" aria-pressed={f.y === y} disabled={n === 0} onClick={() => mudar({ ...f, y })} title={n === 0 ? "Ainda não há apostila para esta série" : undefined}>
                {anoNome(y)}{n > 0 && <span className="conta">{n}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <p className="meta" aria-live="polite">{lista.length === 1 ? "1 apostila" : `${lista.length} apostilas`}</p>
      <div className="vitrine">
        {lista.map((a) => (
          <article className="produto" key={a.slug} style={{ ["--sc" as string]: `var(--${a.materia})` }}>
            <Link href={`/apostilas/${a.slug}`} className="produto-capa" aria-label={`Ver detalhes de ${a.titulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apostilas/${a.slug}/capa.webp`} alt={`Capa da apostila ${a.titulo}`} width={566} height={800} loading="lazy" />
            </Link>
            <div className="produto-info">
              <div className="tags"><span className={`tag ${a.materia}`}>{MATERIAS[a.materia]}</span><span className="tag">{anoNome(a.ano)}</span></div>
              <h3><Link href={`/apostilas/${a.slug}`}>{a.titulo}</Link></h3>
              <p className="meta">{a.subtitulo} · {a.paginas} páginas</p>
              <div className="row">
                <Comprar slug={a.slug} titulo={a.titulo} checkout={a.checkout} preco={a.preco} />
                <Link className="btn small ghost" href={`/apostilas/${a.slug}`}>Ver páginas</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
