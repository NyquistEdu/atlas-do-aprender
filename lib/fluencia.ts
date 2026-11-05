// Teste de fluência leitora do Atlas: três etapas de 1 minuto (palavras, pseudopalavras e texto),
// mais prosódia e perguntas de compreensão. Inspirado no formato das avaliações de fluência usadas
// pelas redes públicas (CAEd), com textos próprios do Atlas.

export type Pergunta = { p: string; r: string };
export type Forma = { palavras: string[]; pseudo: string[]; titulo: string; texto: string; perguntas: Pergunta[] };
export type Nivel = { id: "1" | "2" | "3"; nome: string; anos: string; formas: Record<"A" | "B", Forma> };

export const NIVEIS: Nivel[] = [
  {
    id: "1", nome: "Nível 1", anos: "1º e 2º ano",
    formas: {
      A: {
        palavras: ["bola", "casa", "pato", "mesa", "vaca", "dedo", "sapo", "lua", "rato", "fada", "gato", "mala",
          "sino", "bolo", "uva", "pipa", "copo", "faca", "menino", "cavalo", "sapato", "janela", "tomate", "macaco",
          "boneca", "cabelo", "peteca", "panela", "galinha", "chuva", "queijo", "carro", "prato", "flor", "trem", "livro",
          "festa", "porta", "barco", "sorvete", "estrela", "bruxa", "chinelo", "escola", "palhaço", "girafa", "ninho", "blusa"],
        pseudo: ["bafe", "tilo", "mupa", "sige", "vanu", "gumi", "lifo", "fime", "nole", "dabu", "zoti", "pemo",
          "cufe", "tobe", "rupe", "fanica", "mutela", "sorapi", "bicuno", "tamelo", "lodeca", "punira", "gavito", "renafo",
          "cobime", "brafe", "plico", "trume", "drapo", "glemo", "cranti", "tolva", "perqui", "nhapo", "quibo", "guefa"],
        titulo: "O passeio de Lia",
        texto: "Lia tem um cachorro chamado Bolinha. Todo sábado, os dois vão ao parque perto de casa. Lia leva uma bola vermelha e uma garrafa de água.\nNo parque, Bolinha corre atrás da bola e pula na grama. Lia ri muito.\nUm dia, a bola caiu no lago. Bolinha olhou para a água e latiu. Um menino pegou um galho comprido e puxou a bola até a beirada.\n— Obrigada! — disse Lia.\nO menino se chamava Rafa. Desde aquele dia, Lia, Rafa e Bolinha brincam juntos todo sábado.",
        perguntas: [
          { p: "Como se chama o cachorro de Lia?", r: "Bolinha." },
          { p: "O que Lia leva para o parque?", r: "Uma bola vermelha e uma garrafa de água." },
          { p: "Onde a bola caiu?", r: "No lago." },
          { p: "Como o menino pegou a bola?", r: "Com um galho comprido." },
          { p: "O que mudou depois daquele dia?", r: "Os três passaram a brincar juntos (ficaram amigos)." },
        ],
      },
      B: {
        palavras: ["dado", "foca", "mapa", "roda", "lata", "suco", "pena", "vela", "muro", "selo", "mola", "fogo",
          "bota", "pia", "pipoca", "cebola", "moeda", "pijama", "banana", "camelo", "tapete", "cadeira", "foguete", "telhado",
          "minhoca", "coelho", "praia", "fruta", "grama", "peixe", "chave", "nuvem", "papel", "lápis", "planta", "cobra",
          "tigre", "folha", "milho", "caderno", "sorriso", "presente", "pássaro", "abelha", "dragão", "gelo", "gema", "sol"],
        pseudo: ["tame", "boli", "fubi", "nesto", "vipa", "cabi", "lomu", "rido", "sefa", "mebo", "dupi", "gova",
          "pine", "faco", "tupe", "camupe", "belino", "foraci", "ludepa", "tisavo", "monefa", "rubica", "pelafo", "sinoto",
          "garipe", "bliva", "frode", "trapi", "clefo", "grume", "porfe", "salmi", "chafo", "lhumo", "quepa", "gimo"],
        titulo: "A horta da escola",
        texto: "Na escola de Téo tem uma horta pequena atrás do pátio. Cada turma cuida de um canteiro.\nA turma de Téo plantou alface, cenoura e tomate. Toda manhã, uma criança enche o regador e molha as plantas.\nUm dia, as folhas da alface apareceram cheias de buracos. A professora olhou de perto e achou uma lagarta verde.\n— Ela também está com fome! — riu Téo.\nAs crianças levaram a lagarta para uma árvore longe da horta. Semanas depois, viram uma borboleta amarela voando sobre os canteiros.",
        perguntas: [
          { p: "Onde fica a horta da escola?", r: "Atrás do pátio." },
          { p: "O que a turma de Téo plantou?", r: "Alface, cenoura e tomate." },
          { p: "O que estava comendo as folhas da alface?", r: "Uma lagarta verde." },
          { p: "O que as crianças fizeram com a lagarta?", r: "Levaram para uma árvore longe da horta." },
          { p: "O que a borboleta amarela tem a ver com a lagarta?", r: "A lagarta virou a borboleta." },
        ],
      },
    },
  },
  {
    id: "2", nome: "Nível 2", anos: "3º ano",
    formas: {
      A: {
        palavras: ["bicicleta", "travesseiro", "chocolate", "guarda-chuva", "passarinho", "computador", "dinossauro", "brinquedo",
          "príncipe", "ninguém", "quintal", "gelatina", "formiga", "mochila", "relógio", "tesoura", "elefante", "borboleta",
          "farinha", "piscina", "sanduíche", "abacaxi", "orelha", "cozinha", "fantasma", "estrada", "pescador", "lanterna",
          "campeão", "tartaruga", "girassol", "explosão", "chiclete", "flauta", "bruxinha", "aniversário", "geladeira", "trovão",
          "esquilo", "caminhão", "planeta", "sombra", "folhagem", "assobio", "fogueira", "carrinho", "agulha", "biscoito"],
        pseudo: ["brostela", "canfimo", "lopraga", "tulhenco", "frasmeta", "guistolo", "pindrava", "cholmeta", "sercapo", "blanquite",
          "mursela", "trenhofa", "quebrimo", "danselu", "flomarca", "gliturno", "porvanhe", "zentrovo", "carlimpo", "nestrafo",
          "plusmeca", "verdomba", "sinclave", "trombelo", "chaspilu", "ronfeca", "gramisto", "lusterpo", "bremanto", "sorquilo"],
        titulo: "O segredo do farol",
        texto: "Na pequena vila de pescadores, havia um farol antigo no alto das pedras. Ninguém subia lá havia muitos anos, porque a porta vivia trancada.\nNuma tarde de ventania, Clara e o irmão, Pedro, encontraram uma chave enferrujada na areia da praia. Na ponta da chave, estava gravado o desenho de um farol.\n— Será que ela abre a porta? — perguntou Pedro, com os olhos arregalados.\nOs dois correram até as pedras. A chave girou com um rangido, e a porta se abriu devagar. Lá dentro, uma escada em caracol subia até o topo.\nNo último degrau, eles encontraram uma caixa de madeira com cartas antigas. Eram mensagens de um faroleiro para a filha, contando como guiava os barcos nas noites de tempestade.\nClara e Pedro levaram as cartas para o museu da vila. Desde então, o farol foi reformado e voltou a brilhar todas as noites.",
        perguntas: [
          { p: "Por que ninguém subia no farol?", r: "Porque a porta vivia trancada." },
          { p: "O que Clara e Pedro encontraram na praia?", r: "Uma chave enferrujada com o desenho de um farol." },
          { p: "O que havia dentro da caixa de madeira?", r: "Cartas antigas de um faroleiro para a filha." },
          { p: "Como Pedro se sentiu ao achar a chave? Como você sabe?", r: "Curioso/animado: ele perguntou se a chave abria a porta, com os olhos arregalados." },
          { p: "Por que o farol voltou a brilhar no final?", r: "Porque, depois que as cartas foram para o museu, o farol foi reformado." },
        ],
      },
      B: {
        palavras: ["bombeiro", "telefone", "escorregador", "macarrão", "fotografia", "cachorrinho", "jacaré", "almofada",
          "astronauta", "pirulito", "lençol", "melancia", "cenoura", "palhaçada", "jardineiro", "montanha", "pantufa", "lagartixa",
          "foguete", "trampolim", "cachoeira", "guitarra", "bandeira", "joaninha", "esconderijo", "escova", "pipoqueiro", "travessura",
          "golfinho", "canguru", "chapéu", "dentista", "parque", "tambor", "pulseira", "biblioteca", "vassoura", "fivela",
          "cogumelo", "helicóptero", "brigadeiro", "nuvem", "framboesa", "queijadinha", "galinheiro", "relâmpago", "estojo", "coruja"],
        pseudo: ["prandelo", "folquima", "tresnaca", "bilhosto", "gruntela", "cosmilha", "plenduva", "charvito", "quindreco", "mastrolu",
          "dobranhe", "sulfeca", "blinqueta", "vortamo", "crelusa", "nampreto", "gostelha", "fliranco", "torvesme", "puscadi",
          "lhanteca", "brismoda", "sanfrelo", "quertaba", "glomecho", "ranviste", "trusbalho", "cindrepa", "folsanto", "mesquide"],
        titulo: "A grande corrida de carrinhos",
        texto: "Todo ano, a rua de Davi organizava uma corrida de carrinhos de rolimã. As crianças passavam semanas construindo os carrinhos com tábuas, rodinhas e muita criatividade.\nNaquele ano, Davi resolveu fazer o carrinho com a avó, que era marceneira. Juntos, eles lixaram a madeira, pintaram tudo de azul e colocaram uma bandeira com um raio desenhado.\nNo dia da corrida, a rua estava cheia de vizinhos. Na largada, Davi saiu atrás de todos, mas foi ganhando velocidade na descida.\nPerto da chegada, a roda de trás do carrinho de Beatriz soltou. Davi poderia passar e ganhar, mas parou para ajudar a amiga a recolocar a roda.\nOs dois cruzaram a linha juntos, em último lugar. Mesmo assim, os vizinhos aplaudiram de pé, e a avó de Davi disse que nunca tinha sentido tanto orgulho.",
        perguntas: [
          { p: "Com quem Davi construiu o carrinho?", r: "Com a avó, que era marceneira." },
          { p: "Como ficou o carrinho de Davi?", r: "Pintado de azul, com uma bandeira com um raio." },
          { p: "O que aconteceu com o carrinho de Beatriz?", r: "A roda de trás soltou." },
          { p: "Por que Davi chegou em último lugar?", r: "Porque parou para ajudar Beatriz." },
          { p: "Por que a avó sentiu orgulho, mesmo com o último lugar?", r: "Porque Davi escolheu ajudar a amiga em vez de ganhar." },
        ],
      },
    },
  },
  {
    id: "3", nome: "Nível 3", anos: "4º e 5º ano",
    formas: {
      A: {
        palavras: ["exceção", "experiência", "cumprimento", "hipopótamo", "atmosfera", "paralelepípedo", "extraordinário", "necessário",
          "constelação", "obstáculo", "característica", "lâmpada", "silêncio", "independência", "músculo", "cérebro", "arqueólogo", "fábrica",
          "trânsito", "exército", "pêssego", "ventilador", "crocodilo", "espetáculo", "microscópio", "previsão", "chuveiro", "mergulhador",
          "esqueleto", "rinoceronte", "xícara", "própria", "explicação", "acessório", "fósforo", "abóbora", "excelente", "período",
          "frequência", "aquário", "armazém", "construção", "bússola", "geografia", "vegetação", "anfíbio", "admirável", "oxigênio"],
        pseudo: ["trebanfolo", "cospeltura", "flimaderco", "quastrenil", "brindecola", "palusmétrico", "ganforisto", "sitrelhado", "obrastenca", "mulpicavo",
          "derfanoma", "clusterino", "prelanquia", "vostrimenta", "galpéreo", "nosfidreca", "transpélico", "cimbrolago", "fartessula", "plomagenco",
          "rusquivente", "doltrâmico", "esfruglana", "binquestro", "telmofrade", "gruspávolo", "mentrolisco", "abrosquina", "cavendrulo", "solfristeca"],
        titulo: "O voo das tartarugas",
        texto: "As tartarugas marinhas existem há mais de cem milhões de anos. Elas já nadavam nos oceanos quando os dinossauros ainda andavam pela Terra.\nUma das coisas mais impressionantes sobre esses animais é a forma como eles voltam para casa. A fêmea, depois de passar anos viajando pelo oceano, retorna para a mesma praia onde nasceu para colocar seus ovos. Os cientistas acreditam que ela consegue fazer isso porque sente o campo magnético da Terra, como se carregasse uma bússola dentro do corpo.\nNa areia, a mãe cava um buraco, deposita cerca de cem ovos e vai embora. Depois de uns dois meses, os filhotes quebram a casca e correm para o mar, quase sempre à noite, guiados pelo brilho da lua refletido na água.\nInfelizmente, as luzes das casas e das ruas perto da praia confundem os filhotes, que acabam indo na direção errada. Por isso, em várias cidades do litoral brasileiro, as luzes são apagadas ou cobertas durante a época de desova. Pequenas atitudes como essa ajudam a proteger animais que sobrevivem há milhões de anos.",
        perguntas: [
          { p: "Há quanto tempo as tartarugas marinhas existem?", r: "Há mais de cem milhões de anos." },
          { p: "Para onde a fêmea volta para colocar os ovos?", r: "Para a mesma praia onde nasceu." },
          { p: "Como os filhotes sabem para onde ir quando nascem?", r: "Seguem o brilho da lua refletido na água." },
          { p: "Por que as luzes das casas atrapalham os filhotes?", r: "Elas os confundem, e eles vão na direção errada, para longe do mar." },
          { p: "No texto, o que quer dizer “como se carregasse uma bússola dentro do corpo”?", r: "Que a tartaruga sabe se orientar sozinha, sentindo o campo magnético, como uma bússola." },
        ],
      },
      B: {
        palavras: ["helicóptero", "biblioteca", "pássaro", "espécie", "magnífico", "ortografia", "coração", "sobrancelha",
          "astronômico", "pântano", "quilômetro", "felicidade", "estômago", "matemática", "relâmpago", "atenção", "príncipe", "exposição",
          "eletricidade", "telescópio", "travessia", "público", "máquina", "trajetória", "orquestra", "fenômeno", "ambulância", "agricultor",
          "inteligência", "ingrediente", "cachoeira", "crescimento", "extinção", "camaleão", "nascimento", "décimo", "oceano", "previdência",
          "temperatura", "gigantesco", "excursão", "hipótese", "árbitro", "satélite", "maravilhoso", "último", "conhecimento", "tecnologia"],
        pseudo: ["blastremido", "quintolfera", "drespâmico", "solvanteiro", "gruminesca", "plantorélio", "cofrastino", "mesquidaria", "trolvenape", "fenquistora",
          "abrontélio", "vuspernaca", "clorindesto", "pastrúmega", "selfordino", "migrastela", "dorquinavo", "bresmolidro", "talpeníscio", "farnodesco",
          "lustrovenca", "embrifólico", "gartesquino", "prolvimeda", "sonfrálico", "quembrastilo", "nerpaduco", "cifrontela", "dramolesco", "voltriscana"],
        titulo: "A menina que contava estrelas",
        texto: "Quando era pequena, Marina passava as noites de férias na casa do avô, no interior. Lá não havia prédios nem postes acesos, e o céu ficava tão cheio de estrelas que parecia ter sido salpicado de açúcar.\nO avô conhecia o nome de muitas constelações. Ele apontava para o céu e mostrava as Três Marias, o Cruzeiro do Sul e o brilho avermelhado de Marte. Marina tentava contar as estrelas, mas sempre perdia a conta antes de chegar a cem.\n— Ninguém consegue contar todas — dizia o avô, rindo. — Mas dá para conhecer algumas como se fossem amigas.\nAnos depois, Marina estudou astronomia e passou a trabalhar em um observatório. Com telescópios enormes, ela observa galáxias tão distantes que a luz delas leva milhões de anos para chegar até nós.\nAinda assim, sempre que volta ao interior, ela se deita na grama e procura o Cruzeiro do Sul. Diz que nenhum telescópio substitui a sensação de olhar o céu ao lado de alguém que nos ensinou a gostar dele.",
        perguntas: [
          { p: "Por que o céu da casa do avô ficava tão cheio de estrelas?", r: "Porque lá não havia prédios nem postes acesos." },
          { p: "Que constelações o avô mostrava?", r: "As Três Marias e o Cruzeiro do Sul (e o brilho de Marte)." },
          { p: "Em que Marina foi trabalhar quando cresceu?", r: "Em um observatório, como astrônoma." },
          { p: "O que o avô quis dizer com “dá para conhecer algumas como se fossem amigas”?", r: "Que não precisa contar todas: dá para aprender o nome e reconhecer algumas estrelas." },
          { p: "Por que Marina ainda procura o Cruzeiro do Sul quando volta ao interior?", r: "Porque lembra do avô, que a ensinou a gostar do céu." },
        ],
      },
    },
  },
];

