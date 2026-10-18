import Link from "next/link";
import type { Metadata } from "next";
import { APOSTILAS, anoNome } from "@/lib/apostilas";
import { MATERIAS } from "@/lib/data";
import Comprar from "@/components/Comprar";

export const metadata: Metadata = {
  title: "Apostilas para imprimir",
  description: "Apostilas em PDF para imprimir em casa, com explicação para a família, exercícios, revisões diárias, jogos e gabarito. Criadas por Stephanie Kamarry.",
};

export default function Apostilas() {
  return (
    <div className="wrap">
      <p className="eyebrow-i">Para imprimir em casa</p>
      <h2 className="hero-t">Apostilas do Atlas</h2>
      <p className="lead">Cada apostila aprofunda um tema das trilhas: explicação para a família, exercícios de entendimento, cinco revisões diárias em que a ajuda vai diminuindo, jogos para recortar, atividades mão na massa e gabarito.</p>
      <div className="vitrine">
        {APOSTILAS.map((a) => (
          <article className="produto" key={a.slug} style={{ ["--sc" as string]: `var(--${a.materia})` }}>
            <Link href={`/apostilas/${a.slug}`} className="produto-capa" aria-label={`Ver detalhes de ${a.titulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/apostilas/${a.slug}/capa.webp`} alt={`Capa da apostila ${a.titulo}`} width={566} height={800} loading="lazy" />
            </Link>
            <div className="produto-info">
              <div className="tags"><span className={`tag ${a.materia}`}>{MATERIAS[a.materia]}</span><span className="tag">{anoNome(a.ano)}</span></div>
              <h3><Link href={`/apostilas/${a.slug}`}>{a.titulo}</Link></h3>
              <p className="meta">{a.subtitulo} · {a.paginas} páginas</p>
              <div className="row">
                <Comprar slug={a.slug} titulo={a.titulo} checkout={a.checkout} preco={a.preco} />
                <Link className="btn small ghost" href={`/apostilas/${a.slug}`}>Ver páginas</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="feedback">
        <p className="feedback-t">Como funciona</p>
        <p>O pagamento é feito por Pix, cartão ou boleto numa plataforma segura. Assim que o pagamento é confirmado, o PDF chega no seu e-mail. Você imprime quantas cópias precisar para as crianças da sua casa.</p>
        <p className="note">A licença é para uso pessoal e familiar. Não é permitido revender, compartilhar o arquivo ou distribuir sem autorização. Escolas e professores que quiserem usar com turmas podem escrever para combinar uma licença.</p>
      </div>
    </div>
  );
}
