"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, Laboratorio, NoMundo, Pizzaria, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "A Pizzaria Atlas", curto: "Pizzaria", icone: "🍕" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌍" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "👹" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "🍕✂️", texto: "Uma pizza foi cortada em 8 pedaços iguais. O Lucas comeu 3 pedaços. Que fração da pizza ele comeu?", op: ["3/8", "3/5", "8/3", "5/8"], certa: 0, hab: "fracao",
    passos: ["A pizza tem 8 partes iguais: esse é o número de baixo.", "O Lucas comeu 3: esse é o número de cima.", "Ele comeu 3/8. Sobraram 5/8."] },
  { cena: "🎂 1/3 ou 1/6", texto: "Dois bolos do mesmo tamanho: um foi cortado em 3 partes iguais e o outro em 6. Qual pedaço é maior: 1/3 ou 1/6?", op: ["1/3", "1/6", "São iguais"], certa: 0, hab: "comparar",
    passos: ["Quanto mais partes, menor fica cada pedaço.", "O bolo cortado em 6 tem pedaços menores.", "1/3 é maior que 1/6 (é o dobro!)."] },
  { cena: "🃏🃏🃏", texto: "A Bia tem 18 figurinhas e deu a metade para o irmão. Quantas figurinhas ela deu?", op: ["9", "6", "8", "36"], certa: 0, hab: "quantidade",
    passos: ["Metade é repartir em 2 partes iguais.", "18 ÷ 2 = 9.", "Ela deu 9 figurinhas e ficou com 9."] },
  { cena: "⏰", texto: "O treino começa às 4 horas e dura meia hora. Quantos minutos tem meia hora?", op: ["30 minutos", "50 minutos", "15 minutos", "60 minutos"], certa: 0, hab: "diaadia",
    passos: ["Uma hora tem 60 minutos.", "Meia hora é a metade de 60.", "60 ÷ 2 = 30 minutos: o treino acaba às 4h30."] },
  { cena: "👹🍫", texto: "O Ogro cortou um chocolate em 2 pedaços: um grandão para ele e um pequenininho para você. Ele disse que cada um ficou com a metade. Ele está certo?", op: ["Sim, são 2 pedaços", "Não, as partes não são iguais", "Sim, porque é 1/2"], certa: 1, hab: "partes",
    passos: ["Metade quer dizer 2 partes IGUAIS.", "Um pedaço grande e um pequeno não são iguais.", "Então não são metades. O Ogro está enganando!"] },
];
const ITENS = [
  { t: "Partes iguais", f: "sem partes iguais, não é fração", ex: "Cortar torto não vale: metade são 2 partes do mesmo tamanho." },
  { t: "Ler a fração", f: "de cima / de baixo", ex: "Em 3/4: o 4 diz em quantas partes iguais cortei; o 3, quantas peguei." },
  { t: "Os nomes", f: "meio, terço, quarto…", ex: "1/2 um meio · 1/3 um terço · 1/4 um quarto · 1/5 um quinto · 1/10 um décimo." },
  { t: "Comparar", f: "mais partes, pedaço menor", ex: "1/2 é maior que 1/4, que é maior que 1/8." },
  { t: "Fração de um tanto", f: "repartir em grupos iguais", ex: "1/3 de 15: reparto em 3 grupos e cada um tem 5." },
  { t: "No dia a dia", f: "meia dúzia, meia hora, meio litro", ex: "Meia dúzia = 6 · meia hora = 30 min · meio litro = 500 mL." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "1/8 parece maior que 1/4 porque 8 é maior que 4. Mas é o contrário: cortando em 8, cada pedaço fica menor!" },
  { cor: "#f4a6c0", d: "Dividir em 2 pedaços não é o mesmo que dividir em 2 metades. As partes precisam ser iguais." },
  { cor: "#a9d3f5", d: "4/8 e 1/2 têm números diferentes, mas é o mesmo tanto de pizza: são frações equivalentes." },
];
const HABS: Record<string, string> = { fracao: "Ler e escrever frações", partes: "Partes iguais", comparar: "Comparar pedaços", quantidade: "Fração de quantidade", diaadia: "Frações do dia a dia", pizzaria: "Montar a fração pedida", mundo: "Meia dúzia, meia hora…", lab: "Laboratório" };

export default function PedacoViva() {
  return (
    <Shell chave="viva-pedaco-por-pedaco" titulo="Pedaço por Pedaço · Matemática · 3º ano" telas={TELAS} materia="mat" nomeFase="Pedaço por Pedaço">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Pizzaria />}
          {t === 5 && <NoMundo />}
          {t === 6 && <Desafio chefe="o Ogro Guloso" emoji="👹" sub="Ele corta tudo torto e sempre quer o pedaço maior." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Pedaço por Pedaço" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={10}
            links={[["/apostilas/pedaco-por-pedaco", "📘 Apostila Pedaço por Pedaço (com barra de frações para recortar)"], ["/trilhas/matematica/3-ano#tema-5", "🗺️ A fase 5 na trilha de Matemática do 3º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
