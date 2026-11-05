/**
 * Roteiro do diagnóstico do planejamento gratuito (o mesmo de ferramentas/planejamento/roteiro.py),
 * usado na página /planejamento/montar para preencher a ficha durante a videochamada.
 */
import type { Materia } from "@/lib/data";
import type { ExtraPlano, TemaPlano, EventoPlano } from "@/lib/plano";
import { TRILHAS } from "@/lib/data";
import { GRATUITOS, apostilaDoTema } from "@/lib/apostilas";
import { DS, somaDias } from "@/lib/plano";

export type Nivel = "" | "sim" | "ajuda" | "nao";
export const NIVEIS: [Exclude<Nivel, "">, string][] = [["sim", "consegue"], ["ajuda", "com ajuda"], ["nao", "ainda não"]];

export type Tarefa = { t: string; mostrar: string; obs?: string };

export const CONVERSA: [string, string][] = [
  ["confirmar", "Confirmar o formulário: ano escolar, escola ou estudo em casa, quem acompanha, quanto tempo por dia"],
  ["dia", "Como é um dia comum da criança? Em que horário ela está mais disposta?"],
  ["tentaram", "O que já tentaram? O que funcionou e o que virou briga?"],
  ["gosta", "Do que a criança gosta muito? (vai entrar nos exemplos e nas atividades)"],
  ["espera", "O que a família espera daqui a um mês? E daqui a seis meses?"],
  ["necessidade", "Há alguma avaliação, acompanhamento ou necessidade específica que ajude a entender a criança?"],
];

export const COM_A_CRIANCA = [
  "Comece conversando sobre o que ela gosta. Diga que não é prova: “quero conhecer você para preparar atividades legais”.",
  "Siga as tarefas na ordem e pare quando ela travar duas vezes seguidas: dali começa o plano.",
  "Peça para a família mostrar o caderno da escola, se houver.",
  "Elogie o esforço. Se cansar, pare: dá para completar depois.",
];

export const FECHAMENTO = [
  "Contar à família o que você observou, sempre começando pelo que a criança já sabe.",
  "Combinar a rotina possível (dias, horário e tempo) e quem acompanha.",
  "Avisar que o planejamento vai aparecer em Meu Plano, entrando com o e-mail dela.",
];

export const LEITURA: Tarefa[] = [
  { t: "Nomear letras", mostrar: "B  M  A  S  T  O  R  L  E  P  U  F", obs: "Pergunte o nome e o som de cada letra." },
  { t: "Separar em sílabas com palmas", mostrar: "pato · boneca · sol · borboleta", obs: "Quantas palmas tem cada palavra?" },
  { t: "Rima", mostrar: "gato · pato · bola (qual não rima?) · Que palavra rima com “mão”?" },
  { t: "Ler sílabas", mostrar: "BA  MI  TO  LU  PE  FA" },
  { t: "Ler palavras simples e complexas", mostrar: "bola  casa  menino  prato  chuva  flor" },
  { t: "Ler uma frase", mostrar: "O gato subiu no muro e miou." },
  { t: "Ler um texto curto e entender", mostrar: "“Lia tinha um cachorro chamado Pipoca. Um dia, Pipoca fugiu atrás de uma borboleta. Lia o encontrou dormindo debaixo da mangueira.”", obs: "Qual era o nome do cachorro? Por que ele fugiu? Onde estava?" },
  { t: "Escrever", mostrar: "Ditado: sapo · janela · prato · e a frase “Eu gosto de brincar.”", obs: "Peça para mostrar o papel na câmera." },
];

export const MATEMATICA: Tarefa[] = [
  { t: "Contar objetos", mostrar: "Contar 15 objetos de verdade (tampinhas, lápis).", obs: "Repare se aponta um a um, sem pular e sem repetir." },
  { t: "Sequência e números", mostrar: "7  15  48  102 · contar de 10 em 10 até 100", obs: "Ler os números e dizer qual é o maior." },
  { t: "Somar e subtrair", mostrar: "3 + 4   9 − 5   27 + 15   50 − 18", obs: "Pode usar os dedos ou papel; observe a estratégia." },
  { t: "Multiplicar", mostrar: "3 × 4   6 × 7 · “3 pacotes com 5 balas, quantas balas?”" },
  { t: "Dividir", mostrar: "“12 balas para 3 crianças, quantas para cada uma?”" },
  { t: "Frações e medidas", mostrar: "Metade de 10 · Qual é maior, 1/2 ou 1/4? · Quantos centímetros tem 1 metro?" },
  { t: "Problema", mostrar: "“Comprei um lanche de R$ 7 e paguei com R$ 10. Quanto recebi de troco?”" },
];

