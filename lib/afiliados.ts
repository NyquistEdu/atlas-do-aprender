/**
 * Links de afiliado da Amazon.
 * TAG: a etiqueta do Programa de Associados (termina em -20). Vazia = sem botões da Amazon.
 * Os links são de BUSCA (título + autor), para não quebrarem quando um produto sai do ar
 * e para a família escolher a edição.
 */
export const AMAZON_TAG = "stephanikamar-20";

export const AVISO_AFILIADO = "Como associada da Amazon, eu ganho com compras qualificadas.";

/** Transforma “Título” — Autor (nota) em "Título Autor" para a busca. Revistas não ganham link. */
export function buscaLivro(livro: string): string | null {
  if (/^Revista /i.test(livro)) return null;
  const titulo = (livro.match(/“([^”]+)”/) || [])[1];
  if (!titulo) return null;
  const depois = livro.split("” ").slice(1).join("” ");
  const autor = (depois.match(/—\s*([^(]+)/) || [])[1] || "";
  return `${titulo} ${autor}`.replace(/\s+/g, " ").trim();
}

export function linkAmazon(termo: string | null, categoria: "livro" | "jogo" = "livro"): string | null {
  if (!AMAZON_TAG || !termo) return null;
  const q = categoria === "jogo" ? `${termo} jogo` : `${termo} livro`;
  return `https://www.amazon.com.br/s?k=${encodeURIComponent(q)}&tag=${encodeURIComponent(AMAZON_TAG)}`;
}
