"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Achados, Capa, Laboratorio, NoMundo, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "Achados e perdidos", curto: "Achados", icone: "🔍" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌍" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🧽" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "🐱💤🛋️", texto: "Na frase “O gato preguiçoso dormiu no sofá”, qual palavra é o adjetivo?", op: ["preguiçoso", "gato", "dormiu", "sofá"], certa: 0, hab: "adjetivo",
    passos: ["Procure a palavra que diz como alguém ou alguma coisa é.", "Como é o gato? Preguiçoso!", "Gato e sofá são substantivos; dormiu é ação."] },
  { cena: "🗺️🇧🇷", texto: "Qual destas palavras é um substantivo próprio?", op: ["país", "Brasil", "bonito", "cidade"], certa: 1, hab: "proprio",
    passos: ["Substantivo próprio é o nome de um só, com letra maiúscula.", "País e cidade servem para qualquer um: são comuns.", "Brasil é o nome de um país só: é próprio."] },
  { cena: "🌷🌼🌸", texto: "Complete com a palavra certa: “As flores estão muito ___.”", op: ["bonito", "bonita", "bonitos", "bonitas"], certa: 3, hab: "concordancia",
    passos: ["Flores é feminino (as flores).", "E está no plural: são várias flores.", "Então o adjetivo fica no feminino plural: bonitas."] },
  { cena: "🥟🥟🔥", texto: "Qual é o plural de “o pastel quentinho”?", op: ["os pastels quentinho", "os pastéis quentinhos", "os pastéis quentinho", "o pastéis quentinhos"], certa: 1, hab: "concordancia",
    passos: ["Pastel no plural vira pastéis.", "O adjetivo vai junto para o plural: quentinhos.", "E o artigo também: os pastéis quentinhos."] },
  { cena: "🧽🏚️", texto: "A Borracha apagou os adjetivos: “Era uma casa ___ e ___.” Quais palavras devolvem o sentido?", op: ["velha e assombrada", "porta e janela", "correu e pulou", "ontem e hoje"], certa: 0, hab: "adjetivo",
    passos: ["O espaço vazio precisa dizer como era a casa.", "Porta e janela são nomes; correu e pulou são ações.", "Velha e assombrada são adjetivos: a frase fica cheia de mistério!"] },
];
const ITENS = [
  { t: "Substantivo", f: "dá nome", ex: "Pessoas, bichos, coisas, lugares e sentimentos: menina, gato, mesa, praia, alegria." },
  { t: "Comum e próprio", f: "o próprio tem maiúscula", ex: "cidade é comum · Aracaju é próprio." },
  { t: "Singular e plural", f: "um ou mais de um", ex: "a coruja → as corujas · o robô → os robôs." },
  { t: "Masculino e feminino", f: "o ou a", ex: "o gato → a gata · o menino → a menina." },
  { t: "Adjetivo", f: "dá o jeito", ex: "Diz como é: grande, azul, peludo, feliz." },
  { t: "Concordância", f: "os dois combinam", ex: "monstro bravo · coruja brava · corujas bravas." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "Nem toda palavra perto do substantivo é adjetivo: em “o gato dormiu”, dormiu é ação." },
  { cor: "#f4a6c0", d: "Substantivo próprio sempre com letra maiúscula: Maria, Brasil, Aracaju." },
  { cor: "#a9d3f5", d: "“As meninas alegre” está errado: no plural, o adjetivo também vai para o plural. O certo é “as meninas alegres”." },
];
const HABS: Record<string, string> = { substantivo: "Achar o adjetivo na frase", proprio: "Comum e próprio", adjetivo: "Substantivo ou adjetivo", concordancia: "Concordância", achados: "Ler uma descrição", mundo: "Adjetivos em textos reais", lab: "Laboratório" };

export default function NomearViva() {
  return (
    <Shell chave="viva-nomear-e-descrever" titulo="Nomear e Descrever · Português · 3º ano" telas={TELAS} materia="por" nomeFase="Nomear e Descrever">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Achados />}
          {t === 5 && <NoMundo />}
          {t === 6 && <Desafio chefe="a Borracha Comilona" emoji="🧽" sub="Ela apaga os adjetivos e deixa os textos sem graça." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Nomear e Descrever" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={9}
            links={[["/apostilas/nomear-e-descrever", "📘 Apostila Nomear e Descrever (com o jogo Quem sou eu?)"], ["/trilhas/portugues/3-ano#tema-5", "🗺️ A fase 5 na trilha de Português do 3º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
