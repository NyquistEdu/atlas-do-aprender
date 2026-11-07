import type { Metadata } from "next";
import Link from "next/link";
import OlharAtento from "./OlharAtento";
import { jsonLd, url } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Olhar Atento: o que observar no meu filho? Leitura, escrita, matemática, atenção e comportamento",
  description: "Fichas e jogos gratuitos para a família observar sinais ligados a dislexia, disgrafia, discalculia, TDAH, autismo e altas habilidades, com resultado na hora, o que treinar em casa e quando procurar um profissional. Não é diagnóstico. Gratuito e sem cadastro.",
  alternates: { canonical: "/olhar-atento" },
};

const FAQ: [string, string][] = [
  ["O Olhar Atento faz diagnóstico?", "Não. Ele ajuda a família a organizar o que observa no dia a dia. Diagnóstico de autismo, TDAH, dislexia, discalculia ou qualquer outra condição só pode ser feito por profissionais habilitados, com avaliação completa."],
  ["Os itens são de algum teste oficial?", "Não. Todas as fichas e jogos foram escritos para o Atlas, em linguagem de família. Instrumentos clínicos, como o M-CHAT-R/F e o SNAP-IV, são aplicados por profissionais, e o Olhar Atento explica quando procurar cada um."],
  ["Como leio o resultado?", "Cada resposta vale 0 (nunca), 1 (às vezes) ou 2 (quase sempre). Até 30% dos pontos: poucos sinais. De 30% a 55%: acompanhe de perto e treine no Atlas. Acima de 55%: vale conversar com um profissional. O resultado é um ponto de partida para a conversa, nunca um rótulo."],
  ["Dá para acompanhar mais de uma criança?", "Sim. Toque em Adicionar criança e preencha as fichas de cada uma separadamente. Cada criança tem o próprio relatório. Se você tem conta no Atlas, as crianças cadastradas já aparecem aqui."],
  ["Preciso me cadastrar?", "Não. As respostas ficam guardadas só neste navegador. Para levar à escola ou à consulta, abra o Relatório e toque em Gerar PDF."],
];

export default function Page() {
  return (
    <div className="wrap" style={{ maxWidth: 1040 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "FAQPage", url: url("/olhar-atento"),
        mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      })} />
      <p className="eyebrow-i no-print">Olhar Atento · gratuito · 10 fichas e 3 jogos · sem cadastro</p>
      <h1 className="hero-t no-print">O que observar no meu filho?</h1>
      <p className="lead no-print">Fichas e jogos para observar como a criança lê, escreve, calcula, presta atenção e convive. Você marca o que vê no dia a dia, para uma ou mais crianças, e o resultado aparece na hora. No final, um relatório visual mostra as áreas que pedem atenção e pode ser salvo em PDF para levar à escola ou à consulta.</p>

      <OlharAtento />

      <h3 className="ini-h no-print">Perguntas frequentes</h3>
      <section className="card no-print">
        <dl>{FAQ.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}</dl>
      </section>
      <p className="meta no-print">Para encontrar as lacunas de conteúdo em Português, Matemática e Ciências, faça o <Link href="/diagnostico">Diagnóstico</Link>. Para ver a leitura de perto, o <Link href="/fluencia">Teste de fluência</Link>.</p>
    </div>
  );
}
