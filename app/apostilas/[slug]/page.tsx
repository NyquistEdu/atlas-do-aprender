import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APOSTILAS, GRATUITOS, KITS, anoNome, treinoDaApostila, type Gratuito, type Kit } from "@/lib/apostilas";
import { MATERIAS, SLUG, anoSlug } from "@/lib/data";
import { CONTATO } from "@/lib/contato";
import Comprar from "@/components/Comprar";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { slug: string } };

export function generateStaticParams() {
  return [...APOSTILAS, ...GRATUITOS, ...KITS].map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: P): Metadata {
  const k = KITS.find((x) => x.slug === params.slug);
  if (k) return { title: `${k.titulo} · kit de ${k.selo} para imprimir`, description: `${k.subtitulo}. ${k.publico}, ${k.paginas} páginas para imprimir em casa.`, alternates: { canonical: `/apostilas/${k.slug}` }, openGraph: { images: [`/apostilas/${k.slug}/capa.webp`] } };
  const g = GRATUITOS.find((x) => x.slug === params.slug);
  if (g) return { title: `${g.titulo} · PDF gratuito`, description: `${g.subtitulo}. ${g.paginas} páginas, gratuito.`, alternates: { canonical: `/apostilas/${g.slug}` }, openGraph: { images: [`/apostilas/${g.slug}/capa.webp`] } };
  const a = APOSTILAS.find((x) => x.slug === params.slug);
  if (!a) return {};
  return {
    title: `${a.titulo} · apostila para imprimir`,
    description: `${a.subtitulo}. ${MATERIAS[a.materia]}, ${anoNome(a.ano)}. ${a.paginas} páginas com explicação, exercícios, jogos e gabarito.`,
    alternates: { canonical: `/apostilas/${a.slug}` },
    openGraph: { images: [`/apostilas/${a.slug}/capa.webp`] },
  };
}

