"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Cantina, Capa, Laboratorio, NoMundo, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "O mural da cantina", curto: "Cantina", icone: "🥪" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌍" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🧙‍♀️" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "🍦✏️", texto: "Na pesquisa do sorvete preferido, o chocolate ganhou 2 feixes de 5 risquinhos e mais 3 risquinhos soltos. Quantos votos o chocolate teve?", op: ["13", "5", "10", "23"], certa: 0, hab: "contagem",
    passos: ["Cada feixe tem 5 risquinhos.", "2 feixes: 5, 10.", "Mais 3 soltos: 11, 12, 13. O chocolate teve 13 votos."] },
  { cena: "🐶🐶🐶🐶", texto: "Num pictograma, cada 🐶 vale 2 alunos. Na linha dos cachorros tem 4 figuras. Quantos alunos escolheram cachorro?", op: ["4", "8", "6", "2"], certa: 1, hab: "escala",
    passos: ["Primeiro leia a legenda: cada figura vale 2.", "4 figuras de 2 em 2: 2, 4, 6, 8.", "8 alunos escolheram cachorro."] },
  { cena: "⚽🏐🏊", texto: "Na tabela do esporte preferido: futebol 12, vôlei 7 e natação 9. Quantos alunos responderam a pesquisa?", op: ["28", "12", "19", "21"], certa: 0, hab: "ler",
    passos: ["Quem respondeu a pesquisa está em todas as linhas da tabela.", "Some tudo: 12 + 7 = 19.", "19 + 9 = 28 alunos."] },
  { cena: "🧃📊🥤", texto: "No gráfico de barras, a barra do suco chega no 9 e a do refrigerante chega no 4. Quantos votos o suco teve a mais?", op: ["5", "13", "9", "4"], certa: 0, hab: "comparar",
    passos: ["“A mais” é a diferença entre as duas barras.", "9 − 4 = 5.", "O suco teve 5 votos a mais."] },
  { cena: "🧙‍♀️📉", texto: "A Bruxa desenhou um gráfico com as barras começando em alturas diferentes e sem números no eixo. Qual é o problema?", op: ["Não tem problema nenhum", "Assim não dá para ler nem comparar os valores", "Faltou pintar as barras", "As barras deviam ser deitadas"], certa: 1, hab: "ler",
    passos: ["Num gráfico de barras, todas as barras começam do zero.", "Os números do eixo dizem quanto vale cada altura.", "Sem isso, ninguém consegue ler os valores nem comparar as barras."] },
];
const ITENS = [
  { t: "Pesquisar", f: "pergunta + opções", ex: "Faça uma pergunta clara, dê as opções e anote cada resposta." },
  { t: "Risquinhos", f: "feixes de 5", ex: "4 risquinhos em pé e o 5º atravessado: depois é só contar de 5 em 5." },
  { t: "Tabela", f: "organiza os dados", ex: "Uma coluna com as opções e outra com os votos. Somando tudo, sai o total." },
  { t: "Gráfico de barras", f: "a barra mais alta ganha", ex: "Uma barra para cada opção, todas começando do zero, com números no eixo." },
  { t: "Escala e legenda", f: "cada figura pode valer 2, 5, 10…", ex: "Se cada bloquinho vale 2, meio bloquinho vale 1. Leia a legenda antes de contar!" },
  { t: "Dupla entrada", f: "linha × coluna", ex: "Ache a linha e a coluna: a resposta está no cruzamento." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "Esquecer a legenda: se cada 🐶 vale 2, quatro cachorrinhos são 8 alunos, não 4." },
  { cor: "#f4a6c0", d: "“Quantos a mais” é diferença: 9 e 4 dão 5 a mais. Somar (13) está errado!" },
  { cor: "#a9d3f5", d: "Barra mais larga ou mais colorida não vale mais. O que conta é a altura." },
];
const HABS: Record<string, string> = { ler: "Ler tabelas e gráficos", comparar: "Comparar e achar a diferença", contagem: "Contar com risquinhos", escala: "Escala e legenda", cantina: "Montar o gráfico", mundo: "Tabelas e gráficos da vida", lab: "Laboratório" };

export default function DetetivesViva() {
  return (
    <Shell chave="viva-detetives-de-dados" titulo="Detetives de Dados · Matemática · 3º ano" telas={TELAS} materia="mat" nomeFase="Detetives de Dados">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Cantina />}
          {t === 5 && <NoMundo />}
          {t === 6 && <Desafio chefe="a Bruxa Bagunça" emoji="🧙‍♀️" sub="Ela embaralha os dados e desenha gráficos tortos." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Detetives de Dados" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={9}
            links={[["/apostilas/detetives-de-dados", "📘 Apostila Detetives de Dados (grátis, com malha para gráficos)"], ["/trilhas/matematica/3-ano#tema-4", "🗺️ A fase 4 na trilha de Matemática do 3º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
