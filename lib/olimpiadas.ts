/** Olimpíadas abertas a crianças dos anos iniciais e materiais do Atlas para se preparar. Datas da edição 2026. */
export type Olimpiada = {
  nome: string;
  area: "por" | "mat" | "cie";
  quem: string;
  inscricao: string;
  custo: string;
  quando: string;
  como: string;
  site: string;
};

export const INDIVIDUAIS: Olimpiada[] = [
  {
    nome: "Olimpíada de Literatura",
    area: "por",
    quem: "Categoria Candura: até 9 anos. Categoria Mirim: até 12 anos (idade no dia da prova).",
    inscricao: "Individual, pelo site, sem precisar da escola. Escolas também podem inscrever grupos.",
    custo: "R$ 28 por competição no 1º período e R$ 38 no 2º (2026).",
    quando: "Em 2026: inscrições de 20/08 a 30/10; prova Candura em 12/11 e Mirim em 13/11; resultado em 19/11.",
    como: "Cada competição é sobre um livro. A prova é online, com perguntas objetivas, dura 1 hora e pode ser feita com o livro aberto.",
    site: "https://www.olimpiadadeliteratura.com.br",
  },
  {
    nome: "Olimpíada Nacional de Astronomia (ONA)",
    area: "cie",
    quem: "Nível 1: 1º ao 3º ano. Nível 2: 4º e 5º ano. Há níveis para os anos seguintes.",
    inscricao: "Individual, online. Escolas também podem inscrever turmas.",
    custo: "Em 2026: R$ 7 (escola pública) e R$ 9 (escola particular) por inscrição individual.",
    quando: "Em 2026, as inscrições foram até 1º de maio, com prova em fase única, digital.",
    como: "Bom par para a trilha de Ciências do 3º ano (O céu e as estrelas) e a apostila Olhar o Céu.",
    site: "https://onaolimpiada.netlify.app",
  },
  {
    nome: "Torneio Nacional de Astronomia (TNA), da EOBA",
    area: "cie",
    quem: "Do 1º ano do fundamental ao ensino médio. Nível 1: 1º ao 3º ano (o céu, o Sol, a Lua e os planetas). Nível 2: 4º e 5º ano (Sistema Solar, eclipses, estações e galáxias).",
    inscricao: "Individual, pelo site do Clube de Ciências EOBA, com autorização do responsável.",
    custo: "R$ 14,99 por inscrição (2026). Medalhas físicas são vendidas à parte.",
    quando: "Em 2026: inscrições de 01/09 a 09/10 e provas em 10 e 11/10. A edição 2026 já passou; fique de olho no site para a próxima.",
    como: "Prova online, em fase única: 20 questões objetivas e 2 horas nos níveis 1 e 2, sem consulta. As provas e gabaritos anteriores ficam no site e são um ótimo treino. Combina com a apostila Olhar o Céu.",
    site: "https://www.eoba.site/tna-2026",
  },
  {
    nome: "Torneio Nacional de Matemática (TNM), da EOBA",
    area: "mat",
    quem: "Estudantes do ensino fundamental e médio, divididos em níveis por ano escolar (confira o nível de cada ano no regulamento da edição).",
    inscricao: "Individual, online, pelo Clube de Ciências EOBA, sem precisar da escola.",
    custo: "Inscrição paga; o valor sai no regulamento de cada edição.",
    quando: "As datas da próxima edição são divulgadas no site e no Instagram @eoba_.",
    como: "Prova online com questões originais e desafiadoras, pensada para treinar para outras olimpíadas de matemática.",
    site: "https://www.eoba.site",
  },
];

export const PELA_ESCOLA: [string, string, string][] = [
  ["Canguru de Matemática", "a partir do 3º ano", "Prova em março; inscrições até o meio de março, só pela escola."],
  ["OP Bê-á-bá (Olimpíada de Português)", "1º ao 5º ano", "Duas fases de múltipla escolha no 2º semestre; inscrição só pela escola."],
  ["OBMEP Mirim", "2º ao 5º ano", "A versão da OBMEP para os anos iniciais; inscrição pela escola."],
  ["OBA (Astronomia e Astronáutica)", "do 1º ano ao ensino médio", "Prova em maio; inscrição pela escola."],
];

/** Materiais do Atlas para competições específicas. */
export type MaterialOlimpiada = {
  slug: string;
  titulo: string;
  competicao: string;
  autor: string;
  paginas: number;
  arquivo: string;
  nomeArquivo: string;
  resumo: string;
  dentro: string[];
};

export const MATERIAIS: MaterialOlimpiada[] = [
  {
    slug: "gato-de-botas",
    titulo: "O Gato de Botas",
    competicao: "Olimpíada de Literatura 2026 · Candura 17",
    autor: "conto de Charles Perrault",
    paginas: 20,
    arquivo: "/olimpiadas/gato-de-botas.pdf",
    nomeArquivo: "Gato-de-Botas-Olimpiada-Atlas-do-Aprender.pdf",
    resumo: "Para quem está aprendendo a ler: o adulto lê, a criança responde falando, ligando, circulando ou desenhando.",
    dentro: ["A história em 6 partes, com conversa e atividade", "Personagens, ordem da história e palavras do conto", "Jeito de contar, moral e jogos", "3 simulados no formato da prova e gabarito"],
  },
  {
    slug: "enquanto-ana-espera",
    titulo: "Enquanto Ana Espera",
    competicao: "Olimpíada de Literatura 2026 · Candura 16",
    autor: "livro de Fernanda Witwytzky",
    paginas: 20,
    arquivo: "/olimpiadas/enquanto-ana-espera.pdf",
    nomeArquivo: "Enquanto-Ana-Espera-Olimpiada-Atlas-do-Aprender.pdf",
    resumo: "Para quem já lê: as quatro visitas de Ana à Grande Árvore, com perguntas para responder conferindo no livro.",
    dentro: ["Mapa das quatro visitas e uma página por visita", "Ana e Eliseu, o fruto e o caminho, ordem da história", "Palavras do livro, jeito de contar e reflexão", "3 simulados de 10 questões e gabarito"],
  },
];
