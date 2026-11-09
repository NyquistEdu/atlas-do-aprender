import { arquivoChefao, type Chefao } from "@/lib/chefoes";

/** Botão para baixar o chefão da fase (avaliação gratuita para passar de fase). */
export default function ChefaoTema({ c, largo = false }: { c: Chefao; largo?: boolean }) {
  return (
    <a className={`chefao-tema${largo ? " largo" : ""}`} href={arquivoChefao(c)} download={c.nomeArquivo}>
      <i aria-hidden="true">{c.emoji}</i>
      <div>
        <b>Enfrentar o chefão da fase: {c.chefe}</b>
        <span>Avaliação grátis em forma de batalha: 5 golpes, 5 corações. Venceu? Pode passar de fase.</span>
      </div>
      <em>Baixar grátis</em>
    </a>
  );
}
