import type { Materia } from "@/lib/data";

/** Estações da aba Mão na massa. Sem os dados, para poder ir para o navegador sem peso. */
export type Estacao = "inv" | "lab" | "num" | "pal";

export const ESTACOES: Record<Estacao, { nome: string; curto: string; desc: string }> = {
  inv: { nome: "Oficina dos Inventores", curto: "Inventores", desc: "Robôs, carrinhos, lançadores e máquinas de papelão: construa, teste e faça andar." },
  lab: { nome: "Laboratório de Ciências", curto: "Laboratório", desc: "Experimentos com coisas da cozinha e do quintal: palpite, teste e descoberta." },
  num: { nome: "Matemática na mão", curto: "Matemática", desc: "Contas, medidas, formas e gráficos que a criança pega, mede e monta." },
  pal: { nome: "Palavras em ação", curto: "Palavras", desc: "Ler, escrever e contar histórias com motivo de verdade." },
};
export const ORDEM_ESTACOES: Estacao[] = ["inv", "lab", "num", "pal"];

export const NIVEIS: Record<1 | 2 | 3, string> = { 1: "Primeiros passos", 2: "Mão firme", 3: "Grande desafio" };

/** Caminho onde a foto da atividade deve ser colocada (em public/). */
export const caminhoFoto = (slug: string) => `/mao-na-massa/${slug}.webp`;

/** O que a lista precisa de cada atividade. */
export type Cartao = { slug: string; n: string; sub: string; est: Estacao; y: string; idade: string; tm: string; nivel: 1 | 2 | 3; num: string; foto: boolean; a: Materia; tema: boolean };
