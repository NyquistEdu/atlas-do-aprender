import { LEMA } from "@/lib/lema";
import Link from "next/link";
import type { Metadata } from "next";
import { ESTANTE, EXPERIMENTOS, JOGOS, TRILHAS } from "@/lib/data";
import { GRATUITOS } from "@/lib/apostilas";
import { desafioAtual } from "@/lib/desafios";
import { ultimasConquistas } from "@/lib/comunidade";
import { todasFases } from "@/lib/fasesInfo";
import CartaoConquista from "@/components/CartaoConquista";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export const revalidate = 600;

export default async function Inicio() {
  const desafio = desafioAtual();
  const conquistas = await ultimasConquistas(3);
  const fases = conquistas.length ? todasFases() : {};
  let temas = 0, livros = 0;
  Object.values(TRILHAS).forEach((anos) => Object.values(anos).forEach((l) => l.forEach((t) => { temas++; livros += t.l?.length || 0; })));
  ESTANTE.forEach(([, l]) => (livros += l.length));
  const passos: [string, string, string, string, string][] = [
    ["1", "Descubra as lacunas", "Um diagnóstico de 5 minutos, respondido por você, mostra o que a criança já sabe em Português, Matemática e Ciências e onde estão as lacunas, inclusive as de anos anteriores.", "/diagnostico", "Fazer o diagnóstico"],
    ["2", "Siga a trilha", `Cada lacuna é uma fase no mapa da trilha (são ${temas} ao todo). Você sabe exatamente qual é a próxima e, quando ela fica firme, passa para a seguinte.`, "/trilhas/portugues/1-ano", "Ver o mapa das trilhas"],
    ["3", "Um pouquinho todo dia", "15 minutos por dia, com material pronto para cada fase: treino diário para imprimir, apostila, livro, jogo e experimento. Nada para montar do zero.", "/apostilas", "Ver o material"],
  ];
  const destaque = GRATUITOS.slice(0, 6);
  const extras: [string, string, string, string][] = [
    ["/comunidade", "Comunidade", "Desafio do mês, mural de conquistas e dicas das famílias", "var(--jog)"],
    ["/duvidas", "Pergunte à professora", "Mande sua dúvida; eu respondo pessoalmente", "var(--mat)"],
    ["/livros", "Livros", `${livros} indicações, por tema e na estante de Formação`, "var(--jog)"],
    ["/jogos", "Jogos", `${JOGOS.length} jogos comentados, do jogo da memória ao GeoMundo`, "var(--jog)"],
    ["/mao-na-massa", "Mão na massa", `${EXPERIMENTOS.length} experimentos com material de casa`, "var(--cie)"],
    ["/diario", "Diário", "Registros e a linha do tempo de cada criança", "var(--mat)"],
    ["/planejamento", "Planejamento gratuito", "Uma conversa por vídeo e um plano feito para a sua criança", "var(--cie)"],
    ["/tematicas", "Temáticas", "Halloween, Dia do Saci, Natal e outras datas", "var(--jog)"],
    ["/olimpiadas", "Olimpíadas", "Competições com inscrição individual e quando abrem", "var(--por)"],
    ["/loja", "Loja", "Jogos educativos para aprender brincando", "var(--jog)"],
    ["/guia", "Guia de uso", "Como usar cada parte do Atlas, passo a passo", "var(--line)"],
  ];
  return (
    <div className="wrap largo">
      <section className="ini-hero">
        <span className="selo" aria-hidden="true">grátis e sem cadastro</span>
        <p className="eyebrow-i">feito por uma professora e mãe de&nbsp;3</p>
        <h1 className="hero-t">Atlas do Aprender</h1>
        <p className="lema">{LEMA}</p>
        <p className="lead">O Atlas encontra as <b>lacunas de aprendizagem</b> da criança e entrega <b>o caminho e o material</b> para resolvê-las, em <b>15 minutos por dia</b>. Português, Matemática e Ciências, da alfabetização ao 5º ano, para usar em casa junto com a escola.</p>
        <div className="row">
          <Link className="btn" href="/diagnostico">Descobrir onde meu filho está →</Link>
          <Link className="ini-sec" href="/trilhas/portugues/1-ano">ou ver o mapa das trilhas</Link>
        </div>
        <p className="meta" style={{ margin: 0 }}>Tudo é aberto e gratuito. A conta grátis serve para guardar o progresso de cada criança.</p>
      </section>

      <h2 className="ini-h"><span className="ini-kick">em 3 passos</span><span className="marca">Como funciona</span></h2>
      <ol className="ini-passos ini-passos3">
        {passos.map(([n, t, d, href, cta]) => (
          <li key={n} className="card">
            <span className="ini-n" aria-hidden="true">{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <Link href={href}>{cta} →</Link>
          </li>
        ))}
      </ol>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 className="ini-h"><span className="ini-kick">passo 3, pronto para imprimir</span><span className="marca">Treinos diários grátis</span></h2>
        <Link href="/apostilas">Ver todos os materiais →</Link>
      </div>
      <div className="ini-gratis">
        {destaque.map((g) => (
          <Link key={g.slug} href={`/apostilas/${g.slug}`} className="ini-g">
            <img src={`/apostilas/${g.slug}/capa.webp`} alt="" width={566} height={800} loading="lazy" />
            <b>{g.titulo.replace("Treino Diário · ", "")}</b>
            <span>{g.subtitulo}</span>
          </Link>
        ))}
      </div>

      <div className="grid2">
        <article className="card"><h3>Para quem é</h3><p>Para mães, pais, avós e professores que querem saber o que falta para a criança e ter um caminho claro para resolver, sem montar tudo do zero. Não substitui a escola: complementa, recupera o que ficou para trás e desperta o gosto por aprender.</p></article>
        <article className="card">
          <h3>Quer ajuda para montar o plano?</h3>
          <p>No planejamento gratuito, conversamos por vídeo sobre a criança e eu monto um plano seguindo o Atlas, com o que fazer em cada dia.</p>
          <div className="row"><Link className="btn small ghost" href="/planejamento">Pedir o planejamento</Link></div>
        </article>
      </div>

      <h2 className="ini-h"><span className="ini-kick">para ir além</span><span className="marca">E ainda tem…</span></h2>
      <Link href="/desafio" className="ini-desafio">
        <span className="ini-desafio-em" aria-hidden="true">{desafio.emoji}</span>
        <span className="ini-desafio-t"><small>Desafio de {desafio.mes}</small><b>{desafio.titulo}</b><span>{desafio.resumo}</span></span>
        <span className="btn small">Participar →</span>
      </Link>

      {conquistas.length > 0 && (
        <>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 className="ini-h">Conquistas das famílias</h3>
            <Link href="/mural">Ver o mural →</Link>
          </div>
          <div className="mural">{conquistas.map((c) => <CartaoConquista key={c.id} c={c} fase={fases[c.tema]} />)}</div>
        </>
      )}

      <div className="home-grid">
        {extras.map(([href, t, d, c]) => (
          <Link key={href} href={href} className="home-card" style={{ ["--sc" as string]: c }}><b>{t}</b><span>{d}</span></Link>
        ))}
      </div>
    </div>
  );
}
