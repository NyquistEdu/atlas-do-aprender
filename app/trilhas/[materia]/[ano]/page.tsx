import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ANOS, CATEGORIAS, DE_SLUG, MATERIAS, SLUG, TRILHAS, anoDeSlug, anoSlug, temaId, type Materia } from "@/lib/data";
import { Marcar, ParaDiario } from "@/components/Registrar";
import Dicas from "@/components/Dicas";
import Progresso from "./Progresso";
import Mapa from "./Mapa";
import { EMOJI_FASE, ENFEITES, NOME_REGIAO } from "@/lib/fases";
import { ConviteConta } from "@/components/Acesso";
import { AmazonLivro } from "@/components/Amazon";
import { apostilaDoTema, treinoDoTema } from "@/lib/apostilas";
import { jogosDoTema } from "@/lib/loja";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { materia: string; ano: string } };

const ICONE_CAT: Record<string, string> = { m: "📚", e: "✏️", f: "🎬", a: "🎧", j: "🎲", p: "🧪" };

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
      <nav className="mundo" aria-label="Ano">
        {ANOS.map(([a, l]) => (
          <Link key={a} href={`/trilhas/${params.materia}/${anoSlug(a)}`} aria-current={a === y ? "true" : undefined} className="ilha">
            <i aria-hidden="true">{["🏝️", "🌴", "⛰️", "🏞️", "🗻"][Number(a) - 1]}</i>
            <b>{a === "1" ? "Alfabetização" : l}</b>
            <span>{NOME_REGIAO[a]}</span>
          </Link>
        ))}
      </nav>
      <p className="passo">2. Siga o caminho: cada fase do mapa é um tema. Toque numa fase para entrar</p>
      <Progresso chaves={lista.map((_, i) => temaId(s, y, i))} cor={cor} />
      <Mapa cor={cor} enfeites={ENFEITES[s]} anoIdx={ANOS.findIndex(([a]) => a === y)}
        anos={ANOS.map(([a]) => (TRILHAS[s][a] || []).map((_, i) => temaId(s, a, i)))} regiao={`${MATERIAS[s]} · ${NOME_REGIAO[y]}`}
        fases={lista.map((th, i) => ({ id: temaId(s, y, i), titulo: th.t, obj: th.o, emoji: EMOJI_FASE[temaId(s, y, i)] || "📍" }))}>
        {lista.map((th, i) => {
          const id = temaId(s, y, i);
          const ap = apostilaDoTema(s, y, i + 1);
          const jgs = jogosDoTema(s, y, i + 1);
          const tr = treinoDoTema(s, y, i + 1);
          return (
              <div className="tbody" key={id}>

                {ap && (
                  <Link className="apostila-tema" href={`/apostilas/${ap.slug}`} style={{ textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/apostilas/${ap.slug}/capa.webp`} alt="" width={56} height={79} loading="lazy" />
                    <div><b>Apostila deste tema: {ap.titulo}</b><span>{ap.paginas} páginas para imprimir, com exercícios, jogos e gabarito{ap.arquivo ? " · grátis" : ""}</span></div>
                  </Link>
                )}
                {tr && (
                  <Link className="apostila-tema" href={`/apostilas/${tr.slug}`} style={{ textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/apostilas/${tr.slug}/capa.webp`} alt="" width={56} height={79} loading="lazy" />
                    <div><b>Treino diário grátis: {tr.titulo.replace("Treino Diário · ", "")}</b><span>30 folhas curtas, uma por dia, com tempo-meta e gabarito</span></div>
                  </Link>
                )}
                {jgs.map((j) => (
                  <Link className="jogo-tema" key={j.slug} href={`/loja#${j.slug}`}>
                    <i aria-hidden="true">{j.emoji}</i>
                    <div><b>Jogo para este tema: {j.nome}</b><span>Feito pelo Atlas, à venda no Mercado Livre · ver como usar</span></div>
                  </Link>
                ))}
                {th.l?.length ? (
                  <details className="books books-fechado">
                    <summary>
                      <i aria-hidden="true">📖</i>
                      <span className="bk-t"><b>Livros paradidáticos</b><small>{th.l[0][0].split(" — ")[0]}{th.l.length > 1 ? ` e mais ${th.l.length - 1}` : ""}</small></span>
                      <span className="res-n">{th.l.length}</span>
                    </summary>
                    <ul>{th.l.map(([b, w]) => <li key={b}><b>{b}</b><span>{w}</span><AmazonLivro livro={b} /></li>)}</ul>
                  </details>
                ) : (
                  <p className="meta">Ainda sem livro específico para este tema; use as revistas e o material indicados.</p>
                )}
                <div className="res res-fechado">
                  {CATEGORIAS.map(([k, nome]) => {
                    const itens = ((th[k] as string[] | undefined) || []).filter((x) => x && x !== "—");
                    return itens.length ? (
                      <details key={k as string} className="res-item">
                        <summary><i aria-hidden="true">{ICONE_CAT[k as string]}</i><b>{nome}</b><span className="res-n">{itens.length}</span></summary>
                        <ul>{itens.map((x) => <li key={x}>{x}</li>)}</ul>
                      </details>
                    ) : null;
                  })}
                </div>
                <Dicas tema={id} titulo={th.t} />
                <div className="row">
                  <Marcar chave={"andamento|" + id} rotulo={["Estamos trabalhando neste tema", "Tirar de “em andamento”"]} origem="trilhas" />
                  <Marcar chave={id} rotulo={["Marcar tema como concluído", "Desmarcar tema"]} origem="trilhas" />
                  <ParaDiario area={s} tipo="Estudo da trilha" titulo={th.t} />
                </div>
              </div>
          );
        })}
      </Mapa>
      <p className="note">Filmes e séries mudam de plataforma com frequência; confira a classificação e onde estão disponíveis antes de assistir. Os anos são referência: avance ou volte conforme a criança.</p>
    </div>
  );
}