export const NIVEL_DO_ANO: Record<string, Nivel["id"]> = { "1": "1", "2": "1", "3": "2", "4": "3", "5": "3" };

export const TIPOS_ERRO: [string, string][] = [
  ["troca", "Trocou letras (pato → bato)"],
  ["parte", "Leu só um pedaço da palavra"],
  ["inventou", "Inventou ou adivinhou pela figura/começo"],
  ["pulou", "Pulou a palavra"],
  ["silabou", "Silabou e não chegou na palavra"],
];

export const PROSODIA: [number, string][] = [
  [1, "Lê palavra por palavra, sem ritmo."],
  [2, "Lê em pedacinhos de 2 ou 3 palavras, com pausas fora do lugar."],
  [3, "Lê frases inteiras e respeita a maioria dos pontos, com pouca expressão."],
  [4, "Lê com ritmo e expressão, respeita pontos e muda a voz nas perguntas e falas."],
];

/** Palavras do texto, na ordem, para marcar erros e onde parou. Travessões e pontuação não contam. */
export function tokens(texto: string): { t: string; w: boolean }[] {
  return texto.split(/(\s+)/).filter((s) => s !== "").map((t) => ({ t, w: /[\p{L}\p{N}]/u.test(t) }));
}

export type Etapa = { lidas: number; erros: Record<number, string>; seg: number };
export type Resultado = {
  id: string; crianca: string; data: string; nivel: Nivel["id"]; forma: "A" | "B";
  palavras: Etapa; pseudo: Etapa; texto: Etapa; prosodia: number; comp: boolean[];
};

