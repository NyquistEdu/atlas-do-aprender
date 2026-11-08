import type { Materia } from "@/lib/data";

/**
 * Jogos educativos vendidos pela Stephanie no Mercado Livre e na Shopee.
 * O site só mostra e explica; a compra (pagamento, frete, troca) acontece na plataforma.
 * Fotos: public/loja/<slug>.webp, <slug>-2.webp, <slug>-3.webp… (quadradas, 800×800); `fotos` diz quantas há.
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
  fotos?: number;
};

const ML = "?pdp_filters=seller_id%3A214831539";

export const LOJA: ProdutoLoja[] = [
  {
    slug: "jogo-de-fracoes",
    nome: "Jogo de Frações",
    emoji: "🍕",
    area: "mat",
    idade: "a partir de 7 anos",
    resumo: "Um tabuleiro com seis círculos de encaixe: o inteiro e o mesmo círculo cortado em metades, terços, quartos, quintos e sextos. Cada cor é uma fração e cada peça traz o número escrito, então a criança vê, pega e compara o tamanho de cada pedaço.",
    trabalha: ["Ideia de inteiro e partes iguais", "Comparar frações (1/3 ou 1/4?)", "Frações equivalentes", "Coordenação motora fina"],
    comoUsar: "Tire as peças e peça para a criança remontar cada círculo, contando quantas peças formam um inteiro. Depois ponha peças lado a lado: quantos quartos cobrem uma metade? Quantos sextos cobrem um terço? Qual pedaço é maior, um terço ou um quinto? Combina com a apostila Pedaço por Pedaço.",
    fotos: 1,
    temas: [["mat", "3", 5], ["mat", "4", 2], ["mat", "5", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/jogo-educativo-de-fracoes--estimula-raciocinio-logico/up/MLBU5372493260${ML}`,
  },
  {
    slug: "domino-matematico",
    nome: "Dominó Matemático Math Match",
    emoji: "🎲",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Um dominó em que cada lado da peça é uma conta de somar ou subtrair (3+1, 9-4, 6+3…). Encaixa quem tem o mesmo resultado: para jogar, a criança precisa calcular, e calcula sem perceber que está treinando. Vem numa caixa com tampa de correr para guardar as peças; a cor varia conforme a opção escolhida.",
    trabalha: ["Adição e subtração até 10", "Cálculo mental", "Atenção", "Esperar a vez e seguir regras"],
    comoUsar: "Jogue em dupla ou em família, com as peças viradas. No começo vale contar nos dedos ou usar tampinhas; com o tempo, desafie a responder de cabeça. Uma partida por dia rende mais que uma lista de contas.",
    fotos: 3,
    temas: [["mat", "1", 3], ["mat", "2", 2], ["mat", "3", 1]],
    mercadoLivre: `https://www.mercadolivre.com.br/domino-matematico-math-match-educativo/up/MLBU5331165987${ML}`,
  },
  {
    slug: "giragenio",
    nome: "GiraGênio: spinner matemático",
    emoji: "🌀",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Discos de engrenagens para girar e calcular: cada disco tem uma operação no centro (2×, ×5, ÷3, ÷8…) e, ao girar as engrenagens, a seta aponta um número e a criança diz o resultado. Junta o gosto pelo brinquedo de mexer nas mãos com o treino da tabuada, em rodadas rápidas.",
    trabalha: ["Tabuada de multiplicar e dividir", "Rapidez no cálculo", "Concentração", "Coordenação fina"],
    comoUsar: "Use em rodadas curtas, de 3 a 5 minutos, com um disco por vez: gire, diga o resultado da conta que a seta mostrar e marque um ponto a cada acerto. Comece pelo 2× e pelo ×5 e deixe as divisões para depois. Bom para o treino diário e para os dias em que a criança está agitada.",
    fotos: 1,
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
  {
    slug: "quebra-cabeca-deslizante-natal",
    nome: "Kit 2 Quebra-Cabeças Deslizantes de Natal 3×3",
    emoji: "🎅",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Dois quebra-cabeças deslizantes 3×3, um de Papai Noel e outro de elfo natalino, cada um com seu próprio tabuleiro. O desafio é mover as peças pelo espaço vazio até reconstruir o personagem. Um presente de Natal que treina a cabeça e rende momentos de desafio em família.",
    trabalha: ["Planejamento de movimentos", "Raciocínio lógico e resolução de problemas", "Percepção visual e orientação espacial", "Atenção, persistência e coordenação olho-mão"],
    comoUsar: "Embaralhe deslizando as peças e entregue para a criança remontar, uma peça por vez para o espaço vazio. Monte junto nas primeiras vezes e pergunte em voz alta: qual peça precisa sair do lugar primeiro? Valorize a persistência, não a velocidade. Com dois kits, dá para fazer desafio em dupla: cada um embaralha o do outro.",
    fotos: 2,
    temas: [["mat", "1", 4]],
    shopee: "https://shopee.com.br/product/1933090137/58222545876/",
  },
  {
    slug: "quebra-cabeca-deslizante-numeros-e-letras",
    nome: "Quebra-Cabeça Deslizante Dupla Face 4×5: Números e Letras",
    emoji: "🔢",
    area: "mat",
    idade: "a partir de 6 anos",
    resumo: "Dois desafios em um único quebra-cabeça: um tabuleiro com grade 4×5 que tem números na frente e letras do alfabeto no verso. A criança vira o jogo para escolher o desafio e desliza as peças pelo espaço vazio até deixar os números em ordem crescente ou as letras em ordem alfabética. Feito em impressão 3D; as cores seguem a opção escolhida no anúncio.",
    trabalha: ["Reconhecimento de números e letras", "Ordem numérica e alfabética", "Planejamento de movimentos e raciocínio lógico", "Atenção, percepção espacial e persistência"],
    comoUsar: "Escolha um lado, embaralhe deslizando as peças e desafie a criança a pôr tudo em ordem, uma peça por vez para o espaço vazio. Comece pelo lado dos números, que é mais fácil de conferir, e vire para as letras quando ela já souber o alfabeto. Peça que diga em voz alta o número ou a letra que está procurando. Valorize a persistência e a troca de estratégia quando travar, não a velocidade.",
    fotos: 3,
    temas: [["mat", "1", 1], ["mat", "1", 2], ["por", "1", 2]],
    shopee: "https://shopee.com.br/product/1933090137/58272570483/",
  },
];

export const jogosDoTema = (m: Materia, ano: string, tema: number) =>
  LOJA.filter((p) => p.temas.some(([a, b, c]) => a === m && b === ano && c === tema));
