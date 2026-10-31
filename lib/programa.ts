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

  // ---------- Apostilas ----------
  "nomear-e-descrever": { blocos: [
    { titulo: "Partes da apostila", itens: ["Parte 1 · Tudo tem um nome", "Parte 2 · Nome de todos e nome de um só (comum e próprio)", "Parte 3 · Um ou muitos? Masculino ou feminino?", "Parte 4 · Como é? O adjetivo", "Parte 5 · O adjetivo combina com o substantivo (concordância)", "Parte 6 · Descrever: pintar com palavras"] },
    { titulo: "Para praticar", itens: ["Leitura original", "Treino diário de 5 dias", "Jogo Quem sou eu? e caixa misteriosa", "Gabarito"] },
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
  "contar-ate-cem": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["As regras da contagem: contar de verdade, não de cor", "Escrever os números, com traçado de 0 a 9", "Comparar quantidades", "Formar dezenas com palitos e material dourado", "Contar em saltos", "Os padrões do quadro dos 100"] },
    { titulo: "Para praticar", itens: ["Quadro de dez, reta numérica e material dourado desenhados", "5 revisões diárias", "Bingo, jogo da memória e mercadinho com dinheiro de brincadeira", "Gabarito"] },
  ] },
  "medir-o-mundo": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["Comprimento: metro, centímetro e quilômetro", "Massa: quilograma e grama", "Capacidade: litro e mililitro", "Conversões, partindo do dinheiro: 1 real = 100 centavos, 1 metro = 100 centímetros", "O quadro das trocas"] },
    { titulo: "Para praticar", itens: ["5 treinos diários em que a ajuda vai diminuindo", "Jogo da memória das medidas", "Mão na massa na cozinha", "Gabarito"] },
  ] },
  "olhar-o-ceu": { blocos: [
    { titulo: "O que a criança trabalha", itens: ["O caminho do Sol e as sombras", "O dia e a noite", "As fases da Lua", "As estrelas", "Constelações: Cruzeiro do Sul e Três Marias"] },
    { titulo: "Para praticar", itens: ["Diário da Lua para 15 noites", "Experimentos com lanterna e biscoito", "5 revisões diárias", "Caça-palavras, jogo da memória e constelação na lata", "Gabarito"] },
  ] },

  // ---------- Kits e outros gratuitos ----------
  "duende-tico": { blocos: [
    { titulo: "Nas 24 atividades do Advento", itens: ["Português: leitura, rimas e entrevista", "Matemática: problemas e contas", "Ciências: pequenos experimentos", "Arte, jogos e gentileza"] },
    { titulo: "Na caça ao presente", itens: ["Ler e seguir 6 pistas pela casa", "Juntar os números do código do cadeado", "Montar a Frase Secreta com as letras dos 24 dias"] },
  ], nota: "Atividades de 10 a 20 minutos, para crianças de 6 a 10 anos." },
  "bruxa-matilda": { blocos: [
    { titulo: "O que as crianças trabalham na caça ao tesouro", itens: ["Leitura: pistas com 1 ou 2 palavras e desenho, e uma palavra no espelho", "Números: achar os morcegos e montar o código do cadeado", "Lógica: decifrar uma mensagem em símbolos", "Ciência: mensagem invisível e poção que espuma", "Corpo e sentidos: atravessar a teia sem tocar os sinos e a caixa de tato", "Cooperação: cada criança tem um papel, e ninguém é eliminado"] },
  ] },
  "caderno-de-conversa": { blocos: [
    { titulo: "Para cada livro", itens: ["A lição principal e um resumo para o adulto", "O que a criança pode aprender", "Dez perguntas com respostas: de compreensão, de interpretação e pessoais", "Uma atividade para fazer junto e o que ler depois"] },
    { titulo: "As 4 partes", itens: ["Português: rimas, letras, contos, fábulas, poesia, romances e crônicas", "Matemática: contagem, formas, dinheiro, divisão, mapas e lógica", "Ciências: corpo, plantas, bichos, som, céu, água e energia", "Estante de Formação: sentimentos, Brasil, mundo, mitos, literatura e arte"] },
  ] },
};
