import type { Metadata } from "next";
import Vitrine from "./Vitrine";
import PedirApostila from "./PedirApostila";

export const metadata: Metadata = {
  title: "Apostilas para imprimir: Português, Matemática e Ciências",
  alternates: { canonical: "/apostilas" },
  description: "Apostilas em PDF para imprimir em casa, com explicação para a família, exercícios, revisões diárias, jogos e gabarito. Criadas por Stephanie Kamarry.",
};

export default function Apostilas() {
  return (
    <div className="wrap">
      <p className="eyebrow-i">Para imprimir em casa</p>
      <h1 className="hero-t">Apostilas do Atlas</h1>
      <p className="lead">Cada apostila aprofunda um tema das trilhas: explicação para a família, exercícios de entendimento, cinco revisões diárias em que a ajuda vai diminuindo, jogos para recortar, atividades mão na massa e gabarito.</p>
      <Vitrine />
      <PedirApostila />
      <div className="feedback">
        <p className="feedback-t">Como funciona</p>
        <p>O pagamento é feito por Pix, cartão ou boleto numa plataforma segura. Assim que o pagamento é confirmado, o PDF chega no seu e-mail. Você imprime quantas cópias precisar para as crianças da sua casa.</p>
        <p className="note">A licença é para uso pessoal e familiar. Não é permitido revender, compartilhar o arquivo ou distribuir sem autorização. Escolas e professores que quiserem usar com turmas podem escrever para combinar uma licença.</p>
      </div>
    </div>
  );
}
