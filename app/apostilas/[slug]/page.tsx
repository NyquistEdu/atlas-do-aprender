import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { APOSTILAS, GRATUITOS, anoNome, type Gratuito } from "@/lib/apostilas";
import { MATERIAS, SLUG, anoSlug } from "@/lib/data";
import { CONTATO } from "@/lib/contato";
import Comprar from "@/components/Comprar";

type P = { params: { slug: string } };

export function generateStaticParams() {
  return [...APOSTILAS, ...GRATUITOS].map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: P): Metadata {
  const g = GRATUITOS.find((x) => x.slug === params.slug);
  if (g) return { title: `${g.titulo} · PDF gratuito`, description: `${g.subtitulo}. ${g.paginas} páginas, gratuito.`, openGraph: { images: [`/apostilas/${g.slug}/capa.webp`] } };
  const a = APOSTILAS.find((x) => x.slug === params.slug);
  if (!a) return {};
  return {
    title: `${a.titulo} · apostila para imprimir`,
    description: `${a.subtitulo}. ${MATERIAS[a.materia]}, ${anoNome(a.ano)}. ${a.paginas} páginas com explicação, exercícios, jogos e gabarito.`,
    openGraph: { images: [`/apostilas/${a.slug}/capa.webp`] },
  };
}

function PaginaGratuito({ g }: { g: Gratuito }) {
  const baixar = <a className="btn" href={g.arquivo} download={g.nomeArquivo}>Baixar grátis</a>;
  return (
    <div className="wrap">
      <p className="meta"><Link href="/apostilas">Apostilas</Link> › {g.titulo}</p>
      <div className="produto-topo" style={{ ["--sc" as string]: "var(--cie)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="produto-capa-g" src={`/apostilas/${g.slug}/capa.webp`} alt={`Capa do ${g.titulo}`} width={566} height={800} />
        <div className="produto-txt">
          <div className="tags"><span className="tag cie">Gratuito</span><span className="tag">Todas as séries</span><span className="tag">{g.paginas} páginas</span></div>
          <h2 className="hero-t">{g.titulo}</h2>
          <p className="lead">{g.subtitulo}</p>
          <p>{g.resumo}</p>
          <div className="row">{baixar}</div>
          <p className="note">PDF em tamanho A4, para imprimir ou ler no celular. Pode compartilhar com outras famílias, sem alterar e sem vender.</p>
        </div>
      </div>
      <section className="card">
        <h3>O que tem dentro</h3>
        <ul className="dentro">{g.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
        <h3>Como usar</h3>
        <p style={{ margin: 0 }}>Terminou um livro com seu filho e não sabe por onde puxar a conversa? Leiam juntos, abram a página do livro no caderno e escolham duas ou três perguntas. Dez minutos de conversa já valem.</p>
        <p className="meta">Os livros também estão na aba <Link href="/livros">Livros</Link>, onde dá para marcar os que cada criança já leu.</p>
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

export default function Apostila({ params }: P) {
  const g = GRATUITOS.find((x) => x.slug === params.slug);
  if (g) return <PaginaGratuito g={g} />;
  const a = APOSTILAS.find((x) => x.slug === params.slug);
  if (!a) notFound();
  const trilha = `/trilhas/${SLUG[a.materia]}/${anoSlug(a.ano)}#tema-${a.tema}`;
  return (
    <div className="wrap">
      <p className="meta"><Link href="/apostilas">Apostilas</Link> › {a.titulo}</p>
      <div className="produto-topo" style={{ ["--sc" as string]: `var(--${a.materia})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="produto-capa-g" src={`/apostilas/${a.slug}/capa.webp`} alt={`Capa da apostila ${a.titulo}`} width={566} height={800} />
        <div className="produto-txt">
          <div className="tags"><span className={`tag ${a.materia}`}>{MATERIAS[a.materia]}</span><span className="tag">{anoNome(a.ano)}</span><span className="tag">{a.paginas} páginas</span></div>
          <h2 className="hero-t">{a.titulo}</h2>
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
