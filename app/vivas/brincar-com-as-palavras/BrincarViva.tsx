"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, Estacao, Laboratorio, NoMundo, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "A estação das rimas", curto: "Estação", icone: "🚂" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌍" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🐺" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "👟", texto: "Quantas palmas tem a palavra SAPATO?", op: ["👏", "👏👏", "👏👏👏", "👏👏👏👏"], certa: 2, hab: "silabas",
    passos: ["Fale devagar: SA… PA… TO.", "Uma palma em cada pedaço.", "SA-PA-TO: três palmas!"] },
  { cena: "🎈", texto: "Qual palavra rima com BALÃO?", op: ["🍞 pão", "⚽ bola", "🐸 sapo", "🌸 flor"], certa: 0, hab: "rima",
    passos: ["Escute o fim de balão: -ÃO.", "PÃO também termina com -ÃO.", "Balão e pão rimam!"] },
  { cena: "🐴🐺", texto: "O lobo comeu um pedaço do CA__LO. Que pedaço falta?", op: ["VA", "BO", "PA", "MA"], certa: 0, hab: "silabas",
    passos: ["A palavra é CAVALO.", "Fale devagar: CA… VA… LO.", "O pedaço do meio é VA."] },
  { cena: "🐒", texto: "Qual palavra começa com o mesmo pedaço de MACACO?", op: ["🍎 maçã", "⚽ bola", "🐸 sapo", "🍇 uva"], certa: 0, hab: "comeco",
    passos: ["MACACO começa com MA.", "MA-ÇÃ também começa com MA.", "Macaco e maçã começam igual!"] },
  { cena: "🐂 ou 🐜", texto: "Qual palavra é mais comprida, com mais pedaços: BOI ou FORMIGA?", op: ["🐂 boi", "🐜 formiga"], certa: 1, hab: "tamanho",
    passos: ["BOI: uma palma só.", "FOR-MI-GA: três palmas.", "O boi é grande, mas a palavra FORMIGA é mais comprida!"] },
];
const ITENS = [
  { t: "Palavras têm pedaços", f: "uma palma = um pedaço", ex: "MA-CA-CO: três palmas, três pedaços (sílabas)." },
  { t: "Contar palmas", f: "fale devagar", ex: "SOL tem 1, BO-LA tem 2, BOR-BO-LE-TA tem 4." },
  { t: "Tamanho da palavra", f: "não é o tamanho da coisa", ex: "BOI é bicho grande e palavra curta; FOR-MI-GUI-NHA é bicho pequeno e palavra comprida." },
  { t: "Rima", f: "o fim soa igual", ex: "gato, pato, rato, sapato." },
  { t: "Começo igual", f: "o primeiro pedaço", ex: "BOla e BOta começam com o mesmo pedaço." },
  { t: "Parlendas e trava-línguas", f: "brincar treina o ouvido", ex: "Repetir rimas e falar rápido ajuda a perceber os sons." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "Palavra de bicho grande não é palavra grande: BOI tem 1 pedaço; FORMIGUINHA tem 4." },
  { cor: "#f4a6c0", d: "Rima é no fim: GATO e GALO começam igual, mas não rimam. GATO e PATO rimam." },
  { cor: "#a9d3f5", d: "Bata palmas falando devagar: depressa, a gente junta os pedaços sem perceber." },
];
const HABS: Record<string, string> = { silabas: "Contar sílabas", rima: "Rimas", comeco: "Começo igual", tamanho: "Tamanho da palavra", estacao: "Achar a rima", mundo: "Sons nas brincadeiras", lab: "Laboratório" };

export default function BrincarViva() {
  return (
    <Shell chave="viva-brincar-com-as-palavras" titulo="Brincar com as Palavras · Português · Alfabetização" telas={TELAS} materia="por" nomeFase="Brincar com as Palavras">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Estacao />}
          {t === 5 && <NoMundo />}
          {t === 6 && <Desafio chefe="o Lobo Come-Pedaços" emoji="🐺" sub="Ele come pedaços das palavras! Escute com atenção." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Brincar com as Palavras" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={9}
            links={[["/apostilas/brincar-com-as-palavras", "📘 Apostila Brincar com as Palavras (com a Trilha das palmas)"], ["/trilhas/portugues/1-ano#tema-1", "🗺️ A fase 1 na trilha de Português da Alfabetização"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
