/** Desafio do mês: um desafio por mês para todas as famílias. Quem faz posta o resultado no mural e ganha o selo. */
export type Desafio = {
  id: string; // "2026-11": ano-mês
  mes: string; // "novembro"
  ano: number;
  titulo: string;
  emoji: string;
  resumo: string;
  porque: string;
  duracao: string;
  materiais: string[];
  passos: { titulo: string; texto: string }[];
  porIdade: { faixa: string; texto: string }[];
  participar: string;
  prazo: string; // texto, ex.: "até 30 de novembro"
  fim: string; // data ISO do último dia
  selo: { nome: string; emoji: string };
  pdf?: { href: string; nome: string; rotulo: string };
  temas: { id: string; rotulo: string; href: string }[];
};

export const DESAFIOS: Desafio[] = [
  {
    id: "2026-11",
    mes: "novembro",
    ano: 2026,
    titulo: "O diário do feijão",
    emoji: "🌱",
    resumo: "Plante um feijão no algodão e acompanhe, dia após dia, como ele vira uma plantinha. Observe, meça, desenhe e escreva o diário da planta.",
    porque: "Em poucas semanas, a criança vê com os próprios olhos o que uma planta precisa para crescer, aprende a medir com a régua, organiza os números numa tabela e conta a história da planta por escrito. Ciências, Matemática e Português no mesmo copo!",
    duracao: "2 a 3 semanas, com 5 minutos por dia",
    materiais: ["1 copo transparente (pode ser de plástico ou um pote de vidro)", "Algodão", "3 a 5 grãos de feijão", "Água", "Régua", "O diário do feijão para imprimir (ou um caderno)"],
    passos: [
      { titulo: "Monte o copo", texto: "Forre o fundo do copo com algodão, coloque os feijões encostados na parede do copo, para dar para ver, e molhe o algodão até ficar úmido, sem encharcar." },
      { titulo: "Escolha um lugar", texto: "Deixe o copo num lugar com luz, perto de uma janela, mas sem sol forte o dia todo. Combinem quem vai molhar o algodão e quando." },
      { titulo: "Observe todo dia", texto: "Uma vez por dia, olhem o feijão: o que mudou? Apareceu raiz? Caule? Folhas? Registrem no diário com desenho, palavras ou medidas." },
      { titulo: "Meça a planta", texto: "Quando o caule aparecer, meçam com a régua, a partir do algodão, sempre no mesmo horário. Anotem a altura na tabela do diário." },
      { titulo: "Conte a história", texto: "No fim, a criança escreve (ou conta, para o adulto escrever) a história da planta, do grão até as folhas. Os maiores fazem um gráfico com as medidas." },
    ],
    porIdade: [
      { faixa: "Alfabetização e 2º ano", texto: "Desenhar o feijão a cada 2 ou 3 dias e escrever uma palavra ou frase curta: RAIZ, CAULE, FOLHA, CRESCEU! Contar os dias nos dedos e no calendário." },
      { faixa: "3º ano", texto: "Medir a altura com a régua todo dia, em centímetros, e preencher a tabela do diário. Escrever duas ou três frases sobre o que observou." },
      { faixa: "4º e 5º anos", texto: "Montar um gráfico de linha com as medidas, calcular quanto a planta cresceu por semana e fazer uma experiência: um copo no escuro e outro na luz. O que muda?" },
    ],
    participar: "Até o fim do mês, compartilhe no Mural de conquistas uma foto do feijão (e do diário, se quiser) com uma frase sobre o que a criança descobriu. Quando a conquista for aprovada, a família ganha o selo de Jardineiro do Atlas.",
    prazo: "até 30 de novembro",
    fim: "2026-11-30",
    selo: { nome: "Jardineiro do Atlas · novembro de 2026", emoji: "🌱" },
    pdf: { href: "/desafios/diario-do-feijao.pdf", nome: "Diario-do-Feijao-Atlas-do-Aprender.pdf", rotulo: "Baixar o diário do feijão (PDF, 2 páginas)" },
    temas: [
      { id: "cie2-1", rotulo: "Plantas: partes e necessidades", href: "/trilhas/ciencias/2-ano#tema-2" },
      { id: "mat3-2", rotulo: "Medidas: comprimento, massa e capacidade", href: "/trilhas/matematica/3-ano#tema-3" },
      { id: "mat3-3", rotulo: "Tabelas e gráficos", href: "/trilhas/matematica/3-ano#tema-4" },
    ],
  },
];

/** O desafio do mês atual (horário de Fortaleza); se ainda não houver, o mais recente. */
export function desafioAtual(agora = new Date()): Desafio {
  const d = new Date(agora.toLocaleString("en-US", { timeZone: "America/Fortaleza" }));
  const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return DESAFIOS.find((x) => x.id === id) || [...DESAFIOS].sort((a, b) => b.id.localeCompare(a.id))[0];
}

export const desafioPorId = (id: string) => DESAFIOS.find((d) => d.id === id);
