// Kit de Observação em Casa: fichas e jogos de observação pedagógica para famílias.
// Todos os itens são originais do Atlas (não reproduzem instrumentos clínicos publicados).
// Não é diagnóstico: orienta o treino no Atlas e quando procurar um profissional.

export type Item = string | { t: string; flag?: boolean; cat?: string };
export type Erro = { t: string; ex: string; som: boolean };
export type Ficha = {
  id: string; titulo: string; sub: string; minSerie: number; tipo: "escala" | "ditado" | "pref"; positivo?: boolean;
  intro: string; itens?: Item[]; palavras?: string[]; frase?: string; erros?: Erro[];
  atlas: string; quem: string; dica: string;
};
export const itemText = (it: Item) => (typeof it === "string" ? it : it.t);

export const ESCALA = ["Nunca","Às vezes","Quase sempre"];

export const FICHAS: Ficha[] = [
 {id:"leitura", titulo:"Leitura", sub:"Sinais ligados à dislexia", minSerie:2, tipo:"escala",
  intro:"Peça que a criança leia em voz alta um texto da série dela por 2 a 3 minutos, em dias diferentes. Marque o que acontece com frequência.",
  itens:[
   "Confunde letras parecidas (b/d, p/q, m/n)",
   "Troca sons parecidos ao ler (f/v, t/d, p/b)",
   "Lê sílaba por sílaba, muito devagar para a série",
   "Pula palavras ou linhas",
   "Inventa palavras pelo começo ou pelo desenho",
   "Lê a mesma palavra de jeitos diferentes no mesmo texto",
   "Tem dificuldade com rimas e brincadeiras de sons",
   "Termina de ler e não sabe contar o que leu",
   "Entende bem quando alguém lê para ela, mas não quando ela mesma lê",
   "Cansa, chora ou foge na hora de ler",
   "Alguém da família teve dificuldade parecida com leitura"
  ],
  atlas:"Treine consciência dos sons (rimas, sílabas, primeiro som da palavra) e leitura em voz alta de textos curtos, 15 minutos por dia. Leia para ela também: isso mantém o gosto pelas histórias.",
  quem:"Faça exame de vista e de audição. Depois, converse com a escola e procure fonoaudiólogo ou psicopedagogo.",
  dica:"O sinal mais importante é a diferença entre entender ouvindo e entender lendo."
 },
 {id:"escrita", titulo:"Escrita e traçado", sub:"Sinais ligados à disgrafia", minSerie:2, tipo:"escala",
  intro:"Peça que copie 3 linhas de um livro e depois escreva 3 frases sobre o dia dela. Guarde as folhas com a data. Aqui você olha a forma da letra e o esforço, não a ortografia.",
  itens:[
   "Segura o lápis com muita força ou de jeito desconfortável",
   "Reclama de dor ou cansaço na mão depois de pouco tempo",
   "Letras de tamanhos muito diferentes na mesma linha",
   "Não respeita a linha (sobe, desce, sai do caderno)",
   "Espaço irregular entre letras e palavras",
   "Escreve com letra que nem ela consegue ler depois",
   "Copia muito devagar comparada a outras crianças da idade",
   "Apaga e refaz muitas vezes",
   "Explica bem a ideia falando, mas escreve muito pouco",
   "Tem dificuldade também para recortar, abotoar ou amarrar o tênis"
  ],
  atlas:"Prefira atividades curtas de traçado, massinha, pinça e recorte a cópias longas. Deixe que ela conte a ideia em voz alta antes de escrever.",
  quem:"Se a dificuldade aparece também em recortar e abotoar, um terapeuta ocupacional pode avaliar a coordenação fina.",
  dica:"Compare folhas de meses diferentes: a evolução diz mais que uma folha só."
 },
 {id:"ditado", titulo:"Ortografia: ditado", sub:"Sinais ligados à disortografia", minSerie:2, tipo:"ditado",
  intro:"Dite as palavras e a frase abaixo, uma por vez, falando normalmente (sem separar sílabas). Depois conte quantas vezes cada tipo de erro apareceu.",
  palavras:["faca","vaca","pato","bola","dedo","telhado","galinha","cachorro","carro","caro","prato","blusa","casa","cebola","exemplo","chuva","laranja","gelo","campo","cantar"],
  frase:"O menino comeu a laranja embaixo da árvore.",
  erros:[
   {t:"Troca de sons parecidos (f/v, p/b, t/d, c/g)", ex:"vaca → faca", som:true},
   {t:"Falta ou sobra de letra", ex:"prato → pato", som:true},
   {t:"Letras fora de ordem", ex:"blusa → bulsa", som:true},
   {t:"Escreve como fala", ex:"cantar → cantá", som:false},
   {t:"Dúvida de regra (s/z/ss/ç, x/ch, g/j)", ex:"casa → caza", som:false},
   {t:"Erro com nh, lh, ch, rr", ex:"galinha → galina", som:false},
   {t:"M ou N antes de consoante", ex:"campo → canpo", som:false},
   {t:"Junta ou separa palavras", ex:"embaixo da → enbaixoda", som:false},
   {t:"Esquece maiúscula ou ponto final", ex:"o menino comeu", som:false}
  ],
  atlas:"Erros de regra melhoram com leitura e treino de famílias de palavras. Erros de som pedem treino de consciência fonológica: falar devagar, sentir o som na boca, comparar pares como faca/vaca.",
  quem:"Erros de som que continuam no 3º ano ou depois, junto com sinais na ficha de Leitura, pedem conversa com fonoaudiólogo ou psicopedagogo.",
  dica:"Repita o mesmo ditado a cada 2 meses e compare."
 },
 {id:"matematica", titulo:"Matemática", sub:"Sinais ligados à discalculia", minSerie:2, tipo:"escala",
  intro:"Observe nas tarefas do Atlas e no dia a dia (dinheiro, relógio, jogos de tabuleiro) durante algumas semanas.",
  itens:[
   "Conta nos dedos mesmo em contas que já treinou muito",
   "Precisa contar um por um para saber quantos há num grupo de 3 ou 4 objetos",
   "Confunde números parecidos ao ler ou escrever (12/21, 6/9)",
   "Escreve números como fala (cento e dois → 1002)",
   "Não sabe dizer qual de dois números é maior",
   "Esquece de um dia para o outro contas simples que já sabia (2 + 3, 5 + 5)",
   "Se perde ao contar de 2 em 2, de 5 em 5 ou de trás para frente",
   "Tem dificuldade com relógio, dinheiro ou calendário para a idade",
   "Entende o problema quando você lê, mas não sabe qual conta fazer",
   "Fica muito ansiosa ou trava diante de atividades de matemática"
  ],
  atlas:"Volte ao concreto: material dourado, palitos, dinheiro de brinquedo, reta numérica no chão. Jogos de dados e de cartas treinam quantidade sem pressão.",
  quem:"Se os sinais continuam depois de meses de treino com material concreto, procure psicopedagogo ou avaliação neuropsicológica.",
  dica:"Ansiedade com matemática pode parecer dificuldade. Observe se ela trava menos quando é brincadeira."
 },
 {id:"atencao", titulo:"Atenção e agitação", sub:"Sinais ligados ao TDAH", minSerie:1, tipo:"escala",
  intro:"Pense nos últimos 6 meses e compare com crianças da mesma idade. Sono ruim, muitas telas, ansiedade e mudanças na família também mexem com a atenção.",
  itens:[
   "Começa a tarefa e se distrai antes de 5 minutos",
   "Precisa que a instrução seja repetida várias vezes",
   "Perde material, brinquedos ou objetos do dia a dia",
   "Deixa tarefas pela metade e pula para outra coisa",
   "Erra por pressa, mesmo sabendo o conteúdo",
   "Parece estar no mundo da lua quando falam com ela",
   "Não consegue ficar sentada nas refeições ou nas tarefas",
   "Mexe nas coisas, balança as pernas, está sempre em movimento",
   "Fala muito e interrompe conversas",
   "Tem muita dificuldade de esperar a vez em jogos e filas",
   "Age sem pensar e acaba se machucando ou quebrando coisas",
   "Professores ou parentes também comentam esses comportamentos"
  ],
  atlas:"Use blocos curtos (5 a 10 minutos) com pausa para se mexer, uma tarefa por vez na mesa e um checklist visual do dia. Elogie o esforço logo depois que ele acontece.",
  quem:"Se os sinais aparecem em casa e na escola há mais de 6 meses, converse com o pediatra. Ele pode encaminhar para neuropediatra, psiquiatra infantil ou psicólogo.",
  dica:"O item sobre a escola conta muito: os sinais de TDAH costumam aparecer em mais de um lugar."
 },
 {id:"social", titulo:"Comunicação e interação", sub:"Sinais ligados ao autismo", minSerie:0, tipo:"escala",
  intro:"Para crianças de qualquer idade. Para bebês de 16 a 30 meses, peça ao pediatra o M-CHAT-R/F, que é o questionário oficial de rastreio.",
  itens:[
   "Não responde quando chamam pelo nome, mesmo ouvindo bem",
   "Evita ou estranha olhar nos olhos durante a conversa",
   "Não aponta nem mostra coisas para dividir o interesse com você",
   "Prefere brincar sozinha e raramente chama outras crianças",
   "Repete falas de desenhos ou frases fora de contexto",
   "Entende frases ao pé da letra e não pega piadas para a idade",
   "Tem interesse muito intenso por um assunto e fala quase só dele",
   "Fica muito abalada com mudanças pequenas de rotina",
   "Reage muito forte a barulhos, texturas, roupas ou comidas",
   "Faz movimentos repetidos (balançar, girar, mexer as mãos) quando está animada ou nervosa",
   {t:"Perdeu palavras ou habilidades que já tinha (fala, brincadeira, contato)", flag:true}
  ],
  atlas:"Antecipe a rotina com quadros visuais, avise antes das mudanças e use o interesse favorito da criança como porta de entrada para as atividades.",
  quem:"Converse com o pediatra, que pode encaminhar para neuropediatra ou psiquiatra infantil. Quanto mais cedo a avaliação, melhor.",
  dica:"Perda de habilidades em qualquer idade é motivo para procurar o pediatra logo, sem esperar."
 },
 {id:"convivencia", titulo:"Convivência e regras", sub:"Sinais ligados ao TOD", minSerie:0, tipo:"escala",
  intro:"Toda criança testa limites. Marque pensando nos últimos 6 meses e no que é mais forte que o comum para a idade.",
  itens:[
   "Perde a paciência e explode com facilidade",
   "Discute muito com adultos",
   "Recusa combinados simples de propósito",
   "Provoca ou irrita os outros de propósito",
   "Culpa os outros pelos próprios erros",
   "Fica com raiva e guarda rancor por muito tempo",
   "Os conflitos atrapalham a rotina da família quase todo dia",
   "Os conflitos acontecem também fora de casa (escola, parentes)"
  ],
  atlas:"Combine poucas regras, claras e escritas, com consequências previsíveis. Reserve 10 minutos por dia de brincadeira escolhida pela criança, sem correções.",
  quem:"Um psicólogo infantil pode ajudar a criança e orientar a família. Vale também observar se há cansaço, dificuldades na escola ou mudanças recentes por trás.",
  dica:"Às vezes a oposição aparece quando a tarefa é difícil demais. Compare com as fichas de Leitura e Atenção."
 },
 {id:"escuta", titulo:"Escuta e compreensão", sub:"Sinais ligados ao processamento auditivo e à linguagem", minSerie:1, tipo:"escala",
  intro:"Observe em conversas, histórias lidas em voz alta e instruções do dia a dia. Combine com o jogo Siga o comando.",
  itens:[
   "Pede para repetir com frequência (\"hã?\", \"o quê?\")",
   "Entende mal quando há barulho em volta (TV, várias pessoas falando)",
   "Confunde palavras de som parecido (pato/bato, faca/vaca)",
   "Esquece instruções com dois ou três passos",
   "Se perde em histórias lidas em voz alta",
   "Demora para responder, como se precisasse processar",
   "Cansa ou se dispersa em conversas longas",
   "Tem dificuldade de localizar de onde vem um som"
  ],
  atlas:"Fale de frente para a criança, uma instrução por vez, em ambiente silencioso. Brincadeiras de rimas, ritmos e músicas treinam a escuta.",
  quem:"Comece pelo exame de audição. Se a audição estiver normal, um fonoaudiólogo pode avaliar o processamento auditivo e a linguagem.",
  dica:"Audição normal não descarta dificuldade de processar o que ouve."
 },
 {id:"talentos", titulo:"Talentos e criatividade", sub:"Sinais de altas habilidades", minSerie:0, tipo:"escala", positivo:true,
  intro:"Aqui \"quase sempre\" mostra pontos fortes. Altas habilidades podem existir junto com dificuldades em outras áreas.",
  itens:[
   "Aprendeu a ler ou a contar cedo, quase sozinha",
   "Usa palavras avançadas para a idade",
   "Faz perguntas profundas (por quê, e se, como funciona)",
   "Lembra detalhes com facilidade",
   "Fica muito tempo concentrada num assunto que ama",
   "Inventa histórias, jogos, regras ou objetos novos",
   "Encontra várias soluções diferentes para o mesmo problema",
   "Tem humor esperto para a idade",
   "Prefere conversar com adultos ou crianças mais velhas",
   "Se incomoda muito com injustiças",
   "Fica entediada com atividades repetidas que já domina",
   "Organiza as brincadeiras e lidera o grupo"
  ],
  atlas:"Avance a trilha nos temas que ela domina e aprofunde com projetos de Mão na massa, perguntas abertas e olimpíadas do conhecimento.",
  quem:"Um psicólogo pode avaliar altas habilidades. A escola pode oferecer atendimento educacional especializado (AEE) para enriquecimento.",
  dica:"Talento numa área e dificuldade em outra podem andar juntos. Olhe também as outras fichas."
 },
 {id:"preferencias", titulo:"Como gosta de aprender", sub:"Preferências e motivação", minSerie:0, tipo:"pref",
  intro:"Isto não define um estilo fixo: toda criança aprende melhor misturando formas. Use as preferências para motivar, sem deixar de lado as outras.",
  itens:[
   {t:"Lembra melhor com desenhos, mapas e cores", cat:"Ver"},
   {t:"Lembra do que ouviu em histórias e músicas", cat:"Ouvir"},
   {t:"Aprende montando, mexendo, experimentando", cat:"Fazer"},
   {t:"Precisa se mexer enquanto pensa", cat:"Movimento"},
   {t:"Aprende explicando em voz alta ou conversando", cat:"Conversar"},
   {t:"Rende mais estudando sozinha e em silêncio", cat:"Sozinha"},
   {t:"Rende mais estudando junto com alguém", cat:"Junto"},
   {t:"Se anima com desafios, pontos e jogos", cat:"Desafio"}
  ],
  atlas:"Comece cada sessão pela forma preferida e termine com uma diferente. Ex.: quem gosta de fazer, monta primeiro e escreve depois.",
  quem:"Não é preciso procurar profissional por esta ficha.",
  dica:"A preferência pode mudar com a idade. Repita a cada semestre."
 }
];

export const COMANDOS = [
 "Pegue o lápis.",
 "Coloque a colher dentro do copo.",
 "Bata palmas duas vezes.",
 "Pegue o papel e me entregue.",
 "Coloque o lápis embaixo do papel.",
 "Toque na colher e depois no copo.",
 "Antes de pegar o brinquedo, toque no lápis.",
 "Coloque o copo ao lado do papel e a colher em cima do papel.",
 "Pegue o lápis, dê uma volta na cadeira e sente.",
 "Depois de colocar o brinquedo atrás do copo, aponte para a porta.",
 "Se o copo estiver vazio, coloque o lápis dentro dele. Se não estiver, coloque a colher.",
 "Toque em todas as coisas da mesa, menos no lápis."
];

export const CORES = [
 {n:"VERMELHO", c:"#d62828"},
 {n:"AZUL", c:"#1d4ed8"},
 {n:"VERDE", c:"#15803d"},
 {n:"AMARELO", c:"#d19a00"}
];
