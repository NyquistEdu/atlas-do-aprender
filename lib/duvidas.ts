/** Dúvidas comuns das famílias, respondidas em páginas próprias (boas para busca). */
export type Secao = { h: string; p?: string[]; lista?: string[] };
export type Duvida = {
  slug: string;
  pergunta: string;
  resumo: string;
  grupo: "ano" | "geral";
  ano?: string;
  secoes: Secao[];
  links?: [string, string][];
};

const ANOS_TXT: Record<string, { intro: string[]; casa: string[] }> = {
  "1": {
    intro: [
      "O 1º ano é o ano da alfabetização. A criança descobre que as palavras são feitas de sons, aprende as letras e os sons que elas representam e começa a ler e escrever palavras e frases curtas. Pela BNCC, a alfabetização deve estar consolidada até o fim do 2º ano, então é normal que, no 1º ano, a leitura ainda esteja no começo.",
      "Na Matemática, o foco é entender o que os números querem dizer: contar objetos, ler e escrever números até 100, comparar quantidades e resolver pequenas somas e subtrações com material concreto. Em Ciências, a criança conhece o próprio corpo, os cuidados com a saúde, os materiais do dia a dia e as mudanças entre o dia e a noite.",
    ],
    casa: ["Brincar com rimas, parlendas e sílabas (bater palmas a cada pedaço da palavra).", "Ler em voz alta todos os dias, apontando as palavras de vez em quando.", "Contar tudo: degraus, frutas, carros de uma cor.", "Deixar a criança escrever do jeito dela (lista de compras, bilhete) e conversar sobre como pensou."],
  },
  "2": {
    intro: [
      "No 2º ano a alfabetização se consolida: a criança passa a ler frases e pequenos textos com mais fluência, aprende as sílabas mais difíceis (como BR, LH, NH) e começa a cuidar da ortografia. Ela também escreve textos com função, como bilhetes, listas e convites, e reconta histórias.",
      "Na Matemática entram o sistema de numeração decimal (unidades, dezenas e centenas), somas e subtrações com reagrupamento, dinheiro, calendário e relógio. Em Ciências, a criança estuda os seres vivos e seus ambientes, as plantas, os animais e a relação entre luz, sombra e Sol.",
    ],
    casa: ["Pedir que a criança leia placas, rótulos e receitas.", "Escrever juntos bilhetes e convites de verdade.", "Brincar de mercadinho com moedas e notas.", "Usar o calendário da casa para contar quantos dias faltam para uma data."],
  },
  "3": {
    intro: [
      "No 3º ano a criança já lê e passa a ler para aprender: ganha fluência, entende textos maiores e começa a estudar regras de ortografia (R e RR, S e SS, M antes de P e B), pontuação e parágrafo. Também conhece gêneros como fábulas e poemas e aprende a reconhecer substantivos e adjetivos.",
      "Na Matemática chegam a multiplicação e a tabuada, a divisão como repartir e agrupar, as medidas de comprimento, massa e capacidade, tabelas e gráficos e as primeiras frações (metade, terço, quarto). Em Ciências, os temas são o ciclo de vida dos animais, som e vibração, solo, água e ar, e o céu.",
    ],
    casa: ["Ler junto livros com capítulos e conversar sobre o que aconteceu.", "Cozinhar medindo ingredientes com copo medidor e balança.", "Repartir lanches e brinquedos em partes iguais.", "Jogar jogos de cartas e de tabuleiro que envolvam somar e multiplicar pontos."],
  },
  "4": {
    intro: [
      "No 4º ano a leitura fica mais exigente: livros com capítulos, leitura de inferência (entender o que não está escrito com todas as letras) e gêneros do cotidiano, como notícia, carta e receita. Entram os verbos e tempos verbais e a acentuação.",
      "Na Matemática, a criança multiplica e divide números maiores, compara frações equivalentes, conhece os números decimais pelo dinheiro e calcula área e perímetro. Em Ciências, estuda cadeias alimentares, microrganismos, misturas e transformações, pontos cardeais e o movimento aparente do Sol.",
    ],
    casa: ["Ler notícias para crianças e conversar sobre elas.", "Fazer contas de troco e comparar preços no mercado.", "Medir a área de um cômodo com fita métrica.", "Observar fermento, iogurte ou mofo para falar de microrganismos."],
  },
  "5": {
    intro: [
      "O 5º ano fecha os anos iniciais. Na Língua Portuguesa a criança aprende a dar opinião e argumentar, revisa os próprios textos, lê crônicas e literatura brasileira e faz pesquisas, resumos e apresentações orais.",
      "Na Matemática aparecem frações, decimais e porcentagem, números grandes, volume, probabilidade e o plano cartesiano. Em Ciências, estuda a digestão, a respiração e a circulação, o ciclo da água, o sistema solar, energia e eletricidade, e sustentabilidade.",
    ],
    casa: ["Pedir a opinião da criança sobre um livro ou filme e perguntar “por quê?”.", "Calcular descontos em porcentagem em folhetos de loja.", "Fazer uma pequena pesquisa e apresentar para a família.", "Separar o lixo de casa e conversar sobre o que é reciclável."],
  },
};

