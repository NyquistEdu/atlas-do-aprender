import type { Materia } from "@/lib/data";

/**
 * Diagnóstico para a família: uma frase observável por tema das trilhas, na ordem da trilha.
 * O adulto responde se a criança já faz sozinha, com ajuda ou ainda não.
 * O tema indicado é o primeiro que ainda não está firme.
 */
export type Habilidade = { ano: string; tema: number; frase: string; exemplo?: string };

export const HABILIDADES_DIAG: Record<"por" | "mat", Habilidade[]> = {
  por: [
    { ano: "1", tema: 1, frase: "Percebe palavras que rimam e bate palmas nas sílabas de uma palavra.", exemplo: "gato e pato rimam; “ca-sa” tem duas palmas" },
    { ano: "1", tema: 2, frase: "Reconhece as letras do alfabeto e sabe o som de cada uma.", exemplo: "vê o B e diz “bê”, faz o som de “b” em bola" },
    { ano: "1", tema: 3, frase: "Escreve o próprio nome sem copiar e tenta escrever palavras simples.", exemplo: "escreve BOLA, mesmo que falte uma letra" },
    { ano: "1", tema: 4, frase: "Acompanha com o dedo e “lê” cantigas ou parlendas que sabe de cor.", exemplo: "“Batatinha quando nasce…” apontando as palavras" },
    { ano: "2", tema: 1, frase: "Lê e escreve palavras com BR, PL, NH, LH e CH.", exemplo: "brinquedo, planta, ninho, palha, chuva" },
    { ano: "2", tema: 2, frase: "Lê frases e textos curtos com ritmo e conta o que entendeu." },
    { ano: "2", tema: 3, frase: "Reconta uma história com começo, meio e fim, na ordem certa." },
    { ano: "2", tema: 4, frase: "Escreve sozinha um bilhete ou uma lista que outra pessoa consegue entender." },
    { ano: "3", tema: 1, frase: "Acerta R/RR, S/SS e M antes de P e B na maior parte das palavras.", exemplo: "carro, pássaro, campo, tempo" },
    { ano: "3", tema: 2, frase: "Usa ponto final, de interrogação e de exclamação, e separa o texto em parágrafos." },
    { ano: "3", tema: 3, frase: "Lê uma fábula sozinha e explica a moral da história." },
    { ano: "3", tema: 4, frase: "Lê poemas percebendo rima e ritmo e consegue inventar versos." },
    { ano: "3", tema: 5, frase: "Usa adjetivos para descrever pessoas e coisas e sabe o que é substantivo.", exemplo: "“o cachorro peludo e brincalhão”" },
    { ano: "4", tema: 1, frase: "Diferencia notícia, carta e receita e sabe para que serve cada uma." },
    { ano: "4", tema: 2, frase: "Escreve usando passado, presente e futuro sem misturar os tempos no texto." },
    { ano: "4", tema: 3, frase: "Coloca acento e til nas palavras mais comuns.", exemplo: "café, você, mãe, avó" },
    { ano: "4", tema: 4, frase: "Lê livros com capítulos e percebe o que a história deixa nas entrelinhas." },
    { ano: "5", tema: 1, frase: "Escreve um texto defendendo uma opinião, com motivos e exemplos." },
    { ano: "5", tema: 2, frase: "Relê o próprio texto e corrige concordância e repetições." },
    { ano: "5", tema: 3, frase: "Lê crônicas e clássicos brasileiros e percebe o humor e a crítica." },
    { ano: "5", tema: 4, frase: "Pesquisa um assunto, faz um resumo e apresenta para alguém." },
  ],
  mat: [
    { ano: "1", tema: 1, frase: "Conta objetos até 100 e lê e escreve esses números." },
    { ano: "1", tema: 2, frase: "Compara quantidades (mais, menos, igual) e agrupa coisas por cor, forma ou tamanho." },
    { ano: "1", tema: 3, frase: "Resolve continhas de juntar e de tirar usando objetos ou desenhos.", exemplo: "“tinha 5 balas e ganhou 3: quantas tem?”" },
    { ano: "1", tema: 4, frase: "Reconhece círculo, quadrado, triângulo e retângulo e continua sequências.", exemplo: "vermelho, azul, vermelho, azul… o que vem depois?" },
    { ano: "2", tema: 1, frase: "Entende unidade, dezena e centena.", exemplo: "sabe que, em 245, o 4 vale 40" },
    { ano: "2", tema: 2, frase: "Faz contas de mais e de menos com “vai um” e “empresta”, entendendo o porquê." },
    { ano: "2", tema: 3, frase: "Reconhece cédulas e moedas e calcula um troco simples." },
    { ano: "2", tema: 4, frase: "Lê datas no calendário e horas cheias e meias no relógio de ponteiros." },
    { ano: "2", tema: 5, frase: "Reconhece cubo, esfera, cilindro, cone e pirâmide em objetos de casa." },
    { ano: "3", tema: 1, frase: "Entende a multiplicação como grupos iguais e sabe as tabuadas do 2, do 5 e do 10." },
    { ano: "3", tema: 2, frase: "Divide em partes iguais e resolve problemas de repartir.", exemplo: "12 figurinhas para 3 crianças" },
    { ano: "3", tema: 3, frase: "Mede com régua, fita métrica, balança e copo medidor, e estima antes de medir." },
    { ano: "3", tema: 4, frase: "Lê e monta tabelas e gráficos de barras simples." },
    { ano: "3", tema: 5, frase: "Reconhece metade, terço e quarto de uma pizza ou de uma quantidade." },
    { ano: "4", tema: 1, frase: "Multiplica e divide números de dois algarismos.", exemplo: "23 × 4, 84 ÷ 4" },
    { ano: "4", tema: 2, frase: "Sabe que 1/2 é o mesmo que 2/4 e compara frações." },
    { ano: "4", tema: 3, frase: "Lê e escreve números decimais.", exemplo: "R$ 3,75 ou 1,5 metro" },
    { ano: "4", tema: 4, frase: "Calcula o perímetro e a área de figuras em papel quadriculado." },
    { ano: "4", tema: 5, frase: "Identifica ângulo reto e eixo de simetria e se orienta com direções." },
    { ano: "5", tema: 1, frase: "Relaciona 1/2, 0,5 e 50% e usa porcentagem no dia a dia." },
    { ano: "5", tema: 2, frase: "Lê números grandes, com milhares e milhões, e sabe arredondar." },
    { ano: "5", tema: 3, frase: "Calcula volume com cubinhos e relaciona litro e centímetro cúbico." },
    { ano: "5", tema: 4, frase: "Diz se um acontecimento é certo, provável ou impossível." },
    { ano: "5", tema: 5, frase: "Localiza pontos por coordenadas e resolve problemas de várias etapas." },
  ],
};