function PaginaGratuito({ g }: { g: Gratuito }) {
  const baixar = <a className="btn" href={g.arquivo} download={g.nomeArquivo}>Baixar grátis</a>;
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "Book", name: g.titulo, description: g.resumo, author: { "@type": "Person", name: "Stephanie Kamarry" },
        image: url(`/apostilas/${g.slug}/capa.webp`), numberOfPages: g.paginas, inLanguage: "pt-BR", isAccessibleForFree: true, bookFormat: "https://schema.org/EBook",
      })} />
      <p className="meta"><Link href="/apostilas">Apostilas</Link> › {g.titulo}</p>
      <div className="produto-topo" style={{ ["--sc" as string]: "var(--cie)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="produto-capa-g" src={`/apostilas/${g.slug}/capa.webp`} alt={`Capa do ${g.titulo}`} width={566} height={800} />
        <div className="produto-txt">
          <div className="tags"><span className="tag cie">Gratuito</span><span className="tag">{g.publico ?? "Todas as séries"}</span><span className="tag">{g.paginas} páginas</span></div>
          <h1 className="hero-t">{g.titulo}</h1>
          <p className="lead">{g.subtitulo}</p>
          <p>{g.resumo}</p>
          <div className="row">{baixar}</div>
          <p className="note">PDF em tamanho A4, para imprimir ou ler no celular. Pode compartilhar com outras famílias, sem alterar e sem vender.</p>
        </div>
      </div>
      <section className="card">
        <h3>O que tem dentro</h3>
        <ul className="dentro">{g.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
        {g.apostila && (() => {
          const ap = APOSTILAS.find((a) => a.slug === g.apostila);
          return ap ? <p className="meta">Complementa a apostila <Link href={`/apostilas/${ap.slug}`}>{ap.titulo}</Link>, que explica o conteúdo passo a passo. Lá estão a explicação, os jogos e as atividades; aqui, o treino de todo dia. Tema da trilha: <Link href={`/trilhas/${SLUG[g.materia!]}/${anoSlug(g.ano!)}#tema-${g.tema}`}>{MATERIAS[g.materia!]} · {anoNome(g.ano!)}, tema {g.tema}</Link>.</p> : null;
        })()}
        <h3>Como usar</h3>
        {g.comoUsar ? (
          g.comoUsar.map((p, i) => <p key={i} style={i === 0 ? { marginTop: 0 } : undefined}>{p}</p>)
        ) : (
          <>
            <p style={{ margin: 0 }}>Terminou um livro com seu filho e não sabe por onde puxar a conversa? Leiam juntos, abram a página do livro no caderno e escolham duas ou três perguntas. Dez minutos de conversa já valem.</p>
            <p className="meta">Os livros também estão na aba <Link href="/livros">Livros</Link>, onde dá para marcar os que cada criança já leu.</p>
          </>
        )}
      </section>
      <h3 className="ini-h">Veja algumas páginas</h3>
      <div className="amostras">
        {g.amostras.map((leg, i) => (
          <figure key={leg}>
            <a href={`/apostilas/${g.slug}/pagina-${i + 1}.webp`} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apostilas/${g.slug}/pagina-${i + 1}.webp`} alt={`Página de amostra: ${leg}`} width={566} height={800} loading="lazy" />
            </a>
            <figcaption>{leg}</figcaption>
          </figure>
        ))}
      </div>
      <div className="row">
        {baixar}
        <Link className="btn ghost" href="/apostilas">Ver todas as apostilas</Link>
      </div>
    </div>
  );
}

function PaginaKit({ k }: { k: Kit }) {
  const comprar = <Comprar slug={k.slug} titulo={k.titulo} checkout={k.checkout} preco={k.preco} grande />;
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "Product", name: k.titulo, description: k.resumo,
        image: url(`/apostilas/${k.slug}/capa.webp`), brand: { "@type": "Brand", name: "Atlas do Aprender" },
        audience: { "@type": "PeopleAudience", suggestedMinAge: 6, suggestedMaxAge: 10 },
        ...(k.checkout ? { offers: { "@type": "Offer", price: k.preco.replace(/[^0-9,]/g, "").replace(",", "."), priceCurrency: "BRL", availability: "https://schema.org/InStock", url: url(`/apostilas/${k.slug}`) } } : {}),
      })} />
      <p className="meta"><Link href="/apostilas">Apostilas</Link> › {k.titulo}</p>
      <div className="produto-topo" style={{ ["--sc" as string]: "var(--por)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="produto-capa-g" src={`/apostilas/${k.slug}/capa.webp`} alt={`Capa do kit ${k.titulo}`} width={566} height={800} />
        <div className="produto-txt">
          <div className="tags"><span className="tag por">{k.selo}</span><span className="tag">{k.publico}</span><span className="tag">{k.paginas} páginas</span></div>
          <h1 className="hero-t">{k.titulo}</h1>
          <p className="lead">{k.subtitulo}</p>
          <p>{k.resumo}</p>
          <div className="row">{comprar}</div>
          <p className="note">PDF em tamanho A4, para imprimir em casa. Pix, cartão ou boleto; o arquivo chega no seu e-mail.</p>
        </div>
      </div>
      <section className="card">
        <h3>O que tem dentro</h3>
        <ul className="dentro">{k.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
        <h3>Como usar</h3>
        {k.comoUsar.map((p, i) => <p key={i} style={i === 0 ? { marginTop: 0 } : undefined}>{p}</p>)}
      </section>
      <h3 className="ini-h">Veja algumas páginas</h3>
      <div className="amostras">
        {k.amostras.map((leg, i) => (
          <figure key={leg}>
            <a href={`/apostilas/${k.slug}/pagina-${i + 1}.webp`} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apostilas/${k.slug}/pagina-${i + 1}.webp`} alt={`Página de amostra: ${leg}`} width={566} height={800} loading="lazy" />
            </a>
            <figcaption>{leg}</figcaption>
          </figure>
        ))}
      </div>
      <section className="card">
        <h3>Perguntas frequentes</h3>
        <dl>
          <dt>Como recebo o kit?</dt>
          <dd>Depois que o pagamento é confirmado, a plataforma envia o link do PDF para o seu e-mail. No Pix, costuma ser em poucos minutos.</dd>
          <dt>Posso imprimir mais de uma vez?</dt>
          <dd>Pode. A licença permite imprimir quantas cópias precisar para as crianças da sua casa, inclusive para repetir no ano que vem.</dd>
          <dt>Comecei depois do dia 1º. E agora?</dt>
          <dd>Sem problema: faça dois ou três cartões por dia até alcançar a data. O importante é todas as letras chegarem ao painel até o dia 24.</dd>
          <dt>Sou professora. Posso usar com a turma?</dt>
          <dd>A licença comum é só para uso familiar. Para turmas, escreva para {CONTATO.email ? <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a> : "o e-mail do rodapé"} e combinamos uma licença.</dd>
        </dl>
      </section>
      <div className="row">
        {comprar}
        <Link className="btn ghost" href="/apostilas">Ver todas as apostilas</Link>
      </div>
    </div>
  );
}

