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
  arquivo?: string; // apostila liberada de graça: caminho do PDF em /public (o botão vira "Baixar grátis")
  nomeArquivo?: string;
};

export const APOSTILAS: Apostila[] = [
  {
    slug: "brincar-com-as-palavras",
    titulo: "Brincar com as Palavras",
    subtitulo: "Rimas, sílabas e sons antes de ler",
    materia: "por", ano: "1", tema: 1, nomeTema: "Consciência fonológica: rimas e sílabas",
    paginas: 27, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/Kbr9HfO",
    resumo: "Antes de aprender as letras, a criança precisa perceber que as palavras são feitas de sons. Aqui ela escuta, bate palmas nas sílabas, acha rimas, recita parlendas e brinca de trocar sons. Quase tudo é falado: ainda não precisa ler nem escrever.",
    dentro: ["6 partes com explicação para a família e exercícios ilustrados", "Parlendas e trava-línguas da tradição oral", "5 revisões diárias em que a ajuda vai diminuindo", "Trilha das palmas (jogo de tabuleiro), bingo e memória das rimas", "Atividades mão na massa, certificado e gabarito"],
    amostras: ["Sílabas: uma palma para cada pedaço", "Rimas: o fim que soa igual", "Revisão diária", "Trilha das palmas"],
  },
  {
    slug: "ouvir-as-letras",
    titulo: "Ouvir as Letras",
    subtitulo: "O alfabeto e o som de cada letra",
    materia: "por", ano: "1", tema: 2, nomeTema: "Letras e seus sons",
    paginas: 32, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/gEgqGsT",
    resumo: "O alfabeto ilustrado, maiúsculas e minúsculas, vogais, consoantes, o som do começo das palavras e as letras curiosas. A criança ouve, fala, vê e traça cada letra, com páginas de traçado de A a Z.",
    dentro: ["Alfabeto ilustrado com 26 figuras", "Traçado de todas as letras, com ponto de início e ordem dos traços", "Cuidado especial com b, d, p e q", "5 revisões diárias, caça-letra, bingo, memória e alfabeto móvel para recortar", "Certificado e gabarito"],
    amostras: ["O alfabeto ilustrado", "As vogais", "Traçar letras", "Revisão diária"],
  },
  {
    slug: "escrever-o-nome",
    titulo: "Escrever o Nome",
    subtitulo: "O próprio nome, as letras que ele tem e as primeiras palavras",
    materia: "por", ano: "1", tema: 3, nomeTema: "Escrita do nome e primeiras palavras",
    paginas: 32, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/escrever-o-nome.pdf", nomeArquivo: "Escrever-o-Nome-Atlas-do-Aprender.pdf",
    resumo: "O nome é a primeira palavra que a criança aprende a escrever de verdade, e a porta para todas as outras. Aqui ela escreve o próprio nome sem copiar, descobre quantas e quais letras ele tem, usa os nomes da família como modelo e começa a escrever palavras simples ouvindo os sons, até fazer listas, etiquetas e bilhetes. Com uma página para o adulto sobre como a criança pensa a escrita.",
    dentro: ["6 partes com explicação e exercícios, tudo em letra de forma maiúscula", "Para o adulto: as fases da escrita e um ditado para ver por onde começar", "Erros que são pistas, exercícios guiados e 5 treinos diários", "Cartões de dobrar, alfabeto móvel para recortar, forca da flor e stop dos nomes", "Mão na massa, certificado e gabarito"],
    amostras: ["Meu nome tem letras", "Quantas e quais letras?", "Escrever do meu jeito", "Cartões de dobrar"],
  },
  {
    slug: "ler-o-que-eu-sei",
    titulo: "Ler o que Eu Sei",
    subtitulo: "Parlendas, cantigas e listas para as primeiras leituras",
    materia: "por", ano: "1", tema: 4, nomeTema: "Primeiras leituras: parlendas, cantigas e listas",
    paginas: 32, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/ler-o-que-eu-sei.pdf", nomeArquivo: "Ler-o-que-Eu-Sei-Atlas-do-Aprender.pdf",
    resumo: "A criança já sabe de cor muitas parlendas e cantigas. Aqui ela usa isso para dar o grande passo: descobrir onde está escrito o que ela fala. Primeiro ela lê apontando com o dedo um texto que sabe de memória; depois acha palavras pelas pistas da primeira letra e do tamanho, ordena versos, usa as rimas para conferir e chega a ler sozinha listas e frases curtas. Com uma página para o adulto sobre como a criança lê antes de ler.",
    dentro: ["6 partes com explicação e exercícios, com Batatinha quando nasce, Ciranda, O sapo não lava o pé e outras cantigas e parlendas", "Para o adulto: como a criança lê antes de ler e uma leitura inicial para ver por onde começar", "Erros que são pistas, exercícios guiados e 5 treinos diários", "Dominó de palavra e figura, memória e tiras de versos para recortar", "Varal de poesias, molde de livrinho dobrado, certificado e gabarito"],
    amostras: ["Ler o que eu sei de cor", "Versos em ordem", "Listas", "Dominó de palavra e figura"],
  },
  {
    slug: "contar-ate-cem",
    titulo: "Contar até Cem",
    subtitulo: "Contagem, dezenas e o quadro dos 100",
    materia: "mat", ano: "1", tema: 1, nomeTema: "Contagem e números até 100",
    paginas: 31, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/PGrdZhN",
    resumo: "Contar de verdade não é falar os números de cor. A criança aprende as regras da contagem, escreve os números, compara quantidades, forma dezenas com palitos e material dourado, conta em saltos e descobre os padrões do quadro dos 100.",
    dentro: ["7 partes com explicação e exercícios", "Quadro de dez, reta numérica e material dourado desenhados", "Traçado dos números de 0 a 9", "5 revisões diárias, bingo, memória e mercadinho com dinheiro de brincadeira", "Certificado e gabarito"],
    amostras: ["Os números de 0 a 10", "Dezenas e unidades", "O quadro dos 100", "Revisão diária"],
  },  {
    slug: "separar-e-comparar",
    titulo: "Separar e Comparar",
    subtitulo: "Agrupar, comparar quantidades e colocar em ordem",
    materia: "mat", ano: "1", tema: 2, nomeTema: "Comparar, classificar e ordenar",
    paginas: 30, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/separar-e-comparar.pdf", nomeArquivo: "Separar-e-Comparar-Atlas-do-Aprender.pdf",
    resumo: "Antes de contar bem, a criança precisa aprender a olhar com atenção. Aqui ela separa objetos pela cor, pela forma e pelo tamanho, descobre a regra de um grupo e acha o intruso, compara quantidades ligando um a um (mais, menos ou igual), coloca coisas em ordem do menor para o maior e descobre quantos faltam para ficar igual. Sempre começando com objetos de verdade.",
    dentro: ["6 partes com explicação e exercícios: cor, forma e tamanho, a regra e o intruso, mais, menos ou igual, ordenar e quantos a mais", "Para o adulto: o que a criança aprende e uma observação inicial", "Erros que são pistas, exercícios guiados e 5 treinos diários", "Leitura A gaveta bagunçada, 24 peças para separar e o jogo Batalha dos números", "Arrumar a casa por critério, certificado e gabarito"],
    amostras: ["Separar por cor", "Mais, menos ou igual", "Colocar em ordem", "Batalha dos números"],
  },

  {
    slug: "juntar-e-tirar",
    titulo: "Juntar e Tirar",
    subtitulo: "Adição e subtração com objetos, desenhos e a reta numérica",
    materia: "mat", ano: "1", tema: 3, nomeTema: "Adição e subtração com material",
    paginas: 30, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/juntar-e-tirar.pdf", nomeArquivo: "Juntar-e-Tirar-Atlas-do-Aprender.pdf",
    resumo: "Somar e subtrair começa com as mãos. Aqui a criança vive as quatro situações das contas: juntar dois grupos, acrescentar, tirar e comparar. Aprende a guardar o número maior na cabeça e contar só o resto, pula na reta numérica para a frente e para trás, conhece os amigos do 10 e descobre, lendo um problema, se a conta é de mais ou de menos.",
    dentro: ["6 partes com explicação e exercícios: juntar, acrescentar, tirar, comparar, os amigos do 10 e problemas", "Para o adulto: o que a criança aprende e uma observação inicial com tampinhas", "Erros que são pistas, exercícios guiados e 5 treinos diários", "Leitura O piquenique da Formiga Fifi, quadros de dez, cartas e reta numérica para recortar", "Jogo Corrida até 20, mão na massa (boliche de garrafas, reta no chão, mercadinho), certificado e gabarito"],
    amostras: ["Juntar", "Os amigos do 10", "Problemas: que conta eu faço?", "Corrida até 20"],
  },

  {
    slug: "medir-o-mundo",
    titulo: "Medir o Mundo",
    subtitulo: "Medidas e conversões sem travar",
    materia: "mat", ano: "3", tema: 3, nomeTema: "Medidas: comprimento, massa e capacidade",
    paginas: 32, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/hj87on5",
    resumo: "Comprimento, massa e capacidade, com foco nas conversões, onde muita criança trava. A explicação começa pelo que ela já conhece, o dinheiro: se 1 real vale 100 centavos, 1 metro vale 100 centímetros.",
    dentro: ["Explicação passo a passo de cada medida", "Quadro das trocas para as conversões", "5 treinos diários em que a ajuda vai diminuindo", "Jogo da memória das medidas e mão na massa na cozinha", "Certificado e gabarito"],
    amostras: ["Conversões", "Comprimento", "Treino diário", "Jogo da memória"],
  },
  {
    slug: "ouvir-o-mundo",
    titulo: "Ouvir o Mundo",
    subtitulo: "Som e vibração: de onde vem o som e como ele viaja",
    materia: "cie", ano: "3", tema: 2, nomeTema: "Som e vibração",
    paginas: 31, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/ouvir-o-mundo.pdf", nomeArquivo: "Ouvir-o-Mundo-Atlas-do-Aprender.pdf",
    resumo: "Com experimentos simples, feitos com régua, elástico, arroz, copos e latas, a criança descobre que todo som nasce de uma vibração e que ele viaja pelo ar, pela água e pelos sólidos. Depois investiga o que deixa um som grave ou agudo, forte ou fraco, acompanha a viagem do som até o cérebro e aprende a cuidar da audição. Sempre do jeito de um cientista: pergunta, palpite, teste e conclusão.",
    dentro: ["6 partes com explicação, experimentos e exercícios: vibração, o som viaja, grave e agudo, forte e fraco, como a gente ouve e cuidar dos ouvidos", "Como um cientista investiga, instrumentos musicais e ideias erradas sobre o som", "Exercícios guiados, 5 treinos diários e a leitura O telefone de lata do vovô", "Bingo dos sons para jogar em casa", "Telefone de lata, xilofone de copos, violão de caixa, tambor e chocalho, certificado e gabarito"],
    amostras: ["Todo som é uma vibração", "Grave e agudo", "Como a gente ouve", "Telefone de lata"],
  },
  {
    slug: "olhar-o-ceu",
    titulo: "Olhar o Céu",
    subtitulo: "O Sol, a Lua, as estrelas e as constelações",
    materia: "cie", ano: "3", tema: 4, nomeTema: "O céu e as estrelas",
    paginas: 31, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/3L5H7BS",
    resumo: "Observar, registrar e entender o céu: o caminho do Sol e as sombras, o dia e a noite, as fases da Lua, as estrelas, o Cruzeiro do Sul e as Três Marias. Com diário da Lua de 15 noites e experimentos com lanterna e biscoito.",
    dentro: ["6 partes com observação, explicação e experimentos", "Diário da Lua para 15 noites", "5 revisões diárias", "Caça-palavras, jogo da memória e constelação na lata", "Certificado e gabarito"],
    amostras: ["As fases da Lua", "Estrelas", "Revisão diária", "Jogo da memória do céu"],
  },
  {
    slug: "nomear-e-descrever",
    titulo: "Nomear e Descrever",
    subtitulo: "Substantivos e adjetivos para dar nome e cor às coisas",
    materia: "por", ano: "3", tema: 5, nomeTema: "Substantivos e adjetivos",
    paginas: 32, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/CEiCquy",
    resumo: "Tudo tem um nome, e cada coisa tem um jeito. A criança descobre o substantivo (comum, próprio, singular, plural, masculino e feminino), o adjetivo e a concordância entre os dois, e termina usando tudo para descrever um personagem. Com leitura original, jogo de adivinhação e caixa misteriosa.",
    dentro: ["6 partes com explicação e exercícios", "Erros comuns e exercícios guiados", "Treino diário de 5 dias", "Jogo “Quem sou eu?”, fichas para classificar e mão na massa", "Certificado e gabarito"],
    amostras: ["Tudo tem um nome", "O adjetivo", "Treino diário", "Jogo Quem sou eu?"],
  },
  {
    slug: "textos-do-dia-a-dia",
    titulo: "Textos do Dia a Dia",
    subtitulo: "Notícia, carta e receita: para que serve e como se organiza cada gênero",
    materia: "por", ano: "4", tema: 1, nomeTema: "Gêneros do cotidiano: notícia, carta e receita",
    paginas: 34, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/textos-do-dia-a-dia.pdf", nomeArquivo: "Textos-do-Dia-a-Dia-Atlas-do-Aprender.pdf",
    resumo: "Cada texto nasce para resolver uma necessidade e, por isso, tem um formato. A criança descobre o que é gênero textual e conhece de perto três textos da vida real: a notícia (manchete, lide, fato e opinião), a carta (partes, linguagem formal e informal, envelope) e a receita (ingredientes, passos numerados e verbos que dão ordem). Compara os três e termina escrevendo uma notícia, uma carta e uma receita da própria família.",
    dentro: ["5 partes com explicação, exemplos comentados e exercícios", "Notícia, carta e receita anotadas parte por parte", "Produção de texto: minha notícia, minha carta e minha receita", "Treino diário de 5 dias, leitura do jornal da família e jogo Que gênero é?", "Mão na massa, certificado e gabarito"],
    amostras: ["Cada texto tem um jeito", "Uma notícia por dentro", "Uma receita por dentro", "Treino diário"],
  },
  {
    slug: "detetives-de-dados",
    titulo: "Detetives de Dados",
    subtitulo: "Pesquisar, organizar em tabela e fazer gráfico de barras",
    materia: "mat", ano: "3", tema: 4, nomeTema: "Tabelas e gráficos",
    paginas: 31, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/detetives-de-dados.pdf", nomeArquivo: "Detetives-de-Dados-Atlas-do-Aprender.pdf",
    resumo: "A criança faz o que um pesquisador faz: pergunta, conta as respostas com risquinhos de 5 em 5, organiza tudo numa tabela e mostra num gráfico de barras desenhado na malha. Depois aprende a ler gráficos e tabelas feitos por outras pessoas, incluindo pictogramas, gráficos de 2 em 2 e tabelas de dupla entrada, e a resolver problemas com esses dados.",
    dentro: ["6 partes com explicação e exercícios: pesquisa, tabela, ler gráfico, fazer gráfico, pictograma e escala, dupla entrada", "Gráficos e tabelas do dia a dia, erros comuns e problemas", "5 treinos diários e a leitura A horta da escola", "Malha quadriculada para gráficos e o jogo Corrida dos dados", "5 pesquisas de verdade para fazer em casa, certificado e gabarito"],
    amostras: ["Perguntar e contar", "Ler um gráfico de barras", "Pictograma e escala", "Jogo: corrida dos dados"],
  },
  {
    slug: "pedaco-por-pedaco",
    titulo: "Pedaço por Pedaço",
    subtitulo: "Metade, terço, quarto e as frações do dia a dia",
    materia: "mat", ano: "3", tema: 5, nomeTema: "Frações do dia a dia",
    paginas: 32, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/02JsG1b",
    resumo: "Repartir de um jeito justo é o começo das frações. A criança descobre as partes iguais, a metade, o terço, o quarto, o quinto e o décimo, compara pedaços e reparte quantidades, até usar meia dúzia, meio litro e meia hora no dia a dia. Com barra de frações para recortar, dominó e receitas pela metade.",
    dentro: ["6 partes com explicação e exercícios", "Frações no dia a dia, erros comuns e exercícios guiados", "Treino diário de 5 dias", "Barra e discos de frações para recortar, dominó de frações e mão na massa", "Certificado e gabarito"],
    amostras: ["A metade", "Qual pedaço é maior?", "Treino diário", "Dominó de frações"],
  },
  {
    slug: "ontem-hoje-e-amanha",
    titulo: "Ontem, Hoje e Amanhã",
    subtitulo: "Verbos e tempos verbais para contar o que foi, o que é e o que será",
    materia: "por", ano: "4", tema: 2, nomeTema: "Verbos e tempos verbais",
    paginas: 35, preco: "Grátis", checkout: "",
    arquivo: "/apostilas-pdf/ontem-hoje-e-amanha.pdf", nomeArquivo: "Ontem-Hoje-e-Amanha-Atlas-do-Aprender.pdf",
    resumo: "O verbo é o coração da frase. A criança descobre o que é verbo (ação, estado e fenômeno da natureza), acha o infinitivo e os grupos -AR, -ER e -IR, faz o verbo combinar com quem pratica a ação e usa passado, presente e futuro, incluindo a diferença entre “brinquei” e “brincava”, os verbos irregulares e o eterno -AM ou -ÃO. No fim, escreve textos sem misturar os tempos. Com cartas de mímica e dados do tempo para montar.",
    dentro: ["8 partes com explicação e exercícios", "Tabelas de conjugação, verbos irregulares e o truque do -AM e -ÃO", "Erros comuns, exercícios guiados e 5 treinos diários", "Leitura original, cartas de mímica e dados do tempo para recortar", "Mão na massa, certificado e gabarito"],
    amostras: ["O que é verbo", "Ontem, hoje e amanhã", "Cantaram ou cantarão?", "Cartas de mímica"],
  },
];

