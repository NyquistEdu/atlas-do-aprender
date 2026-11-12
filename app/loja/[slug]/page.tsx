import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOJA, produtoPorSlug } from "@/lib/loja";
import { MATERIAS, SLUG, anoSlug, TRILHAS } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import BotaoLoja from "@/components/BotaoLoja";
import { url, jsonLd } from "@/lib/seo";

type P = { params: { slug: string } };

export function generateStaticParams() {
  return LOJA.map((p) => ({ slug: p.slug }));
}

const foto = (slug: string, i: number) => `/loja/${slug}${i ? `-${i + 1}` : ""}.webp`;

export function generateMetadata({ params }: P): Metadata {
  const p = produtoPorSlug(params.slug);
  if (!p) return {};
  return {
    title: p.seo.titulo,
    description: p.seo.descricao,
    alternates: { canonical: `/loja/${p.slug}` },
    openGraph: { type: "website", title: p.seo.titulo, description: p.seo.descricao, ...(p.fotos ? { images: [{ url: foto(p.slug, 0), width: 800, height: 800, alt: p.nome }] } : {}) },
  };
}

export default function ProdutoPagina({ params }: P) {
  const p = produtoPorSlug(params.slug);
  if (!p) notFound();

  const idadeMin = Number(p.idade.match(/\d+/)?.[0]) || undefined;
  const imagens = p.fotos ? Array.from({ length: p.fotos }, (_, i) => url(foto(p.slug, i))) : [];
  const plataformas = [p.mercadoLivre && "Mercado Livre", p.shopee && "Shopee"].filter(Boolean).join(" e na ");
  const outros = LOJA.filter((x) => x.slug !== p.slug).sort((a, b) => Number(b.area === p.area) - Number(a.area === p.area)).slice(0, 3);

  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.nome,
        description: p.resumo,
        ...(imagens.length ? { image: imagens } : {}),
        brand: { "@type": "Brand", name: "Atlas do Aprender" },
        category: "Jogos educativos",
        audience: { "@type": "PeopleAudience", ...(idadeMin ? { suggestedMinAge: idadeMin } : {}) },
        ...(p.preco ? { offers: { "@type": "Offer", price: p.preco.replace(/[^0-9,]/g, "").replace(",", "."), priceCurrency: "BRL", availability: "https://schema.org/InStock", url: url(`/loja/${p.slug}`) } } : {}),
      })} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Loja", item: url("/loja") },
          { "@type": "ListItem", position: 2, name: p.nome, item: url(`/loja/${p.slug}`) },
        ],
      })} />

      <p className="meta"><Link href="/loja">Loja</Link> › {p.nome}</p>

      <div className="produto-topo" style={{ ["--sc" as string]: `var(--${p.area})` }}>
        <div className="produto-capa">
          {p.fotos ? (
            <div className="loja-fotos" tabIndex={p.fotos > 1 ? 0 : undefined} aria-label={p.fotos > 1 ? `${p.fotos} fotos, role para o lado` : undefined}>
              {Array.from({ length: p.fotos }, (_, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={foto(p.slug, i)} alt={i ? `${p.nome}, foto ${i + 1}` : p.nome} width={800} height={800} loading={i ? "lazy" : "eager"} />
              ))}
            </div>
          ) : (
            <div className="loja-capa" aria-hidden="true">{p.emoji}</div>
          )}
          {(p.fotos || 0) > 1 && <p className="meta loja-dica">Arraste a foto para o lado: são {p.fotos} fotos →</p>}
        </div>
        <div className="produto-txt">
          <div className="tags"><span className="tag">{MATERIAS[p.area]}</span><span className="tag">{p.idade}</span></div>
          <h1 className="hero-t">{p.nome}</h1>
          <p className="lead">{p.resumo}</p>
          <div className="row">
            {p.mercadoLivre && <BotaoLoja slug={p.slug} loja="mercadolivre" href={p.mercadoLivre} rotulo="Ver no Mercado Livre" />}
            {p.shopee && <BotaoLoja slug={p.slug} loja="shopee" href={p.shopee} rotulo="Ver na Shopee" ghost={!!p.mercadoLivre} />}
          </div>
          <p className="note">A compra é feita no {plataformas}, com pagamento, frete e troca pela própria plataforma.</p>
        </div>
      </div>

      <section className="card">
        <h3>O que o jogo trabalha</h3>
        <ul className="dentro">{p.trabalha.map((t) => <li key={t}>{t}</li>)}</ul>
        <h3>Como aproveitar</h3>
        <p style={{ marginTop: 0 }}>{p.comoUsar}</p>
        {p.bncc && p.bncc.length > 0 && (
          <>
            <h3>Habilidades da BNCC</h3>
            <ul className="dentro">{p.bncc.map((b) => <li key={b.codigo}><b>{b.codigo}</b>: {b.texto}</li>)}</ul>
          </>
        )}
        <h3>Entra nos temas das trilhas</h3>
        <ul className="dentro">
          {p.temas.map(([m, a, t]) => (
            <li key={`${m}${a}${t}`}>
              <Link href={`/trilhas/${SLUG[m]}/${anoSlug(a)}#tema-${t}`}>{TRILHAS[m][a]?.[t - 1]?.t} ({MATERIAS[m]}, {anoNome(a)})</Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="feedback">
        <p className="feedback-t">Jogo não substitui conversa</p>
        <p>O jogo funciona melhor com um adulto por perto nas primeiras partidas: perguntando, deixando a criança explicar como pensou e voltando ao assunto da trilha. Depois, ela joga sozinha ou com os irmãos.</p>
      </div>

      <h3 className="ini-h">Outros jogos do Atlas</h3>
      <ul className="dentro">
        {outros.map((o) => <li key={o.slug}><Link href={`/loja/${o.slug}`}>{o.emoji} {o.nome}</Link> · {o.idade}</li>)}
      </ul>
      <div className="row">
        <Link className="btn ghost" href="/loja">Ver todos os jogos</Link>
      </div>
    </div>
  );
}
