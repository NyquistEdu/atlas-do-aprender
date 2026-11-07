import type { Metadata } from "next";
import Link from "next/link";
import Diagnostico from "./Diagnostico";
import { jsonLd, url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Diagnóstico grátis: onde estão as lacunas do meu filho? (1º ao 5º ano)",
  description: "Responda perguntas rápidas sobre o que a criança já faz em Português, Matemática e Ciências e descubra onde estão as lacunas, inclusive de anos anteriores, e por qual fase da trilha começar. Da alfabetização ao 5º ano. Gratuito e sem cadastro.",
  alternates: { canonical: "/diagnostico" },
};

const FAQ: [string, string][] = [
  ["É uma prova para a criança?", "Não. Quem responde é o adulto, pensando no que a criança faz no dia a dia: na leitura de uma placa, numa conta de troco, num bilhete. Não precisa chamar a criança nem aplicar exercício."],
  ["Como o tema é escolhido?", "As perguntas seguem a ordem das trilhas do Atlas, que vão da alfabetização ao 5º ano e seguem a BNCC. O diagnóstico começa um ano abaixo do ano escolar e pergunta sobre todos os temas daquele ano. Os temas que ainda não estão firmes entram na lista, na ordem da trilha, e o primeiro é por onde começar."],
  ["E se a criança estiver atrasada em relação à série?", "Acontece muito, e não é motivo de preocupação. Se aparece algum tema não firme, o diagnóstico desce para o ano anterior, e continua descendo até encontrar um ano em que tudo está firme. Assim, uma criança do 3º ano com lacunas do 1º e do 2º ano recebe esses temas na lista. Firmar a base é o caminho mais rápido para alcançar a turma."],
  ["Preciso me cadastrar?", "Não. O resultado aparece na hora e fica guardado só no seu navegador. A conta gratuita serve para marcar os temas concluídos e usar o diário, se você quiser."],
  ["O diagnóstico substitui uma avaliação profissional?", "Não. Ele é um ponto de partida para o estudo em casa. Se você percebe dificuldades persistentes de fala, leitura, atenção ou comportamento, converse com a escola e com um profissional de saúde."],
];

export default function Page() {
  return (
    <div className="wrap" style={{ maxWidth: 820 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "FAQPage", url: url("/diagnostico"),
        mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      })} />
      <p className="eyebrow-i">Gratuito · 5 minutos · sem cadastro</p>
      <h1 className="hero-t">Onde estão as lacunas do meu filho?</h1>
      <p className="lead">Responda algumas perguntas sobre o que a criança já faz sozinha em Português, Matemática e Ciências. No final, você vê onde estão as lacunas em cada matéria, na ordem certa, e por qual fase da trilha começar, com material pronto para 15 minutos por dia.</p>

      <Diagnostico />

      <h3 className="ini-h">Perguntas frequentes</h3>
      <section className="card">
        <dl>{FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}</dl>
      </section>
      <p className="meta">Quer ver de perto a leitura? Faça o <Link href="/fluencia">Teste de fluência leitora</Link>: 10 minutos, com palavras por minuto, precisão e compreensão.</p>
      <p className="meta">Percebe sinais de dificuldade na leitura, na escrita, na atenção ou no comportamento? Use o <Link href="/olhar-atento">Olhar Atento</Link>: fichas e jogos com resultado na hora e orientação sobre quando procurar um profissional.</p>
      <p className="meta">Quer um plano completo, feito para a rotina da sua família? Conheça o <Link href="/planejamento">Planejamento gratuito</Link>.</p>
    </div>
  );
}
