/** Datas especiais do ano, com livros, filmes, jogos e atividades para viver o tema em família. */
export type Bloco = { nome: string; itens: [string, string?][] };
export type Tematica = {
  slug: string;
  titulo: string;
  quando: string;
  resumo: string;
  emoji: string;
  intro: string[];
  livros: [string, string][];
  blocos: Bloco[];
  cuidado?: string;
};

export const TEMATICAS: Tematica[] = [
  {
    slug: "halloween",
    titulo: "Halloween e Dia do Saci",
    quando: "31 de outubro",
    emoji: "🎃",
    resumo: "Bruxas, monstros, assombrações e o nosso Saci: livros, filmes, experimentos e brincadeiras para falar de medo, imaginação e folclore.",
    intro: [
      "O Halloween nasceu de festas antigas dos povos celtas, que marcavam o fim da colheita e o começo do inverno. A tradição chegou aos Estados Unidos com imigrantes irlandeses e de lá se espalhou pelo mundo, com fantasias, abóboras e “gostosuras ou travessuras”.",
      "No Brasil, o 31 de outubro também é comemorado em vários lugares como o Dia do Saci, para valorizar o nosso folclore: Saci, Curupira, Mula sem Cabeça, Cuca e Boitatá. Dá para aproveitar as duas festas ou escolher a que combina mais com a sua família.",
      "Histórias de medo, contadas em segurança, ajudam a criança a dar nome ao que sente e a perceber que o medo pode diminuir.",
    ],
    livros: [
      ["“Bruxa, Bruxa, Venha à Minha Festa” — Arden Druce", "Rimas e convites em sequência; ótimo para quem está aprendendo a ler."],
      ["“A Bruxinha Atrapalhada” — Eva Furnari", "Livro só de imagens: a criança conta a história com as próprias palavras."],
      ["“O Grúfalo” — Julia Donaldson e Axel Scheffler", "Um ratinho esperto inventa um monstro para escapar da floresta. Rima e humor."],
      ["“Onde Vivem os Monstros” — Maurice Sendak", "Imaginação, raiva e o caminho de volta para casa."],
      ["“Chapeuzinho Amarelo” — Chico Buarque", "A menina que tinha medo de tudo descobre que o medo pode encolher."],
      ["“Dez Sacizinhos” — Tatiana Belinky", "Contagem regressiva em versos com o Saci; bom para o Dia do Saci."],
      ["“Sete Histórias para Sacudir o Esqueleto” — Angela Lago", "Contos de assombração da tradição popular, para ler junto."],
      ["“O Saci” — Monteiro Lobato", "Pedrinho caça um Saci e conhece os seres da mata. Leitura mais longa, em capítulos, para ler junto."],
    ],
    blocos: [
      {
        nome: "Filmes e séries",
        itens: [
          ["Monstros S.A. (2001)", "monstros que, no fundo, têm medo das crianças"],
          ["Hotel Transilvânia (2012)", "comédia com Drácula e companhia"],
          ["Viva: A Vida é uma Festa (2017)", "o Dia dos Mortos mexicano e a memória da família"],
          ["O Estranho Mundo de Jack (1993)", "Halloween encontra o Natal; melhor a partir de 8 anos, com um adulto"],
          ["Sítio do Picapau Amarelo", "episódios com o Saci e a Cuca"],
          ["Castelo Rá-Tim-Bum", "a bruxa Morgana e o Doutor Victor"],
        ],
      },
      {
        nome: "Mão na massa e ciência",
        itens: [
          ["Poção que muda de cor", "suco de repolho roxo fica rosa com vinagre e verde com bicarbonato: é um indicador de ácido e base"],
          ["Gosma de monstro", "amido de milho com um pouco de água: aperte e fica dura, solte e escorre"],
          ["Fantasma que dança", "esfregue um balão no cabelo e aproxime de fantasminhas de papel de seda: eletricidade estática"],
          ["Abóbora de verdade", "estimar e contar as sementes, medir a volta com fita métrica e pesar na balança"],
          ["Gorro do Saci", "gorro vermelho de papel ou feltro e uma máscara para contar a lenda"],
        ],
      },
      {
        nome: "Português",
        itens: [
          ["Floresta de medo × floresta de festa", "descrever o mesmo lugar trocando só os adjetivos"],
          ["História de assombração em 5 frases", "começo, o susto, o mistério, a descoberta e o final"],
          ["Recontar uma lenda", "a criança conta o Saci ou o Curupira para alguém da família"],
        ],
      },
      {
        nome: "Matemática",
        itens: [
          ["Repartir os doces", "dividir em partes iguais: metade, terça parte, quarta parte"],
          ["Gráfico das fantasias", "perguntar a família e montar um gráfico de barras"],
          ["Quantas sementes?", "estimar antes, contar de 10 em 10 depois"],
        ],
      },
      {
        nome: "Jogos",
        itens: [
          ["Ghost Blitz", "rapidez, atenção e lógica com um fantasma, uma garrafa e outros objetos"],
          ["Jogo da memória de monstros", "versão caseira: a criança desenha os pares"],
          ["Caça ao tesouro de enigmas", "pistas em rima espalhadas pela casa"],
        ],
      },
      {
        nome: "Para conversar",
        itens: [
          ["Do que você tem medo? O que ajuda o medo a diminuir?"],
          ["O que o Halloween e o Dia do Saci contam sobre os lugares de onde vieram?"],
          ["Qual monstro ou ser do folclore você inventaria? Como ele seria?"],
        ],
      },
    ],
    cuidado: "Confira a classificação indicativa antes de assistir e respeite o limite da criança: se o susto passar do ponto, pare e troque por algo mais leve. O experimento da poção usa só ingredientes de cozinha, mas não é para beber.",
  },
];

export const tematica = (slug: string) => TEMATICAS.find((t) => t.slug === slug);