const porAno: Duvida[] = ["1", "2", "3", "4", "5"].map((a) => ({
  slug: `o-que-a-crianca-aprende-no-${a}-ano`,
  pergunta: `O que a criança aprende no ${a}º ano do ensino fundamental?`,
  resumo: `O que a BNCC espera em Português, Matemática e Ciências no ${a}º ano, com a lista de temas e ideias simples para ajudar em casa.`,
  grupo: "ano",
  ano: a,
  secoes: [
    { h: `Visão geral do ${a}º ano`, p: ANOS_TXT[a].intro },
    { h: "Como ajudar em casa", lista: ANOS_TXT[a].casa },
  ],
}));

const gerais: Duvida[] = [
  {
    slug: "crianca-no-3-ano-nao-sabe-ler",
    pergunta: "Meu filho está no 3º ano e ainda não sabe ler. O que fazer?",
    resumo: "Por onde começar quando a criança passou da idade da alfabetização: o que observar, o que fazer em casa todos os dias e quando procurar uma avaliação.",
    grupo: "geral",
    secoes: [
      { h: "Primeiro: respire", p: ["Muitas crianças chegam ao 3º ano sem ler com segurança, por motivos diferentes: troca de escola, faltas, uma alfabetização que não funcionou para elas, uma história de vida difícil. Isso tem solução, e quanto antes começar, melhor. O mais importante é partir de onde a criança está, e não de onde ela “deveria” estar."] },
      { h: "Descubra onde a criança está", lista: ["Ela reconhece todas as letras pelo nome e pelo som?", "Consegue separar uma palavra em sílabas batendo palmas?", "Lê sílabas simples (BA, MI, TO)? E palavras curtas?", "Escreve o próprio nome e palavras do dia a dia?"] },
      { h: "O que fazer todos os dias", lista: ["15 a 20 minutos por dia, sempre, valem mais que uma hora no fim de semana.", "Comece pela consciência fonológica: rimas, sílabas, sons do começo das palavras.", "Depois, letras e sons, e a leitura de palavras com sílabas simples.", "Leia em voz alta para ela todos os dias livros mais interessantes do que ela consegue ler sozinha.", "Comemore cada palavra lida. Evite comparar com irmãos ou colegas."] },
      { h: "Quando procurar ajuda", p: ["Converse com a escola sobre o que estão vendo em sala. Se, mesmo com prática diária por alguns meses, a criança continua com muita dificuldade, troca letras com frequência ou se cansa demais para ler, vale uma avaliação: oftalmologista (para descartar problema de visão), audiometria e uma avaliação com fonoaudiólogo ou psicopedagogo."] },
    ],
    links: [["/trilhas/portugues/1-ano", "Trilha de Português da alfabetização"], ["/apostilas/brincar-com-as-palavras", "Apostila Brincar com as Palavras"], ["/apostilas/ouvir-as-letras", "Apostila Ouvir as Letras"]],
  },
  {
    slug: "quanto-tempo-estudar-em-casa",
    pergunta: "Quanto tempo a criança deve estudar em casa por dia?",
    resumo: "Para os anos iniciais, blocos curtos funcionam melhor que sessões longas. Veja quanto tempo faz sentido e como distribuir na semana.",
    grupo: "geral",
    secoes: [
      { h: "Pouco e todo dia", p: ["Para crianças da alfabetização ao 5º ano, encontros de 15 a 20 minutos funcionam melhor do que uma hora seguida. A atenção dura pouco nessa idade, e a memória se fixa com repetição espaçada: rever um pouco em vários dias seguidos."] },
      { h: "Uma referência", lista: ["Quem estuda na escola: de 30 minutos a 1 hora por dia em casa, somando tudo, já é bastante.", "Divida em blocos: um depois do lanche, outro mais tarde.", "Inclua a leitura em voz alta antes de dormir, que conta muito e não parece tarefa.", "Deixe o fim de semana para atividades práticas: cozinhar medindo, um experimento, um jogo."] },
      { h: "Sinais de que passou do ponto", p: ["Choro, irritação, “não sei” para tudo, olhar perdido. Pare antes do cansaço: o objetivo é que a criança queira voltar no dia seguinte."] },
    ],
    links: [["/guia", "Guia de uso do Atlas, com uma semana possível"]],
  },
  {
    slug: "como-criar-o-habito-de-leitura",
    pergunta: "Como criar o hábito de leitura nas crianças?",
    resumo: "Ler junto todos os dias, deixar a criança escolher e conversar sobre as histórias: ideias práticas para formar leitores em casa.",
    grupo: "geral",
    secoes: [
      { h: "O hábito nasce da companhia", p: ["Crianças que ouvem histórias todos os dias tendem a gostar de ler. Ler em voz alta, mesmo para quem já lê sozinho, amplia o vocabulário e mostra que a leitura é um momento bom, não uma obrigação."] },
      { h: "Ideias que funcionam", lista: ["Um horário fixo: 15 minutos antes de dormir.", "Comece por livros curtos e engraçados, mesmo que pareçam fáceis para a idade.", "Deixe a criança escolher na biblioteca ou no sebo.", "Converse depois: do que você mais gostou? O que você faria no lugar do personagem?", "Deixe livros à vista e leia perto dela: o exemplo pesa.", "Nunca use a leitura como castigo."] },
    ],
    links: [["/livros", "Livros para ler com a criança, por ano"], ["/apostilas/caderno-de-conversa", "Caderno de Conversa gratuito, com perguntas para cada livro"]],
  },
  {
    slug: "dever-de-casa-sem-brigas",
    pergunta: "Como ajudar com o dever de casa sem brigas?",
    resumo: "Rotina, lugar certo, ajuda na medida e elogio ao esforço: como acompanhar a lição de casa sem estresse.",
    grupo: "geral",
    secoes: [
      { h: "Combine a rotina antes", lista: ["Mesmo horário todos os dias, depois de um lanche e de um tempo livre.", "Um lugar com luz, mesa e sem tela ligada.", "Material separado antes de começar."] },
      { h: "Ajude na medida", lista: ["Fique por perto, mas deixe a criança tentar primeiro.", "Quando ela errar, pergunte “como você pensou?” antes de corrigir: o erro mostra onde está a dúvida.", "Divida tarefas longas em partes, com pequenas pausas.", "Elogie o esforço e a estratégia, não só o acerto."] },
      { h: "Quando a tarefa vira briga", p: ["Pare, respire e volte mais tarde. Se a lição é sempre difícil demais, converse com a professora: ela precisa saber onde a criança está."] },
    ],
  },
  {
    slug: "o-que-e-a-bncc",
    pergunta: "O que é a BNCC e por que ela importa para as famílias?",
    resumo: "A Base Nacional Comum Curricular define o que toda criança deve aprender em cada ano. Entenda como ela ajuda a acompanhar o estudo em casa.",
    grupo: "geral",
    secoes: [
      { h: "O que é", p: ["A BNCC (Base Nacional Comum Curricular) é o documento que define as aprendizagens essenciais de cada ano da educação básica no Brasil. A parte da educação infantil e do ensino fundamental foi homologada em 2017. Todas as escolas, públicas e particulares, montam seus currículos a partir dela."] },
      { h: "Como ler os códigos", p: ["Cada habilidade tem um código. Em EF03MA09, por exemplo: EF é ensino fundamental, 03 é o 3º ano, MA é Matemática e 09 é o número da habilidade. Essa, especificamente, trata de metade, terça, quarta, quinta e décima parte."] },
      { h: "Por que importa em casa", p: ["Saber o que se espera em cada ano ajuda a família a perceber se a criança está no caminho, a reforçar o que a escola está ensinando e a voltar a um ano anterior quando há lacunas, sem pular etapas. As trilhas do Atlas seguem a BNCC, ano a ano."] },
    ],
    links: [["/trilhas/portugues/1-ano", "Trilhas do Atlas, ano a ano"]],
  },
  {
    slug: "jogos-de-tabuleiro-para-aprender",
    pergunta: "Jogos de tabuleiro ajudam a criança a aprender?",
    resumo: "Memória, atenção, contagem, estratégia e saber perder: o que os jogos desenvolvem e como aproveitar a partida.",
    grupo: "geral",
    secoes: [
      { h: "O que os jogos desenvolvem", lista: ["Memória e atenção (jogo da memória, Lince).", "Números e cálculo (dominó, UNO, jogos de pontos).", "Linguagem (Stop, Perfil Júnior).", "Estratégia e planejamento (damas, xadrez).", "Lidar com frustração, esperar a vez e seguir regras."] },
      { h: "Como aproveitar", p: ["Jogue junto e converse depois: qual foi a jogada decisiva? O que você faria diferente? Comece por jogos curtos e aumente a dificuldade aos poucos. Muitos jogos têm versões caseiras, feitas com papel."] },
    ],
    links: [["/jogos", "Jogos comentados por idade e habilidade"]],
  },
];

export const DUVIDAS: Duvida[] = [...porAno, ...gerais];
export const duvida = (slug: string) => DUVIDAS.find((d) => d.slug === slug);
