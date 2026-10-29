import type { Metadata } from "next";
import Link from "next/link";
import { PEDIR_CONSENTIMENTO } from "@/lib/consentimento";
import FormPlanejamento from "./FormPlanejamento";

export const metadata: Metadata = {
  title: "Planejamento de estudos gratuito para a sua criança",
  description: "Converse por vídeo com Stephanie Kamarry, criadora do Atlas do Aprender: diagnóstico de onde a criança está e um plano de estudos em casa, feito sob medida e 100% gratuito.",
  alternates: { canonical: "/planejamento" },
};

export default function Planejamento() {
  return (
    <div className="wrap">
      <p className="eyebrow-i">100% gratuito</p>
      <h1 className="hero-t">Um plano de estudos feito para a sua criança</h1>
      <p className="lead">Eu me ofereço para conversar com você por videochamada, entender onde a criança está e montar um planejamento possível para a rotina da sua família, usando as trilhas, os livros, os jogos e as apostilas do Atlas. Foi assim que organizei o estudo dos meus filhos, e quero fazer o mesmo por quem precisar.</p>
      <p className="meta">Quer adiantar? Faça antes o <Link href="/diagnostico">diagnóstico grátis</Link> (5 minutos): o resultado vem junto no formulário.</p>
      <p className="meta" style={{ marginTop: -6 }}>Stephanie Kamarry, criadora do Atlas do Aprender</p>

      <div className="passos-plan">
        <div><b>1</b><span>Você preenche o formulário abaixo, sobre a família, a criança e os horários livres.</span></div>
        <div><b>2</b><span>Eu entro em contato pelo WhatsApp ou e-mail para marcar a conversa.</span></div>
        <div><b>3</b><span>Numa videochamada, fazemos juntos o diagnóstico: o que a criança já sabe e o que precisa reforçar.</span></div>
        <div><b>4</b><span>Você recebe o planejamento em PDF: a semana organizada, os temas de cada matéria e o que usar em cada um.</span></div>
      </div>

      <div className="feedback">
        <p className="feedback-t">O que vem no planejamento</p>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>Os temas das trilhas de Português, Matemática e Ciências mais indicados para o momento da criança, mesmo que sejam de outro ano.</li>
          <li>Uma semana possível, com blocos curtos, que caiba na rotina de vocês.</li>
          <li>Livros, filmes, jogos e atividades mão na massa para cada tema.</li>
          <li>Um quadro para marcar o que foi feito e acompanhar o progresso.</li>
        </ul>
        <p className="note">Não há custo e nenhum compromisso de compra. As vagas dependem da minha agenda; respondo por ordem de chegada.</p>
      </div>

      <h2 className="sec-t" id="formulario">Formulário</h2>
      <FormPlanejamento />
      <p className="note">Seus dados são usados apenas para entrar em contato e preparar o planejamento, e não são compartilhados com ninguém.{PEDIR_CONSENTIMENTO && <> Veja a <Link href="/privacidade">política de privacidade</Link>.</>}</p>
    </div>
  );
}
