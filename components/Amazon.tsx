import { buscaLivro, linkAmazon } from "@/lib/afiliados";

const JOGO_CASEIRO = /caseir|caixa tátil|bingo|stop|forca|batata|mímica|caça|quiz|rimas em roda|memória de|^—$/i;

export function AmazonLivro({ livro, pequeno = true }: { livro: string; pequeno?: boolean }) {
  const href = linkAmazon(buscaLivro(livro), "livro");
  if (!href) return null;
  return (
    <a className={`btn ${pequeno ? "small " : ""}ghost amz`} href={href} target="_blank" rel="sponsored noopener noreferrer">
      Ver na Amazon
    </a>
  );
}

export function AmazonJogo({ nome }: { nome: string }) {
  if (JOGO_CASEIRO.test(nome)) return null;
  const termo = nome.replace(/\s*\(.*?\)\s*/g, " ").replace(/ e jogos de geografia/i, "").split(" / ")[0].trim();
  const href = linkAmazon(termo, "jogo");
  if (!href) return null;
  return (
    <a className="btn small ghost amz" href={href} target="_blank" rel="sponsored noopener noreferrer">
      Ver na Amazon
    </a>
  );
}
