import raw from "@/data/conteudo.json";

export type Livro = [string, string];
export type Tema = {
  t: string; o: string;
  m?: string[]; e?: string[]; f?: string[]; a?: string[]; j?: string[]; p?: string[];
  l?: Livro[];
};
export type Jogo = { n: string; s: string; i: string; k: string[]; w: string; y: string; h: string };
export type Experimento = { n: string; a: "por" | "mat" | "cie"; y: string; tm: string; mat: string[]; st: string[]; l: string; c: string };
export type Materia = "por" | "mat" | "cie";

const d = raw as unknown as {
  YEARS: [string, string][];
  SUBJ: Record<Materia, string>;
  T: Record<Materia, Record<string, Tema[]>>;
  SK: Record<string, string>;
  STAGES: [string, string, string][];
  G: Jogo[];
  X: Experimento[];
  SHELF: [string, Livro[]][];
};

export const ANOS = d.YEARS;
export const MATERIAS = d.SUBJ;
export const TRILHAS = d.T;
export const HABILIDADES = d.SK;
export const ESTAGIOS = d.STAGES;
export const JOGOS = d.G;
export const EXPERIMENTOS = d.X;
export const ESTANTE = d.SHELF;

export const SLUG: Record<Materia, string> = { por: "portugues", mat: "matematica", cie: "ciencias" };
export const DE_SLUG: Record<string, Materia> = { portugues: "por", matematica: "mat", ciencias: "cie" };
export const anoSlug = (y: string) => `${y}-ano`;
export const anoDeSlug = (s: string) => s.replace("-ano", "");
export const anoCurto = (l: string) => l.replace("Alfabetização · ", "");

export const AREAS: Record<string, string> = { por: "Português", mat: "Matemática", cie: "Ciências", jog: "Jogo", out: "Outro" };
export const CATEGORIAS: [keyof Tema, string][] = [
  ["m", "Material e livros"], ["e", "Exercícios"], ["f", "Filmes e documentários"],
  ["a", "Podcasts e áudio"], ["j", "Jogos"], ["p", "Mão na massa"],
];
export const temaId = (s: Materia, y: string, i: number) => `${s}${y}-${i}`;
export const GUIA_DRIVE = "https://drive.google.com/file/d/15DIrG9l0uy-eGWf11ykfJkzVm1TyIk80/view?usp=sharing";
