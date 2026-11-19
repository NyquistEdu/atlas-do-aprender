"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, CeuNoite, Laboratorio, RelogioSol, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "Relógio de sol", curto: "Relógio", icone: "🕰️" },
  { n: 5, nome: "O céu da noite", curto: "Noite", icone: "🌌" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "⛈️" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "👧🏢🌅", texto: "Toda manhã, a Ana vê o Sol nascer atrás de um prédio. Para que lado fica esse prédio?", op: ["Norte", "Sul", "Leste", "Oeste"], certa: 2, hab: "caminho-sol",
    passos: ["O Sol nasce sempre do mesmo lado do céu, mais ou menos.", "Esse lado se chama leste (ou nascente).", "Se o Sol nasce atrás do prédio, o prédio fica no leste."] },
  { cena: "🌍🔄☀️", texto: "Por que existem o dia e a noite?", op: ["Porque o Sol dá a volta na Terra todo dia", "Porque a Terra gira em torno de si mesma", "Porque a Lua tapa o Sol à noite", "Porque as nuvens escondem o Sol"], certa: 1, hab: "dia-noite",
    passos: ["A Terra gira como um pião: uma volta completa leva cerca de 24 horas.", "O lado virado para o Sol fica iluminado: é dia. O outro lado fica no escuro: é noite.", "O Sol parece andar no céu, mas quem se move somos nós, girando junto com a Terra."] },
  { cena: "👦📏🌞", texto: "O Téo mediu a sombra do poste da rua às 8h, ao meio-dia e às 16h. Quando a sombra ficou mais curta?", op: ["Às 8h", "Ao meio-dia", "Às 16h", "Foi igual nas três vezes"], certa: 1, hab: "sombras",
    passos: ["A sombra é comprida quando o Sol está baixo no céu.", "Perto do meio-dia o Sol fica no ponto mais alto.", "Então a sombra mais curta foi a do meio-dia."] },
  { cena: "🌕📅➡️❓", texto: "Hoje a Lua está cheia. Daqui a mais ou menos uma semana, que fase ela vai mostrar?", op: ["Nova", "Crescente", "Minguante", "Cheia de novo"], certa: 2, hab: "fases",
    passos: ["A ordem das fases é: nova, crescente, cheia, minguante, e começa tudo de novo.", "Cada passo leva mais ou menos uma semana.", "Depois da cheia vem a minguante."] },
  { cena: "👵✨🌄", texto: "A vovó disse que a “estrela-d’alva”, que brilha forte no céu de madrugada, é uma estrela. Ela está certa?", op: ["Sim, é a estrela mais brilhante", "Não, é o planeta Vênus", "Não, é a Lua", "Não, é um avião"], certa: 1, hab: "corpos",
    passos: ["A “estrela-d’alva” é o nome popular de um ponto bem brilhante perto do nascer do Sol.", "Na verdade é Vênus, um planeta: ele não tem luz própria e brilha porque reflete a luz do Sol.", "Então a vovó usou o nome antigo, mas Vênus é planeta, não estrela."] },
];

const ITENS = [
  { t: "O Sol é uma estrela", f: "a estrela mais perto de nós", ex: "Tem luz própria e nos dá luz e calor. Nunca olhe direto para ele!" },
  { t: "Dia e noite", f: "a Terra gira em torno de si", ex: "Uma volta leva cerca de 24 horas. O lado virado para o Sol tem dia." },
  { t: "O caminho do Sol", f: "nasce no leste, se põe no oeste", ex: "De manhã o Sol está no leste; à tarde, no oeste." },
  { t: "As sombras", f: "do lado oposto ao Sol", ex: "Compridas de manhã cedo e no fim da tarde; curtinhas perto do meio-dia." },
  { t: "As fases da Lua", f: "nova, crescente, cheia, minguante", ex: "A Lua não tem luz própria: reflete a do Sol. O ciclo dura cerca de 29 dias e meio." },
  { t: "Estrelas e constelações", f: "desenhos que a gente liga no céu", ex: "O Cruzeiro do Sul aponta para o sul. As Três Marias ficam em fila." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "O Sol não dá a volta na Terra. É a Terra que gira e faz o Sol parecer andar no céu." },
  { cor: "#f4a6c0", d: "Na Lua Nova a Lua não some: o lado iluminado está virado para o Sol, de costas para nós." },
  { cor: "#a9d3f5", d: "A “estrela-d’alva” é Vênus, um planeta. E as estrelas não se apagam de dia: o Sol é que ofusca." },
];
const HABS: Record<string, string> = { "dia-noite": "Dia e noite", fases: "Fases da Lua", sombras: "Sombras e posição do Sol", corpos: "Estrela, planeta ou satélite", "caminho-sol": "O caminho do Sol", constelacoes: "Constelações", mundo: "O céu no dia a dia", lab: "Laboratório" };

export default function OlharOCeuViva() {
  return (
    <Shell chave="viva-olhar-o-ceu" titulo="Olhar o Céu · Ciências · 3º ano" telas={TELAS}>
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <RelogioSol />}
          {t === 5 && <CeuNoite />}
          {t === 6 && <Desafio chefe="a Nuvem Tapa-Céu" emoji="⛈️" sub="Ela cobre o céu para ninguém conseguir observar." questoes={QUESTOES} />}
          {t === 7 && <Resumo titulo="Olhar o Céu" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={6}
            links={[["/apostilas/olhar-o-ceu", "📘 Apostila Olhar o Céu (com o diário da Lua de 15 noites)"], ["/trilhas/ciencias/3-ano#tema-4", "🗺️ A fase 4 na trilha de Ciências do 3º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
