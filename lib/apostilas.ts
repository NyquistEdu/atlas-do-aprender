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
    slug: "contar-ate-cem",
    titulo: "Contar até Cem",
    subtitulo: "Contagem, dezenas e o quadro dos 100",
    materia: "mat", ano: "1", tema: 1, nomeTema: "Contagem e números até 100",
    paginas: 31, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/PGrdZhN",
    resumo: "Contar de verdade não é falar os números de cor. A criança aprende as regras da contagem, escreve os números, compara quantidades, forma dezenas com palitos e material dourado, conta em saltos e descobre os padrões do quadro dos 100.",
    dentro: ["7 partes com explicação e exercícios", "Quadro de dez, reta numérica e material dourado desenhados", "Traçado dos números de 0 a 9", "5 revisões diárias, bingo, memória e mercadinho com dinheiro de brincadeira", "Certificado e gabarito"],
    amostras: ["Os números de 0 a 10", "Dezenas e unidades", "O quadro dos 100", "Revisão diária"],
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
    slug: "pedaco-por-pedaco",
    titulo: "Pedaço por Pedaço",
    subtitulo: "Metade, terço, quarto e as frações do dia a dia",
    materia: "mat", ano: "3", tema: 5, nomeTema: "Frações do dia a dia",
    paginas: 32, preco: "R$ 9,90", checkout: "https://pay.kiwify.com.br/02JsG1b",
    resumo: "Repartir de um jeito justo é o começo das frações. A criança descobre as partes iguais, a metade, o terço, o quarto, o quinto e o décimo, compara pedaços e reparte quantidades, até usar meia dúzia, meio litro e meia hora no dia a dia. Com barra de frações para recortar, dominó e receitas pela metade.",
    dentro: ["6 partes com explicação e exercícios", "Frações no dia a dia, erros comuns e exercícios guiados", "Treino diário de 5 dias", "Barra e discos de frações para recortar, dominó de frações e mão na massa", "Certificado e gabarito"],
    amostras: ["A metade", "Qual pedaço é maior?", "Treino diário", "Dominó de frações"],
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
};

export const GRATUITOS: Gratuito[] = [
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
    slug: "bruxa-matilda",
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

/** Treino diário (gratuito) de um tema da trilha, se existir. */
export const treinoDoTema = (m: Materia, ano: string, tema: number) => GRATUITOS.find((g) => g.materia === m && g.ano === ano && g.tema === tema);
export const treinoDaApostila = (slug: string) => GRATUITOS.find((g) => g.apostila === slug);
