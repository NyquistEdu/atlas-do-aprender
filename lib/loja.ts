import type { Materia } from "@/lib/data";

/**
 * Jogos educativos vendidos pela Stephanie no Mercado Livre e na Shopee.
 * O site só mostra e explica; a compra (pagamento, frete, troca) acontece na plataforma.
 * Para pôr foto: salve public/loja/<slug>.webp (quadrada, 800×800) e preencha `foto: true`.
 */
export type ProdutoLoja = {
  slug: string;
  nome: string;
  emoji: string;
  area: Materia;
  idade: string;
  resumo: string;
  trabalha: string[];
  comoUsar: string;
  /** Temas das trilhas em que o jogo entra: [matéria, ano, número do tema]. */
  temas: [Materia, string, number][];
  mercadoLivre?: string;
  shopee?: string;
  foto?: boolean;
};

const ML = "?pdp_filters=seller_id%3A214831539";

export const LOJA: ProdutoLoja[] = [
  {
    slug: "jogo-de-fracoes",
    nome: "Jogo de Frações",
    emoji: "🍕",
    area: "mat",
    idade: "a partir de 7 anos",
    resumo: "Peças que representam o inteiro e suas partes para montar, comparar e trocar: metade, terço, quarto e outras frações viram algo que se pega com a mão.",
    trabalha: ["Ideia de partes iguais", "Comparar frações", "Frações equivalentes", "Raciocínio lógico"],
    comoUsar: "Comece montando o inteiro com peças iguais e contando quantas foram precisas. Depois pergunte: quantos quartos cabem numa metade? Qual pedaço é maior, um terço ou um quarto? Combina com a apostila Pedaço por Pedaço.",
    temas: [["mat", "3", 5], ["mat", "4", 2], ["mat", "5", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/jogo-educativo-de-fracoes--estimula-raciocinio-logico/up/MLBU5372493260${ML}`,
  },
  {
    slug: "domino-matematico",
    nome: "Dominó Matemático Math Match",
    emoji: "🎲",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Um dominó em que as peças se encaixam pela conta e pelo resultado: para jogar, a criança precisa calcular, e calcula sem perceber que está treinando.",
    trabalha: ["Cálculo mental", "Fatos básicos das operações", "Atenção", "Esperar a vez e seguir regras"],
    comoUsar: "Jogue em dupla ou em família, com as peças viradas. No começo vale contar nos dedos ou usar tampinhas; com o tempo, desafie a responder de cabeça. Uma partida por dia rende mais que uma lista de contas.",
    temas: [["mat", "1", 3], ["mat", "2", 2], ["mat", "3", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/domino-matematico-math-match-educativo/up/MLBU5331165987${ML}`,
  },
  {
    slug: "giragenio",
    nome: "GiraGênio: spinner matemático",
    emoji: "🌀",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Um spinner para girar e calcular: junta o gosto das crianças pelo fidget spinner com o treino das contas, em rodadas rápidas que cabem em qualquer intervalo.",
    trabalha: ["Fatos básicos e tabuada", "Rapidez no cálculo", "Concentração", "Coordenação fina"],
    comoUsar: "Use em rodadas curtas, de 3 a 5 minutos: gire, resolva a conta que aparecer e marque um ponto a cada acerto. Bom para o treino diário e para os dias em que a criança está agitada.",
    temas: [["mat", "1", 3], ["mat", "2", 2], ["mat", "3", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/giragenio-spinner-matematico-para-criancas--fidget-spinner/up/MLBU5331645429${ML}`,
  },
  {
    slug: "esqueleto-3d",
    nome: "Quebra-cabeça 3D do Esqueleto Humano",
    emoji: "🦴",
    area: "cie",
    idade: "a partir de 6 anos",
    resumo: "Um esqueleto para montar peça por peça: a criança descobre onde fica cada osso, como as partes se encaixam e por que o corpo se mexe do jeito que se mexe.",
    trabalha: ["Partes do corpo e principais ossos", "Noção de espaço e encaixe", "Vocabulário científico", "Paciência e coordenação"],
    comoUsar: "Monte junto na primeira vez, nomeando cada parte: crânio, costelas, coluna, braço, perna. Depois peça que a criança encontre os mesmos ossos no próprio corpo, apalpando. Na segunda montagem, ela já faz sozinha.",
    temas: [["cie", "1", 1], ["cie", "5", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/quebracabeca-corpo-humano-esqueleto-3d/up/MLBU5569140592${ML}`,
  },
];

export const jogosDoTema = (m: Materia, ano: string, tema: number) =>
  LOJA.filter((p) => p.temas.some(([a, b, c]) => a === m && b === ano && c === tema));
