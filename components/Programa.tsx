import Link from "next/link";
import { PROGRAMA } from "@/lib/programa";
import { HABILIDADES_DIAG } from "@/lib/diagnostico";
import { MATERIAS, SLUG, anoSlug, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";

type Props = { slug: string; materia?: Materia; ano?: string; tema?: number; nomeTema?: string };

/** Seção "Conteúdo programático": disciplina, ano, tema, objetivo e o que é trabalhado em cada parte. */
export default function Programa({ slug, materia, ano, tema, nomeTema }: Props) {
  const p = PROGRAMA[slug];
  if (!p) return null;
  const hab = materia && ano && tema ? HABILIDADES_DIAG[materia]?.find((h) => h.ano === ano && h.tema === tema) : undefined;
  return (
    <section className="card programa" style={{ ["--sc" as string]: materia ? `var(--${materia})` : "var(--jog)" }}>
      <h3>Conteúdo programático</h3>
      {materia && ano && tema ? (
        <dl className="prog-ficha">
          <div><dt>Disciplina</dt><dd>{MATERIAS[materia]}</dd></div>
          <div><dt>Ano</dt><dd>{anoNome(ano)}</dd></div>
          <div><dt>Tema da trilha</dt><dd><Link href={`/trilhas/${SLUG[materia]}/${anoSlug(ano)}#tema-${tema}`}>{nomeTema ?? `Tema ${tema}`}</Link></dd></div>
        </dl>
      ) : null}
      {hab && <p className="prog-obj"><b>Ao final, a criança consegue:</b> {hab.frase.charAt(0).toLowerCase() + hab.frase.slice(1)}</p>}
      <div className="prog-blocos">
        {p.blocos.map((b) => (
          <div key={b.titulo} className="prog-bloco">
            <h4>{b.titulo}</h4>
            <ul>{b.itens.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
      {p.nota && <p className="meta" style={{ marginBottom: 0 }}>{p.nota}</p>}
    </section>
  );
}
