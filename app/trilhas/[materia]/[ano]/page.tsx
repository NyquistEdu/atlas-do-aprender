import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ANOS, CATEGORIAS, DE_SLUG, MATERIAS, SLUG, TRILHAS, anoDeSlug, anoSlug, temaId, type Materia } from "@/lib/data";
import { Feito, Marcar, ParaDiario } from "@/components/Registrar";
import Progresso from "./Progresso";
import { AmazonLivro } from "@/components/Amazon";
import { apostilaDoTema } from "@/lib/apostilas";

type P = { params: { materia: string; ano: string } };

export function generateStaticParams() {
  return (Object.keys(SLUG) as Materia[]).flatMap((s) => ANOS.map(([y]) => ({ materia: SLUG[s], ano: anoSlug(y) })));
}

export function generateMetadata({ params }: P): Metadata {
  const s = DE_SLUG[params.materia];
  const ano = ANOS.find(([y]) => y === anoDeSlug(params.ano));
  return s && ano ? { title: `${MATERIAS[s]} · ${ano[1]}` } : {};
}

export default function Trilha({ params }: P) {
  const s = DE_SLUG[params.materia];
  const y = anoDeSlug(params.ano);
  const lista = s ? TRILHAS[s][y] : undefined;
  if (!s || !lista) notFound();
  const cor = `var(--${s})`;
  return (
    <div className="wrap">
      <h2>Trilhas formativas</h2>
      <p className="lead">Cada matéria segue uma sequência por ano, alinhada à BNCC. Abra um tema para ver livros, material, exercícios, filmes, áudios, jogos e atividade prática.</p>
      <div className="seg subj">
        {(Object.keys(MATERIAS) as Materia[]).map((m) => (
          <Link key={m} data-s={m} href={`/trilhas/${SLUG[m]}/${params.ano}`} aria-current={m === s ? "true" : undefined}>{MATERIAS[m]}</Link>
        ))}
      </div>
      <div className="seg yr">
        {ANOS.map(([a, l]) => (
          <Link key={a} href={`/trilhas/${params.materia}/${anoSlug(a)}`} aria-current={a === y ? "true" : undefined}>{l}</Link>
        ))}
      </div>
      <Progresso chaves={lista.map((_, i) => temaId(s, y, i))} cor={cor} />
      <div className="list">
        {lista.map((th, i) => {
          const id = temaId(s, y, i);
          const ap = apostilaDoTema(s, y, i + 1);
          return (
            <details className="theme" key={id} id={`tema-${i + 1}`} style={{ ["--sc" as string]: cor }}>
              <summary>
                <span className="tnum">Tema {i + 1}</span>
                <span className="tt">{th.t}</span>
                <Feito chave={id} />
                <span className="tobj">{th.o}</span>
              </summary>
              <div className="tbody">
                {ap && (
                  <Link className="apostila-tema" href={`/apostilas/${ap.slug}`} style={{ textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/apostilas/${ap.slug}/capa.webp`} alt="" width={56} height={79} loading="lazy" />
                    <div><b>Apostila deste tema: {ap.titulo}</b><span>{ap.paginas} páginas para imprimir, com exercícios, jogos e gabarito</span></div>
                  </Link>
                )}
                <section className="books">
                  <h4>Livros paradidáticos</h4>
                  {th.l?.length ? (
                    <ul>{th.l.map(([b, w]) => <li key={b}><b>{b}</b><span>{w}</span><AmazonLivro livro={b} /></li>)}</ul>
                  ) : (
                    <p className="meta">Ainda sem livro específico para este tema; use as revistas e o material indicados.</p>
                  )}
                </section>
                <div className="res">
                  {CATEGORIAS.map(([k, nome]) => {
                    const itens = ((th[k] as string[] | undefined) || []).filter((x) => x && x !== "—");
                    return itens.length ? (
                      <section key={k as string}><h4>{nome}</h4><ul>{itens.map((x) => <li key={x}>{x}</li>)}</ul></section>
                    ) : null;
                  })}
                </div>
                <div className="row">
                  <Marcar chave={id} />
                  <ParaDiario area={s} tipo="Estudo da trilha" titulo={th.t} />
                </div>
              </div>
            </details>
          );
        })}
      </div>
      <p className="note">Filmes e séries mudam de plataforma com frequência; confira a classificação e onde estão disponíveis antes de assistir. Os anos são referência: avance ou volte conforme a criança.</p>
    </div>
  );
}