export const apostilaDoTema = (m: Materia, ano: string, tema: number) => APOSTILAS.find((a) => a.materia === m && a.ano === ano && a.tema === tema);
export const anoNome = (ano: string) => (ano === "1" ? "Alfabetização" : `${ano}º ano`);

/** Kits temáticos pagos (datas especiais), sem ligação com um tema das trilhas. Aparecem em "Gerais". */
export type Kit = {
  slug: string;
  titulo: string;
  subtitulo: string;
  paginas: number;
  preco: string;
  checkout: string; // vazio = "Em breve"
  resumo: string;
  dentro: string[];
  amostras: string[];
  publico: string;
  selo: string; // ex.: "Natal"
  comoUsar: string[];
};

export const KITS: Kit[] = [
  {
    slug: "duende-tico",
    titulo: "A Grande Missão do Duende Tico",
    subtitulo: "Calendário do Advento e caça ao presente de Natal",
    paginas: 31,
    preco: "R$ 19,90",
    checkout: "https://pay.kiwify.com.br/AjOvx3A",
    resumo: "De 1º a 24 de dezembro, o Duende Tico deixa um cartão por dia com uma atividade curta e uma letra. As letras formam a Frase Secreta. Na noite de Natal, ele esconde um presente pela casa e esquece onde: as crianças seguem 6 pistas, juntam os 4 números do cadeado e dizem a frase para abrir a caixa. No caminho, leem, contam, fazem experimentos, criam e praticam gentileza.",
    dentro: [
      "24 cartões do Advento, com atividades de 10 a 20 minutos de Português, Matemática, Ciências, arte, jogo e gentileza",
      "Guia dos 24 dias para a família, com o que fazer, o que precisa e a letra de cada dia",
      "Painel da Frase Secreta e folhas dos dias (corrente do Natal, problemas, rimas e entrevista)",
      "Caça ao presente com 6 estações passo a passo: biscoitos, gelo, sinos, equilíbrio, código e pegadas de rena",
      "Cartas do Tico, 6 pistas, tabela secreta, código do cadeado, faixa, certificados e bilhete final",
    ],
    amostras: ["Os 24 dias numa página", "Cartões do Advento", "O painel da Frase Secreta", "Cartões de pista da caça"],
    publico: "6 a 10 anos",
    selo: "Natal",
    comoUsar: [
      "Imprima no fim de novembro, recorte os cartões e esconda um por dia (varal de envelopes, saquinhos ou uma caixa). Cada atividade leva de 10 a 20 minutos e usa coisas de casa.",
      "Na véspera de Natal, siga o guia da caça: em cerca de 1 hora, as crianças encontram o presente. O único item que talvez precise comprar é um cadeado de números.",
    ],
  },
];

