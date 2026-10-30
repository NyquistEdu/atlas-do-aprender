import Link from "next/link";
import type { Metadata } from "next";
import { APOSTILAS, GRATUITOS, KITS } from "@/lib/apostilas";

export const metadata: Metadata = {
  title: "Guia de uso",
  description: "Como usar o Atlas do Aprender: diagnóstico grátis, trilhas, treinos diários, apostilas, diário com linha do tempo, planejamento gratuito, uma semana possível e perguntas frequentes.",
  alternates: { canonical: "/guia" },
};

const SECOES: [string, string][] = [
  ["comece", "Comece em 5 minutos"], ["diagnostico", "Diagnóstico grátis"], ["trilhas", "Trilhas e temas"],
  ["treinos", "Treinos, apostilas e kits"], ["diario", "Diário e linha do tempo"], ["plano", "Meu plano e planejamento gratuito"],
  ["livros", "Livros, jogos e mão na massa"], ["mais", "Loja, Olimpíadas e Temáticas"], ["semana", "Uma semana possível"],
  ["cuidados", "Mais de uma criança e cuidados"], ["faq", "Perguntas frequentes"],
];

export default function Guia() {
  const treinos = GRATUITOS.filter((g) => g.materia).length;
  return (
    <div className="wrap guia">
      <header className="guia-head">
        <p className="eyebrow-i">Guia de uso</p>
        <h1>Como usar o Atlas do Aprender</h1>
        <p className="lead">Tudo o que o Atlas oferece e como aproveitar cada parte, do primeiro acesso à rotina da semana. Leva uns 10 minutos para ler.</p>
        <div className="row no-print">
          <a className="btn small" href="/guia.pdf" download="Atlas-do-Aprender-guia.pdf">Baixar em PDF</a>
          <Link className="btn small ghost" href="/diagnostico">Começar pelo diagnóstico</Link>
        </div>
      </header>

      <nav className="card guia-toc" aria-label="Neste guia">
        <b>Neste guia</b>
        <ol>{SECOES.map(([id, t]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ol>
      </nav>

      <section id="comece" className="guia-s">
        <h2>1. Comece em 5 minutos</h2>
        <ol className="guia-passos">
          <li><b>Abra o site</b> no celular ou no computador. Não precisa instalar nada, e todo o conteúdo é aberto, sem cadastro.</li>
          <li><b>Faça o diagnóstico grátis</b> para saber por qual tema começar em cada matéria.</li>
          <li><b>Crie sua conta</b> tocando em Entrar e informando seu e-mail. Chega um link de acesso, sem senha. Abra o link no mesmo aparelho.</li>
          <li><b>Cadastre as crianças</b> no Diário, em Gerenciar crianças, e escolha no topo da página com quem vai estudar.</li>
          <li><b>Abra o primeiro tema</b> indicado e escolha uma ou duas atividades para a semana.</li>
        </ol>
        <p className="guia-nota"><b>Privacidade.</b> Cada família tem a própria conta. Ninguém vê os seus registros, e você não vê os de mais ninguém. Os registros ficam salvos e aparecem em qualquer aparelho em que você entrar com o mesmo e-mail.</p>
      </section>

      <section id="diagnostico" className="guia-s">
        <h2>2. Diagnóstico grátis</h2>
        <p>São perguntas sobre o que a criança já faz no dia a dia, em Português, Matemática e Ciências. Leva de 4 a 6 minutos e não precisa de cadastro.</p>
        <ul>
          <li>As perguntas começam no ano escolar da criança. Quando aparece uma dificuldade, o diagnóstico volta para os anos anteriores e encontra onde a base ficou incompleta.</li>
          <li>No resultado, você vê <b>por qual tema começar</b> em cada matéria e a lista dos temas seguintes, na ordem.</li>
          <li>Cada tema do resultado leva direto para a trilha, com as atividades, o treino diário e a apostila daquele assunto.</li>
          <li>Se quiser ajuda para transformar o resultado em rotina, peça o planejamento gratuito.</li>
        </ul>
        <p className="guia-nota"><b>Dica.</b> Faça junto com a criança, sem pressa e sem clima de prova. Responda pelo que ela faz sozinha, não pelo que faz com ajuda.</p>
      </section>

      <section id="trilhas" className="guia-s">
        <h2>3. Trilhas e temas</h2>
        <p>Cada matéria tem uma sequência de temas por ano, da alfabetização ao 5º ano, alinhada à BNCC. Ao abrir um tema, você encontra:</p>
        <table className="guia-t">
          <thead><tr><th>Parte do tema</th><th>O que é</th></tr></thead>
          <tbody>
            <tr><td>Objetivo</td><td>O que a criança deve conseguir fazer no final, em uma frase.</td></tr>
            <tr><td>Livros paradidáticos</td><td>Livros que tratam do assunto, cada um com o motivo da indicação.</td></tr>
            <tr><td>Material e exercícios</td><td>Material concreto e atividades curtas para fazer em casa.</td></tr>
            <tr><td>Filmes, séries e áudios</td><td>Para assistir ou ouvir junto e conversar depois.</td></tr>
            <tr><td>Jogos</td><td>Jogos que treinam aquele conteúdo, incluindo os da Loja.</td></tr>
            <tr><td>Mão na massa</td><td>Uma atividade prática ligada ao tema.</td></tr>
            <tr><td>Treino diário e apostila</td><td>Quando existem para o tema, aparecem em destaque, prontos para imprimir.</td></tr>
          </tbody>
        </table>
        <h3>Os dois botões de cada tema</h3>
        <ul>
          <li><b>Estamos trabalhando neste tema</b>: marca o tema como em andamento para a criança escolhida no topo. Ele passa a aparecer em “Agora”, no Diário.</li>
          <li><b>Marcar tema como concluído</b>: quando a criança dominar o assunto. O tema vira um ✓ no mapa das trilhas e entra na linha do tempo com a data.</li>
        </ul>
        <h3>Como avançar</h3>
        <ul>
          <li>Os anos são referência, não regra. Se a criança já domina um tema, marque como concluído e siga. Se tiver dificuldade, volte ao ano anterior sem problema.</li>
          <li>Um tema costuma render de uma a três semanas, com encontros curtos.</li>
        </ul>
      </section>

      <section id="treinos" className="guia-s">
        <h2>4. Treinos, apostilas e kits</h2>
        <p>Na aba Apostilas ficam os materiais em PDF para imprimir em casa.</p>
        <table className="guia-t">
          <thead><tr><th>Material</th><th>Para que serve</th><th>Preço</th></tr></thead>
          <tbody>
            <tr><td>Treinos diários ({treinos})</td><td>30 folhas curtas por tema, uma por dia, de 5 a 10 minutos, em pequenos passos, com gabarito e registro de progresso. Fixam o que a criança aprendeu.</td><td>Grátis</td></tr>
            <tr><td>Apostilas ({APOSTILAS.length})</td><td>Explicação para a família, exemplos, exercícios, jogo e gabarito de um tema da trilha.</td><td>R$ 9,90</td></tr>
            <tr><td>Kits temáticos ({KITS.length})</td><td>Atividades para datas especiais, como o calendário do Advento com caça ao presente.</td><td>Variam</td></tr>
            <tr><td>Outros gratuitos</td><td>A caça ao tesouro de Halloween e o Caderno de Conversa sobre os livros.</td><td>Grátis</td></tr>
          </tbody>
        </table>
        <h3>Como usar o treino diário</h3>
        <ol className="guia-passos">
          <li>Imprima as folhas, ou só as da semana.</li>
          <li>Uma folha por dia, de preferência no mesmo horário. A criança anota a hora de início e de fim.</li>
          <li>Corrija logo depois, com o gabarito do fim do caderno. O que estiver errado, a criança refaz.</li>
          <li>Passe para a próxima folha quando ela fizer dentro do tempo indicado e com no máximo um erro. Repetir não é voltar atrás.</li>
        </ol>
        <p className="guia-nota"><b>Apostila sob medida.</b> Não achou o tema que precisa? Na aba Apostilas há um formulário para pedir uma apostila de outro tema, série e matéria.</p>
      </section>

      <section id="diario" className="guia-s">
        <h2>5. Diário e linha do tempo</h2>
        <p>O Diário guarda a história de aprendizagem de cada criança. No topo dele fica <b>O caminho</b> da criança escolhida:</p>
        <ul>
          <li><b>Agora</b>: os temas em andamento, com a data de início e quantos registros já têm. Daqui dá para abrir o tema ou marcar como concluído.</li>
          <li><b>Mapa das trilhas</b>: todas as matérias e anos, com ✓ nos temas concluídos e um ponto nos que estão em andamento.</li>
          <li><b>Linha do tempo</b>: mês a mês, o que a criança começou e concluiu.</li>
          <li><b>Sugestão de próximo passo</b>: o tema seguinte em cada matéria sem nada em andamento.</li>
        </ul>
        <h3>O que escrever em cada registro</h3>
        <table className="guia-t">
          <thead><tr><th>Campo</th><th>O que escrever</th></tr></thead>
          <tbody>
            <tr><td>Data, criança, área e tipo</td><td>Quando foi, com quem, de qual matéria e que atividade. Use “Todos juntos” para atividades em família.</td></tr>
            <tr><td>Minutos</td><td>O tempo aproximado. O resumo soma as horas do período.</td></tr>
            <tr><td>O que fizemos</td><td>Os passos e o material, em poucas linhas.</td></tr>
            <tr><td>O que a criança descobriu ou disse</td><td>O mais valioso: frases dela, perguntas, dificuldades.</td></tr>
            <tr><td>Envolvimento</td><td>De 1 a 5, quanto ela se interessou.</td></tr>
            <tr><td>Próximo passo</td><td>O que fazer na próxima vez.</td></tr>
          </tbody>
        </table>
        <p className="guia-nota"><b>Dica.</b> Um registro de “Estudo da trilha” com o nome do tema também faz o tema aparecer como em andamento.</p>
      </section>

      <section id="plano" className="guia-s">
        <h2>6. Meu plano e planejamento gratuito</h2>
        <p>Pelo <b>planejamento gratuito</b>, você conta sobre a criança num formulário, conversamos por videochamada e eu monto um plano de estudos possível para a rotina da sua família, com as trilhas, os livros, os jogos e as apostilas do Atlas.</p>
        <p>O plano fica salvo na aba <b>Meu plano</b>, que aparece quando você entra na sua conta: o que fazer hoje, a semana e os temas de cada criança. Os temas do plano também aparecem como em andamento no Diário.</p>
      </section>

      <section id="livros" className="guia-s">
        <h2>7. Livros, jogos e mão na massa</h2>
        <h3>Livros</h3>
        <p>A aba Livros reúne os títulos das trilhas e a estante de Formação, com livros que formam a criança mesmo sem pertencer a uma matéria. Leia em voz alta mesmo para quem já lê sozinho, e comece pelos livros curtos e engraçados com quem ainda não tem o hábito. Procure na biblioteca da escola, em bibliotecas públicas e em sebos antes de comprar.</p>
        <h3>Jogos</h3>
        <p>Os jogos estão em quatro estágios, das bases aos avançados. Cada ficha diz o que o jogo trabalha, por que importa e como aproveitar a partida. Conversar depois de jogar vale tanto quanto jogar.</p>
        <h3>Mão na massa</h3>
        <ol className="guia-passos">
          <li><b>Prever</b>: antes de começar, a criança diz o que acha que vai acontecer.</li>
          <li><b>Testar</b>: fazem juntos, seguindo os passos.</li>
          <li><b>Observar</b>: desenhar ou anotar o que viram.</li>
          <li><b>Explicar</b>: a criança conta com as próprias palavras por que aconteceu.</li>
          <li><b>Registrar</b>: guardar no diário as frases e perguntas que surgiram.</li>
        </ol>
        <p className="guia-nota"><b>Segurança.</b> Leia o campo “Cuidado” de cada atividade. Água quente, fogo, álcool, objetos cortantes e pilhas pequenas ficam sempre com um adulto.</p>
      </section>

      <section id="mais" className="guia-s">
        <h2>8. Loja, Olimpíadas e Temáticas</h2>
        <ul>
          <li><b>Loja</b>: jogos educativos à venda no Mercado Livre e na Shopee, com o que cada um trabalha. Eles também aparecem nos temas em que fazem sentido.</li>
          <li><b>Olimpíadas</b>: competições com inscrição individual para crianças dos anos iniciais, com filtro por área, materiais para se preparar e um selo quando as inscrições estão abertas. A lista é conferida todo mês.</li>
          <li><b>Temáticas</b>: livros, filmes, atividades e materiais para datas especiais, como Halloween, Dia do Saci e Natal.</li>
          <li><b>Dúvidas comuns</b>: respostas sobre o que se aprende em cada ano, leitura, rotina de estudo e mais.</li>
        </ul>
      </section>

      <section id="semana" className="guia-s">
        <h2>9. Uma semana possível</h2>
        <p>Encontros curtos e frequentes funcionam melhor que sessões longas. Um exemplo para quem tem pouco tempo:</p>
        <table className="guia-t">
          <thead><tr><th>Dia</th><th>Atividade</th><th>Tempo</th></tr></thead>
          <tbody>
            <tr><td>Todo dia</td><td>Uma folha do treino diário do tema em andamento.</td><td>10 min</td></tr>
            <tr><td>Segunda</td><td>Português: leitura do livro indicado no tema e uma conversa.</td><td>20 min</td></tr>
            <tr><td>Terça</td><td>Matemática: exercícios do tema, com material concreto.</td><td>20 min</td></tr>
            <tr><td>Quarta</td><td>Um jogo ligado ao que estão estudando.</td><td>30 min</td></tr>
            <tr><td>Quinta</td><td>Ciências: leitura ou episódio de série do tema.</td><td>20 min</td></tr>
            <tr><td>Sexta</td><td>Filme em família, com conversa depois.</td><td>1h30</td></tr>
            <tr><td>Sábado</td><td>Uma atividade mão na massa.</td><td>45 min</td></tr>
            <tr><td>Domingo</td><td>Olhar o Diário da semana junto com a criança e escolher o próximo passo.</td><td>10 min</td></tr>
            <tr><td>Toda noite</td><td>Leitura em voz alta antes de dormir.</td><td>15 min</td></tr>
          </tbody>
        </table>
      </section>

      <section id="cuidados" className="guia-s">
        <h2>10. Mais de uma criança e cuidados</h2>
        <ul>
          <li>Cada criança pode estar num ano diferente de cada trilha. Troque o nome no topo da página para marcar o progresso de cada uma.</li>
          <li>Evite comparar irmãos. O caminho de cada um mostra a história dele.</li>
          <li>Telas entram como experiência em família, não como passatempo solitário. Confira a classificação indicativa e a plataforma antes de assistir.</li>
          <li>Se a criança cansar ou resistir, pare e volte outro dia. O objetivo é que ela peça mais.</li>
          <li>Converse com a professora sobre o que está sendo visto em sala, para alinhar os temas.</li>
        </ul>
      </section>

      <section id="faq" className="guia-s">
        <h2>11. Perguntas frequentes</h2>
        <dl className="guia-faq">
          <dt>Preciso pagar alguma coisa?</dt>
          <dd>Não. As trilhas, o diagnóstico, o diário, os treinos diários e o planejamento são gratuitos. As apostilas e os kits são pagos e opcionais.</dd>
          <dt>Preciso comprar todos os livros e jogos?</dt>
          <dd>Não. Escolha alguns por tema, use a biblioteca, troque com outras famílias e faça versões caseiras de jogos como memória, bingo e dominó.</dd>
          <dt>O link de acesso não chegou no meu e-mail.</dt>
          <dd>Espere alguns minutos e olhe o spam e a aba Promoções. Se não aparecer, peça outro link na tela Entrar, conferindo se o e-mail está certo.</dd>
          <dt>Troquei de celular. Perdi o diário?</dt>
          <dd>Não. Os registros ficam na sua conta. No celular novo, toque em Entrar e use o mesmo e-mail.</dd>
          <dt>Minha criança está no 3º ano, mas não lê bem. Por onde começo?</dt>
          <dd>Pelo diagnóstico: ele volta aos anos anteriores e mostra o tema certo. Os anos são referência; o importante é partir do que ela já sabe.</dd>
          <dt>As marcações valem para todas as crianças?</dt>
          <dd>Não. Valem para a criança escolhida no topo da página. Troque o nome para marcar o progresso de outra.</dd>
          <dt>Posso usar com minha turma na escola?</dt>
          <dd>Pode. As trilhas, os treinos, os jogos e os experimentos servem para sala de aula. O diário foi pensado para poucas crianças.</dd>
          <dt>Encontrei uma indicação errada ou fora do ar.</dt>
          <dd>Me avise pelo e-mail ou pelo Instagram que aparecem no rodapé do site.</dd>
        </dl>
        <p className="guia-nota"><b>Resumo em uma frase.</b> Faça o diagnóstico, siga o tema indicado, pratique um pouco por dia e escreva no diário o que a criança descobriu. Repita na semana seguinte.</p>
      </section>
    </div>
  );
}
