import Link from "next/link";
import { ESTANTE, EXPERIMENTOS, JOGOS, TRILHAS } from "@/lib/data";

export default function Inicio() {
  let temas = 0, livros = 0;
  Object.values(TRILHAS).forEach((anos) => Object.values(anos).forEach((l) => l.forEach((t) => { temas++; livros += t.l?.length || 0; })));
  ESTANTE.forEach(([, l]) => (livros += l.length));
  const numeros: [number, string][] = [[temas, "temas nas trilhas"], [livros, "indicações de livros"], [JOGOS.length, "jogos comentados"], [EXPERIMENTOS.length, "experimentos e atividades"]];
  const cards: [string, string, string, string][] = [
    ["/trilhas/portugues/1-ano", "Trilhas", "Português, Matemática e Ciências, ano a ano", "var(--por)"],
    ["/livros", "Livros", "Paradidáticos e a estante de Formação", "var(--jog)"],
    ["/jogos", "Jogos", "Do jogo da memória ao GeoMundo", "var(--jog)"],
    ["/mao-na-massa", "Mão na massa", "Experimentos com material de casa", "var(--cie)"],
    ["/apostilas", "Apostilas", "PDFs para imprimir, com exercícios e gabarito", "var(--por)"],
    ["/diario", "Diário", "O que cada criança fez e descobriu", "var(--mat)"],
    ["/guia", "Guia de uso", "Como usar o Atlas, em PDF", "var(--line)"],
  ];
  return (
    <div className="wrap">
      <p className="eyebrow-i">Bem-vindo ao</p>
      <h2 className="hero-t">Atlas do Aprender</h2>
      <p className="lead">Um sistema para acompanhar a formação de crianças da alfabetização ao 5º ano, em casa, junto com a escola.</p>
      <div className="stats">{numeros.map(([b, s]) => <div className="stat" key={s}><b>{b}</b><span>{s}</span></div>)}</div>
      <div className="grid2">
        <article className="card"><h3>Para quem é</h3><p>Para mães, pais, avós e professores que querem dar à criança um caminho de estudo organizado, com livros, filmes, jogos e experiências práticas, sem montar tudo do zero. Não substitui a escola: complementa, revisa e desperta o interesse.</p></article>
        <article className="card"><h3>A ideia</h3><p>Criança aprende melhor quando o mesmo assunto aparece de vários jeitos: lido num livro, visto num filme, jogado num tabuleiro e testado com as mãos. Cada tema reúne essas portas de entrada num só lugar. Você escolhe uma ou duas por semana.</p></article>
      </div>
      <h3 className="ini-h">Como começar</h3>
      <ol className="ini-steps">
        <li><b>Escolha a matéria e o ano</b> na aba Trilhas. Os anos são referência: comece de onde a criança está.</li>
        <li><b>Abra um tema</b> e escolha uma ou duas atividades para a semana: um livro, um jogo, um experimento.</li>
        <li><b>Registre no Diário</b> o que a criança fez e, principalmente, o que ela descobriu ou perguntou. Para isso, entre com seu e-mail; todo o resto é aberto.</li>
      </ol>
      <div className="row">
        <Link className="btn" href="/trilhas/portugues/1-ano">Começar pelas trilhas</Link>
        <Link className="btn ghost" href="/guia">Ver o guia de uso</Link>
      </div>
      <h3 className="ini-h">O que tem no Atlas</h3>
      <div className="home-grid">
        {cards.map(([href, t, d, c]) => (
          <Link key={href} href={href} className="home-card" style={{ ["--sc" as string]: c }}><b>{t}</b><span>{d}</span></Link>
        ))}
      </div>
    </div>
  );
}
