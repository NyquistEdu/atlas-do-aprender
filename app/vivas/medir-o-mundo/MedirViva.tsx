"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, Estime, Laboratorio, Receita, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "A receita do bolo", curto: "Receita", icone: "🎂" },
  { n: 5, nome: "Estime antes de medir", curto: "Estimar", icone: "🌎" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🧌" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "👧📏🪑", texto: "A Malu mediu a mesa com uma régua que começava no 1, não no zero. A ponta da mesa ficou no 61. Quanto a mesa mede?", op: ["61 cm", "60 cm", "62 cm", "1 m"], certa: 1, hab: "comprimento",
    passos: ["A medida começa no zero. Se a Malu começou no 1, ela ganhou 1 centímetro a mais na leitura.", "Então tiramos esse 1: 61 − 1 = 60.", "A mesa mede 60 cm."] },
  { cena: "🧃🥤🥤🥤🥤", texto: "Uma garrafa de 2 litros de suco vai encher copos de 250 mL. Quantos copos ficam cheios?", op: ["4", "6", "8", "10"], certa: 2, hab: "capacidade",
    passos: ["2 litros = 2000 mL, porque 1 L = 1000 mL.", "4 copos de 250 mL fazem 1 litro (250 + 250 + 250 + 250).", "Então 2 litros enchem 4 + 4 = 8 copos."] },
  { cena: "☁️⚖️🔩", texto: "O que pesa mais: 1 kg de algodão ou 1 kg de ferro?", op: ["O algodão", "O ferro", "Os dois pesam o mesmo", "Depende do tamanho"], certa: 2, hab: "massa",
    passos: ["Os dois têm 1 kg: a massa é a mesma.", "O algodão ocupa muito mais espaço, por isso parece mais leve.", "Mas na balança, 1 kg é sempre 1 kg."] },
  { cena: "🏠🛣️🏫", texto: "A escola fica a 2 km de casa. Quantos metros são?", op: ["20 m", "200 m", "2000 m", "20 000 m"], certa: 2, hab: "conversoes",
    passos: ["1 quilômetro tem 1000 metros.", "2 km = 1000 + 1000.", "São 2000 metros."] },
  { cena: "👵🌾🎂", texto: "A receita pede meio quilo de farinha. Quanto a balança da cozinha deve marcar?", op: ["50 g", "250 g", "500 g", "5 kg"], certa: 2, hab: "conversoes",
    passos: ["1 quilo = 1000 gramas.", "Meio quilo é a metade de 1000.", "A balança deve marcar 500 g."] },
];
const ITENS = [
  { t: "Comprimento", f: "mm, cm, m e km", ex: "1 m = 100 cm, como 1 real = 100 centavos. 1 km = 1000 m." },
  { t: "Massa", f: "grama e quilograma", ex: "1 kg = 1000 g. A balança mostra a massa: quanto a coisa “pesa”." },
  { t: "Capacidade", f: "mililitro e litro", ex: "1 L = 1000 mL. 4 copos de 250 mL enchem 1 litro." },
  { t: "Medir certo", f: "a régua começa no zero", ex: "Encoste o 0 no começo do objeto e leia onde ele termina." },
  { t: "Comparar", f: "mesma unidade antes", ex: "800 g ou 1 kg? Passe para gramas: 800 g e 1000 g. O 1 kg é maior." },
  { t: "Estimar", f: "palpite antes de medir", ex: "Uma porta tem uns 2 m; um saco grande de arroz, 5 kg." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "A régua começa no zero, não no 1. Começou no 1? Tire 1 da leitura." },
  { cor: "#f4a6c0", d: "1 kg de algodão pesa o mesmo que 1 kg de ferro. Grande não quer dizer pesado." },
  { cor: "#a9d3f5", d: "Meio quilo = 500 g e meio litro = 500 mL, mas meio metro = 50 cm. O metro troca por 100, não por 1000!" },
];
const HABS: Record<string, string> = { comprimento: "Medir comprimento", massa: "Massa", capacidade: "Capacidade", conversoes: "Converter unidades", unidades: "Escolher a unidade", comparar: "Comparar medidas", instrumentos: "Escolher o instrumento", receita: "Medir na receita", estimar: "Estimar", lab: "Laboratório" };

export default function MedirViva() {
  return (
    <Shell chave="viva-medir-o-mundo" titulo="Medir o Mundo · Matemática · 3º ano" telas={TELAS} materia="mat" nomeFase="Medir o Mundo">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Receita />}
          {t === 5 && <Estime />}
          {t === 6 && <Desafio chefe="o Gigante Desmedido" emoji="🧌" sub="Ele bagunça todas as medidas da cidade." questoes={QUESTOES} />}
          {t === 7 && <Resumo titulo="Medir o Mundo" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={10}
            links={[["/apostilas/medir-o-mundo", "📘 Apostila Medir o Mundo (com o quadro das trocas)"], ["/trilhas/matematica/3-ano#tema-3", "🗺️ A fase 3 na trilha de Matemática do 3º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
