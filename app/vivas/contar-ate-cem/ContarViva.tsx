"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, Feira, Laboratorio, Saltos, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "O caminhão da feira", curto: "Feira", icone: "🚚" },
  { n: 5, nome: "Contar em saltos", curto: "Saltos", icone: "🦘" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🐉" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "🍬🍬🍬", texto: "A Lia tem 2 pacotes com 10 balas e mais 5 balas soltas. Quantas balas ela tem?", op: ["7", "25", "52", "20"], certa: 1, hab: "dezenas",
    passos: ["Cada pacote tem 10 balas: 2 pacotes são 10, 20.", "Depois vêm as 5 soltas: 21, 22, 23, 24, 25.", "A Lia tem 25 balas: 2 dezenas e 5 unidades."] },
  { cena: "🔢➡️❓", texto: "Que número vem logo depois do 59?", op: ["50", "60", "510", "58"], certa: 1, hab: "vizinhos",
    passos: ["Depois do 9 as unidades acabam e voltam para o 0.", "Aí a dezena aumenta: 5 dezenas viram 6 dezenas.", "Depois do 59 vem o 60."] },
  { cena: "🧒🗣️ 1, 2, 3, 5, 6", texto: "O Davi contou assim: 1, 2, 3, 5, 6. Que número ele pulou?", op: ["4", "7", "0", "6"], certa: 0, hab: "contagem",
    passos: ["Vamos contar juntos devagar: 1, 2, 3…", "Depois do 3 vem o 4, e só depois o 5.", "O Davi pulou o 4."] },
  { cena: "🐊 38 ou 83", texto: "O jacaré come o número maior. Ele vai comer o 38 ou o 83?", op: ["O 38", "O 83", "Os dois são iguais"], certa: 1, hab: "comparar",
    passos: ["Os dois números têm 3 e 8, mas em lugares diferentes.", "O 38 tem 3 dezenas; o 83 tem 8 dezenas.", "8 dezenas é mais: o jacaré come o 83."] },
  { cena: "🐷💵💵💵💵", texto: "No cofrinho tem 4 notas de 10 reais. Quantos reais tem no cofrinho?", op: ["4 reais", "14 reais", "40 reais", "10 reais"], certa: 2, hab: "saltos",
    passos: ["Cada nota vale 10 reais.", "Contando de 10 em 10: 10, 20, 30, 40.", "No cofrinho tem 40 reais."] },
];
const ITENS = [
  { t: "Contar certo", f: "um número para cada coisa", ex: "Toque em cada objeto uma vez só. O último número que você fala é quanto tem." },
  { t: "Fileiras de 10", f: "5 e mais 5", ex: "Arrumar em fileiras de 10 ajuda a ver quanto tem sem contar de um em um." },
  { t: "Dezena", f: "10 unidades = 1 dezena", ex: "10 cubinhos viram 1 barra. 10 laranjas enchem 1 caixa." },
  { t: "Ler o número", f: "a dezena vem na frente", ex: "34 = 3 dezenas e 4 unidades = 30 + 4. Lê-se trinta e quatro." },
  { t: "Antes e depois", f: "os vizinhos", ex: "Antes do 40 vem o 39. Depois do 39 vem o 40." },
  { t: "Saltos", f: "de 2, de 5 e de 10", ex: "10, 20, 30… é como contar notas de 10 reais até 100." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "23 e 32 não são iguais! O lugar do algarismo muda tudo: 23 tem 2 dezenas, 32 tem 3." },
  { cor: "#f4a6c0", d: "Depois do 29 não vem “vinte e dez”. Vem o 30: o 9 vira 0 e a dezena aumenta." },
  { cor: "#a9d3f5", d: "Contar o mesmo objeto duas vezes aumenta o número à toa. Toque e separe o que já contou." },
];
const HABS: Record<string, string> = { contagem: "Contar quantos tem", vizinhos: "Antes e depois", dezenas: "Dezenas e unidades", comparar: "Comparar números", saltos: "Contar em saltos", feira: "Agrupar de 10 em 10", lab: "Laboratório" };

export default function ContarViva() {
  return (
    <Shell chave="viva-contar-ate-cem" titulo="Contar até Cem · Matemática · Alfabetização" telas={TELAS} materia="mat" nomeFase="Contar até Cem">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Feira />}
          {t === 5 && <Saltos />}
          {t === 6 && <Desafio chefe="o Dragão Desconta" emoji="🐉" sub="Ele embaralha os números e esconde as dezenas." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Contar até Cem" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={9}
            links={[["/apostilas/contar-ate-cem", "📘 Apostila Contar até Cem (com o quadro dos 100)"], ["/trilhas/matematica/1-ano#tema-1", "🗺️ A fase 1 na trilha de Matemática da Alfabetização"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
