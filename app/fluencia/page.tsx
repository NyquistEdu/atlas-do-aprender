import type { Metadata } from "next";
import Link from "next/link";
import Fluencia from "./Fluencia";
import { jsonLd, url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Teste de fluência leitora grátis: como meu filho está lendo? (1º ao 5º ano)",
  description: "Em 10 minutos, descubra quantas palavras por minuto a criança lê, com que precisão e se entende o texto. Três leituras de 1 minuto, como nas avaliações das escolas, com resultado na hora, histórico de evolução e o material certo para treinar. Gratuito.",
  alternates: { canonical: "/fluencia" },
};

const FAQ: [string, string][] = [
  ["O que é fluência leitora?", "É ler com precisão (sem errar as palavras), com velocidade (sem precisar silabar) e com ritmo e expressão. Ela é a ponte para a compreensão: a criança que gasta toda a energia decifrando palavra por palavra não sobra atenção para entender a história."],
  ["Como o teste funciona?", "São três leituras de 1 minuto: uma lista de palavras, uma lista de palavras inventadas e um texto curto. O adulto só toca nas palavras que a criança errar; o site cronometra e calcula as palavras corretas por minuto. No final, o adulto avalia o ritmo da leitura e faz cinco perguntas sobre o texto."],
  ["Para que servem as palavras inventadas?", "Palavras como “tilo” ou “brafe” não existem, então a criança não consegue reconhecê-las de memória nem adivinhar. Elas mostram se ela realmente junta letras e sons, que é a base de toda a leitura."],
  ["O que significa cada perfil?", "Usamos os mesmos perfis das avaliações de fluência aplicadas pelas redes públicas no 2º ano: pré-leitor (ainda está aprendendo a juntar letras e sons), leitor iniciante (já lê palavras, mas o texto ainda sai devagar ou com erros) e leitor fluente (mais de 65 palavras corretas por minuto no texto, com pelo menos 90% de precisão)."],
  ["De quanto em quanto tempo refazer?", "A cada 2 ou 3 meses, alternando as versões A e B do texto, para a criança não decorar. O gráfico de evolução mostra o crescimento ao longo do ano."],
  ["O teste substitui uma avaliação profissional?", "Não. Ele mostra onde treinar em casa. Se a leitura não evolui depois de alguns meses de treino, ou se a criança troca letras também ao falar, converse com a escola e procure um fonoaudiólogo."],
];

export default function Page() {
  return (
    <div className="wrap" style={{ maxWidth: 860 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "FAQPage", url: url("/fluencia"),
        mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      })} />
      <p className="eyebrow-i">Gratuito · 10 minutos · do 1º ao 5º ano</p>
      <h1 className="hero-t">Como meu filho está lendo?</h1>
      <p className="lead">O teste de fluência mostra quantas palavras por minuto a criança lê, com que precisão, com que ritmo e se ela entende o que leu. No final, você vê o perfil de leitor, os tipos de erro que mais aparecem e o material certo para treinar, 15 minutos por dia.</p>

      <div id="flu" style={{ scrollMarginTop: 12 }}><Fluencia /></div>

      <h3 className="ini-h">Perguntas frequentes</h3>
      <section className="card">
        <dl>{FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}</dl>
      </section>
      <p className="meta">Quer ver também Matemática e Ciências? Faça o <Link href="/diagnostico">Diagnóstico gratuito</Link>.</p>
    </div>
  );
}
