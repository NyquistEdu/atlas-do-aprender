import type { Metadata } from "next";
import { INDIVIDUAIS, MATERIAIS, PELA_ESCOLA } from "@/lib/olimpiadas";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Olimpíadas para crianças",
  description: "Olimpíadas em que a criança pode se inscrever sem depender da escola, como a Olimpíada de Literatura, e materiais gratuitos do Atlas para se preparar.",
};

export default function Olimpiadas() {
  return (
    <div className="wrap">
      <p className="eyebrow-i">Para ir além</p>
      <h2 className="hero-t">Olimpíadas para crianças</h2>
      <p className="lead">Olimpíadas dão um objetivo para estudar, ensinam a lidar com prova e tempo e celebram o esforço. Aqui estão as que aceitam crianças dos anos iniciais e em que a família pode fazer a inscrição sozinha, além dos materiais que preparamos para elas.</p>

      <h3 className="sec-t">Inscrição individual, sem depender da escola</h3>
      <div className="list">
        {INDIVIDUAIS.map((o) => (
          <article className="card olimp" key={o.nome} style={{ ["--sc" as string]: `var(--${o.area})` }}>
            <h3>{o.nome}</h3>
            <dl>
              <dt>Quem pode</dt><dd>{o.quem}</dd>
              <dt>Inscrição</dt><dd>{o.inscricao}</dd>
              <dt>Valor</dt><dd>{o.custo}</dd>
              <dt>Datas</dt><dd>{o.quando}</dd>
              <dt>Como é</dt><dd>{o.como}</dd>
            </dl>
            <div className="row"><a className="btn small" href={o.site} target="_blank" rel="noopener noreferrer">Site oficial</a></div>
          </article>
        ))}
      </div>

      <h3 className="sec-t">Materiais do Atlas para a Olimpíada de Literatura</h3>
      <p className="meta">Apostilas gratuitas para preparar as competições da edição 2026. Material independente, sem ligação com a organização da olimpíada.</p>
      <div className="vitrine">
        {MATERIAIS.map((m) => (
          <article className="produto" key={m.slug} style={{ ["--sc" as string]: "var(--por)" }}>
            <a href={m.arquivo} download={m.nomeArquivo} className="produto-capa" aria-label={`Baixar ${m.titulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/olimpiadas/${m.slug}.webp`} alt={`Capa da apostila ${m.titulo}`} width={566} height={800} loading="lazy" />
            </a>
            <div className="produto-info">
              <div className="tags"><span className="tag cie">Gratuito</span><span className="tag por">{m.competicao.split(" · ")[1]}</span></div>
              <h3>{m.titulo}</h3>
              <p className="meta">{m.autor} · {m.paginas} páginas</p>
              <p style={{ margin: 0 }}>{m.resumo}</p>
              <ul className="dentro">{m.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
              <div className="row"><a className="btn small" href={m.arquivo} download={m.nomeArquivo}>Baixar grátis</a></div>
            </div>
          </article>
        ))}
      </div>

      <h3 className="sec-t">Pela escola: vale perguntar</h3>
      <p className="meta">Estas também aceitam os anos iniciais, mas a inscrição é feita pela escola. Se a criança estuda numa escola, pergunte se ela participa.</p>
      <div className="card">
        <ul className="escola">
          {PELA_ESCOLA.map(([n, q, d]) => <li key={n}><b>{n}</b> <span className="meta">· {q}</span><br />{d}</li>)}
        </ul>
      </div>

      <div className="feedback">
        <p className="feedback-t">Dicas para a preparação</p>
        <p>Comece cedo e em doses pequenas: 15 minutos por dia rendem mais que uma maratona na véspera. Leia o livro mais de uma vez, faça simulados com relógio e, no dia, escolha um horário calmo. Nas provas em que se pode consultar o texto, ensine a criança a voltar ao livro antes de responder.</p>
        <p className="note">Datas e valores são da edição 2026 e mudam a cada ano: confira sempre no site oficial. Conhece outra olimpíada aberta a crianças? <a href={`mailto:${CONTATO.email}`}>Escreva para a gente</a>.</p>
      </div>
    </div>
  );
}
