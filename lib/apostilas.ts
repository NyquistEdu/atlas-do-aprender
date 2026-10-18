import type { Materia } from "./data";

/**
 * Apostilas à venda.
 *
 * Para começar a vender uma apostila:
 *  1. Cadastre o produto na plataforma de pagamento (Kiwify, Eduzz ou Hotmart) e envie o PDF por lá.
 *  2. Copie o link do checkout para `checkout` e escreva o preço em `preco` (ex.: "R$ 19,90").
 * Enquanto `checkout` estiver vazio, o botão aparece como "Em breve".
 */
export type Apostila = {
  slug: string;
  titulo: string;
  subtitulo: string;
  materia: Materia;
  ano: string; // chave do ano nas trilhas ("1" = alfabetização)
  tema: number; // número do tema na trilha (1, 2, 3…)
  nomeTema: string;
  paginas: number;
  preco: string;
  checkout: string;
  resumo: string;
  dentro: string[];
  amostras: string[]; // legenda de cada página de amostra (pagina-1.webp, pagina-2.webp…)
};

export const APOSTILAS: Apostila[] = [
  {
    slug: "brincar-com-as-palavras",
    titulo: "Brincar com as Palavras",
    subtitulo: "Rimas, sílabas e sons antes de ler",
    materia: "por", ano: "1", tema: 1, nomeTema: "Consciência fonológica: rimas e sílabas",
    paginas: 27, preco: "R$ 15,90", checkout: "",
    resumo: "Antes de aprender as letras, a criança precisa perceber que as palavras são feitas de sons. Aqui ela escuta, bate palmas nas sílabas, acha rimas, recita parlendas e brinca de trocar sons. Quase tudo é falado: ainda não precisa ler nem escrever.",
    dentro: ["6 partes com explicação para a família e exercícios ilustrados", "Parlendas e trava-línguas da tradição oral", "5 revisões diárias em que a ajuda vai diminuindo", "Trilha das palmas (jogo de tabuleiro), bingo e memória das rimas", "Atividades mão na massa, certificado e gabarito"],
    amostras: ["Sílabas: uma palma para cada pedaço", "Rimas: o fim que soa igual", "Revisão diária", "Trilha das palmas"],
  },
  {
    slug: "ouvir-as-letras",
    titulo: "Ouvir as Letras",
    subtitulo: "O alfabeto e o som de cada letra",
    materia: "por", ano: "1", tema: 2, nomeTema: "Letras e seus sons",
    paginas: 32, preco: "R$ 15,90", checkout: "",
    resumo: "O alfabeto ilustrado, maiúsculas e minúsculas, vogais, consoantes, o som do começo das palavras e as letras curiosas. A criança ouve, fala, vê e traça cada letra, com páginas de traçado de A a Z.",
    dentro: ["Alfabeto ilustrado com 26 figuras", "Traçado de todas as letras, com ponto de início e ordem dos traços", "Cuidado especial com b, d, p e q", "5 revisões diárias, caça-letra, bingo, memória e alfabeto móvel para recortar", "Certificado e gabarito"],
    amostras: ["O alfabeto ilustrado", "As vogais", "Traçar letras", "Revisão diária"],
  },
  {
    slug: "contar-ate-cem",
    titulo: "Contar até Cem",
    subtitulo: "Contagem, dezenas e o quadro dos 100",
    materia: "mat", ano: "1", tema: 1, nomeTema: "Contagem e números até 100",
    paginas: 31, preco: "R$ 15,90", checkout: "",
    resumo: "Contar de verdade não é falar os números de cor. A criança aprende as regras da contagem, escreve os números, compara quantidades, forma dezenas com palitos e material dourado, conta em saltos e descobre os padrões do quadro dos 100.",
    dentro: ["7 partes com explicação e exercícios", "Quadro de dez, reta numérica e material dourado desenhados", "Traçado dos números de 0 a 9", "5 revisões diárias, bingo, memória e mercadinho com dinheiro de brincadeira", "Certificado e gabarito"],
    amostras: ["Os números de 0 a 10", "Dezenas e unidades", "O quadro dos 100", "Revisão diária"],
  },
  {
    slug: "medir-o-mundo",
    titulo: "Medir o Mundo",
    subtitulo: "Medidas e conversões sem travar",
    materia: "mat", ano: "3", tema: 3, nomeTema: "Medidas: comprimento, massa e capacidade",
    paginas: 32, preco: "R$ 15,90", checkout: "",
    resumo: "Comprimento, massa e capacidade, com foco nas conversões, onde muita criança trava. A explicação começa pelo que ela já conhece, o dinheiro: se 1 real vale 100 centavos, 1 metro vale 100 centímetros.",
    dentro: ["Explicação passo a passo de cada medida", "Quadro das trocas para as conversões", "5 treinos diários em que a ajuda vai diminuindo", "Jogo da memória das medidas e mão na massa na cozinha", "Certificado e gabarito"],
    amostras: ["Conversões", "Comprimento", "Treino diário", "Jogo da memória"],
  },
  {
    slug: "olhar-o-ceu",
    titulo: "Olhar o Céu",
    subtitulo: "O Sol, a Lua, as estrelas e as constelações",
    materia: "cie", ano: "3", tema: 4, nomeTema: "O céu e as estrelas",
    paginas: 31, preco: "R$ 15,90", checkout: "",
    resumo: "Observar, registrar e entender o céu: o caminho do Sol e as sombras, o dia e a noite, as fases da Lua, as estrelas, o Cruzeiro do Sul e as Três Marias. Com diário da Lua de 15 noites e experimentos com lanterna e biscoito.",
    dentro: ["6 partes com observação, explicação e experimentos", "Diário da Lua para 15 noites", "5 revisões diárias", "Caça-palavras, jogo da memória e constelação na lata", "Certificado e gabarito"],
    amostras: ["As fases da Lua", "Estrelas", "Revisão diária", "Jogo da memória do céu"],
  },
];

export const apostilaDoTema = (m: Materia, ano: string, tema: number) => APOSTILAS.find((a) => a.materia === m && a.ano === ano && a.tema === tema);
export const anoNome = (ano: string) => (ano === "1" ? "Alfabetização" : `${ano}º ano`);
