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
  material?: { href: string; titulo: string; texto: string }; // material gratuito do Atlas em destaque
};

export const TEMATICAS: Tematica[] = [
  {
    slug: "halloween",
    titulo: "Halloween e Dia do Saci",
    quando: "31 de outubro",
    emoji: "🎃",
    material: { href: "/apostilas/bruxa-matilda", titulo: "O Feitiço da Bruxa Matilda", texto: "Caça ao tesouro de Halloween pronta para imprimir: pistas pela casa, código secreto e uma poção que espuma no final. Gratuita." },
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
  {
    slug: "natal",
    titulo: "Natal",
    quando: "25 de dezembro",
    emoji: "🎄",
    resumo: "O nascimento de Jesus, o presépio, a Folia de Reis e o Papai Noel: livros, filmes, música, receitas e atividades para o mês de dezembro.",
    intro: [
      "O Natal celebra o nascimento de Jesus, contado na Bíblia nos evangelhos de Lucas e de Mateus: a viagem de Maria e José a Belém, a manjedoura, os pastores e os magos que seguiram a estrela.",
      "Muitas tradições vieram depois. O presépio foi montado pela primeira vez por São Francisco de Assis, em 1223. O Papai Noel nasceu da história de São Nicolau, um bispo que ajudava em segredo as crianças pobres. No Brasil, a Folia de Reis sai às ruas até 6 de janeiro, com música, bandeiras e visitas às casas.",
      "E uma curiosidade para explorar com as crianças: aqui o Natal é no verão, enquanto no hemisfério norte é inverno, com neve. Por que será?",
    ],
    livros: [
      ["A história do Natal, em Lucas 2 e Mateus 2", "Leia numa Bíblia infantil ilustrada e depois montem juntos o presépio."],
      ["“Como o Grinch Roubou o Natal!” — Dr. Seuss", "Em rima: o Natal não está nos presentes nem nos enfeites."],
      ["“O Expresso Polar” — Chris Van Allsburg", "Um trem misterioso na noite de Natal e o som de um sininho que só alguns conseguem ouvir."],
      ["“O Pinheiro” — Hans Christian Andersen", "O pinheirinho que vivia com pressa de crescer; boa conversa sobre aproveitar o presente."],
      ["“O Quebra-Nozes” — E. T. A. Hoffmann (adaptação)", "O boneco que ganha vida na noite de Natal; ótimo para ouvir a música de Tchaikovsky depois."],
      ["“Um Conto de Natal” — Charles Dickens (adaptação)", "Scrooge e os três fantasmas do Natal; melhor a partir de 8 anos, lido junto."],
    ],
    blocos: [
      {
        nome: "Filmes",
        itens: [
          ["O Expresso Polar (2004)", "a viagem do livro, em animação"],
          ["O Grinch (2018)", "a versão animada da história do Dr. Seuss"],
          ["Klaus (2019)", "uma origem inventada e muito bonita do Papai Noel"],
          ["Operação Presente (2011)", "a família Noel e um presente que ficou para trás"],
          ["O Quebra-Nozes", "uma gravação do balé, para assistir em família"],
        ],
      },
      {
        nome: "Música",
        itens: [
          ["Suíte O Quebra-Nozes, de Tchaikovsky", "a Dança da Fada Açucarada e a Valsa das Flores; adivinhar qual instrumento está tocando"],
          ["Noite Feliz", "composta na Áustria em 1818; cantar junto e conhecer a história da canção"],
          ["Folia de Reis", "procurar vídeos de grupos brasileiros e reparar nos instrumentos e nas roupas"],
        ],
      },
      {
        nome: "Mão na massa e ciência",
        itens: [
          ["Presépio de sucata ou de argila", "cada personagem feito pela criança, contando quem é"],
          ["Floco de neve de papel", "dobrar e recortar: os seis lados iguais mostram a simetria"],
          ["Por que aqui é verão no Natal?", "com uma lanterna e uma bola inclinada, mostrar o Sol iluminando mais o sul em dezembro (combina com a apostila Olhar o Céu)"],
          ["Cristais de açúcar", "barbante numa calda bem doce; observar os cristais crescendo por uma semana"],
          ["Biscoitos de Natal", "medir os ingredientes e cortar formas; dá para fazer meia receita"],
        ],
      },
      {
        nome: "Português",
        itens: [
          ["Carta ou cartão de Natal", "para um avô, uma madrinha, a professora: quem a criança quiser agradecer"],
          ["Acróstico NATAL", "uma palavra ou frase para cada letra"],
          ["Recontar o Natal", "a criança conta a história com os bonecos do presépio"],
        ],
      },
      {
        nome: "Matemática",
        itens: [
          ["Calendário do Advento", "contagem regressiva até 25/12, com uma pequena tarefa ou gentileza por dia"],
          ["Padrões na árvore", "montar sequências de enfeites: vermelho, dourado, vermelho…"],
          ["Receita dobrada ou pela metade", "recalcular os ingredientes dos biscoitos"],
        ],
      },
      {
        nome: "Jogos e brincadeiras",
        itens: [
          ["Amigo secreto da família", "sortear, guardar segredo e pensar num presente feito à mão"],
          ["Bingo de Natal", "cartelas com desenhos: estrela, sino, presépio, pinheiro"],
          ["Jogo da memória natalino", "versão caseira, com os pares desenhados pela criança"],
        ],
      },
      {
        nome: "Para conversar",
        itens: [
          ["O que o Natal significa para a nossa família?"],
          ["Que presente a gente pode dar que não se compra?"],
          ["Como será o Natal em um país onde é inverno e neva?"],
        ],
      },
    ],
    cuidado: "Forno, fogão e calda quente ficam sempre com um adulto. Confira a classificação indicativa dos filmes antes de assistir.",
  },
];

export const tematica = (slug: string) => TEMATICAS.find((t) => t.slug === slug);
