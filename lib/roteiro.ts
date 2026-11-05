/**
 * Roteiro do diagnóstico do planejamento gratuito (o mesmo de ferramentas/planejamento/roteiro.py),
 * usado na página /planejamento/montar para preencher a ficha durante a videochamada.
 */
import type { Materia } from "@/lib/data";
import type { ExtraPlano, TemaPlano } from "@/lib/plano";

export type Nivel = "" | "sim" | "ajuda" | "nao";
export const NIVEIS: [Exclude<Nivel, "">, string][] = [["sim", "consegue"], ["ajuda", "com ajuda"], ["nao", "ainda não"]];

export type Tarefa = { t: string; mostrar: string; obs?: string };

export const CONVERSA: [string, string][] = [
  ["confirmar", "Confirmar o formulário: ano escolar, escola ou estudo em casa, quem acompanha, quanto tempo por dia"],
  ["dia", "Como é um dia comum da criança? Em que horário ela está mais disposta?"],
  ["tentaram", "O que já tentaram? O que funcionou e o que virou briga?"],
  ["gosta", "Do que a criança gosta muito? (vai entrar nos exemplos e nas atividades)"],
  ["espera", "O que a família espera daqui a um mês? E daqui a seis meses?"],
  ["necessidade", "Há alguma avaliação, acompanhamento ou necessidade específica que ajude a entender a criança?"],
];

export const COM_A_CRIANCA = [
  "Comece conversando sobre o que ela gosta. Diga que não é prova: “quero conhecer você para preparar atividades legais”.",
  "Siga as tarefas na ordem e pare quando ela travar duas vezes seguidas: dali começa o plano.",
  "Peça para a família mostrar o caderno da escola, se houver.",
  "Elogie o esforço. Se cansar, pare: dá para completar depois.",
];

export const FECHAMENTO = [
  "Contar à família o que você observou, sempre começando pelo que a criança já sabe.",
  "Combinar a rotina possível (dias, horário e tempo) e quem acompanha.",
  "Avisar que o planejamento vai aparecer em Meu Plano, entrando com o e-mail dela.",
];

export const LEITURA: Tarefa[] = [
  { t: "Nomear letras", mostrar: "B  M  A  S  T  O  R  L  E  P  U  F", obs: "Pergunte o nome e o som de cada letra." },
  { t: "Separar em sílabas com palmas", mostrar: "pato · boneca · sol · borboleta", obs: "Quantas palmas tem cada palavra?" },
  { t: "Rima", mostrar: "gato · pato · bola (qual não rima?) · Que palavra rima com “mão”?" },
  { t: "Ler sílabas", mostrar: "BA  MI  TO  LU  PE  FA" },
  { t: "Ler palavras simples e complexas", mostrar: "bola  casa  menino  prato  chuva  flor" },
  { t: "Ler uma frase", mostrar: "O gato subiu no muro e miou." },
  { t: "Ler um texto curto e entender", mostrar: "“Lia tinha um cachorro chamado Pipoca. Um dia, Pipoca fugiu atrás de uma borboleta. Lia o encontrou dormindo debaixo da mangueira.”", obs: "Qual era o nome do cachorro? Por que ele fugiu? Onde estava?" },
  { t: "Escrever", mostrar: "Ditado: sapo · janela · prato · e a frase “Eu gosto de brincar.”", obs: "Peça para mostrar o papel na câmera." },
];

export const MATEMATICA: Tarefa[] = [
  { t: "Contar objetos", mostrar: "Contar 15 objetos de verdade (tampinhas, lápis).", obs: "Repare se aponta um a um, sem pular e sem repetir." },
  { t: "Sequência e números", mostrar: "7  15  48  102 · contar de 10 em 10 até 100", obs: "Ler os números e dizer qual é o maior." },
  { t: "Somar e subtrair", mostrar: "3 + 4   9 − 5   27 + 15   50 − 18", obs: "Pode usar os dedos ou papel; observe a estratégia." },
  { t: "Multiplicar", mostrar: "3 × 4   6 × 7 · “3 pacotes com 5 balas, quantas balas?”" },
  { t: "Dividir", mostrar: "“12 balas para 3 crianças, quantas para cada uma?”" },
  { t: "Frações e medidas", mostrar: "Metade de 10 · Qual é maior, 1/2 ou 1/4? · Quantos centímetros tem 1 metro?" },
  { t: "Problema", mostrar: "“Comprei um lanche de R$ 7 e paguei com R$ 10. Quanto recebi de troco?”" },
];