/** Ano escolar da trilha (1 a 5) a partir do texto do formulário. */
export function anoTrilha(ano: string): string {
  const m = ano.match(/(\d)/);
  if (!m) return "1";
  return String(Math.min(5, Math.max(1, Number(m[1]))));
}

/** Índice da primeira tarefa em que a criança não conseguiu sozinha; -1 se fez tudo; null se nada foi marcado. */
export function parouEm(n: Nivel[]): number | null {
  if (!n.some(Boolean)) return null;
  const i = n.findIndex((x) => x === "ajuda" || x === "nao");
  return i;
}

const T = (materia: Materia, ano: string, tema: number): TemaPlano => ({ materia, ano, tema });

/** “Onde começar no Atlas” de Português (tabela do roteiro). */
export function sugereLeitura(n: Nivel[], ano: string): { tema: TemaPlano; porque: string } | null {
  const p = parouEm(n);
  if (p === null) return null;
  if (p === -1) return { tema: T("por", anoTrilha(ano), 1), porque: "Fez todas as tarefas: temas do ano escolar." };
  if (p <= 2) return { tema: T("por", "1", 1), porque: "Parou nas tarefas 1 a 3: rimas e sílabas (Brincar com as Palavras)." };
  if (p === 3) return { tema: T("por", "1", 2), porque: "Parou na leitura de sílabas: letras e seus sons (Ouvir as Letras)." };
  if (p <= 5) return { tema: T("por", "1", 3), porque: "Parou em palavras e frases: alfabetização, temas 3 e 4." };
  if (p === 6) return { tema: T("por", "2", 2), porque: "Lê, mas não entende o texto: leitura fluente de frases e compreensão." };
  return { tema: T("por", "2", 1), porque: "Lê e entende, mas trava na escrita: sílabas complexas e ortografia." };
}

/** “Onde começar no Atlas” de Matemática (tabela do roteiro). */
export function sugereMat(n: Nivel[]): { tema: TemaPlano; porque: string } | null {
  const p = parouEm(n);
  if (p === null) return null;
  if (p === -1) return { tema: T("mat", "4", 1), porque: "Fez todas as tarefas: temas do 4º e 5º ano." };
  if (p <= 1) return { tema: T("mat", "1", 1), porque: "Parou em contagem e números: números até 100 (Contar até Cem)." };
  if (p === 2) return { tema: T("mat", "1", 3), porque: "Parou em somar e subtrair: adição e subtração com material." };
  if (p === 3) return { tema: T("mat", "3", 1), porque: "Parou na multiplicação: multiplicação e tabuada." };
  if (p === 4) return { tema: T("mat", "3", 2), porque: "Parou na divisão: dividir como repartir e agrupar." };
  if (p === 5) return { tema: T("mat", "3", 5), porque: "Parou em frações e medidas: frações do dia a dia (e medidas, 3º ano tema 3)." };
  return { tema: T("mat", "2", 3), porque: "Parou no problema com dinheiro: dinheiro e trocas." };
}

export type FichaCrianca = {
  nome: string; idade: string; ano: string;
  leitura: Nivel[]; leituraNota: string;
  mat: Nivel[]; matNota: string;
  fortes: string; gosta: string; reforcar: string;
  por: TemaPlano | null; matT: TemaPlano | null; cie: TemaPlano | null;
};

export type Ficha = {
  id: string; pedidoId?: string;
  email: string; familia: string; inicio: string; dias: number;
  acompanha: string; objetivo: string; como: string; obs: string;
  conversa: Record<string, string>;
  criancas: FichaCrianca[];
  cieJuntos: boolean;
  extras: ExtraPlano[];
  eventos?: EventoPlano[];
  sugestao?: Sugestao;
  publicado?: string; // data em que o plano foi publicado
};

