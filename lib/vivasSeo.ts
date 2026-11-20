import type { Metadata } from "next";

/** Texto fixo de cada Fase Viva para quem busca no Google (e para a família entender antes de jogar). */
export type VivaSeo = {
  slug: string; nome: string; titulo: string; descricao: string; materia: string; ano: string; idade: [number, number];
  apostila: string; trilha: string; intro: string; aprende: string[]; bncc: [string, string][]; faq: [string, string][];
};

export const VIVAS_SEO: VivaSeo[] = [
  {
    slug: "brincar-com-as-palavras", nome: "Brincar com as Palavras", materia: "Português", ano: "Alfabetização (1º ano)", idade: [5, 7],
    titulo: "Jogo de sílabas e rimas online grátis · consciência fonológica para a alfabetização",
    descricao: "Jogo grátis de consciência fonológica: a criança bate palmas nas sílabas no trem 3D, acha rimas na estação, brinca com parlendas e trava-línguas. Com voz para quem ainda não lê. BNCC EF01LP06 e EF12LP07.",
    apostila: "brincar-com-as-palavras", trilha: "/trilhas/portugues/1-ano#tema-1",
    intro: "Antes de ler, a criança precisa perceber que as palavras são feitas de pedaços (sílabas) e que algumas terminam com o mesmo som (rimas). Nesta Fase Viva ela escuta cada palavra, bate uma palma para cada sílaba e vê um vagão chegar no trem para cada palma. Na estação das rimas, ajuda o passageiro certo a embarcar. Tudo tem figura e voz, então dá para brincar mesmo sem saber ler.",
    aprende: ["Separar palavras em sílabas batendo palmas (MA-CA-CO)", "Contar quantas sílabas tem uma palavra", "Perceber que o tamanho da palavra não é o tamanho da coisa (BOI e FORMIGUINHA)", "Reconhecer rimas (gato, pato, rato)", "Identificar palavras que começam com o mesmo pedaço (BOla, BOta)", "Brincar com parlendas e trava-línguas da tradição oral"],
    bncc: [["EF01LP06", "Segmentar oralmente palavras em sílabas."], ["EF12LP07", "Identificar e (re)produzir, em cantigas, quadras, parlendas, trava-línguas e canções, rimas, aliterações e o ritmo de fala."]],
    faq: [
      ["O que é consciência fonológica?", "É a capacidade de perceber e brincar com os sons da fala: separar sílabas, achar rimas, notar que palavras começam com o mesmo som. Ela vem antes da leitura e ajuda muito na alfabetização."],
      ["Como ensinar sílabas para criança em casa?", "Fale a palavra devagar e bata uma palma em cada pedaço: SA-PA-TO, três palmas. Faça com nomes da família, objetos da casa e comidas. No trem das sílabas, cada palma vira um vagão, o que deixa a ideia bem concreta."],
      ["Com que idade a criança começa a perceber rimas?", "Muitas crianças brincam com rimas entre 4 e 6 anos, principalmente se ouvem parlendas, cantigas e livros rimados. Na alfabetização (1º ano), a escola trabalha isso de forma sistemática."],
    ],
  },
  {
    slug: "contar-ate-cem", nome: "Contar até Cem", materia: "Matemática", ano: "Alfabetização (1º ano)", idade: [5, 7],
    titulo: "Jogo de contagem até 100 online grátis · dezenas e unidades para o 1º ano",
    descricao: "Jogo grátis para aprender a contar até 100: material dourado em 3D em que 10 cubinhos viram 1 dezena, quadro dos 100, caminhão da feira com caixas de 10 e contagem de 2 em 2, 5 em 5 e 10 em 10. Com voz. BNCC EF01MA04 e EF01MA07.",
    apostila: "contar-ate-cem", trilha: "/trilhas/matematica/1-ano#tema-1",
    intro: "Contar até 100 é muito mais do que decorar a sequência: a criança precisa entender que 10 unidades formam 1 dezena. Nesta Fase Viva ela junta cubinhos de material dourado em 3D e vê 10 deles virarem uma barra, monta números no quadro dos 100 e carrega o caminhão da feira com caixas de 10 laranjas.",
    aprende: ["Contar quantidades até 100", "Agrupar de 10 em 10: 10 unidades = 1 dezena", "Ler um número pelas dezenas e unidades (34 = 30 + 4)", "Encontrar antecessor e sucessor (antes e depois)", "Comparar números (qual é maior?)", "Contar em saltos de 2, de 5 e de 10"],
    bncc: [["EF01MA04", "Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos."], ["EF01MA05", "Comparar números naturais de até duas ordens em situações cotidianas."], ["EF01MA07", "Compor e decompor número de até duas ordens, por meio de diferentes adições, com o suporte de material manipulável."], ["EF01MA10", "Descrever, após o reconhecimento e a explicitação de um padrão, elementos ausentes em sequências de números naturais."]],
    faq: [
      ["Como ensinar dezena e unidade para criança?", "Use objetos de verdade: palitos amarrados de 10 em 10, caixas de ovos, cubinhos. Quando juntar 10 soltos, troque por um grupo de 10. O material dourado da Fase Viva faz exatamente essa troca na tela."],
      ["Com que idade a criança conta até 100?", "Na BNCC, contar coleções até 100 é habilidade do 1º ano (6 a 7 anos). Muitas crianças recitam até 100 antes disso, mas entender dezenas e unidades leva mais tempo e prática."],
      ["Para que serve o quadro dos 100?", "Ele mostra os números de 1 a 100 em linhas de 10. Fica fácil ver padrões: descendo uma linha soma 10, as colunas terminam com o mesmo algarismo, e contar de 10 em 10 vira descer a última coluna."],
    ],
  },
  {
    slug: "divide-ai", nome: "Divide Aí!", materia: "Matemática", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de divisão online grátis para o 3º ano · repartir e agrupar",
    descricao: "Jogo grátis de divisão para o 3º ano: reparta biscoitos nos pratos em 3D, encha as vans do passeio, descubra o resto e enfrente o chefão. Modo sozinho e modo família. BNCC EF03MA08.",
    apostila: "divide-ai", trilha: "/trilhas/matematica/3-ano#tema-2",
    intro: "Dividir tem dois sentidos que a criança precisa conhecer: repartir igualmente (quanto fica para cada um?) e agrupar (quantos grupos dá para formar?). Nesta Fase Viva ela reparte biscoitos nos pratos em 3D, descobre o que sobra e decide quantas vans a escola precisa chamar para o passeio, onde o resto faz toda a diferença.",
    aprende: ["Repartir em partes iguais (quanto fica para cada um)", "Agrupar (quantos grupos cabem)", "Entender o resto da divisão", "Relacionar divisão e multiplicação", "Resolver problemas em que o resto muda a resposta (as vans do passeio)"],
    bncc: [["EF03MA08", "Resolver e elaborar problemas de divisão de um número natural por outro (até 10), com resto zero e com resto diferente de zero, com os significados de repartição equitativa e de medida."]],
    faq: [
      ["Como ensinar divisão para criança do 3º ano?", "Comece com objetos: reparta biscoitos ou lápis em pratos, um de cada vez, até acabar. Depois faça o contrário: forme grupos de 3, de 4. Só então passe para a conta. A Fase Viva mostra os dois jeitos lado a lado."],
      ["O que é o resto da divisão?", "É o que sobra quando não dá para repartir mais sem quebrar. 14 biscoitos em 4 pratos: 3 em cada prato e sobram 2. Às vezes o resto pede mais um grupo, como nas vans: 30 crianças em vans de 8 lugares precisam de 4 vans, não de 3."],
      ["Divisão é ensinada em que ano?", "As ideias de repartir e agrupar aparecem no 2º ano, e a divisão com resto entra no 3º ano, segundo a BNCC."],
    ],
  },
  {
    slug: "pedaco-por-pedaco", nome: "Pedaço por Pedaço", materia: "Matemática", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de frações online grátis · metade, terço e quarto para o 3º ano",
    descricao: "Jogo grátis de frações: corte pizza e chocolate em partes iguais em 3D, monte pedidos na pizzaria, compare pedaços e use meia dúzia, meia hora e meio litro. BNCC EF03MA09.",
    apostila: "pedaco-por-pedaco", trilha: "/trilhas/matematica/3-ano#tema-5",
    intro: "Fração começa com uma ideia simples: partes iguais. Nesta Fase Viva a criança corta uma pizza ou uma barra de chocolate em 3D, coloca pedaços no prato e vê a fração se formar. Na pizzaria, monta pedidos como \"três quartos da pizza\" e descobre que 2/4 é o mesmo tanto que a metade.",
    aprende: ["Dividir um inteiro em partes iguais", "Ler e escrever frações (o número de cima e o de baixo)", "Os nomes: metade, terço, quarto, quinto, décimo", "Comparar pedaços: quanto mais partes, menor o pedaço", "Calcular fração de uma quantidade (metade de 12)", "Usar frações do dia a dia: meia dúzia, meia hora, meio litro"],
    bncc: [["EF03MA09", "Associar o quociente de uma divisão com resto zero de um número natural por 2, 3, 4, 5 e 10 às ideias de metade, terça, quarta, quinta e décima partes."]],
    faq: [
      ["Como explicar fração para criança?", "Use comida: corte uma pizza ou um bolo em partes iguais e pergunte quantos pedaços tem e quantos você pegou. O número de baixo é em quantas partes iguais cortou; o de cima, quantas pegou."],
      ["Por que 1/8 é menor que 1/4?", "Porque o inteiro foi cortado em mais partes. Uma pizza dividida em 8 tem pedaços menores que uma dividida em 4. Essa é a pegadinha mais comum das frações."],
      ["Fração é conteúdo de que ano?", "As ideias de metade, terça, quarta, quinta e décima partes estão no 3º ano da BNCC. No 4º e 5º ano elas são aprofundadas."],
    ],
  },
  {
    slug: "detetives-de-dados", nome: "Detetives de Dados", materia: "Matemática", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de tabelas e gráficos online grátis para o 3º ano · pesquisa e gráfico de barras",
    descricao: "Jogo grátis de estatística para o 3º ano: faça uma pesquisa, marque votos com risquinhos, veja o gráfico de barras crescer, leia pictogramas e tabelas de dupla entrada. BNCC EF03MA26, EF03MA27 e EF03MA28.",
    apostila: "detetives-de-dados", trilha: "/trilhas/matematica/3-ano#tema-4",
    intro: "Tabelas e gráficos aparecem no jornal, na escola e no supermercado. Nesta Fase Viva a criança faz uma pesquisa de verdade, marca os votos com risquinhos de 5 em 5, monta a tabela e vê o gráfico de barras crescer quadradinho por quadradinho. Depois monta o mural da cantina e decide qual lanche comprar.",
    aprende: ["Fazer uma pesquisa com pergunta e opções", "Registrar votos com risquinhos (feixes de 5)", "Organizar dados numa tabela", "Ler e construir gráficos de barras", "Usar escala e legenda (cada figura vale 2, 5, 10)", "Ler tabelas de dupla entrada"],
    bncc: [["EF03MA26", "Resolver problemas cujos dados estão apresentados em tabelas de dupla entrada, gráficos de barras ou de colunas."], ["EF03MA27", "Ler, interpretar e comparar dados apresentados em tabelas de dupla entrada, gráficos de barras ou de colunas."], ["EF03MA28", "Realizar pesquisa envolvendo variáveis categóricas e organizar os dados em listas, tabelas e gráficos de colunas simples."]],
    faq: [
      ["Como ensinar gráfico de barras para criança?", "Faça uma pesquisa em casa (comida preferida, por exemplo), marque os votos e pinte um quadradinho por voto no caderno quadriculado. A barra mais alta é a mais votada."],
      ["O que é tabela de dupla entrada?", "É uma tabela com linhas e colunas ao mesmo tempo, como brincadeira preferida por turma. A resposta está no cruzamento da linha com a coluna."],
      ["O que é pictograma?", "É um gráfico feito com figuras. Cada figura pode valer mais de 1, por isso é preciso ler a legenda antes de contar."],
    ],
  },
  {
    slug: "medir-o-mundo", nome: "Medir o Mundo", materia: "Matemática", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de medidas online grátis · comprimento, massa e capacidade para o 3º ano",
    descricao: "Jogo grátis de medidas para o 3º ano: régua, balança e jarra em 3D, metro e centímetro, quilo e grama, litro e mililitro, receita da vovó e estimativas. BNCC EF03MA19 e EF03MA20.",
    apostila: "medir-o-mundo", trilha: "/trilhas/matematica/3-ano#tema-3",
    intro: "Medir é comparar com uma unidade. Nesta Fase Viva a criança usa régua, balança e jarra em 3D, aprende quando usar metro, quilo ou litro, faz a receita da vovó medindo leite e farinha e treina estimar antes de medir.",
    aprende: ["Medir comprimento com metro e centímetro", "Medir massa com quilograma e grama", "Medir capacidade com litro e mililitro", "Escolher a unidade certa para cada coisa", "Estimar antes de medir", "Converter: 1 m = 100 cm, 1 kg = 1000 g, 1 L = 1000 mL"],
    bncc: [["EF03MA19", "Estimar, medir e comparar comprimentos, utilizando unidades de medida não padronizadas e padronizadas mais usuais."], ["EF03MA20", "Estimar e medir capacidade e massa, utilizando unidades de medida não padronizadas e padronizadas mais usuais."]],
    faq: [
      ["Como ensinar medidas para criança?", "Na cozinha e na rua: medir a altura com fita métrica, pesar frutas no mercado, usar copo medidor numa receita. Antes de medir, peça um palpite; estimar treina o senso de medida."],
      ["Qual a diferença entre massa e capacidade?", "Massa é quanto algo pesa (quilo, grama). Capacidade é quanto cabe dentro de um recipiente (litro, mililitro)."],
      ["Medidas é conteúdo de que ano?", "Comprimento, massa e capacidade com unidades padronizadas são trabalhados no 3º ano pela BNCC, depois de experiências com medidas não padronizadas nos anos anteriores."],
    ],
  },
  {
    slug: "olhar-o-ceu", nome: "Olhar o Céu", materia: "Ciências", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de astronomia para crianças online grátis · dia e noite, fases da Lua e estrelas (3º ano)",
    descricao: "Jogo grátis de ciências para o 3º ano: gire a Terra e veja o dia e a noite, mude as fases da Lua, use um relógio de sol em 3D e ache o Cruzeiro do Sul num céu noturno de planetário. BNCC EF03CI08.",
    apostila: "olhar-o-ceu", trilha: "/trilhas/ciencias/3-ano#tema-4",
    intro: "Por que existe dia e noite? Por que a Lua muda de forma? Nesta Fase Viva a criança gira a Terra em 3D, acompanha as fases da Lua, usa a sombra de um cabo de vassoura como relógio de sol e explora um céu noturno de planetário para achar o Cruzeiro do Sul e as Três Marias.",
    aprende: ["O dia e a noite pela rotação da Terra", "As fases da Lua", "Sombras e a posição do Sol ao longo do dia", "Diferença entre estrela, planeta e satélite", "Reconhecer o Cruzeiro do Sul e as Três Marias"],
    bncc: [["EF03CI08", "Observar, identificar e registrar os períodos diários (dia e/ou noite) em que o Sol, demais estrelas, Lua e planetas estão visíveis no céu."], ["EF02CI07", "Descrever as posições do Sol em diversos horários do dia e associá-las ao tamanho da sombra projetada (revisão)."]],
    faq: [
      ["Como explicar dia e noite para criança?", "Com uma lanterna (o Sol) e uma bola (a Terra) num quarto escuro: o lado iluminado é dia, o outro é noite. Girando a bola, o dia e a noite se revezam. A Fase Viva faz isso em 3D."],
      ["Como achar o Cruzeiro do Sul no céu?", "Em noites sem nuvens, olhe para o sul e procure 4 estrelas brilhantes em forma de cruz (ou pipa). Prolongando o braço maior da cruz, você chega perto do polo sul do céu."],
      ["Por que a Lua muda de forma?", "A Lua não tem luz própria: ela reflete a luz do Sol. Conforme ela gira em volta da Terra, vemos partes diferentes do lado iluminado. Daí as fases nova, crescente, cheia e minguante."],
    ],
  },
  {
    slug: "nomear-e-descrever", nome: "Nomear e Descrever", materia: "Português", ano: "3º ano", idade: [8, 9],
    titulo: "Jogo de substantivo e adjetivo online grátis para o 3º ano · concordância",
    descricao: "Jogo grátis de substantivos e adjetivos: monte personagens 3D com palavras e veja cada adjetivo mudar o monstro, a coruja ou o robô, com concordância de gênero e número. Inclui comum e próprio e achados e perdidos.",
    apostila: "nomear-e-descrever", trilha: "/trilhas/portugues/3-ano#tema-5",
    intro: "O substantivo dá o nome; o adjetivo dá o jeito. Nesta Fase Viva a criança monta personagens numa fábrica em 3D: escolhe o substantivo (monstro, coruja, robô), a quantidade e os adjetivos (grande, azul, peludo, bravo), e vê o personagem mudar a cada palavra, com a concordância certinha: \"duas corujas peludas e bravas\".",
    aprende: ["Reconhecer substantivos (nomes de pessoas, bichos, coisas, lugares)", "Diferenciar substantivo comum e próprio", "Reconhecer adjetivos (palavras que dizem como é)", "Concordância de gênero e número (coruja brava, corujas bravas)", "Achar adjetivos em textos reais: cartazes, anúncios e placas"],
    bncc: [["EF04LP07", "Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal). A fase prepara essa habilidade."]],
    faq: [
      ["Qual a diferença entre substantivo e adjetivo?", "Substantivo é o nome (gato, escola, Maria). Adjetivo é a palavra que diz como ele é (gato preguiçoso, escola grande). Um bom teste: dá para colocar \"o\" ou \"a\" antes do substantivo."],
      ["O que é substantivo próprio?", "É o nome de um só, escrito com letra maiúscula: Aracaju, Brasil, Ana. Cidade, país e menina são substantivos comuns."],
      ["O que é concordância nominal?", "É quando o artigo e o adjetivo combinam com o substantivo em gênero e número: o monstro bravo, a coruja brava, as corujas bravas."],
    ],
  },
  {
    slug: "textos-do-dia-a-dia", nome: "Textos do Dia a Dia", materia: "Português", ano: "4º ano", idade: [9, 10],
    titulo: "Jogo de gêneros textuais online grátis · notícia, carta e receita para o 4º ano",
    descricao: "Jogo grátis de gêneros textuais para o 4º ano: monte notícia, carta e receita parte por parte numa mesa 3D, separe trechos no correio da escola e treine fato e opinião e linguagem formal e informal. BNCC EF04LP10, EF04LP13 e EF04LP14.",
    apostila: "textos-do-dia-a-dia", trilha: "/trilhas/portugues/4-ano#tema-1",
    intro: "Cada texto tem um jeito e uma função: a notícia informa, a carta conversa, a receita ensina. Nesta Fase Viva a criança monta uma notícia, uma carta e uma receita parte por parte numa prancheta em 3D (manchete, lide, saudação, despedida, ingredientes, modo de preparo) e depois separa trechos no correio da escola.",
    aprende: ["Reconhecer notícia, carta e receita e para que servem", "As partes da notícia: manchete, linha fina e lide (o quê, quem, quando, onde)", "As partes da carta: local e data, saudação, mensagem, despedida e assinatura", "As partes da receita: ingredientes e modo de preparo com verbos de ordem", "Diferenciar fato de opinião", "Diferenciar linguagem formal e informal"],
    bncc: [["EF04LP14", "Identificar, em notícias, fatos, participantes, local e momento/tempo da ocorrência do fato noticiado."], ["EF04LP15", "Distinguir fatos de opiniões em textos informativos e jornalísticos."], ["EF04LP10", "Ler e compreender cartas, de acordo com as convenções do gênero carta."], ["EF04LP13", "Identificar e reproduzir, em textos injuntivos instrucionais, a formatação própria desses textos (verbos no imperativo, indicação de passos)."]],
    faq: [
      ["O que é gênero textual?", "É o tipo de texto que usamos para cada necessidade do dia a dia: notícia para informar, carta para conversar com quem está longe, receita para ensinar a fazer. Cada um tem partes e um jeito de escrever."],
      ["Quais são as partes de uma notícia?", "Manchete (o título), linha fina (completa o título), lide (o primeiro parágrafo, que conta o quê, quem, quando e onde) e o desenvolvimento com mais detalhes."],
      ["Qual a diferença entre fato e opinião?", "Fato dá para conferir: \"300 pessoas foram à festa\". Opinião é o que alguém acha: \"foi a melhor festa do ano\". A notícia deve trazer fatos."],
    ],
  },
];

export const seoDe = (slug: string) => VIVAS_SEO.find((x) => x.slug === slug)!;
export function metaViva(slug: string): Metadata {
  const s = seoDe(slug);
  return {
    title: s.titulo,
    description: s.descricao,
    alternates: { canonical: `/vivas/${slug}` },
    openGraph: { title: `${s.nome} · Fase Viva grátis do Atlas do Aprender`, description: s.descricao, images: [`/apostilas/${s.apostila}/capa.webp`] },
  };
}
