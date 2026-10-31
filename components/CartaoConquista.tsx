import Link from "next/link";
import type { ConquistaPub } from "@/lib/comunidade";
import type { FaseInfo } from "@/lib/fasesInfo";

/** Cartão de conquista só para leitura (página Comunidade e página inicial). */
export default function CartaoConquista({ c, fase }: { c: ConquistaPub; fase?: FaseInfo }) {
  return (
    <article className={`conq ${c.foto ? "" : "sem-foto"}`} style={fase ? { ["--sc" as string]: `var(--${fase.cor})` } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {c.foto && <img src={c.foto} alt={`Foto da conquista: ${c.texto}`} loading="lazy" />}
      <div className="conq-txt">
        {!c.foto && <span className="conq-em" aria-hidden="true">{fase?.emoji || "🏆"}</span>}
        <p>{c.texto}</p>
        <span className="conq-autor">{c.autor}</span>
        {fase && <Link className="conq-fase" href={fase.href}>{fase.emoji} {fase.nome}</Link>}
        <Link className="palma" href="/mural" aria-label="Ver no mural e aplaudir">👏 <b>{c.palmas || ""}</b></Link>
      </div>
    </article>
  );
}
