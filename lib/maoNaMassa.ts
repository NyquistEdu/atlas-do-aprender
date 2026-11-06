import raw from "@/data/mao-na-massa.json";
import type { Materia } from "@/lib/data";

import { type Estacao } from "@/lib/maoNaMassaInfo";
export * from "@/lib/maoNaMassaInfo";

/**
 * Uma atividade mão na massa, no formato de ficha.
 * `ad` lista os passos (contando a partir de 1) que o adulto faz.
 * `foto` descreve a cena da foto; o prompt completo sai de `promptFoto`.
 */
export type Atividade = {
  slug: string; n: string; sub: string; est: Estacao; a: Materia; y: string;
  idade: string; tm: string; nivel: 1 | 2 | 3; adulto: string; sujeira: string; ideia: string;
  mat: string[]; comprar: string; palpite: string; st: string[]; ad: number[];
  como: string; turbine: string; seg: string; dica: string; foto: string; naocoma?: boolean;
  /** Temas das trilhas com que a atividade se relaciona: "cie2-3" = Ciências, 2º ano, tema 3 (contando de 1). */
  temas: string[];
};

export const ATIVIDADES = raw as Atividade[];

export const atividade = (slug: string) => ATIVIDADES.find((x) => x.slug === slug);
export const numero = (x: Atividade) => String(ATIVIDADES.indexOf(x) + 1).padStart(3, "0");

/** Outras atividades da mesma estação, das mais próximas na idade para as mais distantes. */
export function relacionadas(x: Atividade, n = 3) {
  return ATIVIDADES.filter((o) => o.est === x.est && o.slug !== x.slug)
    .sort((p, q) => Math.abs(+p.y - +x.y) - Math.abs(+q.y - +x.y))
    .slice(0, n);
}

/** Prompt para gerar a foto da atividade num gerador de imagens. */
export const promptFoto = (x: Atividade) =>
  `Foto realista, luz natural de janela, ambiente de casa brasileira, cores alegres e foco no objeto pronto: ${x.foto}. Sem texto, sem marcas e sem logotipos na imagem. Formato quadrado 4:3, alta resolução.`;
