/**
 * Conteúdo programático de cada material (apostilas, treinos diários, kits e gratuitos).
 * Cada bloco tem um título (parte da apostila ou nível do treino) e os conteúdos trabalhados.
 * Os treinos seguem os títulos das folhas do PDF; as apostilas, as partes do PDF.
 */
export type Bloco = { titulo: string; itens: string[] };
export type Programa = { blocos: Bloco[]; nota?: string };

export const PROGRAMA: Record<string, Programa> = {
  // ---------- Treinos diários ----------
  "treino-contar-ate-cem": { blocos: [
    { titulo: "Nível A · Contar e escrever até 30 (folhas 1 a 10)", itens: ["Contar objetos e escrever a quantidade", "Escrever os números de 1 a 30", "Completar sequências numéricas", "O número que vem antes e o que vem depois", "O dez e as barrinhas de dez"] },
    { titulo: "Nível B · Números até 100 (folhas 11 a 20)", itens: ["Escrever os números de 31 a 100", "O quadro dos 100", "Antes, depois e entre dois números", "Virar a dezena (29, 30, 31…)", "Dezenas e unidades"] },
    { titulo: "Nível C · Contar em saltos e comparar (folhas 21 a 30)", itens: ["Contar de 10 em 10, de 5 em 5 e de 2 em 2", "Descobrir a regra de uma sequência", "Maior e menor, do menor para o maior", "Separar dezena e unidade", "Andar no quadro dos 100", "Desafio final: escrever de 1 a 100"] },
  ] },
  "treino-textos-do-dia-a-dia": { blocos: [
    { titulo: "Nível A · Reconhecer (folhas 1 a 10)", itens: ["Que gênero é? Para que serve? Onde aparece?", "As partes da notícia, da carta e da receita", "Fato ou opinião?", "O jeito de receita: verbos que dão ordem", "Formal ou informal?"] },
    { titulo: "Nível B · Ler e analisar (folhas 11 a 20)", itens: ["Lendo uma notícia: o lide", "A melhor manchete", "Lendo uma carta e cartas em ordem", "O envelope: remetente e destinatário", "Lendo uma receita, passos em ordem e medidas", "Gênero e pista"] },
    { titulo: "Nível C · Escrever (folhas 21 a 30)", itens: ["Faça a manchete e escreva o lide", "Tire a opinião", "Complete a carta e deixe a carta formal", "Escreva os passos e monte a receita", "Um assunto, três textos", "Desafio final: o jornal da minha casa"] },
  ] },
  "treino-juntar-e-tirar": { blocos: [
    { titulo: "Nível A · Juntar e acrescentar (folhas 1 a 10)", itens: ["Juntar dois grupos", "Somar no quadro de dez", "Guardar o maior na cabeça", "Pular para a frente na reta numérica", "Mais 1 e mais 2", "A ordem não muda", "Os dobros", "Somas até 10", "Problemas de juntar"] },
    { titulo: "Nível B · Tirar e comparar (folhas 11 a 20)", itens: ["Riscar e contar", "Tirar no quadro de dez", "Pular para trás na reta numérica", "Menos 1 e menos 2", "Subtrações até 10", "Quantos a mais", "Quanto falta", "Problemas de tirar e de comparar"] },
    { titulo: "Nível C · Amigos do 10 e problemas (folhas 21 a 30)", itens: ["Quanto falta para 10", "Os amigos do 10", "Mais ou menos?", "O número escondido", "Passando do 10", "Família de contas", "Que conta eu faço?", "Desafio final: o mercadinho"] },
  ] },
  "treino-ontem-hoje-e-amanha": { blocos: [
    { titulo: "Nível A · Reconhecer (folhas 1 a 10)", itens: ["Achar o verbo", "Ação, estado ou fenômeno", "O infinitivo", "-AR, -ER ou -IR", "Quem faz a ação", "O verbo combina (concordância)", "Ontem, hoje ou amanhã", "Dançar nos três tempos", "A palavra de tempo"] },
    { titulo: "Nível B · Conjugar e escolher (folhas 11 a 20)", itens: ["Conjugar no presente, no passado e no futuro", "Brinquei ou brincava?", "Quando o vovô era menino (imperfeito)", "Irregulares: ser, estar, ter, ir", "Irregulares: fazer, ver, dizer, trazer", "Cantaram ou cantarão?", "-AM ou -ÃO?"] },
    { titulo: "Nível C · Usar no texto (folhas 21 a 30)", itens: ["Passar para o passado e para o futuro", "O verbo fora do tempo", "Completar a história", "O que eu fiz ontem", "Como era antigamente", "Planos para as férias", "Troque o “disse”", "Desafio final: diário de três dias"] },
  ] },
  "treino-olhar-o-ceu": { blocos: [
    { titulo: "Nível A · O céu, o Sol e o dia (folhas 1 a 10)", itens: ["De dia ou de noite?", "Luz própria ou reflete?", "Verdadeiro ou falso sobre o Sol", "Leste ou oeste?", "Sombra comprida ou curta", "Rotação e translação", "Onde é dia, onde é noite", "Explicar com as próprias palavras"] },
    { titulo: "Nível B · A Lua (folhas 11 a 20)", itens: ["A luz da Lua", "Qual é a fase?", "A roda das fases", "O calendário da Lua", "Crescente ou minguante?", "Onde está a Lua?", "O diário da Bia", "Desenhar as fases"] },
    { titulo: "Nível C · Estrelas e constelações (folhas 21 a 30)", itens: ["Estrela ou planeta?", "Por que as estrelas piscam", "Cruzeiro do Sul e Três Marias", "Ligar as estrelas e inventar uma constelação", "Do olho ao telescópio", "Linha do tempo do céu", "Palavras do céu", "Desafio final: noite de observação"] },
  ] },
  "treino-formas-e-padroes": { blocos: [
    { titulo: "Nível A · Reconhecer (folhas 1 a 10)", itens: ["Qual é o nome?", "Contar lados e pontas", "Pintar e contar", "Ache os triângulos", "Ache os quadrados", "Quadrado ou retângulo?", "Adivinhas", "O intruso"] },
    { titulo: "Nível B · Formas no mundo e figuras (folhas 11 a 20)", itens: ["Formas nos objetos", "O carimbo", "O trem e o foguete de formas", "Que forma aparece?", "Desmontar formas", "Copiar na malha", "Completar a forma", "Desafios do Tangram"] },
    { titulo: "Nível C · Padrões (folhas 21 a 30)", itens: ["Padrão AB", "Padrões AAB, ABB e ABC", "Padrões de posição", "A parte que se repete", "Ache o erro", "O que falta no meio?", "Padrões que crescem", "Sons, letras e números", "Desafio final"] },
  ] },
  "treino-alem-do-ba-be-bi": { blocos: [
    { titulo: "Nível A · Encontros com R e L (folhas 1 a 10)", itens: ["BR, PR, TR, CR, DR, FR, GR", "Ponha um R", "R ou L?", "BL, CL, FL, GL, PL", "Juntar as sílabas", "Qual está certa?", "Sílabas embaralhadas", "Ditado de encontros"] },
    { titulo: "Nível B · NH, LH e CH (folhas 11 a 20)", itens: ["NH, LH e CH", "NH ou LH?", "Uma letra muda tudo", "Separar as sílabas", "Desafio: CH ou X?", "A galinha Chiquinha", "Ditado de NH, LH e CH"] },
    { titulo: "Nível C · Finalzinho e regras (folhas 21 a 30)", itens: ["Não esqueça o finalzinho", "M ou N?", "R ou RR?", "S ou SS?", "QU ou GU?", "Separar e contar", "Fábrica de palavras", "Corrija o Duda", "Desafio final"] },
  ] },
  "treino-separar-e-comparar": { blocos: [
    { titulo: "Nível A · Separar (folhas 1 a 10)", itens: ["Contar por cor", "Reconhecer cores e formas (círculo, quadrado, triângulo, retângulo)", "Contar as formas", "Grande ou pequeno", "Achar o intruso e a forma intrusa", "Descobrir a regra do grupo: cor, forma ou tamanho", "Desenhar um que combina"] },
    { titulo: "Nível B · Comparar (folhas 11 a 20)", itens: ["Mais, menos ou igual, ligando um a um", "Qual grupo tem mais e qual tem menos", "É igual? Sim ou não", "Juntinho ou espalhado: a quantidade não muda", "Desenhar a mesma quantidade", "Quantos a mais", "Desenhar ou riscar para ficar igual"] },
    { titulo: "Nível C · Ordenar (folhas 21 a 30)", itens: ["Do menor para o maior e do maior para o menor", "Do mais curto para o mais comprido", "1º, 2º, 3º e último da fila", "O que vem depois na sequência", "Ordenar quantidades", "Os números em fila", "Problemas de comparar", "Desafio final: a festa da bicharada"] },
  ] },
  "treino-t-ou-d": { blocos: [
    { titulo: "Nível A · Ouvir e sentir (folhas 1 a 10)", itens: ["A mão na garganta: D vibra, T não vibra", "T ou D no começo da palavra", "Pintar as figuras que começam com T ou com D", "Pares mínimos: o adulto diz, a criança circula (gato e gado, tia e dia, roda e rota)", "T ou D no meio da palavra", "Igual ou diferente?", "A primeira sílaba: TA ou DA, TE ou DE…"] },
    { titulo: "Nível B · Ler e escrever (folhas 11 a 20)", itens: ["Completar com T ou D no começo e no meio", "Completar com a sílaba: TA TE TI TO TU · DA DE DI DO DU", "Ler o par e circular a figura certa", "Uma letra muda tudo", "Qual está escrita certo?", "Caça ao erro", "Ditado de palavras", "Palavras com T e com D juntos (dente, tarde, tomada)"] },
    { titulo: "Nível C · Frases e textos (folhas 21 a 30)", itens: ["Completar a frase pelo sentido (tia ou dia, gato ou gado)", "Frases malucas: achar e corrigir a troca", "Sílabas embaralhadas", "Ditado de frases", "Uma pequena história para completar", "Caça-palavras do T e do D", "Troque o T pelo D e descubra a nova palavra", "Desafio final"] },
  ] },
  "treino-detetives-de-dados": { blocos: [
    { titulo: "Nível A · Contar e organizar (folhas 1 a 10)", itens: ["Contar e desenhar risquinhos de 5 em 5", "Das respostas para a tabela", "Completar e ler tabelas", "Verdadeiro ou falso com tabela", "Achar erros de contagem", "Total ou diferença", "Boas perguntas de pesquisa"] },
    { titulo: "Nível B · Gráficos de barras (folhas 11 a 20)", itens: ["Ler o valor de cada barra", "Responder perguntas com o gráfico", "Do gráfico para a tabela", "Fazer gráficos na malha a partir de tabelas e risquinhos", "Qual gráfico combina com a tabela?", "Gráfico de 2 em 2 e pictograma de 5 em 5", "Problemas com gráfico"] },
    { titulo: "Nível C · Dupla entrada e problemas (folhas 21 a 30)", itens: ["Cruzar linha e coluna", "Completar os totais", "Comparar na dupla entrada", "Desenhar pictograma e gráfico de 2 em 2", "Problemas com tabela e com gráfico", "A minha pesquisa", "Desafio final: o diário do feijão"] },
  ] },
  "treino-pedaco-por-pedaco": { blocos: [
    { titulo: "Nível A · Partes iguais e frações (folhas 1 a 10)", itens: ["Reconhecer partes iguais", "Em quantas partes o inteiro foi dividido", "A metade", "Ler e pintar frações em barras e pizzas", "Escrever frações com números (um terço = 1/3)", "A parte que ficou sem pintar"] },
    { titulo: "Nível B · Comparar frações (folhas 11 a 20)", itens: ["Qual pedaço é maior", "Comparar frações com o mesmo número de partes", "Ordenar frações do menor para o maior", "Quantos pedaços formam o inteiro", "Frações que valem o mesmo (equivalentes)", "Mais ou menos que a metade"] },
    { titulo: "Nível C · Frações de quantidades e no dia a dia (folhas 21 a 30)", itens: ["A metade de uma quantidade, no papel e de cabeça", "Terço, quarto e quinto de um número", "Mais de um pedaço (2/3 de 12)", "Meio e meia no dia a dia", "Meia hora e quarto de hora", "Problemas com frações"] },
  ] },
  "treino-medir-o-mundo": { blocos: [
    { titulo: "Nível A · Medir e escolher a unidade (folhas 1 a 10)", itens: ["Medir com quadradinhos e com a régua", "Desenhar segmentos com a régua", "Escolher a unidade certa: centímetro, metro, grama, quilograma, mililitro, litro", "Ler a jarra medidora", "Comparar medidas: maior ou menor"] },
    { titulo: "Nível B · Conversões (folhas 11 a 20)", itens: ["Reais e centavos como ponto de partida", "Metros em centímetros e centímetros em metros", "Metros e centímetros juntos (1 m e 20 cm)", "Quilos e gramas", "Litros e mililitros", "Meio e um quarto (de quilo, de litro)", "Quilômetros e metros", "Comparar medidas escritas em unidades diferentes"] },
    { titulo: "Nível C · Problemas com medidas (folhas 21 a 30)", itens: ["Somar medidas", "Quanto falta para completar", "Somar e converter", "Receita pela metade e em dobro", "Ordenar medidas", "Quantos cabem", "Problemas de medidas"] },
  ] },
  "treino-ouvir-as-letras": { blocos: [
    { titulo: "Nível A · Vogais e consoantes (folhas 1 a 10)", itens: ["As vogais maiúsculas e minúsculas", "Com que vogal começa a palavra", "As consoantes B, C, D, F, G, J, L, M, N, P, R, S, T, V e Z"] },
    { titulo: "Nível B · O alfabeto (folhas 11 a 20)", itens: ["Letra maiúscula e minúscula", "A letra que começa cada palavra", "As letras diferentes: H, Q, X e K", "A ordem do alfabeto", "A letra que vem antes e a que vem depois"] },
    { titulo: "Nível C · As letras dentro das palavras (folhas 21 a 30)", itens: ["Achar a letra dentro da palavra", "Completar palavras e a vogal que falta", "Figuras que começam com a mesma letra", "Contar as letras de uma palavra", "Copiar palavras e escrever os nomes da família", "Desafio final: o alfabeto inteiro"] },
  ] },
  "treino-brincar-com-as-palavras": { blocos: [
    { titulo: "Nível A · Rimas (folhas 1 a 10)", itens: ["Reconhecer palavras que rimam", "Achar a que não rima", "Famílias de rimas (pão, mão, cão…)", "Terminar e inventar rimas"] },
    { titulo: "Nível B · Sílabas (folhas 11 a 20)", itens: ["Contar sílabas com palmas, de uma a quatro", "Comparar o tamanho das palavras", "Palavras que começam com a mesma sílaba", "Juntar sílabas para formar palavras", "Palavras que terminam com a mesma sílaba"] },
    { titulo: "Nível C · Sons e palavras (folhas 21 a 30)", itens: ["O primeiro som da palavra", "Achar a palavra que começa com som diferente", "Contar as palavras de uma frase", "A palavra não é a coisa: coisa grande, palavra pequena", "Trava-línguas", "Trocar o primeiro som e formar outra palavra"] },
  ], nota: "Tudo com figuras, para quem ainda não lê." },
  "treino-nomear-e-descrever": { blocos: [
    { titulo: "Nível A · Substantivos (folhas 1 a 10)", itens: ["Reconhecer os nomes (substantivos)", "Achar o substantivo na frase", "Substantivo comum e próprio", "Letra maiúscula nos nomes próprios", "Coletivos"] },
    { titulo: "Nível B · Plural, masculino e feminino (folhas 11 a 20)", itens: ["Plural com S", "Plural das palavras terminadas em -ão, em R, Z e S, e em L", "Masculino e feminino", "Femininos diferentes (boi, vaca)", "Passar frases para o plural e para o feminino"] },
    { titulo: "Nível C · Adjetivos e concordância (folhas 21 a 30)", itens: ["Reconhecer os adjetivos", "Adjetivos contrários", "Escolher o adjetivo que combina", "Concordância entre substantivo e adjetivo", "Completar descrições", "Descrever um personagem"] },
  ] },

  "treino-ler-o-que-eu-sei": { blocos: [
    { titulo: "Nível A · Ler com o dedo (folhas 1 a 10)", itens: ["Ler apontando parlendas que já sabe de cor", "Contar as palavras de cada verso", "Achar a palavra escrita igual", "Achar palavras no texto pela primeira letra", "Ligar palavra e figura", "Palavras que grudaram: separar e contar", "Completar versos e comparar versos iguais e diferentes"] },
    { titulo: "Nível B · Pistas para ler (folhas 11 a 20)", itens: ["A primeira letra como pista", "Palavras parecidas: PATO, PRATO, RATO", "Ligar e completar rimas", "Versos em ordem: Borboletinha e O sapo não lava o pé", "A palavra intrusa e o nome da lista", "Ler frases e ligar à figura"] },
    { titulo: "Nível C · Ler sozinho (folhas 21 a 30)", itens: ["Ler e desenhar", "Perguntas de sim ou não", "Dois textos novos com perguntas", "Completar frases e montar frases", "A lista do piquenique", "Desafio final: ler uma cantiga sozinho, com observação do adulto"] },
  ] },
  "treino-escrever-o-nome": { blocos: [
    { titulo: "Nível A · O meu nome (folhas 1 a 10)", itens: ["Escrever o próprio nome com e sem modelo", "Achar o nome escrito igual", "Contar as letras de um nome", "Comparar palavras: o tamanho da palavra não é o tamanho da coisa", "Letras fora do lugar", "Nomes e palavras que começam igual", "Palavras de carinho: MAMÃE, PAPAI, VOVÓ…"] },
    { titulo: "Nível B · Ouvir para escrever (folhas 11 a 20)", itens: ["Contar os pedaços (sílabas) com palmas", "A vogal que falta", "A consoante que falta", "O pedaço que falta", "Escrever palavras de duas sílabas e de três letras nos quadradinhos", "Ler e ligar palavra e figura"] },
    { titulo: "Nível C · Escrever de verdade (folhas 21 a 30)", itens: ["Escrever palavras sem quadradinhos", "Palavras de três sílabas", "Ditado", "Lista, etiquetas e bilhete", "Completar frases", "Separar as palavras de uma frase", "Desafio final: o mesmo ditado do começo da apostila"] },
  ] },

  // ---------- Apostilas ----------
  "nomear-e-descrever": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · Tudo tem um nome", "Parte 2 · Nome de todos e nome de um só (comum e próprio)", "Parte 3 · Um ou muitos? Masculino ou feminino?", "Parte 4 · Como é? O adjetivo", "Parte 5 · O adjetivo combina com o substantivo (concordância)", "Parte 6 · Descrever: pintar com palavras"] },
    { titulo: "Para praticar", itens: ["Leitura original", "Treino diário de 5 dias", "Jogo Quem sou eu? e caixa misteriosa", "Gabarito"] },
  ] },
  "textos-do-dia-a-dia": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · Cada texto tem um jeito: o que é gênero textual", "Parte 2 · A notícia: manchete, lide, corpo, legenda, fato e opinião", "Parte 3 · A carta: local e data, saudação, corpo, despedida, assinatura e envelope", "Parte 4 · A receita: ingredientes, modo de preparo e verbos que dão ordem", "Parte 5 · Os três lado a lado", "Parte 6 · Escrever: minha notícia, minha carta e minha receita"] },
    { titulo: "Para praticar", itens: ["Erros comuns e exercícios guiados", "Treino diário de 5 dias", "Leitura: o jornal da família", "Jogo Que gênero é? e mão na massa", "Gabarito"] },
  ] },
  "detetives-de-dados": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · Perguntar e contar: a pesquisa e os risquinhos de 5 em 5", "Parte 2 · Organizar em tabela: título, linhas, colunas e total", "Parte 3 · Ler um gráfico de barras", "Parte 4 · Fazer um gráfico de barras na malha", "Parte 5 · Pictograma e escala de 2 em 2", "Parte 6 · Tabela de dupla entrada", "Parte 7 · Gráficos e tabelas no dia a dia"] },
    { titulo: "Para praticar", itens: ["Erros comuns, exercícios guiados e problemas", "5 treinos diários", "Leitura: A horta da escola", "Malha para gráficos e jogo Corrida dos dados", "Pesquisas para fazer em casa e gabarito"] },
  ] },
  "pedaco-por-pedaco": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · Repartir de um jeito justo (partes iguais)", "Parte 2 · A metade", "Parte 3 · Terço, quarto e outras partes", "Parte 4 · Qual pedaço é maior? (comparar frações)", "Parte 5 · Metade de uma quantidade", "Parte 6 · Terça, quarta, quinta e décima parte de uma quantidade", "Parte 7 · Frações no dia a dia: meia dúzia, meio litro, meia hora"] },
    { titulo: "Para praticar", itens: ["Treino diário de 5 dias", "Barra e discos de frações para recortar", "Dominó de frações e receitas pela metade", "Gabarito"] },
  ] },
  "brincar-com-as-palavras": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["Perceber que as palavras são feitas de sons", "Sílabas: uma palma para cada pedaço", "Rimas: o fim que soa igual", "Parlendas e trava-línguas da tradição oral", "Brincar de trocar sons e formar novas palavras"] },
    { titulo: "Para praticar", itens: ["5 revisões diárias em que a ajuda vai diminuindo", "Trilha das palmas, bingo e memória das rimas", "Atividades mão na massa e gabarito"] },
  ], nota: "Quase tudo é falado: ainda não precisa ler nem escrever." },
  "ouvir-as-letras": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["O alfabeto ilustrado", "Letras maiúsculas e minúsculas", "Vogais e consoantes", "O som do começo das palavras", "As letras curiosas", "O traçado de A a Z, com ponto de início e ordem dos traços", "As letras que se confundem: b, d, p e q"] },
    { titulo: "Para praticar", itens: ["5 revisões diárias", "Caça-letra, bingo e jogo da memória", "Alfabeto móvel para recortar", "Gabarito"] },
  ] },
  "escrever-o-nome": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · Como a criança pensa a escrita, com ditado inicial", "Parte 1 · Meu nome tem letras: a primeira letra e a ordem das letras", "Parte 2 · Nomes curtos e nomes compridos: contar letras", "Parte 3 · Os nomes de quem eu gosto: a agenda da família", "Parte 4 · Usar palavras que eu já sei para escrever outras", "Parte 5 · Quantas e quais letras? Falar, bater palmas, escutar e escrever", "Parte 6 · Escrever para alguém: listas, etiquetas e bilhetes"] },
    { titulo: "Para praticar", itens: ["Escrita do meu jeito e erros que são pistas", "5 treinos diários", "Cartões de dobrar e alfabeto móvel para recortar", "Forca da flor e stop dos nomes", "Gabarito"] },
  ] },
  "ler-o-que-eu-sei": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · Como a criança lê antes de ler, com leitura inicial", "Parte 1 · Ler o que eu sei de cor: o dedo junto com a voz", "Parte 2 · Onde está escrito? As pistas da primeira letra, do tamanho e do final", "Parte 3 · Versos em ordem: Ciranda e O sapo não lava o pé", "Parte 4 · Rimas que ajudam a ler: Um, dois, feijão com arroz", "Parte 5 · Listas: uma palavra embaixo da outra", "Parte 6 · Ler sozinho frases curtas"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Dominó de palavra e figura, memória e tiras de versos para recortar", "Varal de poesias e livrinho dobrado", "Gabarito"] },
  ] },
  "juntar-e-tirar": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · O que a criança aprende e a observação inicial", "Parte 1 · Juntar: os sinais + e =", "Parte 2 · Acrescentar: guardar o maior na cabeça e a reta numérica", "Parte 3 · Tirar: riscar e o sinal −", "Parte 4 · Comparar: quantos a mais e quanto falta", "Parte 5 · Os amigos do 10", "Parte 6 · Problemas: que conta eu faço?"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Leitura: O piquenique da Formiga Fifi", "Quadros de dez, cartas e reta numérica para recortar", "Jogo Corrida até 20, mão na massa e gabarito"] },
  ] },
  "de-que-e-feito": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · O que a criança aprende e a observação inicial", "Parte 1 · De que é feito? Objeto e material", "Parte 2 · Natural ou fabricado? E a reciclagem", "Parte 3 · Sentir com as mãos: duro, liso, pesado", "Parte 4 · Ver através, quebrar, dobrar e molhar", "Parte 5 · Flutua ou afunda?", "Parte 6 · O que o ímã atrai?", "Parte 7 · O material certo para cada uso"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Leitura: Os três porquinhos e os materiais", "16 cartas e 6 placas para recortar e 4 jogos", "Mão na massa e gabarito"] },
  ] },
  "formas-e-padroes": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · O que a criança aprende e a observação inicial", "Parte 1 · As quatro formas: lados e pontas", "Parte 2 · Girou, continua igual", "Parte 3 · Quadrado ou retângulo?", "Parte 4 · Formas na casa", "Parte 5 · Juntar e desmontar formas", "Parte 6 · Padrões: o que se repete", "Parte 7 · Criar padrões"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Leitura: O robô de formas da Nina", "Tangram para recortar, desafios e jogos", "Mão na massa e gabarito"] },
  ] },
  "alem-do-ba-be-bi": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · O que a criança aprende e o ditado inicial", "Parte 1 · Nem toda sílaba é ba-be-bi", "Parte 2 · Encontros com R: BR, CR, DR, FR, GR, PR, TR, VR", "Parte 3 · Encontros com L: BL, CL, FL, GL, PL", "Parte 4 · NH, LH e CH: duas letras, um som", "Parte 5 · Consoante no fim da sílaba e M antes de P e B", "Parte 6 · R ou RR, S ou SS, QU e GU", "Parte 7 · Separar, contar e trocar sílabas"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Leitura: Bráulio, o dragão que espirrava", "40 fichas de sílabas e jogos", "Mão na massa e gabarito"] },
  ] },
  "separar-e-comparar": { blocos: [
    { titulo: "Partes da apostila", itens: ["Para o adulto · O que a criança aprende e a observação inicial", "Parte 1 · Separar por cor", "Parte 2 · Separar por forma e tamanho", "Parte 3 · Qual é a regra? O intruso", "Parte 4 · Mais, menos ou igual, ligando um a um", "Parte 5 · Colocar em ordem", "Parte 6 · Quantos a mais? Deixar igual"] },
    { titulo: "Para praticar", itens: ["Erros que são pistas e exercícios guiados", "5 treinos diários", "Leitura: A gaveta bagunçada", "24 peças para separar e jogo Batalha dos números", "Arrumar a casa por critério e gabarito"] },
  ] },
  "contar-ate-cem": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["As regras da contagem: contar de verdade, não de cor", "Escrever os números, com traçado de 0 a 9", "Comparar quantidades", "Formar dezenas com palitos e material dourado", "Contar em saltos", "Os padrões do quadro dos 100"] },
    { titulo: "Para praticar", itens: ["Quadro de dez, reta numérica e material dourado desenhados", "5 revisões diárias", "Bingo, jogo da memória e mercadinho com dinheiro de brincadeira", "Gabarito"] },
  ] },
  "medir-o-mundo": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["Comprimento: metro, centímetro e quilômetro", "Massa: quilograma e grama", "Capacidade: litro e mililitro", "Conversões, partindo do dinheiro: 1 real = 100 centavos, 1 metro = 100 centímetros", "O quadro das trocas"] },
    { titulo: "Para praticar", itens: ["5 treinos diários em que a ajuda vai diminuindo", "Jogo da memória das medidas", "Mão na massa na cozinha", "Gabarito"] },
  ] },
  "ouvir-o-mundo": { blocos: [
    { titulo: "Partes da apostila", itens: ["Antes de começar · Como um cientista investiga", "Parte 1 · Todo som é uma vibração", "Parte 2 · O som viaja: pelo ar, pela água e pelos sólidos", "Parte 3 · Grave e agudo: tamanho, esticado e grossura", "Parte 4 · Forte e fraco: a força da vibração e a distância", "Parte 5 · Como a gente ouve", "Parte 6 · Cuidar dos ouvidos", "Instrumentos musicais e ideias erradas sobre o som"] },
    { titulo: "Para praticar", itens: ["Exercícios guiados", "5 treinos diários", "Leitura: O telefone de lata do vovô", "Bingo dos sons", "Telefone de lata e a banda de casa", "Gabarito"] },
  ] },
  "olhar-o-ceu": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["O caminho do Sol e as sombras", "O dia e a noite", "As fases da Lua", "As estrelas", "Constelações: Cruzeiro do Sul e Três Marias"] },
    { titulo: "Para praticar", itens: ["Diário da Lua para 15 noites", "Experimentos com lanterna e biscoito", "5 revisões diárias", "Caça-palavras, jogo da memória e constelação na lata", "Gabarito"] },
  ] },

  "ontem-hoje-e-amanha": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · O que é verbo: ação, estado e fenômeno da natureza", "Parte 2 · O infinitivo e os grupos -AR, -ER e -IR", "Parte 3 · Quem faz a ação: as pessoas do verbo e a concordância", "Parte 4 · Ontem, hoje e amanhã: passado, presente e futuro", "Parte 5 · Dois jeitos de contar o passado: pretérito perfeito e imperfeito", "Parte 6 · Verbos irregulares: ser, estar, ter, ir, fazer, ver, dizer, trazer", "Parte 7 · -AM ou -ÃO? (cantaram × cantarão)", "Parte 8 · Um tempo só no texto: coerência verbal"] },
    { titulo: "Para praticar", itens: ["Erros comuns, exercícios guiados e desafios", "5 treinos diários", "Leitura: A caixa de lata", "Cartas de mímica e dados do tempo para montar", "Produção de texto, mão na massa e gabarito"] },
  ] },

  // ---------- Kits e outros gratuitos ----------
  "duende-tico": { blocos: [
    { titulo: "Nas 24 atividades do Advento", itens: ["Português: leitura, rimas e entrevista", "Matemática: problemas e contas", "Ciências: pequenos experimentos", "Arte, jogos e gentileza"] },
    { titulo: "Na caça ao presente", itens: ["Ler e seguir 6 pistas pela casa", "Juntar os números do código do cadeado", "Montar a Frase Secreta com as letras dos 24 dias"] },
  ], nota: "Atividades de 10 a 20 minutos, para crianças de 6 a 10 anos." },
  "olimpiada-gato-de-botas": { blocos: [
    { titulo: "A história", itens: ["O conto em 6 partes, cada uma com conversa e atividade", "Personagens e ordem da história", "Palavras do conto"] },
    { titulo: "Para a prova", itens: ["Jeito de contar e moral da história", "Jogos e desafios", "3 simulados no formato da prova", "Véspera e dia da prova", "Gabarito"] },
  ] },
  "olimpiada-enquanto-ana-espera": { blocos: [
    { titulo: "O livro", itens: ["Ficha do livro e mapa das quatro visitas", "Uma página para cada visita de Ana à Grande Árvore", "Ana e Eliseu, o fruto e o caminho", "Ordem da história e palavras do livro"] },
    { titulo: "Para a prova", itens: ["Jeito de contar, reflexão e jogos", "3 simulados de 10 questões, com relógio", "Véspera e dia da prova", "Gabarito"] },
  ] },
  "bruxa-matilda": { blocos: [
    { titulo: "O que as crianças trabalham na caça ao tesouro", itens: ["Leitura: pistas com 1 ou 2 palavras e desenho, e uma palavra no espelho", "Números: achar os morcegos e montar o código do cadeado", "Lógica: decifrar uma mensagem em símbolos", "Ciência: mensagem invisível e poção que espuma", "Corpo e sentidos: atravessar a teia sem tocar os sinos e a caixa de tato", "Cooperação: cada criança tem um papel, e ninguém é eliminado"] },
  ] },
  "caderno-de-conversa": { blocos: [
    { titulo: "Para cada livro", itens: ["A lição principal e um resumo para o adulto", "O que a criança pode aprender", "Dez perguntas com respostas: de compreensão, de interpretação e pessoais", "Uma atividade para fazer junto e o que ler depois"] },
    { titulo: "As 4 partes", itens: ["Português: rimas, letras, contos, fábulas, poesia, romances e crônicas", "Matemática: contagem, formas, dinheiro, divisão, mapas e lógica", "Ciências: corpo, plantas, bichos, som, céu, água e energia", "Estante de Formação: sentimentos, Brasil, mundo, mitos, literatura e arte"] },
  ] },
};
