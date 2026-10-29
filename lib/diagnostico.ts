import type { Materia } from "@/lib/data";

/**
 * Diagnóstico para a família: uma frase observável por tema das trilhas, na ordem da trilha.
 * O adulto responde se a criança já faz sozinha, com ajuda ou ainda não.
 * O tema indicado é o primeiro que ainda não está firme.
 */
export type Area = "por" | "mat" | "cie";
export type Habilidade = { ano: string; tema: number; frase: string; exemplo?: string };

export const HABILIDADES_DIAG: Record<Area, Habilidade[]> = {
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
  cie: [
    { ano: "1", tema: 1, frase: "Nomeia as partes do corpo e sabe para que serve cada um dos cinco sentidos." },
    { ano: "1", tema: 2, frase: "Explica por que lavamos as mãos, escovamos os dentes e precisamos dormir bem." },
    { ano: "1", tema: 3, frase: "Diz de que material são feitos os objetos e compara suas características.", exemplo: "madeira, plástico, metal, vidro; duro, mole, transparente" },
    { ano: "1", tema: 4, frase: "Explica a diferença entre o dia e a noite e o que vemos no céu em cada um." },
    { ano: "2", tema: 1, frase: "Diferencia seres vivos de não vivos e diz onde alguns animais e plantas vivem." },
    { ano: "2", tema: 2, frase: "Nomeia raiz, caule, folha, flor, fruto e semente e sabe do que a planta precisa para viver." },
    { ano: "2", tema: 3, frase: "Explica como se forma a sombra e percebe que ela muda ao longo do dia." },
    { ano: "2", tema: 4, frase: "Agrupa animais pelo que comem, por como se locomovem ou pela cobertura do corpo.", exemplo: "pelos, penas, escamas" },
    { ano: "3", tema: 1, frase: "Descreve o ciclo de vida de um animal: nascer, crescer, se reproduzir.", exemplo: "ovo, lagarta, casulo, borboleta" },
    { ano: "3", tema: 2, frase: "Explica que o som é produzido por uma vibração.", exemplo: "a corda do violão, o sino" },
    { ano: "3", tema: 3, frase: "Diferencia tipos de solo e sabe que existe ar e água no solo." },
    { ano: "3", tema: 4, frase: "Sabe que o Sol é uma estrela e percebe que a Lua muda de forma ao longo do mês." },
    { ano: "4", tema: 1, frase: "Monta uma cadeia alimentar simples e sabe o papel dos decompositores.", exemplo: "capim → coelho → raposa" },
    { ano: "4", tema: 2, frase: "Sabe que existem microrganismos, alguns úteis e outros que causam doenças.", exemplo: "o fermento do pão e o iogurte" },
    { ano: "4", tema: 3, frase: "Diferencia mistura de transformação e sabe que algumas transformações não voltam atrás.", exemplo: "ovo cozido, papel queimado" },
    { ano: "4", tema: 4, frase: "Usa o nascer do Sol ou a sombra para achar leste, oeste, norte e sul." },
    { ano: "5", tema: 1, frase: "Explica como a digestão, a respiração e a circulação trabalham juntas no corpo." },
    { ano: "5", tema: 2, frase: "Explica o ciclo da água: evaporação, condensação e chuva." },
    { ano: "5", tema: 3, frase: "Nomeia os planetas do Sistema Solar e reconhece pelo menos uma constelação." },
    { ano: "5", tema: 4, frase: "Sabe o que conduz e o que isola eletricidade e entende um circuito com pilha e lâmpada." },
    { ano: "5", tema: 5, frase: "Relaciona consumo, lixo e reciclagem com o impacto no ambiente." },
  ],
};

export type Resposta = "sim" | "ajuda" | "nao";

/** Ano escolar informado → [ano da trilha onde as perguntas começam, ano da série]. Começa um ano abaixo, para dar segurança. */
export const SERIES: [string, string, string, string][] = [
  ["ei", "Educação infantil", "1", "1"],
  ["1", "1º ano", "1", "1"],
  ["2", "2º ano", "1", "2"],
  ["3", "3º ano", "2", "3"],
  ["4", "4º ano", "3", "4"],
  ["5", "5º ano", "4", "5"],
  ["6", "6º ano ou mais", "5", "5"],
];

