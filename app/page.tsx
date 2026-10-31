import Link from "next/link";
import type { Metadata } from "next";
import { ESTANTE, EXPERIMENTOS, JOGOS, TRILHAS } from "@/lib/data";
import { APOSTILAS, GRATUITOS, KITS } from "@/lib/apostilas";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Inicio() {
  let temas = 0, livros = 0;
  Object.values(TRILHAS).forEach((anos) => Object.values(anos).forEach((l) => l.forEach((t) => { temas++; livros += t.l?.length || 0; })));
  ESTANTE.forEach(([, l]) => (livros += l.length));
  const numeros: [number, string][] = [
    [temas, "temas nas trilhas"], [livros, "indicações de livros"], [JOGOS.length, "jogos comentados"],
    [EXPERIMENTOS.length, "experimentos"], [GRATUITOS.length, "materiais grátis para imprimir"],
  ];
  const passos: [string, string, string, string, string][] = [
    ["1", "Descubra por onde começar", "O diagnóstico grátis leva uns 5 minutos e mostra o que a criança já domina em Português, Matemática e Ciências, inclusive o que ficou para trás de anos anteriores.", "/diagnostico", "Fazer o diagnóstico"],
    ["2", "Siga a trilha", "Cada tema reúne o objetivo, livros, filmes, jogos, exercícios e um experimento. Escolha uma ou duas atividades por semana.", "/trilhas/portugues/1-ano", "Ver as trilhas"],
    ["3", "Pratique um pouco por dia", "Os treinos diários são folhas curtas para imprimir, uma por dia, de 5 a 10 minutos, com gabarito. As apostilas aprofundam cada tema.", "/apostilas", "Ver os materiais"],
    ["4", "Acompanhe o caminho", "No Diário você registra o que a criança fez e descobriu, e vê a linha do tempo de cada uma: temas concluídos, em andamento e os próximos.", "/diario", "Abrir o Diário"],
  ];
  const destaque = GRATUITOS.slice(0, 6);
  const cards: [string, string, string, string][] = [
    ["/diagnostico", "Diagnóstico grátis", "Por onde começar com o seu filho", "var(--mat)"],
    ["/trilhas/portugues/1-ano", "Trilhas", "Português, Matemática e Ciências, ano a ano", "var(--por)"],
    ["/apostilas", "Apostilas e treinos", `${GRATUITOS.length} materiais grátis, ${APOSTILAS.length} apostilas e ${KITS.length === 1 ? "um kit" : `${KITS.length} kits`} para imprimir`, "var(--por)"],
    ["/livros", "Livros", "Paradidáticos e a estante de Formação", "var(--jog)"],
    ["/jogos", "Jogos", "Do jogo da memória ao GeoMundo", "var(--jog)"],
    ["/mao-na-massa", "Mão na massa", "Experimentos com material de casa", "var(--cie)"],
    ["/loja", "Loja", "Jogos educativos para aprender brincando", "var(--jog)"],
    ["/olimpiadas", "Olimpíadas", "Competições com inscrição individual e quando abrem", "var(--por)"],
    ["/tematicas", "Temáticas", "Halloween, Dia do Saci, Natal e outras datas", "var(--jog)"],
    ["/planejamento", "Planejamento gratuito", "Uma conversa por vídeo e um plano feito para a sua criança", "var(--cie)"],
    ["/diario", "Diário", "Registros e a linha do tempo de cada criança", "var(--mat)"],
    ["/duvidas", "Dúvidas comuns", "O que se aprende em cada ano, leitura, rotina e mais", "var(--mat)"],
    ["/guia", "Guia de uso", "Como usar cada parte do Atlas, passo a passo", "var(--line)"],
  ];
  return (
    <div className="wrap largo">
      <section className="ini-hero">
        <span className="selo" aria-hidden="true">grátis e sem cadastro</span>
        <p className="eyebrow-i">feito por uma professora e mãe de&nbsp;3</p>
        <h1 className="hero-t">Atlas do Aprender</h1>
        <p className="lead">Um caminho de estudo para crianças da alfabetização ao 5º ano, para usar em casa, junto com a escola. Português, Matemática e Ciências, tema por tema, com livros, jogos, experimentos e treinos para imprimir.</p>
        <div className="row">
          <Link className="btn" href="/diagnostico">Fazer o diagnóstico grátis</Link>
          <Link className="btn ghost" href="/trilhas/portugues/1-ano">Ver as trilhas</Link>
        </div>
        <p className="meta" style={{ margin: 0 }}>Tudo é aberto e gratuito, sem cadastro. A conta grátis serve para guardar o progresso de cada criança.</p>
      </section>

      <div className="stats">{numeros.map(([b, s]) => <div className="stat" key={s}><b>{b}</b><span>{s}</span></div>)}</div>

      <h2 className="ini-h"><span className="ini-kick">passo a passo</span><span className="marca">Como funciona</span></h2>
      <ol className="ini-passos">
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
        <h2 className="ini-h"><span className="ini-kick">é só baixar</span><span className="marca">Grátis para imprimir</span></h2>
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
        <article className="card">
          <h3>Quer ajuda para montar o plano?</h3>
          <p>No planejamento gratuito, você preenche um formulário, conversamos por vídeo sobre a criança e eu monto um plano de estudos seguindo o Atlas. O plano fica salvo na aba Meu plano, com o que fazer em cada dia.</p>
          <div className="row"><Link className="btn small" href="/planejamento">Pedir o planejamento</Link></div>
        </article>
        <article className="card">
          <h3>Primeira vez aqui?</h3>
          <p>O guia de uso explica cada parte do Atlas em poucos minutos: o diagnóstico, as trilhas, os treinos, o diário e uma semana possível de atividades.</p>
          <div className="row"><Link className="btn small ghost" href="/guia">Ler o guia de uso</Link></div>
        </article>
      </div>

      <div className="grid2">
        <article className="card"><h3>Para quem é</h3><p>Para mães, pais, avós e professores que querem dar à criança um caminho de estudo organizado, sem montar tudo do zero. Serve também para quem precisa recuperar o que ficou para trás. Não substitui a escola: complementa, revisa e desperta o interesse.</p></article>
        <article className="card"><h3>A ideia</h3><p>Criança aprende melhor quando o mesmo assunto aparece de vários jeitos: lido num livro, visto num filme, jogado num tabuleiro, testado com as mãos e praticado um pouco por dia. Cada tema reúne essas portas de entrada num só lugar.</p></article>
      </div>

      <h2 className="ini-h"><span className="ini-kick">explore</span><span className="marca">Tudo o que tem no Atlas</span></h2>
      <div className="home-grid">
        {cards.map(([href, t, d, c]) => (
          <Link key={href} href={href} className="home-card" style={{ ["--sc" as string]: c }}><b>{t}</b><span>{d}</span></Link>
        ))}
      </div>
    </div>
  );
}
