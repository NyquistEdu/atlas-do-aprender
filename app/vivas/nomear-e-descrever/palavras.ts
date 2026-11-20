import type { Config, Nome } from "@/components/viva/Personagem3D";

export type Genero = "m" | "f";
export const NOMES: Record<Nome, { g: Genero; s: string; p: string; e: string }> = {
  monstro: { g: "m", s: "monstro", p: "monstros", e: "👾" },
  coruja: { g: "f", s: "coruja", p: "corujas", e: "🦉" },
  robo: { g: "m", s: "robô", p: "robôs", e: "🤖" },
};
// formas do adjetivo: [masc. sing., fem. sing., masc. pl., fem. pl.]
export const ADJ: Record<string, [string, string, string, string]> = {
  pequeno: ["pequeno", "pequena", "pequenos", "pequenas"], grande: ["grande", "grande", "grandes", "grandes"],
  azul: ["azul", "azul", "azuis", "azuis"], verde: ["verde", "verde", "verdes", "verdes"], roxo: ["roxo", "roxa", "roxos", "roxas"],
  amarelo: ["amarelo", "amarela", "amarelos", "amarelas"], vermelho: ["vermelho", "vermelha", "vermelhos", "vermelhas"],
  peludo: ["peludo", "peluda", "peludos", "peludas"], listrado: ["listrado", "listrada", "listrados", "listradas"],
  feliz: ["feliz", "feliz", "felizes", "felizes"], triste: ["triste", "triste", "tristes", "tristes"],
  bravo: ["bravo", "brava", "bravos", "bravas"], assustado: ["assustado", "assustada", "assustados", "assustadas"],
};
export const GRUPOS: { id: "tam" | "cor" | "jeito" | "humor"; nome: string; ops: string[] }[] = [
  { id: "tam", nome: "Tamanho", ops: ["pequeno", "grande"] },
  { id: "cor", nome: "Cor", ops: ["azul", "verde", "roxo", "amarelo", "vermelho"] },
  { id: "jeito", nome: "Jeito", ops: ["peludo", "listrado"] },
  { id: "humor", nome: "Humor", ops: ["feliz", "triste", "bravo", "assustado"] },
];
export const flex = (adj: string, g: Genero, plural: boolean) => ADJ[adj][(g === "f" ? 1 : 0) + (plural ? 2 : 0)];
export const ARTIGO = (g: Genero, q: number) => (q === 1 ? (g === "f" ? "uma" : "um") : q === 2 ? (g === "f" ? "duas" : "dois") : "três");

export type Parte = { txt: string; tipo: "art" | "subst" | "adj" | "liga" };
/** "duas corujas grandes, roxas e bravas" em pedaços, para colorir cada classe de palavra. */
export function frase(cfg: Config, q = 1): Parte[] {
  const n = NOMES[cfg.nome], pl = q > 1;
  const adjs = (["tam", "cor", "jeito", "humor"] as const).map((k) => cfg[k]).filter(Boolean) as string[];
  const out: Parte[] = [{ txt: ARTIGO(n.g, q), tipo: "art" }, { txt: pl ? n.p : n.s, tipo: "subst" }];
  adjs.forEach((a, i) => {
    if (i > 0) out.push({ txt: i === adjs.length - 1 ? "e" : ",", tipo: "liga" });
    out.push({ txt: flex(a, n.g, pl), tipo: "adj" });
  });
  return out;
}
export const fraseTxt = (cfg: Config, q = 1) => frase(cfg, q).map((p) => p.txt).join(" ").replace(/ ,/g, ",");
export const nAdj = (cfg: Config) => (["tam", "cor", "jeito", "humor"] as const).filter((k) => cfg[k]).length;
