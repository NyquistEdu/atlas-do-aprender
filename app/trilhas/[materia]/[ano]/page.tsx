import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ANOS, CATEGORIAS, DE_SLUG, MATERIAS, SLUG, TRILHAS, anoDeSlug, anoSlug, temaId, type Materia } from "@/lib/data";
import { Feito, Marcar, ParaDiario } from "@/components/Registrar";
import Progresso from "./Progresso";
import { ConviteConta } from "@/components/Acesso";
import { AmazonLivro } from "@/components/Amazon";
import { apostilaDoTema } from "@/lib/apostilas";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { materia: string; ano: string } };

export function generateStaticParams() {
  return (Object.keys(SLUG) as Materia[]).flatMap((s) => ANOS.map(([y]) => ({ materia: SLUG[s], ano: anoSlug(y) })));
}

export function generateMetadata({ params }: P): Metadata {
  const s = DE_SLUG[params.materia];
  const ano = ANOS.find(([y]) => y === anoDeSlug(params.ano));
  if (!s || !ano) return {};
  const temas = (TRILHAS[s][ano[0]] || []).map((t) => t.t);
  const nome = `${MATERIAS[s]} do ${ano[1].replace("Alfabetização · ", "")}`;
  return {
    title: `${nome}: atividades, livros e jogos para estudar em casa`,
    description: `Trilha de ${MATERIAS[s]} ${ano[0] === "1" ? "da alfabetização (1º ano)" : `do ${ano[1]}`} alinhada à BNCC: ${temas.slice(0, 4).join(", ")} e mais. Livros paradidáticos, exercícios, filmes, jogos e mão na massa para cada tema.`,
    alternates: { canonical: `/trilhas/${params.materia}/${params.ano}` },
  };
}

export default function Trilha({ params }: P) {
  const s = DE_SLUG[params.materia];
  const y = anoDeSlug(params.ano);
  const lista = s ? TRILHAS[s][y] : undefined;
  if (!s || !lista) notFound();
  const cor = `var(--${s})`;
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "ItemList", name: `${MATERIAS[s]} · ${ANOS.find(([a]) => a === y)?.[1]}`,
        itemListElement: lista.map((th, i) => ({ "@type": "ListItem", position: i + 1, name: th.t, description: th.o, url: url(`/trilhas/${params.materia}/${params.ano}#tema-${i + 1}`) })),
      })} />
      <h1>{MATERIAS[s]} · {ANOS.find(([a]) => a === y)?.[1]}: o que estudar em casa</h1>
      <p className="lead">Uma sequência pronta para ajudar a criança em casa: cada tema traz livros, exercícios, jogos, vídeos e uma atividade prática, seguindo o que a escola ensina em cada ano (BNCC).</p>
      <ConviteConta origem="trilhas" titulo="Acompanhe cada criança"
        texto="Veja os temas que ela já explorou e continue de onde parou." />
      <p className="passo">1. Escolha a matéria e o ano da criança</p>
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
      <p className="passo">2. Toque em um tema para ver as atividades</p>
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
                <span className="ver">Ver atividades ▾</span>
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
                  <Marcar chave={id} rotulo={["Marcar tema como concluído", "Desmarcar tema"]} origem="trilhas" />
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
