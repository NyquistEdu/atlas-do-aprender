import Link from "next/link";
import type { Metadata } from "next";
import Comece from "./Comece";

export const metadata: Metadata = {
  title: "Comece grátis",
  description: "Descubra as lacunas de aprendizagem da criança e siga o caminho para resolvê-las, 15 minutos por dia, da alfabetização ao 5º ano. Crie sua conta grátis em um minuto.",
  alternates: { canonical: "/comece" },
  robots: { index: false, follow: true },
};

/** Página de entrada dos anúncios: um único pedido (criar a conta grátis), com o mesmo texto do anúncio. */
export default function Page() {
  return (
    <div className="wrap" style={{ maxWidth: 720 }}>
      <p className="eyebrow-i">Feito por uma professora e mãe</p>
      <h1 className="hero-t">Descubra o que falta para o seu filho e saiba exatamente como resolver.</h1>
      <p className="lead">
        O Atlas do Aprender encontra as lacunas de aprendizagem da criança e entrega o caminho e o material para resolvê-las,
        em 15 minutos por dia, da alfabetização ao 5º ano. Um pouquinho, todo dia, com amor. É gratuito.
      </p>

      <Comece />

      <h3 className="ini-h">O que você encontra lá dentro</h3>
      <ul className="ini-steps">
        <li><b>Diagnóstico de 5 minutos</b> que mostra onde estão as lacunas em Português, Matemática e Ciências.</li>
        <li><b>O mapa da trilha</b>, com a próxima fase de cada matéria, na ordem certa.</li>
        <li><b>Material pronto para 15 minutos por dia</b>: treinos para imprimir, apostilas, livros, jogos e experimentos.</li>
        <li><b>Progresso de cada criança</b> guardado na sua conta, fase por fase.</li>
      </ul>
      <p className="meta" style={{ margin: 0 }}>
        Prefere olhar antes? <Link href="/trilhas/portugues/1-ano">Ver as trilhas sem conta</Link>.
      </p>
    </div>
  );
}
