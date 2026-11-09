import type { Materia } from "@/lib/data";

/**
 * Chefões de fase: avaliação gratuita em forma de batalha (5 golpes, 5 corações) para saber se a criança pode passar de fase.
 * PDF em public/chefoes/<slug>.pdf.
 */
export type Chefao = { slug: string; materia: Materia; ano: string; tema: number; chefe: string; emoji: string; nomeArquivo: string };

export const CHEFOES: Chefao[] = [
  { slug: "chefao-portugues-alfabetizacao-fase-1", materia: "por", ano: "1", tema: 1, chefe: "Dragão Trava-Língua", emoji: "🐉", nomeArquivo: "Chefao-Fase-1-Portugues-Atlas-do-Aprender.pdf" },
  { slug: "chefao-portugues-3-ano-fase-5", materia: "por", ano: "3", tema: 5, chefe: "Fantasma Sem-Nome", emoji: "👻", nomeArquivo: "Chefao-Fase-5-Portugues-3ano-Atlas-do-Aprender.pdf" },
  { slug: "chefao-matematica-alfabetizacao-fase-1", materia: "mat", ano: "1", tema: 1, chefe: "Monstro Come-Números", emoji: "👾", nomeArquivo: "Chefao-Fase-1-Matematica-Atlas-do-Aprender.pdf" },
  { slug: "chefao-ciencias-3-ano-fase-4", materia: "cie", ano: "3", tema: 4, chefe: "Nuvem Tapa-Céu", emoji: "⛈️", nomeArquivo: "Chefao-Fase-4-Ciencias-3ano-Atlas-do-Aprender.pdf" },
  { slug: "chefao-matematica-3-ano-fase-3", materia: "mat", ano: "3", tema: 3, chefe: "Gigante Desmedido", emoji: "🧌", nomeArquivo: "Chefao-Fase-3-Matematica-3ano-Atlas-do-Aprender.pdf" },
];

export const chefaoDoTema = (m: Materia, ano: string, tema: number) => CHEFOES.find((c) => c.materia === m && c.ano === ano && c.tema === tema);
export const arquivoChefao = (c: Chefao) => `/chefoes/${c.slug}.pdf`;