export const corretas = (e: Etapa) => Math.max(0, e.lidas - Object.keys(e.erros).length);
export const porMinuto = (e: Etapa) => (e.seg > 0 ? Math.round((corretas(e) * 60) / e.seg) : 0);
export const precisao = (e: Etapa) => (e.lidas > 0 ? Math.round((corretas(e) / e.lidas) * 100) : 0);

export type Perfil = { id: "pre" | "iniciante" | "fluente"; nome: string; desc: string };
/** Critérios das avaliações de fluência do CAEd (2º ano): pré-leitor, leitor iniciante, leitor fluente. */
export function perfil(r: Resultado): Perfil {
  const pal = porMinuto(r.palavras), ps = porMinuto(r.pseudo), tx = porMinuto(r.texto), pr = precisao(r.texto);
  if (tx > 65 && pr >= 90) return { id: "fluente", nome: "Leitor fluente", desc: "Lê o texto com velocidade e precisão: mais de 65 palavras corretas por minuto, errando menos de 1 em cada 10." };
  if (pal >= 11 && ps >= 6) return { id: "iniciante", nome: "Leitor iniciante", desc: "Já decodifica palavras sozinho, mas ainda lê o texto devagar ou com muitos erros. Agora é ganhar ritmo e segurança." };
  return { id: "pre", nome: "Pré-leitor", desc: "Ainda está aprendendo a juntar as letras e os sons para ler palavras. É uma fase normal da alfabetização: o foco é o som das letras e as sílabas." };
}