export const novaCrianca = (c: Partial<FichaCrianca> = {}): FichaCrianca => ({
  nome: "", idade: "", ano: "", leitura: LEITURA.map(() => ""), leituraNota: "", mat: MATEMATICA.map(() => ""), matNota: "",
  fortes: "", gosta: "", reforcar: "", por: null, matT: null, cie: null, ...c,
});

// ---------------------------------------------------------------- SUGESTÃO DE PONTO DE PARTIDA
export type SugCrianca = {
  nome: string;
  sabe: string[];
  lacunas: string[];
  por: TemaPlano | null; porPorque: string;
  mat: TemaPlano | null; matPorque: string;
  cie: TemaPlano | null; ciePorque: string;
  reforcar: string;
  extras: ExtraPlano[];
  eventos: EventoPlano[];
};
export type Sugestao = { criancas: SugCrianca[]; como: string; objetivo: string };

const nomeTema = (t: TemaPlano | null) => (t ? TRILHAS[t.materia]?.[t.ano]?.[t.tema - 1]?.t || "" : "");

/** Ciências: tema do ano escolar que mais combina com o que a criança gosta. */
function cieDoInteresse(ano: string, gosta: string): { tema: TemaPlano; porque: string } {
  const temas = TRILHAS.cie?.[ano] || [];
  const regras: [RegExp, RegExp][] = [
    [/bich|anima|dinoss|cachorr|gato|inset|peix|zoo/i, /anima|seres vivos|ciclos de vida|cadeias/i],
    [/plant|jardim|horta|flor|natureza/i, /planta|seres vivos|solo/i],
    [/c[ée]u|estrel|planet|espa[çc]|lua|foguete|astron/i, /c[ée]u|estrel|sol|sistema solar|cardeais|noite/i],
    [/corpo|m[ée]dic|sa[úu]de|esporte|futebol|dan[çc]/i, /corpo|sa[úu]de|higiene|digest/i],
    [/m[úu]sic|cant|instrument|barulho/i, /som/i],
    [/experi|cozinh|mistur|slime|massinha|qu[íi]mic/i, /materia|mistur|transforma/i],
    [/[áa]gua|mar|praia|chuva|rio/i, /[áa]gua|solo/i],
    [/luz|sombra|lanterna/i, /luz|sombra/i],
  ];
  for (const [gostoRe, temaRe] of regras) {
    if (!gostoRe.test(gosta)) continue;
    const k = temas.findIndex((t) => temaRe.test(t.t));
    if (k >= 0) return { tema: { materia: "cie", ano, tema: k + 1 }, porque: `Combina com o que a criança gosta (${gosta.replace(/^Formulário:\s*/, "").slice(0, 60)}).` };
  }
  return { tema: { materia: "cie", ano, tema: 1 }, porque: "Primeiro tema de Ciências do ano escolar." };
}

/** Treino diário ligado à apostila do tema, se existir. */
function treinoDo(t: TemaPlano | null) {
  if (!t) return null;
  const ap = apostilaDoTema(t.materia, t.ano, t.tema);
  return ap ? GRATUITOS.find((g) => g.apostila === ap.slug) || null : null;
}