export default function Apostila({ params }: P) {
  const k = KITS.find((x) => x.slug === params.slug);
  if (k) return <PaginaKit k={k} />;
  const g = GRATUITOS.find((x) => x.slug === params.slug);
  if (g) return <PaginaGratuito g={g} />;
  const a = APOSTILAS.find((x) => x.slug === params.slug);
  if (!a) notFound();
  const trilha = `/trilhas/${SLUG[a.materia]}/${anoSlug(a.ano)}#tema-${a.tema}`;
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "Product", name: `Apostila ${a.titulo}`, description: a.resumo,
        image: url(`/apostilas/${a.slug}/capa.webp`), brand: { "@type": "Brand", name: "Atlas do Aprender" },
        category: `${MATERIAS[a.materia]} · ${anoNome(a.ano)}`, audience: { "@type": "PeopleAudience", suggestedMinAge: 6, suggestedMaxAge: 11 },
        ...(a.checkout ? { offers: { "@type": "Offer", price: a.preco.replace(/[^0-9,]/g, "").replace(",", "."), priceCurrency: "BRL", availability: "https://schema.org/InStock", url: url(`/apostilas/${a.slug}`) } } : {}),
      })} />
      <p className="meta"><Link href="/apostilas">Apostilas</Link> › {a.titulo}</p>
      <div className="produto-topo" style={{ ["--sc" as string]: `var(--${a.materia})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="produto-capa-g" src={`/apostilas/${a.slug}/capa.webp`} alt={`Capa da apostila ${a.titulo}`} width={566} height={800} />
        <div className="produto-txt">
          <div className="tags"><span className={`tag ${a.materia}`}>{MATERIAS[a.materia]}</span><span className="tag">{anoNome(a.ano)}</span><span className="tag">{a.paginas} páginas</span></div>
          <h1 className="hero-t">{a.titulo}</h1>
          <p className="lead">{a.subtitulo}</p>
          <p>{a.resumo}</p>
          <div className="row">
            <Comprar slug={a.slug} titulo={a.titulo} checkout={a.checkout} preco={a.preco} grande />
          </div>
          <p className="note">PDF em tamanho A4, para imprimir em casa. Pix, cartão ou boleto; o arquivo chega no seu e-mail.</p>
        </div>
      </div>
      <section className="card">
        <h3>O que tem dentro</h3>
        <ul className="dentro">{a.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
        <p className="meta">Faz parte da trilha de {MATERIAS[a.materia]} · {anoNome(a.ano)}, tema {a.tema}: <Link href={trilha}>{a.nomeTema}</Link>. Lá estão os livros, filmes e jogos indicados para o mesmo assunto.</p>
        {treinoDaApostila(a.slug) && <p className="meta"><b>Complemento gratuito:</b> <Link href={`/apostilas/${treinoDaApostila(a.slug)!.slug}`}>{treinoDaApostila(a.slug)!.titulo}</Link>, com 30 folhas curtas para treinar um pouco por dia.</p>}
      </section>
      <h3 className="ini-h">Veja algumas páginas</h3>
      <div className="amostras">
        {a.amostras.map((leg, i) => (
          <figure key={leg}>
            <a href={`/apostilas/${a.slug}/pagina-${i + 1}.webp`} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apostilas/${a.slug}/pagina-${i + 1}.webp`} alt={`Página de amostra: ${leg}`} width={566} height={800} loading="lazy" />
            </a>
            <figcaption>{leg}</figcaption>
          </figure>
        ))}
      </div>
      <section className="card">
        <h3>Perguntas frequentes</h3>
        <dl>
          <dt>Como recebo a apostila?</dt>
          <dd>Depois que o pagamento é confirmado, a plataforma envia o link do PDF para o seu e-mail. No Pix, costuma ser em poucos minutos.</dd>
          <dt>Posso imprimir mais de uma vez?</dt>
          <dd>Pode. A licença permite imprimir quantas cópias precisar para as crianças da sua casa, inclusive para refazer os exercícios.</dd>
          <dt>Preciso de algum material especial?</dt>
          <dd>Não. As atividades usam coisas comuns de casa: lápis de cor, tesoura, tampinhas, palitos, feijões.</dd>
          <dt>Sou professora. Posso usar com a turma?</dt>
          <dd>A licença comum é só para uso familiar. Para turmas, escreva para {CONTATO.email ? <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a> : "o e-mail do rodapé"} e combinamos uma licença.</dd>
        </dl>
      </section>
      <div className="row">
        <Comprar slug={a.slug} titulo={a.titulo} checkout={a.checkout} preco={a.preco} grande />
        <Link className="btn ghost" href="/apostilas">Ver todas as apostilas</Link>
      </div>
    </div>
  );
}
