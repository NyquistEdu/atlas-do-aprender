export type Genero = "noticia" | "carta" | "receita";
export type Parte = { id: string; nome: string; txt: string; dica: string };
export type Texto = { id: string; genero: Genero; titulo: string; partes: Parte[] };

export const GEN: Record<Genero, { nome: string; e: string; serve: string; cor: string }> = {
  noticia: { nome: "Notícia", e: "📰", serve: "informar o que aconteceu, quando e onde", cor: "#5b8def" },
  carta: { nome: "Carta", e: "✉️", serve: "conversar com alguém que está longe", cor: "#ef6f5e" },
  receita: { nome: "Receita", e: "🍳", serve: "ensinar a fazer alguma coisa, passo a passo", cor: "#4fb37a" },
};

const n = (id: string, nome: string, dica: string) => (txt: string): Parte => ({ id, nome, txt, dica });
const TIT = n("titulo", "Manchete", "A notícia começa pela manchete: o título curto e chamativo.");
const FINA = n("fina", "Linha fina", "Logo abaixo da manchete vem a linha fina, que completa o título.");
const LIDE = n("lide", "Lide", "O primeiro parágrafo é o lide: conta o quê, quem, quando e onde.");
const CORPO = n("corpo", "Desenvolvimento", "Por último, o desenvolvimento traz detalhes e a fala de quem viu.");
const LOCAL = n("local", "Local e data", "A carta começa com o lugar e a data, lá em cima.");
const SAUD = n("saudacao", "Saudação", "Depois vem a saudação: o jeito de chamar quem vai ler.");
const MSG = n("mensagem", "Mensagem", "Depois da saudação vem a mensagem, o assunto da carta.");
const DESP = n("despedida", "Despedida", "Antes de assinar, a gente se despede.");
const ASS = n("assinatura", "Assinatura", "A carta termina com a assinatura de quem escreveu.");
const RTIT = n("rtitulo", "Título", "A receita começa pelo nome do prato.");
const REND = n("rendimento", "Tempo e rendimento", "Logo depois do título: quanto tempo leva e quanto rende.");
const ING = n("ingredientes", "Ingredientes", "Antes de fazer, a gente separa os ingredientes.");
const PREP = n("preparo", "Modo de preparo", "Por último, o modo de preparo: os passos numerados.");

export const TEXTOS: Texto[] = [
  { id: "n1", genero: "noticia", titulo: "As tartaruguinhas", partes: [
    TIT("Filhotes de tartaruga voltam ao mar em Aracaju"),
    FINA("Mais de 80 tartaruguinhas nasceram na areia e foram vigiadas por biólogos"),
    LIDE("Na manhã desta terça-feira, 82 filhotes de tartaruga-oliva saíram dos ovos na praia de Atalaia, em Aracaju, e seguiram direto para o mar."),
    CORPO("Os ninhos ficaram protegidos por quase 50 dias. “Foi lindo ver as pequenas correndo para a água”, contou uma moradora que acompanhou tudo."),
  ] },
  { id: "c1", genero: "carta", titulo: "Para a vovó", partes: [
    LOCAL("Aracaju, 15 de março de 2026."),
    SAUD("Querida vovó Lurdes,"),
    MSG("Estou com muita saudade! Na escola aprendi a fazer gráficos e já sei a tabuada do 7. No domingo fomos à praia e vi um caranguejo enorme. Quando a senhora vem nos visitar?"),
    DESP("Um abraço bem apertado,"),
    ASS("Sua neta, Júlia"),
  ] },
  { id: "r1", genero: "receita", titulo: "Suco de laranja com cenoura", partes: [
    RTIT("Suco de laranja com cenoura"),
    REND("Rende 4 copos · fica pronto em 10 minutos"),
    ING("• 4 laranjas\n• 1 cenoura pequena\n• 2 copos de água gelada\n• gelo a gosto"),
    PREP("1. Lave e descasque a cenoura.\n2. Esprema as laranjas.\n3. Com a ajuda de um adulto, bata tudo no liquidificador.\n4. Coe e sirva com gelo."),
  ] },
  { id: "n2", genero: "noticia", titulo: "Livros novos", partes: [
    TIT("Biblioteca da escola ganha 500 livros novos"),
    FINA("Os livros foram doados pelas famílias numa campanha de um mês"),
    LIDE("Na sexta-feira, a Escola Estrela do Mar recebeu 500 livros doados por famílias do bairro, que vão ficar na biblioteca para todos os alunos."),
    CORPO("A campanha começou em maio. “Agora tem fila para pegar gibi”, brincou a bibliotecária. A escola quer chegar a mil livros até dezembro."),
  ] },
  { id: "c2", genero: "carta", titulo: "Para a prefeitura", partes: [
    LOCAL("Aracaju, 2 de junho de 2026."),
    SAUD("Prezado senhor prefeito,"),
    MSG("Somos alunos do 4º ano e gostaríamos de pedir a pintura da faixa de pedestres em frente à nossa escola. Ela está apagada, e os carros não param para as crianças atravessarem."),
    DESP("Atenciosamente,"),
    ASS("Turma do 4º ano B"),
  ] },
  { id: "r2", genero: "receita", titulo: "Cuscuz de milho", partes: [
    RTIT("Cuscuz de milho"),
    REND("Rende 6 pedaços · fica pronto em 20 minutos"),
    ING("• 2 xícaras de flocão de milho\n• 1 xícara de água\n• 1 colher (chá) de sal\n• manteiga para servir"),
    PREP("1. Misture o flocão com o sal.\n2. Molhe aos poucos com a água e deixe descansar 10 minutos.\n3. Coloque na cuscuzeira e, com um adulto, leve ao fogo por 10 minutos.\n4. Sirva quentinho com manteiga."),
  ] },
];
