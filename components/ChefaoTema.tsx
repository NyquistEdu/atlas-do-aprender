import { arquivoChefao, type Chefao } from "@/lib/chefoes";
import BaixarComLogin from "@/components/BaixarComLogin";

/** Botão para baixar o chefão da fase (avaliação gratuita para passar de fase). */
export default function ChefaoTema({ c, largo = false }: { c: Chefao; largo?: boolean }) {
  return (
    <BaixarComLogin className={`chefao-tema${largo ? " largo" : ""}`} href={arquivoChefao(c)} nome={c.nomeArquivo} titulo={`Chefão da fase: ${c.chefe}`}>
      <i aria-hidden="true">{c.emoji}</i>
      <div>
        <b>Enfrentar o chefão da fase: {c.chefe}</b>
        <span>Avaliação grátis em forma de batalha: aquecimento, fúria do chefão e golpe final. Venceu? Pode passar de fase.</span>
      </div>
      <em>Baixar grátis</em>
    </BaixarComLogin>
  );
}
