import Link from "next/link";
import type { Metadata } from "next";
import { KITS } from "@/lib/apostilas";
import { CONTATO } from "@/lib/contato";
import Comprar from "@/components/Comprar";
import { url, jsonLd } from "@/lib/seo";
import Faltam from "./Faltam";
import "./tico.css";

const K = KITS.find((k) => k.slug === "duende-tico")!;

export const metadata: Metadata = {
  title: "Calendário do Advento para imprimir: A Grande Missão do Duende Tico",
  description: "24 atividades curtas de 1º a 24 de dezembro (leitura, contas, experimentos, arte e gentileza) e uma caça ao presente com pistas e cadeado na noite de Natal. Para crianças de 6 a 10 anos. PDF para imprimir em casa, R$ 19,90.",
  alternates: { canonical: "/duende-tico" },
  openGraph: { title: "A Grande Missão do Duende Tico", description: "Calendário do Advento + caça ao presente de Natal, pronto para imprimir.", images: ["/apostilas/duende-tico/capa.webp"] },
};

const DIAS: [number, string, string, string][] = [
  [1, "A carta do Tico", "Família", "✉️"], [2, "A corrente do Natal", "Matemática", "🔗"], [3, "Flocos de neve", "Matemática", "❄️"],
  [4, "Carta para quem a gente ama", "Português", "💌"], [5, "Neve de mentira", "Ciências", "⛄"], [6, "Dia de São Nicolau", "Gentileza", "👞"],
  [7, "Acróstico NATAL", "Português", "✏️"], [8, "Biscoitos de Natal", "Matemática", "🍪"], [9, "Natal no verão?", "Ciências", "☀️"],
  [10, "Memória natalina", "Jogo", "🃏"], [11, "Dança do Quebra-Nozes", "Arte", "🩰"], [12, "O presépio", "Família", "⭐"],
  [13, "Padrões na árvore", "Matemática", "🎄"], [14, "Cartão para um vizinho", "Gentileza", "🏡"], [15, "Cristais de açúcar", "Ciências", "🔬"],
  [16, "Os problemas do Papai Noel", "Matemática", "🧮"], [17, "Um brinquedo para doar", "Gentileza", "🧸"], [18, "Noite do filme", "Família", "🍿"],
  [19, "Rimas de Natal", "Português", "🎶"], [20, "Copos musicais", "Ciências", "🥛"], [21, "O dia mais comprido", "Ciências", "🌞"],
  [22, "Embrulho na medida", "Matemática", "📏"], [23, "Entrevista com os avós", "Português", "📞"], [24, "A grande missão", "Missão", "🎁"],
];
const COR: Record<string, string> = { Matemática: "mat", Português: "por", Ciências: "cie", Gentileza: "gen", Família: "fam", Jogo: "jog", Arte: "art", Missão: "mis" };

const ESTACOES: [string, string, string][] = [
  ["🍪", "Os biscoitos misteriosos", "Na cozinha: contar só os biscoitos em forma de estrela."],
  ["🧊", "A neve que fala", "Na geladeira: derreter o gelo para soltar a pista congelada."],
  ["🔔", "Os sinos fujões", "Na sala: encontrar os 5 sinos escondidos."],
  ["🥄", "O equilíbrio do duende", "No corredor: levar a bola de Natal numa colher até o fim."],
  ["🔐", "O código do trenó", "Na mesa: decifrar uma palavra secreta com a tabela do Tico."],
  ["🦌", "As pegadas da rena", "Do quarto até a árvore: seguir as pegadas até o último número."],
];

const FAQ: [string, React.ReactNode][] = [
  ["Como recebo o kit?", "Depois que o pagamento é confirmado, a Kiwify envia o link do PDF para o seu e-mail. No Pix, costuma chegar em poucos minutos."],
  ["Preciso comprar muita coisa?", "Não. Quase tudo já existe em casa: papel, lápis de cor, cola, copos, açúcar, bicarbonato. O guia traz a lista do mês inteiro e o que separar a cada semana. O único item que talvez precise comprar é um cadeado de números para a caixa do presente."],
  ["Precisa de impressora colorida?", "Colorida fica mais bonito, mas o kit funciona também em preto e branco. Se não tiver impressora, dá para imprimir numa papelaria: são 31 páginas A4."],
  ["Comecei depois do dia 1º. E agora?", "Sem problema: faça dois ou três cartões por dia até alcançar a data. O importante é todas as letras chegarem ao painel até o dia 24."],
  ["Funciona com uma criança só? E com irmãos de idades diferentes?", "Funciona nos dois casos. Cada cartão tem um jeito de fazer para quem está começando a ler (6 e 7 anos, com o adulto lendo) e para quem já lê sozinho (8 a 10 anos). Na caça, todos jogam juntos como uma equipe, com papéis que se revezam, e ninguém é eliminado."],
  ["Quanto tempo leva por dia?", "De 10 a 20 minutos. A caça ao presente, na noite de 24 ou na manhã de 25, dura cerca de 1 hora."],
  ["Tem conteúdo religioso?", "O kit é sobre família, aprendizagem e gentileza. Tem um dia para montar o presépio e outro para contar a história de São Nicolau, de um jeito simples, como parte das tradições do Natal."],
  ["Posso imprimir de novo no ano que vem?", "Pode. A licença permite imprimir quantas cópias precisar para as crianças da sua casa, quantas vezes quiser."],
  ["Sou professora. Posso usar com a turma?", <>A licença comum é para uso familiar. Para turmas, escreva para <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a> e combinamos uma licença.</>],
];

