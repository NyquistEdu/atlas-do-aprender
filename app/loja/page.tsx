import type { Metadata } from "next";
import Link from "next/link";
import { LOJA } from "@/lib/loja";
import { MATERIAS, SLUG, anoSlug, TRILHAS } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import BotaoLoja from "@/components/BotaoLoja";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Jogos educativos para comprar: frações, contas e corpo humano",
  description: "Jogos educativos criados pelo Atlas do Aprender para usar junto com as trilhas: frações, dominó matemático, spinner de contas e esqueleto 3D. Compra segura pelo Mercado Livre.",
  alternates: { canonical: "/loja" },
};

export default function Loja() {
  return (
    <div className="wrap largo">
      <p className="eyebrow-i">Para pegar com a mão</p>
      <h1 className="hero-t">Jogos do Atlas</h1>
      <p className="lead">Jogos que criamos para usar junto com as trilhas do Atlas: frações que se encaixam, contas que viram partida e um esqueleto para montar. Cada um diz o que trabalha, em que tema entra e como aproveitar.</p>
      <p className="meta">A compra é feita no Mercado Livre, com pagamento protegido, frete e troca pela própria plataforma.</p>

      <div className="vitrine loja">
        {LOJA.map((p) => (
          <article className="produto" id={p.slug} key={p.slug} style={{ ["--sc" as string]: `var(--${p.area})` }}>
            <div className="produto-capa">
              {p.fotos ? (
                <div className="loja-fotos" tabIndex={p.fotos > 1 ? 0 : undefined} aria-label={p.fotos > 1 ? `${p.fotos} fotos, role para o lado` : undefined}>
                  {Array.from({ length: p.fotos }, (_, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={`/loja/${p.slug}${i ? `-${i + 1}` : ""}.webp`} alt={i ? `${p.nome}, foto ${i + 1}` : p.nome} width={800} height={800} loading="lazy" />
                  ))}
                </div>
              ) : (
                <div className="loja-capa" aria-hidden="true">{p.emoji}</div>
              )}
            </div>
            {(p.fotos || 0) > 1 && <p className="meta loja-dica">Arraste a foto para o lado: são {p.fotos} fotos →</p>}
            <div className="produto-info">
              <span className="meta">{MATERIAS[p.area]} · {p.idade}</span>
              <h3>{p.nome}</h3>
              <p style={{ margin: 0 }}>{p.resumo}</p>
              <ul className="dentro">{p.trabalha.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="meta" style={{ margin: 0 }}><b>Como aproveitar:</b> {p.comoUsar}</p>
              <p className="meta" style={{ margin: 0 }}>
                <b>Entra nos temas:</b>{" "}
                {p.temas.map(([m, a, t], i) => (
                  <span key={`${m}${a}${t}`}>
                    {i > 0 && " · "}
                    <Link href={`/trilhas/${SLUG[m]}/${anoSlug(a)}#tema-${t}`}>{TRILHAS[m][a]?.[t - 1]?.t} ({anoNome(a)})</Link>
                  </span>
                ))}
              </p>
              <div className="row">
                {p.mercadoLivre && <BotaoLoja slug={p.slug} loja="mercadolivre" href={p.mercadoLivre} rotulo="Ver no Mercado Livre" />}
                {p.shopee && <BotaoLoja slug={p.slug} loja="shopee" href={p.shopee} rotulo="Ver na Shopee" ghost />}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="feedback">
        <p className="feedback-t">Jogo não substitui conversa</p>
        <p>O jogo funciona melhor com um adulto por perto nas primeiras partidas: perguntando, deixando a criança explicar como pensou e voltando ao assunto da trilha. Depois, ela joga sozinha ou com os irmãos.</p>
        <p className="note">Tem um jogo que faria falta na sua casa? <a href={`mailto:${CONTATO.email}`}>Escreva para a gente</a>.</p>
      </div>
    </div>
  );
}