/**
 * O diagnóstico anda por blocos de um ano da trilha (todos os temas daquele ano):
 *  - começa um ano abaixo da série;
 *  - se o bloco tem algum tema que não está firme, desce para o ano anterior, até achar um ano todo firme ou chegar à alfabetização;
 *  - depois sobe a partir do ano inicial enquanto os blocos estão quase todos firmes (no máximo 1 tema não firme), até o ano da série.
 * Assim, uma criança do 3º ano com lacunas do 1º e do 2º ano recebe todos esses temas na lista.
 */
export type Estado = {
  anos: string[]; // ordem dos blocos já abertos
  ano: string; // bloco atual
  k: number; // índice do tema dentro do bloco
  fase: "desce" | "sobe";
  respostas: Record<string, Resposta>; // "ano-tema" → resposta
  feito: boolean;
  inicio: string;
  alvo: string;
};

const temasDoAno = (m: Area, ano: string) => HABILIDADES_DIAG[m].filter((h) => h.ano === ano);
const chave = (h: Habilidade) => `${h.ano}-${h.tema}`;

export function inicio(m: Area, serie: string): Estado {
  const s = SERIES.find((x) => x[0] === serie) || SERIES[0];
  return { anos: [s[2]], ano: s[2], k: 0, fase: "desce", respostas: {}, feito: false, inicio: s[2], alvo: s[3] };
}

export function atual(m: Area, e: Estado): Habilidade {
  return temasDoAno(m, e.ano)[e.k];
}

function lacunas(m: Area, ano: string, r: Record<string, Resposta>) {
  return temasDoAno(m, ano).filter((h) => r[chave(h)] && r[chave(h)] !== "sim").length;
}

export function responder(m: Area, e: Estado, resp: Resposta): Estado {
  const h = atual(m, e);
  const respostas = { ...e.respostas, [chave(h)]: resp };
  const bloco = temasDoAno(m, e.ano);
  if (e.k + 1 < bloco.length) return { ...e, respostas, k: e.k + 1 };
  // Fim do bloco: decidir o próximo.
  const g = lacunas(m, e.ano, respostas);
  const n = Number(e.ano);
  if (e.fase === "desce" && g > 0 && n > 1) {
    const ano = String(n - 1);
    return { ...e, respostas, ano, k: 0, anos: [...e.anos, ano] };
  }
  // Terminou de descer: sobe a partir do ano inicial, se o ano inicial estava quase todo firme.
  const ultimoSubido = e.fase === "sobe" ? n : Number(e.inicio);
  const gRef = lacunas(m, String(ultimoSubido), respostas);
  const prox = ultimoSubido + 1;
  if (gRef <= 1 && prox <= Number(e.alvo) && prox <= 5) {
    const ano = String(prox);
    return { ...e, respostas, ano, k: 0, fase: "sobe", anos: [...e.anos, ano] };
  }
  return { ...e, respostas, feito: true };
}

export type Item = { h: Habilidade; r: Resposta };
export type Resultado = { trabalhar: Item[]; proximo: Habilidade | null; firmes: number };

/** Temas para trabalhar, na ordem da trilha (do mais básico ao mais avançado). */
export function resultado(m: Area, e: Estado): Resultado {
  const lista = HABILIDADES_DIAG[m];
  const trabalhar = lista.filter((h) => e.respostas[chave(h)] && e.respostas[chave(h)] !== "sim").map((h) => ({ h, r: e.respostas[chave(h)] }));
  const firmes = Object.values(e.respostas).filter((v) => v === "sim").length;
  let proximo: Habilidade | null = null;
  if (!trabalhar.length) {
    // Tudo firme no que foi perguntado: o próximo é o primeiro tema depois do último bloco aberto.
    const maior = Math.max(...e.anos.map(Number));
    proximo = lista.find((h) => Number(h.ano) === maior + 1) || null;
  }
  return { trabalhar, proximo, firmes };
}

export const perguntadas = (e: Estado) => Object.keys(e.respostas).length;