/** Ano escolar da trilha (1 a 5) a partir do texto do formulário. */
export function anoTrilha(ano: string): string {
  const m = ano.match(/(\d)/);
  if (!m) return "1";
  return String(Math.min(5, Math.max(1, Number(m[1]))));
}

/** Índice da primeira tarefa em que a criança não conseguiu sozinha; -1 se fez tudo; null se nada foi marcado. */
export function parouEm(n: Nivel[]): number | null {
  if (!n.some(Boolean)) return null;
  const i = n.findIndex((x) => x === "ajuda" || x === "nao");
  return i;
}

const T = (materia: Materia, ano: string, tema: number): TemaPlano => ({ materia, ano, tema });

/** “Onde começar no Atlas” de Português (tabela do roteiro). */
export function sugereLeitura(n: Nivel[], ano: string): { tema: TemaPlano; porque: string } | null {
  const p = parouEm(n);
  if (p === null) return null;
  if (p === -1) return { tema: T("por", anoTrilha(ano), 1), porque: "Fez todas as tarefas: temas do ano escolar." };
  if (p <= 2) return { tema: T("por", "1", 1), porque: "Parou nas tarefas 1 a 3: rimas e sílabas (Brincar com as Palavras)." };
  if (p === 3) return { tema: T("por", "1", 2), porque: "Parou na leitura de sílabas: letras e seus sons (Ouvir as Letras)." };
  if (p <= 5) return { tema: T("por", "1", 3), porque: "Parou em palavras e frases: alfabetização, temas 3 e 4." };
  if (p === 6) return { tema: T("por", "2", 2), porque: "Lê, mas não entende o texto: leitura fluente de frases e compreensão." };
  return { tema: T("por", "2", 1), porque: "Lê e entende, mas trava na escrita: sílabas complexas e ortografia." };
}

/** “Onde começar no Atlas” de Matemática (tabela do roteiro). */
export function sugereMat(n: Nivel[]): { tema: TemaPlano; porque: string } | null {
  const p = parouEm(n);
  if (p === null) return null;
  if (p === -1) return { tema: T("mat", "4", 1), porque: "Fez todas as tarefas: temas do 4º e 5º ano." };
  if (p <= 1) return { tema: T("mat", "1", 1), porque: "Parou em contagem e números: números até 100 (Contar até Cem)." };
  if (p === 2) return { tema: T("mat", "1", 3), porque: "Parou em somar e subtrair: adição e subtração com material." };
  if (p === 3) return { tema: T("mat", "3", 1), porque: "Parou na multiplicação: multiplicação e tabuada." };
  if (p === 4) return { tema: T("mat", "3", 2), porque: "Parou na divisão: dividir como repartir e agrupar." };
  if (p === 5) return { tema: T("mat", "3", 5), porque: "Parou em frações e medidas: frações do dia a dia (e medidas, 3º ano tema 3)." };
  return { tema: T("mat", "2", 3), porque: "Parou no problema com dinheiro: dinheiro e trocas." };
}

export type FichaCrianca = {
  nome: string; idade: string; ano: string;
  leitura: Nivel[]; leituraNota: string;
  mat: Nivel[]; matNota: string;
  fortes: string; gosta: string; reforcar: string;
  por: TemaPlano | null; matT: TemaPlano | null; cie: TemaPlano | null;
};

export type Ficha = {
  id: string; pedidoId?: string;
  email: string; familia: string; inicio: string; dias: number;
  acompanha: string; objetivo: string; como: string; obs: string;
  conversa: Record<string, string>;
  criancas: FichaCrianca[];
  cieJuntos: boolean;
  extras: ExtraPlano[];
  publicado?: string; // data em que o plano foi publicado
};

export const novaCrianca = (c: Partial<FichaCrianca> = {}): FichaCrianca => ({
  nome: "", idade: "", ano: "", leitura: LEITURA.map(() => ""), leituraNota: "", mat: MATEMATICA.map(() => ""), matNota: "",
  fortes: "", gosta: "", reforcar: "", por: null, matT: null, cie: null, ...c,
});
