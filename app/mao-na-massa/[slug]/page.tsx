import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ATIVIDADES, ESTACOES, NIVEIS, atividade, caminhoFoto, numero, relacionadas } from "@/lib/maoNaMassa";
import { temFoto } from "@/lib/fotosMaoNaMassa";
import { MATERIAS } from "@/lib/data";
import { url, jsonLd } from "@/lib/seo";
import Caixote from "@/components/Caixote";
import Acoes from "./Acoes";

type P = { params: { slug: string } };

export function generateStaticParams() {
  return ATIVIDADES.map((x) => ({ slug: x.slug }));
}

export function generateMetadata({ params }: P): Metadata {
  const x = atividade(params.slug);
  if (!x) return {};
  const foto = temFoto(x.slug);
  return {
    title: `${x.n} · atividade mão na massa para crianças`,
    description: `${x.sub} ${x.idade}, ${x.tm}. Materiais de casa, passo a passo, explicação e desafio.`,
    alternates: { canonical: `/mao-na-massa/${x.slug}` },
    ...(foto ? { openGraph: { images: [caminhoFoto(x.slug)] } } : {}),
  };
}

export default function Page({ params }: P) {
  const x = atividade(params.slug);
  if (!x) notFound();
  const foto = temFoto(x.slug);
  const i = ATIVIDADES.indexOf(x);
  const ant = ATIVIDADES[i - 1];
  const prox = ATIVIDADES[i + 1];
  const est = ESTACOES[x.est];
  const adulto = new Set(x.ad);

  return (
    <div className="wrap mm-ficha" data-e={x.est}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "HowTo", name: x.n, description: x.sub, inLanguage: "pt-BR",
        url: url(`/mao-na-massa/${x.slug}`), ...(foto ? { image: url(caminhoFoto(x.slug)) } : {}),
        supply: x.mat.map((m) => ({ "@type": "HowToSupply", name: m })),
        step: x.st.map((s, k) => ({ "@type": "HowToStep", position: k + 1, text: s })),
        author: { "@type": "Person", name: "Stephanie Kamarry" },
      })} />
      <p className="meta no-print"><Link href="/mao-na-massa">Mão na massa</Link> › {est.nome}</p>

      <header className="mm-cab">
        <div className="mm-num" aria-hidden="true"><small>Nº</small>{numero(x)}</div>
        <div>
          <p className="mm-sobre">{est.nome}{x.est === "inv" ? ` · ${MATERIAS[x.a]}` : ""}{x.naocoma ? <span className="mm-naocoma">Não coma</span> : null}</p>
          <h1>{x.n}</h1>
          <p className="mm-sub">{x.sub}</p>
        </div>
      </header>

      <div className="mm-alto">
        <div className={foto ? "mm-foto" : "mm-foto vazia"}>
          {foto
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={caminhoFoto(x.slug)} alt={`${x.n} pronto`} width={800} height={600} />
            : <><Caixote size={88} acenando={false} /><span>Foto em breve</span></>}
        </div>
        <dl className="mm-info">
          <div><dt>Idade</dt><dd>{x.idade}</dd></div>
          <div><dt>Tempo</dt><dd>{x.tm}</dd></div>
          <div><dt>Nível</dt><dd>{NIVEIS[x.nivel]}</dd></div>
          <div><dt>Sujeira</dt><dd>{x.sujeira}</dd></div>
          <div className="mm-i-ad"><dt>Adulto</dt><dd>{x.adulto}</dd></div>
          <div className="mm-i-ideia"><dt>Grande ideia</dt><dd>{x.ideia}</dd></div>
        </dl>
      </div>

      <Acoes area={x.a} titulo={x.n} />

      <div className="mm-corpo">
        <div className="mm-col">
          <section className="mm-box">
            <h2>Materiais</h2>
            <ul className="mm-mat">{x.mat.map((m) => <li key={m}>{m}</li>)}</ul>
            {x.comprar && <p className="meta">{x.comprar}</p>}
          </section>
          <aside className="mm-dica">
            <Caixote size={60} />
            <p><b>Dica do Caixote:</b> {x.dica}</p>
          </aside>
        </div>
        <div className="mm-col">
          <section className="mm-palpite">
            <h2>Palpite</h2>
            <p>{x.palpite}</p>
            <p className="mm-linha" aria-hidden="true">Meu palpite: </p>
          </section>
          <section className="mm-box">
            <h2>Passo a passo</h2>
            <ol className="mm-passos">
              {x.st.map((s, k) => (
                <li key={k} className={adulto.has(k + 1) ? "ad" : undefined}>
                  <span className="mm-pn" aria-hidden="true">{k + 1}</span>
                  <span>{adulto.has(k + 1) && <b className="mm-so-ad">Adulto</b>} {s}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <section className="mm-como">
        <h2>Como funciona</h2>
        <p>{x.como}</p>
      </section>

      <div className="mm-fim">
        <section className="mm-turbine">
          <h2>Turbine!</h2>
          <p>{x.turbine}</p>
        </section>
        <section className="mm-seg">
          <h2>Segurança</h2>
          <p>{x.seg}</p>
        </section>
      </div>

      <p className="mm-rodape">Atlas do Aprender · Mão na massa · © {new Date().getFullYear()} Stephanie Kamarry · Uso pessoal e familiar · atlasdoaprender.com.br</p>

      <section className="no-print mm-mais">
        <h2>Mais da {est.nome}</h2>
        <div className="mm-mais-l">
          {relacionadas(x).map((o) => (
            <Link key={o.slug} href={`/mao-na-massa/${o.slug}`} className="mm-mini" data-e={o.est}>
              <b>{o.n}</b><span className="meta">{o.idade} · {o.tm}</span>
            </Link>
          ))}
        </div>
        <nav className="row mm-nav" aria-label="Outras atividades">
          {ant && <Link className="btn small ghost" href={`/mao-na-massa/${ant.slug}`}>← {ant.n}</Link>}
          <Link className="btn small ghost" href="/mao-na-massa">Todas as atividades</Link>
          {prox && <Link className="btn small ghost" href={`/mao-na-massa/${prox.slug}`}>{prox.n} →</Link>}
        </nav>
      </section>
    </div>
  );
}