export type Resposta = "sim" | "ajuda" | "nao";

/** Ano escolar informado → ano da trilha onde as perguntas começam (um ano abaixo, para dar segurança). */
export const SERIES: [string, string, string][] = [
  ["ei", "Educação infantil", "1"],
  ["1", "1º ano", "1"],
  ["2", "2º ano", "1"],
  ["3", "3º ano", "2"],
  ["4", "4º ano", "3"],
  ["5", "5º ano", "4"],
  ["6", "6º ano ou mais", "5"],
];

/** Ciências não é sequencial como as outras: indicamos o 1º tema do ano em que a criança está. */
export function cienciasPara(serie: string): string {
  if (serie === "ei") return "1";
  if (serie === "6") return "5";
  return serie;
}

export type Estado = {
  i: number; // índice da pergunta atual
  fase: "frente" | "volta";
  inicio: number;
  respostas: Record<number, Resposta>;
  feito: boolean;
};

export function inicio(m: "por" | "mat", serie: string): Estado {
  const ano = SERIES.find((s) => s[0] === serie)?.[2] || "1";
  const i = HABILIDADES_DIAG[m].findIndex((h) => h.ano === ano);
  return { i: Math.max(0, i), fase: "frente", inicio: Math.max(0, i), respostas: {}, feito: false };
}

const MAX_FRENTE = 9;
const MAX_VOLTA = 8;

/** Avança o questionário de uma matéria. */
export function responder(m: "por" | "mat", e: Estado, r: Resposta): Estado {
  const lista = HABILIDADES_DIAG[m];
  const respostas = { ...e.respostas, [e.i]: r };
  const n = { ...e, respostas };
  if (e.fase === "frente") {
    // A primeira pergunta já não está firme: volta na trilha até achar o que ela faz sozinha.
    if (e.i === e.inicio && r !== "sim" && e.inicio > 0) return { ...n, fase: "volta", i: e.i - 1 };
    const naoFirmes = Object.entries(respostas).filter(([k, v]) => Number(k) >= e.inicio && v !== "sim").length;
    const perguntadas = Object.keys(respostas).filter((k) => Number(k) >= e.inicio).length;
    if (r === "nao" || naoFirmes >= 2 || perguntadas >= MAX_FRENTE || e.i + 1 >= lista.length) return { ...n, feito: true };
    return { ...n, i: e.i + 1 };
  }
  const voltas = Object.keys(respostas).filter((k) => Number(k) < e.inicio).length;
  if (r === "sim" || e.i === 0 || voltas >= MAX_VOLTA) return { ...n, feito: true };
  return { ...n, i: e.i - 1 };
}

/** Primeiro tema que ainda não está firme (ou null se tudo o que foi perguntado está firme até o fim da trilha). */
export function resultado(m: "por" | "mat", e: Estado): { h: Habilidade; idx: number; firmes: number } | { h: null; idx: number; firmes: number } {
  const lista = HABILIDADES_DIAG[m];
  const idxs = Object.entries(e.respostas).filter(([, v]) => v !== "sim").map(([k]) => Number(k)).sort((a, b) => a - b);
  const idx = idxs.length ? idxs[0] : Math.max(...Object.keys(e.respostas).map(Number)) + 1;
  return idx < lista.length ? { h: lista[idx], idx, firmes: idx } : { h: null, idx, firmes: lista.length };
}
