import Link from "next/link";
import type { Metadata } from "next";
import Comece from "./Comece";

export const metadata: Metadata = {
  title: "Comece grátis",
  description: "Trilhas da alfabetização ao 5º ano com livros, filmes, jogos e experimentos para cada tema. Crie sua conta grátis em um minuto.",
  alternates: { canonical: "/comece" },
  robots: { index: false, follow: true },
};

/** Página de entrada dos anúncios: um único pedido (criar a conta grátis), com o mesmo texto do anúncio. */
export default function Page() {
  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow-i">Feito por uma professora e mãe</p>
      <h1 className="hero-t">Criança aprende melhor quando o mesmo assunto aparece de vários jeitos.</h1>
      <p className="lead">
        No Atlas do Aprender, cada tema do 1º ao 5º ano já vem com um livro para ler, um filme, um jogo e um experimento com material de casa.
        Você escolhe uma ou duas atividades por semana. É gratuito.
      </p>

      <Comece />

      <h3 className="ini-h">O que você encontra lá dentro</h3>
      <ul className="ini-steps">
        <li><b>Trilhas de Português, Matemática e Ciências</b>, ano a ano, na ordem certa.</li>
        <li><b>Indicações de livros, filmes e jogos</b> comentados para cada tema.</li>
        <li><b>Experimentos e atividades</b> com o que você já tem em casa.</li>
        <li><b>Diário da criança</b> para guardar o que ela fez e descobriu, com a sua conta.</li>
      </ul>
      <p className="meta" style={{ margin: 0 }}>
        Prefere olhar antes? <Link href="/trilhas/portugues/1-ano">Ver as trilhas sem conta</Link>.
      </p>
    </div>
  );
}