/** Materiais gratuitos que aparecem na vitrine, antes das apostilas pagas. */
export type Gratuito = {
  slug: string;
  titulo: string;
  subtitulo: string;
  paginas: number;
  arquivo: string; // caminho do PDF em /public
  nomeArquivo: string;
  resumo: string;
  dentro: string[];
  amostras: string[];
  publico?: string; // etiqueta de público (padrão: "Todas as séries")
  comoUsar?: string[]; // parágrafos de "Como usar" (padrão: texto do Caderno de Conversa)
  // Treinos diários: material ligado a um tema da trilha e a uma apostila (aparece no filtro da matéria e na página do tema)
  materia?: Materia;
  ano?: string;
  tema?: number;
  apostila?: string;
  foraDoAr?: boolean; // guardado aqui, mas não aparece no site (ex.: material de uma data que já passou)
};

const TODOS_GRATUITOS: Gratuito[] = [
  {
    slug: "treino-t-ou-d",
    titulo: "Treino Diário · T ou D?",
    subtitulo: "30 folhas para parar de trocar o T pelo D, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-t-ou-d.pdf",
    nomeArquivo: "Treino-Diario-T-ou-D-Atlas-do-Aprender.pdf",
    resumo: "Para a criança que escreve “pado” no lugar de “pato” ou “tente” no lugar de “dente”. T e D são feitos com a boca na mesma posição: só muda a voz. O treino ensina a sentir a diferença com a mão na garganta, depois a ouvir com pares mínimos (gato e gado, tia e dia, roda e rota) e por fim a escrever certo em palavras, frases e numa pequena história.",
    dentro: ["30 folhas em 3 níveis, de 3 a 10 minutos cada", "O truque da mão na garganta: D vibra, T só sopra", "Pares mínimos para ouvir, ler e escrever (gato e gado, tia e dia, roda e rota)", "T e D no começo e no meio da palavra, sílabas, ditados e frases malucas", "Registro de progresso, certificado e gabarito"],
    amostras: ["Mão na garganta", "O adulto diz, você circula", "Uma letra muda tudo", "Frases malucas"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos. Antes de começar, a criança põe a mão no pescoço e fala “ddddd” (vibra) e “ttttt” (não vibra, só sai ar). Use esse truque sempre que ela ficar em dúvida.",
      "Nas folhas de ouvir e de ditado, fale normalmente, sem exagerar o som. Passe para a próxima folha quando ela fizer com no máximo 1 erro. Se a troca também aparece na fala ou continua forte depois do 2º ano, vale procurar um fonoaudiólogo.",
    ],
    materia: "por", ano: "1", tema: 2,
  },
  {
    slug: "treino-ouvir-as-letras",
    titulo: "Treino Diário · Ouvir as Letras",
    subtitulo: "30 folhas para conhecer o alfabeto e o som das letras, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-ouvir-as-letras.pdf",
    nomeArquivo: "Treino-Diario-Ouvir-as-Letras-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa traçando as vogais e as consoantes e caçando letras, passa por ligar maiúscula e minúscula, achar a primeira letra de cada figura e a ordem do alfabeto, e termina completando, contando e copiando palavras.",
    dentro: ["30 folhas em 3 níveis, de 5 a 10 minutos cada", "Traçado de todas as letras, maiúsculas e minúsculas", "Som inicial com figuras, para quem ainda não lê", "Ordem do alfabeto, letras parecidas (b, d, p, q) e primeiras palavras", "Registro de progresso, certificado e gabarito"],
    amostras: ["Com que vogal começa?", "As letras B, C e D", "Que letra começa?", "Complete a palavra"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos. O adulto lê a instrução e, nas folhas com figuras, diz o nome de cada uma (está escrito pequeno embaixo). A criança responde circulando, ligando, traçando ou escrevendo.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Se não deu, repita a mesma folha em outro dia: é assim que a letra e o som ficam automáticos.",
    ],
    materia: "por", ano: "1", tema: 2, apostila: "ouvir-as-letras",
  },
  {
    slug: "treino-escrever-o-nome",
    titulo: "Treino Diário · Escrever o Nome",
    subtitulo: "30 folhas para escrever o nome e as primeiras palavras, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-escrever-o-nome.pdf",
    nomeArquivo: "Treino-Diario-Escrever-o-Nome-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa no próprio nome (escrever com e sem modelo, achar nomes iguais, contar e comparar letras), passa por ouvir os pedaços e os sons das palavras e completar o que falta, e termina escrevendo de verdade: palavras sem apoio, ditado, lista, etiquetas, frases e um bilhete.",
    dentro: ["30 folhas em 3 níveis, de 5 a 10 minutos cada", "O próprio nome e os nomes da família", "Pedaços, vogais, consoantes e sílabas que faltam, com figuras", "Ditado, lista, etiquetas, frases e bilhete", "Registro de progresso, certificado e gabarito"],
    amostras: ["Ache o nome igual", "Quantos pedaços?", "Escreva a palavra", "Complete a frase"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos. O adulto lê a instrução e, nas folhas com figuras, diz o nome de cada uma (está escrito pequeno embaixo). Deixe o nome da criança escrito num papel perto da mesa, como modelo.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Nas folhas de escrita livre (ditado, lista, bilhete), não conte erros de ortografia: observe se ela já escreve todos os sons e mostre primeiro o que ela acertou.",
    ],
    materia: "por", ano: "1", tema: 3, apostila: "escrever-o-nome",
  },
  {
    slug: "treino-ler-o-que-eu-sei",
    titulo: "Treino Diário · Ler o que Eu Sei",
    subtitulo: "30 folhas para as primeiras leituras, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-ler-o-que-eu-sei.pdf",
    nomeArquivo: "Treino-Diario-Ler-o-que-Eu-Sei-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa lendo com o dedo parlendas e cantigas que a criança sabe de cor (contar as palavras dos versos, achar palavras iguais, completar versos), passa pelas pistas para ler (a primeira letra, palavras parecidas, rimas, versos em ordem e listas) e termina lendo sozinha frases, perguntas e textos curtos novos.",
    dentro: ["30 folhas em 3 níveis, de 5 a 10 minutos cada", "Parlendas e cantigas para ler apontando", "Palavras parecidas, rimas, versos em ordem e listas", "Frases, perguntas de sim ou não e dois textos novos", "Registro de progresso, certificado e gabarito"],
    amostras: ["Batatinha com o dedo", "Qual palavra está escrita?", "Versos em ordem: Borboletinha", "A pipa do Leo"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos. Quando a folha tiver parlenda ou cantiga, recitem ou cantem juntos antes, e o dedo vai sempre junto com a voz. Nas folhas com figuras, o nome de cada uma está escrito pequeno embaixo.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Ao corrigir, pergunte “como você descobriu?” e elogie a pista que ela usou: a primeira letra, o tamanho ou a rima.",
    ],
    materia: "por", ano: "1", tema: 4, apostila: "ler-o-que-eu-sei",
  },
  {
    slug: "treino-brincar-com-as-palavras",
    titulo: "Treino Diário · Brincar com as Palavras",
    subtitulo: "30 folhas de rimas, sílabas e sons, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-brincar-com-as-palavras.pdf",
    nomeArquivo: "Treino-Diario-Brincar-com-as-Palavras-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtinhas para treinar o ouvido antes de ler: o adulto lê a instrução e diz o nome das figuras, e a criança responde circulando, pintando ou ligando. Começa nas rimas, passa por bater palmas nas sílabas e juntar pedaços, e termina no primeiro som das palavras, em trava-línguas e na troca de sons.",
    dentro: ["30 folhas em 3 níveis, de 3 a 7 minutos cada", "Tudo com figuras: não precisa saber ler", "Rimas, sílabas, primeiro som e palavras na frase", "Jogo da memória das rimas para recortar", "Registro de progresso, certificado e gabarito"],
    amostras: ["O que rima?", "Uma ou duas palmas?", "O primeiro som", "Jogo da memória das rimas"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 3 a 7 minutos. O adulto lê a instrução e diz o nome de cada figura (está escrito pequeno embaixo dela); a criança responde falando, circulando, pintando ou ligando.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Se não deu, repita a mesma folha em outro dia: é um treino do ouvido, e cada criança tem o seu tempo.",
    ],
    materia: "por", ano: "1", tema: 1, apostila: "brincar-com-as-palavras",
  },
  {
    slug: "treino-nomear-e-descrever",
    titulo: "Treino Diário · Nomear e Descrever",
    subtitulo: "30 folhas de substantivos e adjetivos, uma por dia",
    paginas: 36,
    arquivo: "/treinos/treino-nomear-e-descrever.pdf",
    nomeArquivo: "Treino-Diario-Nomear-e-Descrever-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com tempo-meta e correção até acertar tudo. Começa achando substantivos e usando a letra maiúscula, treina o plural e o feminino de cada tipo de palavra, uma regra por folha, e termina com adjetivos, concordância e a descrição de um personagem.",
    dentro: ["30 folhas em 3 níveis, cada uma com tempo-meta", "Comum e próprio, maiúscula e coletivos", "Plural de cada tipo de palavra e feminino, uma regra por folha", "Adjetivos, contrários, concordância e descrição", "Registro de progresso, certificado e gabarito"],
    amostras: ["Comum ou próprio?", "Plural das palavras em -ão", "O adjetivo acompanha", "Descreva um personagem"],
    publico: "3º ano",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. A criança anota a hora de início e de fim; o adulto corrige com o gabarito e ela refaz o que errou até a folha ficar toda certa.",
      "Só passe para a próxima folha quando ela fizer dentro do tempo-meta e com no máximo 1 erro. Se não deu, imprima a mesma folha e repita no dia seguinte: é assim que a regra fica automática.",
    ],
    materia: "por", ano: "3", tema: 5, apostila: "nomear-e-descrever",
  },
  {
    slug: "treino-contar-ate-cem",
    titulo: "Treino Diário · Contar até Cem",
    subtitulo: "30 folhas de exercícios em pequenos passos, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-contar-ate-cem.pdf",
    nomeArquivo: "Treino-Diario-Contar-ate-Cem-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com tempo-meta e correção até acertar tudo. A ajuda vai diminuindo em passos bem pequenos: contar e escrever até 30, completar o Quadro dos 100, contar de 2 em 2, de 5 em 5 e de 10 em 10, comparar e separar dezenas e unidades.",
    dentro: ["30 folhas em 3 níveis, cada uma com tempo-meta", "Exemplo no topo sempre que o exercício é novo", "Quadro dos 100 com cada vez menos ajuda", "Registro de progresso e certificado", "Gabarito completo"],
    amostras: ["Quadros de dez", "Quadro dos 100", "Contar de 5 em 5", "Registro de progresso"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. A criança anota a hora de início e de fim; o adulto corrige com o gabarito e ela refaz o que errou até a folha ficar toda certa.",
      "Só passe para a próxima folha quando ela fizer dentro do tempo-meta e com no máximo 1 erro. Se não deu, imprima a mesma folha e repita no dia seguinte: é assim que a matéria fica automática.",
    ],
    materia: "mat", ano: "1", tema: 1, apostila: "contar-ate-cem",
  },
  {
    slug: "treino-textos-do-dia-a-dia",
    titulo: "Treino Diário · Textos do Dia a Dia",
    subtitulo: "30 folhas de notícia, carta e receita, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-textos-do-dia-a-dia.pdf",
    nomeArquivo: "Treino-Diario-Textos-do-Dia-a-Dia-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa reconhecendo o gênero, a função e as partes de cada texto (fato e opinião, formal e informal, jeito de receita), passa por ler e analisar notícias, cartas, envelopes e receitas de verdade, e termina escrevendo manchetes, lides, cartas, passos de receita e um mini jornal da família.",
    dentro: ["30 folhas em 3 níveis, de 3 a 12 minutos cada", "Reconhecer: gênero, função, partes, fato e opinião, formal e informal", "Ler e analisar: lide, manchete, cartas, envelope, receitas e medidas", "Escrever: manchete, lide, carta, passos de receita e um mini jornal", "Registro de progresso, certificado e gabarito"],
    amostras: ["Que gênero é?", "Fato ou opinião?", "Lendo uma notícia", "Escreva o lide"],
    publico: "4º ano",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. A criança já lê sozinha; o adulto acompanha e corrige junto, com o gabarito.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro. No nível C (escrever), há mais de uma resposta certa: confira se o texto tem as partes do gênero.",
    ],
    materia: "por", ano: "4", tema: 1, apostila: "textos-do-dia-a-dia",
  },
  {
    slug: "treino-separar-e-comparar",
    titulo: "Treino Diário · Separar e Comparar",
    subtitulo: "30 folhas para separar, comparar e ordenar, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-separar-e-comparar.pdf",
    nomeArquivo: "Treino-Diario-Separar-e-Comparar-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa separando por cor, forma e tamanho e achando o intruso, passa por comparar quantidades ligando um a um (mais, menos, igual, quantos a mais) e termina colocando em ordem do menor para o maior, 1º, 2º e 3º, sequências e problemas.",
    dentro: ["30 folhas em 3 níveis, de 3 a 7 minutos cada", "Separar por cor, forma e tamanho e descobrir a regra", "Comparar ligando um a um: mais, menos, igual e quantos a mais", "Ordenar tamanhos, quantidades, posições e números", "Registro de progresso, certificado e gabarito"],
    amostras: ["Conte por cor", "Mais, menos ou igual?", "Desenhe para ficar igual", "Do mais curto para o mais comprido"],
    publico: "Alfabetização",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. Nas folhas de comparar, deixe a criança ligar um a um com o lápis: ela não precisa contar para saber quem tem mais.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Se não deu, faça primeiro com objetos de verdade (tampinhas, botões, lápis) e depois refaça a folha em outro dia.",
    ],
    materia: "mat", ano: "1", tema: 2, apostila: "separar-e-comparar",
  },
  {
    slug: "treino-medir-o-mundo",
    titulo: "Treino Diário · Medir o Mundo",
    subtitulo: "30 folhas de medidas e conversões, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-medir-o-mundo.pdf",
    nomeArquivo: "Treino-Diario-Medir-o-Mundo-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com tempo-meta e correção até acertar tudo. Começa medindo com régua e jarra e escolhendo a unidade, passa pelas conversões (metro e centímetro, quilo e grama, litro e mililitro) e termina em receitas e problemas.",
    dentro: ["30 folhas em 3 níveis, cada uma com tempo-meta", "Réguas em tamanho real para medir e conferir", "Conversões em passos pequenos, a partir de reais e centavos", "Registro de progresso e certificado", "Gabarito completo"],
    amostras: ["Ler a régua", "Ler a jarra medidora", "Metros e centímetros", "Receita pela metade e em dobro"],
    publico: "3º ano",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. A criança anota a hora de início e de fim; o adulto corrige com o gabarito e ela refaz o que errou até a folha ficar toda certa.",
      "Só passe para a próxima folha quando ela fizer dentro do tempo-meta e com no máximo 1 erro. Se não deu, imprima a mesma folha e repita no dia seguinte: é assim que a matéria fica automática.",
    ],
    materia: "mat", ano: "3", tema: 3, apostila: "medir-o-mundo",
  },
  {
    slug: "treino-detetives-de-dados",
    titulo: "Treino Diário · Detetives de Dados",
    subtitulo: "30 folhas de tabelas e gráficos, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-detetives-de-dados.pdf",
    nomeArquivo: "Treino-Diario-Detetives-de-Dados-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com correção até acertar tudo. Começa contando respostas com risquinhos e organizando tabelas, passa por ler e fazer gráficos de barras na malha, gráficos de 2 em 2 e pictogramas, e termina com tabelas de dupla entrada, problemas, uma pesquisa feita pela própria criança e o diário do feijão.",
    dentro: ["30 folhas em 3 níveis, de 5 a 10 minutos cada", "Risquinhos de 5 em 5, tabelas com total e boas perguntas de pesquisa", "Ler e fazer gráficos de barras, gráficos de 2 em 2 e pictogramas", "Dupla entrada, problemas, a minha pesquisa e o diário do feijão", "Registro de progresso, certificado e gabarito"],
    amostras: ["Quantos risquinhos?", "Quanto vale cada barra?", "Pictograma: cada figura vale 5", "Linha com coluna"],
    publico: "3º ano",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos. Para ler um gráfico, use uma régua deitada do topo da barra até os números. Antes de responder, a criança confere o título, a escala e a legenda.",
      "Passe para a próxima folha quando ela fizer com no máximo 1 erro e sem muita ajuda. Quando errar, peça que mostre com o dedo onde leu: quase sempre o erro aparece na hora.",
    ],
    materia: "mat", ano: "3", tema: 4, apostila: "detetives-de-dados",
  },
  {
    slug: "treino-pedaco-por-pedaco",
    titulo: "Treino Diário · Pedaço por Pedaço",
    subtitulo: "30 folhas de frações em pequenos passos, uma por dia",
    paginas: 35,
    arquivo: "/treinos/treino-pedaco-por-pedaco.pdf",
    nomeArquivo: "Treino-Diario-Pedaco-por-Pedaco-Atlas-do-Aprender.pdf",
    resumo: "Folhas curtas para fazer um pouco por dia, com tempo-meta e correção até acertar tudo. Começa nas partes iguais e em ler e pintar frações, passa por comparar e achar frações que valem o mesmo, e termina em fração de quantidade, meio litro, meia hora e problemas.",
    dentro: ["30 folhas em 3 níveis, cada uma com tempo-meta", "Pizzas e barras para ler e pintar frações", "Comparar, ordenar e frações equivalentes", "Relógios, meia dúzia, meio litro e problemas", "Registro de progresso, certificado e gabarito"],
    amostras: ["Que fração está pintada?", "Pedaços do mesmo tamanho", "Terço, quarto e quinto", "Meia hora e quarto de hora"],
    publico: "3º ano",
    comoUsar: [
      "Uma folha por dia, de 5 a 10 minutos, de preferência no mesmo horário. A criança anota a hora de início e de fim; o adulto corrige com o gabarito e ela refaz o que errou até a folha ficar toda certa.",
      "Só passe para a próxima folha quando ela fizer dentro do tempo-meta e com no máximo 1 erro. Se não deu, imprima a mesma folha e repita no dia seguinte: é assim que a matéria fica automática.",
    ],
    materia: "mat", ano: "3", tema: 5, apostila: "pedaco-por-pedaco",
  },
  {
    slug: "olimpiada-gato-de-botas",
    titulo: "Olimpíada de Literatura · O Gato de Botas",
    subtitulo: "Preparação para a Candura 17 (2026), para quem está aprendendo a ler",
    paginas: 20,
    arquivo: "/olimpiadas/gato-de-botas.pdf",
    nomeArquivo: "Gato-de-Botas-Olimpiada-Atlas-do-Aprender.pdf",
    resumo: "Apostila para treinar para a Olimpíada de Literatura com o conto O Gato de Botas, de Charles Perrault. Feita para quem está aprendendo a ler: o adulto lê o conto em partes e a criança responde falando, ligando, circulando ou desenhando. Termina com três simulados no formato da prova. Material independente, sem ligação com a organização da olimpíada.",
    dentro: ["A história em 6 partes, com conversa e atividade", "Personagens, ordem da história e palavras do conto", "Jeito de contar, moral e jogos", "3 simulados no formato da prova e gabarito"],
    amostras: ["A herança", "O banho no rio", "Brincar com o conto", "Simulado 1"],
    publico: "Alfabetização e 1º ano",
    comoUsar: [
      "Um encontro por dia, de 15 a 20 minutos. O adulto lê o trecho do conto e as perguntas; a criança responde do jeito dela. Deixe o conto sempre por perto: na prova, pode consultar.",
      "Nos simulados, faça como na prova: o adulto pode ler o enunciado junto, mas a criança responde sozinha. Confira datas e regras no site oficial da olimpíada.",
    ],
  },
  {
    slug: "olimpiada-enquanto-ana-espera",
    titulo: "Olimpíada de Literatura · Enquanto Ana Espera",
    subtitulo: "Preparação para a Candura 16 (2026), para quem já lê",
    paginas: 20,
    arquivo: "/olimpiadas/enquanto-ana-espera.pdf",
    nomeArquivo: "Enquanto-Ana-Espera-Olimpiada-Atlas-do-Aprender.pdf",
    resumo: "Apostila para treinar para a Olimpíada de Literatura com o livro Enquanto Ana Espera, de Fernanda Witwytzky. Para quem já lê: as quatro visitas de Ana à Grande Árvore, uma por página, com perguntas para responder conferindo no livro, e três simulados de 10 questões no formato da prova. Material independente, sem ligação com a organização da olimpíada.",
    dentro: ["Mapa das quatro visitas e uma página por visita", "Ana e Eliseu, o fruto e o caminho, ordem da história", "Palavras do livro, jeito de contar e reflexão", "3 simulados de 10 questões e gabarito"],
    amostras: ["O mapa das quatro visitas", "A 2ª visita", "Como o livro é contado", "Simulado 1"],
    publico: "1º ao 3º ano",
    comoUsar: [
      "Primeiro a criança lê o livro inteiro, sem pressa. Depois, uma página da apostila por dia, sempre com o livro aberto ao lado: os resumos ajudam a lembrar, mas as respostas devem ser conferidas no livro.",
      "Nos simulados, marque o tempo e deixe a criança responder sozinha, como na prova. Confira datas e regras no site oficial da olimpíada.",
    ],
  },
  {
    slug: "bruxa-matilda",
    foraDoAr: true, // Halloween: volta em outubro
    titulo: "O Feitiço da Bruxa Matilda",
    subtitulo: "Caça ao tesouro de Halloween para fazer em casa",
    paginas: 22,
    arquivo: "/bruxa-matilda.pdf",
    nomeArquivo: "O-Feitico-da-Bruxa-Matilda-Atlas-do-Aprender.pdf",
    resumo: "A Bruxa Matilda espirrou no meio de um feitiço e trancou os doces da festa num baú. Para abrir, as crianças seguem pistas pela casa e pelo quintal, juntam os 4 ingredientes da Poção do Desencanto e descobrem o código do cadeado. Elas leem, contam, decifram símbolos e trabalham juntas, sem sustos e sem ninguém ser eliminado.",
    dentro: ["Guia da mediadora com materiais, cronograma e 7 estações passo a passo", "Carta da Bruxa e 8 cartões de pista com 1 ou 2 palavras e desenho, para quem está começando a ler", "Morcegos, quebra-cabeça, código de símbolos e molde da mensagem invisível", "Rótulos da poção, ossos, crachás dos papéis e faixa do feitiço", "Grande final com poção que espuma, certificados e bilhete da bruxa"],
    amostras: ["As estações passo a passo", "A carta da Bruxa Matilda", "Cartões de pista", "O código dos símbolos"],
    publico: "6 a 10 anos",
    comoUsar: [
      "Imprima na véspera, recorte e esconda as pistas da última para a primeira. A brincadeira dura cerca de 1 hora, para 3 a 6 crianças, e quase tudo sai de casa: o único item que talvez precise comprar é um cadeado de 3 números.",
      "Sem quintal, dá para montar a teia num corredor e o cemitério de ossos numa bacia.",
    ],
  },
  {
    slug: "caderno-de-conversa",
    foraDoAr: true,
    titulo: "Caderno de Conversa",
    subtitulo: "Perguntas e respostas para conversar sobre os livros do Atlas",
    paginas: 137,
    arquivo: "/caderno-de-conversa.pdf",
    nomeArquivo: "Caderno-de-Conversa-Atlas-do-Aprender.pdf",
    resumo: "Os 129 livros das trilhas e da Estante de Formação, um por página: a lição do livro, um resumo para refrescar a memória do adulto, o que a criança aprende, dez perguntas com respostas e uma atividade para fazer junto.",
    dentro: ["129 livros de Português, Matemática, Ciências e da Estante de Formação", "1.290 perguntas de compreensão, interpretação e pessoais, com respostas", "A lição e um resumo de cada livro", "Uma atividade para fazer em família e o que ler depois", "Dicas para conversar com mais de uma criança"],
    amostras: ["Como usar o caderno", "Poemas para Brincar", "As Aventuras de Pinóquio", "Chapeuzinho Amarelo"],
  },
];

/** Os materiais gratuitos que estão no ar. */
export const GRATUITOS = TODOS_GRATUITOS.filter((g) => !g.foraDoAr);

/** Treino diário (gratuito) de um tema da trilha, se existir. */
export const treinoDoTema = (m: Materia, ano: string, tema: number) => GRATUITOS.find((g) => g.materia === m && g.ano === ano && g.tema === tema);
export const treinoDaApostila = (slug: string) => GRATUITOS.find((g) => g.apostila === slug);