export default function DuendeTico() {
  const comprar = <Comprar slug={K.slug} titulo={K.titulo} checkout={K.checkout} preco={K.preco} grande />;
  return (
    <div className="tico">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
        "@context": "https://schema.org", "@type": "Product", name: K.titulo, description: K.resumo,
        image: url("/apostilas/duende-tico/capa.webp"), brand: { "@type": "Brand", name: "Atlas do Aprender" },
        audience: { "@type": "PeopleAudience", suggestedMinAge: 6, suggestedMaxAge: 10 },
        offers: { "@type": "Offer", price: "19.90", priceCurrency: "BRL", availability: "https://schema.org/InStock", url: url("/duende-tico") },
      })} />

      {/* HERO */}
      <section className="tico-hero">
        <div className="wrap tico-hero-in">
          <div>
            <p className="eyebrow-i">Calendário do Advento · 6 a 10 anos · para imprimir</p>
            <h1 className="hero-t">Um Natal que a criança espera aprendendo, um cartão por dia.</h1>
            <p className="lead">De 1º a 24 de dezembro, o Duende Tico deixa uma atividade curta e uma letra. As letras formam uma Frase Secreta. Na noite de Natal, ele esconde o presente e esquece onde, e as crianças seguem as pistas para encontrar.</p>
            <div className="row">{comprar}<a className="btn ghost" href="#como-funciona">Ver como funciona</a></div>
            <p className="note">PDF de 31 páginas para imprimir em casa. Pix, cartão ou boleto. O arquivo chega no seu e-mail.</p>
            <Faltam />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tico-capa" src="/apostilas/duende-tico/capa.webp" alt="Capa do kit A Grande Missão do Duende Tico" width={566} height={800} />
        </div>
      </section>

      <div className="wrap tico-corpo">
        {/* PROMESSA */}
        <section className="tico-tres">
          <div><span>📅</span><b>24 atividades de 10 a 20 minutos</b><p>Leitura, contas, experimentos, arte, jogo e gentileza, com coisas que você já tem em casa.</p></div>
          <div><span>🔤</span><b>Uma Frase Secreta</b><p>Cada cartão traz uma letra. Dia a dia, o painel vai se completando e a curiosidade só cresce.</p></div>
          <div><span>🗝️</span><b>Uma caça ao presente</b><p>Na noite de 24, seis pistas pela casa, quatro números e um cadeado. Cerca de 1 hora de aventura em equipe.</p></div>
        </section>

        {/* HISTÓRIA */}
        <section className="tico-carta">
          <p className="eyebrow-i">Por que eu criei o Tico</p>
          <p>Toda criança pergunta em dezembro: <i>“falta quanto para o Natal?”</i>. Eu queria transformar essa espera em algo bom: um pouquinho de aprendizagem por dia, com a família junta, sem tela e sem complicação para os pais.</p>
          <p>Por isso o Tico não é um calendário de chocolate. Cada cartão é uma atividade de verdade: medir os ingredientes dos biscoitos, fazer neve de mentira, entrevistar os avós, doar um brinquedo. No fim, a criança percebe que passou o mês inteiro lendo, contando e fazendo o bem, e que o maior presente estava no caminho.</p>
          <p className="tico-ass">Stephanie Kamarry<br /><span>mãe, professora e criadora do Atlas do Aprender</span></p>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona">
          <h2 className="tico-h">Como funciona</h2>
          <ol className="tico-passos">
            <li><b>No fim de novembro</b>, imprima e recorte os 24 cartões. Esconda um por dia num varal de envelopes, em saquinhos ou numa caixa. Cole o painel da Frase Secreta num lugar à vista.</li>
            <li><b>Todo dia, de 1º a 24</b>, a criança abre o cartão, faz a atividade de 10 a 20 minutos e escreve a letra do dia na estrela do painel.</li>
            <li><b>Na noite de 24</b> (ou na manhã de 25), chega a carta do Tico: ele escondeu o presente e esqueceu o caminho. As crianças seguem as 6 pistas, juntam os 4 números do cadeado e dizem a Frase Secreta para abrir a caixa.</li>
          </ol>
        </section>

        {/* 24 DIAS */}
        <section>
          <h2 className="tico-h">Os 24 dias</h2>
          <p className="meta">Cada cor é uma área. O mês passa por todas, sem a criança perceber que está estudando.</p>
          <div className="tico-dias">
            {DIAS.map(([d, t, a, e]) => (
              <div key={d} className={`tico-dia ${COR[a]}`}>
                <span className="n">{d}</span><span className="e" aria-hidden="true">{e}</span>
                <b>{t}</b><small>{a}</small>
              </div>
            ))}
          </div>
          <div className="tico-areas">
            <span className="mat">6 de Matemática</span><span className="cie">5 de Ciências</span><span className="por">4 de Português</span>
            <span className="gen">3 de gentileza</span><span className="fam">3 em família</span><span className="art">arte e jogo</span>
          </div>
        </section>

        {/* CAÇA */}
        <section className="tico-caca">
          <h2 className="tico-h">A noite de Natal: a caça ao presente</h2>
          <p>Todas as crianças jogam juntas, como uma equipe. Ninguém é eliminado: errou, tenta de novo. As pistas têm uma palavra em letra grande e um desenho, para quem está começando a ler. E os papéis se revezam: leitor da pista, detetive dos números, guardião das pistas e chefe da equipe.</p>
          <div className="tico-estacoes">
            {ESTACOES.map(([e, t, d], i) => (
              <div key={t}><span className="e" aria-hidden="true">{e}</span><small>Estação {i + 1}</small><b>{t}</b><p>{d}</p></div>
            ))}
          </div>
          <p className="meta">No fim, a caixa abre com o código do cadeado e a Frase Secreta montada no Advento. Dentro: o presente, os certificados de Ajudante do Tico e um bilhete final.</p>
        </section>

        {/* O QUE VEM */}
        <section className="card">
          <h3>O que vem no kit</h3>
          <ul className="dentro">{K.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
          <p className="meta" style={{ margin: 0 }}>Também traz o jeito de fazer cada atividade para 6 e 7 anos e para 8 a 10 anos, a lista de materiais do mês e um passo a passo de quando montar a caça.</p>
        </section>

        <h2 className="tico-h">Veja algumas páginas</h2>
        <div className="amostras">
          {K.amostras.map((leg, i) => (
            <figure key={leg}>
              <a href={`/apostilas/duende-tico/pagina-${i + 1}.webp`} target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/apostilas/duende-tico/pagina-${i + 1}.webp`} alt={`Página de amostra: ${leg}`} width={566} height={800} loading="lazy" />
              </a>
              <figcaption>{leg}</figcaption>
            </figure>
          ))}
        </div>

        {/* O QUE A CRIANÇA GANHA */}
        <section className="tico-ganha">
          <h2 className="tico-h">O que a criança leva desse dezembro</h2>
          <ul>
            <li><b>Leitura e escrita</b> com propósito: uma carta de verdade, um acróstico, rimas e uma entrevista com os avós.</li>
            <li><b>Matemática no dia a dia</b>: contar quantos dias faltam, medir a receita, achar padrões, calcular o papel do embrulho.</li>
            <li><b>Ciência com as mãos</b>: neve que gela, cristais que crescem, copos que tocam música e a sombra do dia mais comprido.</li>
            <li><b>Gentileza praticada</b>: um bem feito em segredo, um cartão para o vizinho, um brinquedo doado.</li>
            <li><b>Memórias em família</b>: o presépio montado junto, a noite do filme, a caça que todo mundo vai lembrar.</li>
          </ul>
        </section>

        {/* PREÇO */}
        <section className="tico-preco">
          <div>
            <p className="eyebrow-i">Kit completo</p>
            <p className="tico-valor">R$ 19,90</p>
            <p>Um mês inteiro de atividades e a noite de Natal pronta, por menos que um enfeite de árvore.</p>
            <ul>
              <li>PDF de 31 páginas, tamanho A4</li>
              <li>Pix, cartão ou boleto, com pagamento pela Kiwify</li>
              <li>O link chega no seu e-mail</li>
              <li>Imprima quantas vezes quiser, inclusive no próximo Natal</li>
            </ul>
            <div className="row">{comprar}</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="card">
          <h3>Perguntas frequentes</h3>
          <div className="tico-faq">
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </section>

        <section className="tico-fim">
          <h2>Dezembro passa rápido. Deixe a espera do Natal ficar inesquecível.</h2>
          <div className="row" style={{ justifyContent: "center" }}>{comprar}</div>
          <p className="meta">Quer conhecer o Atlas antes? <Link href="/tematicas/natal">Veja os livros, filmes e o material gratuito de Natal</Link>.</p>
        </section>
      </div>
    </div>
  );
}
