import Link from "next/link";
import { url, jsonLd } from "@/lib/seo";
import { seoDe } from "@/lib/vivasSeo";

/** Bloco fixo (renderizado no servidor) embaixo de cada Fase Viva: o que a criança aprende, BNCC e perguntas frequentes. */
export default function SobreFase({ slug }: { slug: string }) {
  const s = seoDe(slug);
  const pagina = url(`/vivas/${slug}`);
  return (
    <section className="viva-sobre" aria-labelledby="sobre-fase">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "LearningResource", "@id": `${pagina}#recurso`, name: `${s.nome} · Fase Viva`, headline: s.titulo, description: s.descricao, url: pagina,
            image: url(`/apostilas/${s.apostila}/capa.webp`), inLanguage: "pt-BR", isAccessibleForFree: true,
            learningResourceType: ["jogo educativo", "atividade interativa"], interactivityType: "active", educationalLevel: `Ensino Fundamental · ${s.ano}`,
            about: s.materia, teaches: s.aprende, typicalAgeRange: `${s.idade[0]}-${s.idade[1]}`,
            audience: { "@type": "EducationalAudience", educationalRole: ["student", "parent", "teacher"] },
            educationalAlignment: s.bncc.map(([codigo, texto]) => ({ "@type": "AlignmentObject", alignmentType: "teaches", educationalFramework: "BNCC", targetName: codigo, targetDescription: texto })),
            author: { "@type": "Person", name: "Stephanie Kamarry" }, publisher: { "@type": "Organization", name: "Atlas do Aprender", url: url("/") },
          },
          { "@type": "FAQPage", mainEntity: s.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Atlas do Aprender", item: url("/") },
            { "@type": "ListItem", position: 2, name: "Fases Vivas", item: url("/vivas") },
            { "@type": "ListItem", position: 3, name: s.nome, item: pagina },
          ] },
        ],
      })} />
      <h2 id="sobre-fase">Sobre a Fase Viva {s.nome}</h2>
      <p className="viva-sobre-tags"><span>{s.materia}</span><span>{s.ano}</span><span>{s.idade[0]} a {s.idade[1]} anos</span><span>grátis, no navegador</span></p>
      <p>{s.intro}</p>
      <div className="viva-sobre-grid">
        <div>
          <h3>O que a criança aprende</h3>
          <ul>{s.aprende.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div>
          <h3>Habilidades da BNCC</h3>
          <ul className="viva-sobre-bncc">{s.bncc.map(([c, t]) => <li key={c}><b>{c}</b> {t}</li>)}</ul>
          <h3>Como usar</h3>
          <p>São 7 telas: capa, laboratório, treino em rodadas de 10, jogo de contexto, situações do dia a dia, desafio do chefão e resumo. Dá para jogar <b>sozinho</b>, ganhando XP e estrelas, ou <b>juntos</b>, Time Sol contra Time Lua, na mesa da cozinha ou na TV da sala de aula.</p>
        </div>
      </div>
      <h3>Perguntas frequentes</h3>
      <div className="viva-sobre-faq">
        {s.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
      <p className="viva-sobre-links">
        <Link href={`/apostilas/${s.apostila}`}>📘 Apostila do tema para imprimir</Link>
        <Link href={s.trilha}>🗺️ Ver o tema na trilha</Link>
        <Link href="/vivas">✨ Todas as Fases Vivas</Link>
      </p>
    </section>
  );
}