export function sugerir(f: Ficha): Sugestao {
  const criancas = f.criancas.filter((c) => c.nome.trim()).map((c): SugCrianca => {
    const nome = c.nome.trim();
    const ano = anoTrilha(c.ano);
    const sabe: string[] = [], lacunas: string[] = [];
    LEITURA.forEach((t, k) => { const v = c.leitura[k]; if (v === "sim") sabe.push(t.t); else if (v === "ajuda") lacunas.push(`${t.t} (com ajuda)`); else if (v === "nao") lacunas.push(`${t.t} (ainda não)`); });
    MATEMATICA.forEach((t, k) => { const v = c.mat[k]; if (v === "sim") sabe.push(t.t); else if (v === "ajuda") lacunas.push(`${t.t} (com ajuda)`); else if (v === "nao") lacunas.push(`${t.t} (ainda não)`); });

    const sl = sugereLeitura(c.leitura, c.ano), sm = sugereMat(c.mat);
    const por = sl?.tema || c.por || { materia: "por", ano, tema: 1 };
    const mat = sm?.tema || c.matT || { materia: "mat", ano, tema: 1 };
    const sc = cieDoInteresse(ano, c.gosta);
    const cie = c.cie || sc.tema;

    // o que reforçar primeiro: as primeiras lacunas de cada matéria + os temas escolhidos
    const lacLei = LEITURA.map((t, k) => (c.leitura[k] === "ajuda" || c.leitura[k] === "nao" ? t.t.toLowerCase() : "")).filter(Boolean).slice(0, 2);
    const lacMat = MATEMATICA.map((t, k) => (c.mat[k] === "ajuda" || c.mat[k] === "nao" ? t.t.toLowerCase() : "")).filter(Boolean).slice(0, 2);
    const partes: string[] = [];
    if (lacLei.length) partes.push(`Na leitura: ${lacLei.join(" e ")}.`);
    if (lacMat.length) partes.push(`Na matemática: ${lacMat.join(" e ")}.`);
    const reforcar = partes.length
      ? `${partes.join(" ")} Vamos começar por ${nomeTema(por)} e ${nomeTema(mat)}, um pouquinho por dia.`
      : `Já domina o que foi pedido no diagnóstico. Vamos seguir com ${nomeTema(por)} e ${nomeTema(mat)} e aprofundar com leitura e desafios.`;

    // extras: treinos diários dos temas, treino T ou D se apareceu troca, teste de fluência no começo e no fim
    const extras: ExtraPlano[] = [];
    const tp = treinoDo(por), tm = treinoDo(mat);
    if (tp) extras.push({ quem: nome, texto: `${tp.titulo}: uma folha`, icone: "🔤", dias: ["Ter", "Qui"], link: `/apostilas/${tp.slug}` });
    if (tm) extras.push({ quem: nome, texto: `${tm.titulo}: uma folha`, icone: "🔢", dias: ["Seg", "Qua", "Sex"], link: `/apostilas/${tm.slug}` });
    if (/troc/i.test(c.leituraNota) && /\bt\b.{0,6}\bd\b|\bd\b.{0,6}\bt\b/i.test(c.leituraNota) && !extras.some((e) => e.link?.includes("t-ou-d")))
      extras.push({ quem: nome, texto: "Treino Diário · T ou D?: uma folha", icone: "🔤", dias: ["Ter", "Qui"], link: "/apostilas/treino-t-ou-d" });
    const lePalavras = c.leitura[4] === "sim" || c.leitura[4] === "ajuda";
    const eventos: EventoPlano[] = lePalavras ? [
      { data: f.inicio, quem: nome, texto: "Teste de fluência leitora (10 min): o ponto de partida", icone: "📚", link: "/fluencia" },
      { data: somaDias(f.inicio, (f.dias || 30) - 2), quem: nome, texto: "Teste de fluência leitora de novo, com a outra versão do texto", icone: "📚", link: "/fluencia" },
    ] : [];

    return {
      nome, sabe, lacunas, por, porPorque: sl?.porque || "Sem tarefas de leitura marcadas: tema do ano escolar.",
      mat, matPorque: sm?.porque || "Sem tarefas de matemática marcadas: tema do ano escolar.",
      cie, ciePorque: c.cie ? "Tema já escolhido na ficha." : sc.porque, reforcar, extras, eventos,
    };
  });

  const tempo = (f.conversa.confirmar || "").match(/Tempo:\s*([^·]+)/)?.[1]?.trim();
  const quem = f.acompanha.trim();
  const como = [
    `Encontros de ${tempo ? tempo.toLowerCase() : "15 a 20 minutos"}, de segunda a sexta, sempre no mesmo horário${f.conversa.dia ? " (no horário em que a criança está mais disposta)" : ""}.`,
    `Cada dia tem uma apostila e, em alguns dias, uma folha de treino: comece pela apostila e pare antes de cansar.`,
    quem ? `${quem[0].toUpperCase() + quem.slice(1)} acompanha, sentando junto no começo e deixando a criança tentar sozinha.` : "",
    "Nos fins de semana, só atividades práticas e jogos.",
  ].filter(Boolean).join(" ");
  const objetivo = f.objetivo.trim() || (f.conversa.espera || "").trim();
  return { criancas, como, objetivo };
}

export const DIAS_SEMANA = DS;
