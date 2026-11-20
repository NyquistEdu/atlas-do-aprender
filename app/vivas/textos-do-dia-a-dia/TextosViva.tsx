"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Desafio, Resumo, type Questao } from "@/components/viva/Comuns";
import { Capa, Correio, Laboratorio, NoMundo, Treino } from "./Telas";

const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "O correio da escola", curto: "Correio", icone: "📮" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌍" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🌪️" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

const QUESTOES: Questao[] = [
  { cena: "✉️🌀", texto: "O Embaralhador misturou as partes da carta. Qual é a ordem certa?", op: ["saudação → local e data → mensagem → assinatura → despedida", "local e data → saudação → mensagem → despedida → assinatura", "mensagem → saudação → despedida → local e data → assinatura", "assinatura → mensagem → saudação → despedida → local e data"], certa: 1, hab: "parte",
    passos: ["A carta começa no alto, com o local e a data.", "Depois a saudação e a mensagem.", "No fim, a despedida e, por último, a assinatura."] },
  { cena: "📰🤔", texto: "Uma notícia deve trazer fatos. Qual destas frases é uma opinião?", op: ["A feira começou às 8 horas.", "Foram 300 visitantes no sábado.", "O passeio foi o mais legal do ano.", "A escola fica no centro da cidade."], certa: 2, hab: "fato",
    passos: ["Fato é o que dá para conferir: horário, quantidade, lugar.", "“O mais legal do ano” é o que alguém acha.", "Outra pessoa pode achar diferente: é opinião."] },
  { cena: "🍳📋", texto: "Numa receita, o que vem antes do modo de preparo?", op: ["A assinatura", "Os ingredientes", "A manchete", "A despedida"], certa: 1, hab: "parte",
    passos: ["Antes de cozinhar, a gente separa tudo o que vai usar.", "Essa lista são os ingredientes.", "Depois vem o modo de preparo, com os passos numerados."] },
  { cena: "🔬🏫", texto: "A manchete é “Feira de ciências reúne 300 alunos”. Qual frase pode ser o lide?", op: ["Foi incrível, todo mundo amou!", "No sábado, 300 alunos apresentaram experiências na feira de ciências da escola, em Aracaju.", "Prezado diretor, gostaria de pedir…", "Misture o vinagre com o bicarbonato."], certa: 1, hab: "genero",
    passos: ["O lide é o primeiro parágrafo da notícia.", "Ele responde: o quê, quem, quando e onde.", "Só a segunda frase traz quando (sábado), quem (300 alunos), o quê e onde."] },
  { cena: "🏫🚰", texto: "A turma vai escrever ao diretor pedindo um bebedouro novo. Qual saudação combina melhor?", op: ["E aí, diretor!", "Oi, sumido!", "Prezado diretor,", "Beijão,"], certa: 2, hab: "formal",
    passos: ["Para o diretor, usamos linguagem formal.", "“E aí” e “Oi, sumido” são para amigos; “Beijão” é despedida.", "“Prezado diretor,” é a saudação formal."] },
];
const ITENS = [
  { t: "Gênero textual", f: "cada texto tem um jeito", ex: "Ele nasce para resolver uma necessidade: informar, conversar, ensinar." },
  { t: "Notícia", f: "manchete, linha fina e lide", ex: "O lide responde: o quê, quem, quando e onde." },
  { t: "Fato e opinião", f: "dá para conferir?", ex: "Fato dá para conferir; opinião é o que alguém acha." },
  { t: "Carta", f: "local e data → saudação → mensagem → despedida → assinatura", ex: "O e-mail é a carta dos dias de hoje." },
  { t: "Formal e informal", f: "depende de quem lê", ex: "“Prezado diretor” para o diretor; “Oi, vó!” para a vovó." },
  { t: "Receita", f: "ingredientes + modo de preparo", ex: "Passos numerados com verbos de ordem: misture, bata, sirva." },
];
const PEGADINHAS = [
  { cor: "#f7d65a", d: "Notícia não é opinião: “foi a melhor festa” é opinião; “300 pessoas foram à festa” é fato." },
  { cor: "#f4a6c0", d: "Carta para o prefeito não começa com “E aí!”: o jeito de falar muda com quem vai ler." },
  { cor: "#a9d3f5", d: "Na receita, a ordem dos passos importa: não dá para servir antes de bater!" },
];
const HABS: Record<string, string> = { genero: "Reconhecer o gênero", parte: "Partes de cada texto", fato: "Fato e opinião", formal: "Formal e informal", correio: "Classificar trechos", mundo: "Gêneros na vida real", lab: "Laboratório" };

export default function TextosViva() {
  return (
    <Shell chave="viva-textos-do-dia-a-dia" titulo="Textos do Dia a Dia · Português · 4º ano" telas={TELAS} materia="por" nomeFase="Textos do Dia a Dia">
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Correio />}
          {t === 5 && <NoMundo />}
          {t === 6 && <Desafio chefe="o Embaralhador" emoji="🌪️" sub="Ele mistura as partes dos textos e troca tudo de lugar." questoes={QUESTOES} ouvir />}
          {t === 7 && <Resumo titulo="Textos do Dia a Dia" itens={ITENS} pegadinhas={PEGADINHAS} habs={HABS} totalMissoes={9}
            links={[["/apostilas/textos-do-dia-a-dia", "📘 Apostila Textos do Dia a Dia (grátis)"], ["/trilhas/portugues/4-ano#tema-1", "🗺️ A fase 1 na trilha de Português do 4º ano"], ["/vivas", "✨ Outras Fases Vivas"]]} />}
        </>
      )}
    </Shell>
  );
}