export type Dica = { t: string; d: string; link?: [string, string] };
export function recomendacoes(r: Resultado): Dica[] {
  const out: Dica[] = [];
  const p = perfil(r);
  const todos = [r.palavras, r.pseudo, r.texto].flatMap((e) => Object.values(e.erros));
  const n = (k: string) => todos.filter((x) => x === k).length;
  const pal = porMinuto(r.palavras), ps = porMinuto(r.pseudo);
  const acertos = r.comp.filter(Boolean).length;
  if (p.id === "pre") {
    out.push({ t: "Firmar o som das letras e as sílabas", d: "Antes da velocidade, a criança precisa ligar cada letra ao seu som e juntar sílabas. Use o treino com 5 a 10 minutos por dia.", link: ["/apostilas/treino-ouvir-as-letras", "Treino Diário · Ouvir as Letras"] });
    if (pal >= 4) out.push({ t: "Ler palavras curtas todos os dias", d: "Ela já lê algumas palavras. Leituras curtas e repetidas (parlendas, listas, cantigas) dão segurança.", link: ["/apostilas/treino-ler-o-que-eu-sei", "Treino Diário · Ler o que eu sei"] });
  }
  if (p.id !== "pre" && pal > 0 && ps < pal * 0.5) out.push({ t: "Decodificar sem adivinhar", d: "Ela lê bem as palavras conhecidas, mas trava nas inventadas: sinal de que reconhece algumas palavras de memória e ainda não decodifica todas. Brinque de ler palavras inventadas e de trocar sílabas.", link: ["/apostilas/treino-brincar-com-as-palavras", "Treino Diário · Brincar com as Palavras"] });
  if (n("troca") >= 2) out.push({ t: "Atenção às letras trocadas", d: "Apareceram trocas de letras. Veja quais pares se repetem. Se for T e D (ou P e B, F e V), o treino de surdo e sonoro ajuda muito.", link: ["/apostilas/treino-t-ou-d", "Treino Diário · T ou D?"] });
  if (n("inventou") + n("parte") >= 3) out.push({ t: "Ler a palavra até o fim", d: "Ela adivinha pela primeira parte. Peça que passe o dedo embaixo da palavra inteira antes de falar. Ler devagar e certo vem antes de ler rápido." });
  if (p.id === "iniciante") out.push({ t: "Leitura repetida, 10 minutos por dia", d: "Escolha um texto curto e leia três vezes no mesmo dia: primeiro você lê e ela acompanha com o dedo, depois vocês leem juntos, por fim ela lê sozinha. A velocidade cresce de forma natural.", link: ["/apostilas/treino-ler-o-que-eu-sei", "Treino Diário · Ler o que eu sei"] });
  if (r.prosodia > 0 && r.prosodia <= 2 && p.id !== "pre") out.push({ t: "Ler com expressão", d: "Faça leitura em eco: você lê uma frase com expressão e ela repete do mesmo jeito. Diálogos, gibis e poemas são ótimos para isso." });
  if (r.comp.length && acertos <= 2 && p.id !== "pre") out.push({ t: "Entender o que leu", d: "Ela lê, mas guarda pouco da história. Faça pausas a cada parágrafo e pergunte: quem? onde? o que aconteceu? Depois, peça que conte a história com as próprias palavras.", link: ["/trilhas/portugues/2-ano", "Trilha de Português"] });
  if (p.id === "fluente" && acertos >= 4) out.push({ t: "Ampliar a leitura", d: "Leitura fluente e com compreensão. Agora é variar os textos (contos, notícias, textos de ciências) e conversar sobre o que leu.", link: ["/livros", "Sugestões de livros"] });
  if (!out.length) out.push({ t: "Manter o ritmo", d: "Continue com 15 minutos de leitura por dia e refaça o teste daqui a 2 ou 3 meses, com a outra versão do texto." });
  return out;
}

export const nivelPorId = (id: string) => NIVEIS.find((n) => n.id === id) || NIVEIS[0];
