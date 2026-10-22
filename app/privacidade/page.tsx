import type { Metadata } from "next";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = { title: "Privacidade", description: "Como o Atlas do Aprender trata dados, cookies, links de afiliado e compras de apostilas.", alternates: { canonical: "/privacidade" } };

export default function Privacidade() {
  return (
    <div className="wrap" style={{ maxWidth: 760 }}>
      <h1>Privacidade</h1>
      <p className="lead">Como o Atlas do Aprender trata as informações de quem usa o site.</p>

      <h3 className="ini-h">O que é aberto, sem cadastro</h3>
      <p>Trilhas, livros, jogos, experimentos e o guia podem ser consultados sem criar conta e sem informar nenhum dado.</p>

      <h3 className="ini-h">Contagem básica de visitas (Vercel Analytics)</h3>
      <p>
        A Vercel, empresa que hospeda o site, faz uma contagem básica de visitas: páginas vistas, país, tipo de aparelho e
        de onde a pessoa veio. Ela não usa cookies, não guarda o endereço IP e não identifica quem visitou.
      </p>

      <h3 className="ini-h">Estatísticas de visita (Google Analytics)</h3>
      <p>
        Se você aceitar no aviso de cookies, usamos o Google Analytics para contar visitas e entender quais páginas são
        mais usadas: por exemplo, quantas pessoas abriram as trilhas de Matemática ou de onde vieram (Instagram,
        WhatsApp, buscas). O endereço IP é anonimizado. Se você recusar, o Google
        Analytics não é carregado. Você pode mudar sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.
      </p>

      <h3 className="ini-h">Medição de anúncios (Pixel da Meta)</h3>
      <p>
        O Atlas é divulgado com anúncios no Instagram e no Facebook. Se você aceitar no aviso de cookies, o Pixel da Meta
        registra ações gerais no site, como abrir uma página, criar a conta, marcar uma atividade, clicar em “Ver na
        Amazon” ou em “Comprar”, para medir se os anúncios funcionam e mostrá-los a famílias com interesse parecido. Não
        enviamos nome, e-mail, nome das crianças nem nada do que você escreve no diário. Se você recusar, o Pixel não é
        carregado, e você pode mudar a escolha em “Preferências de cookies”, no rodapé.
      </p>

      <h3 className="ini-h">Links para a Amazon</h3>
      <p>
        Os botões “Ver na Amazon” levam a uma busca pelo livro ou jogo. Como associada da Amazon, eu ganho com compras
        qualificadas, sem nenhum custo a mais para você. A Amazon pode usar os próprios cookies quando você abre o site
        dela; isso segue a política de privacidade da Amazon. O Atlas é e continua gratuito.
      </p>

      <h3 className="ini-h">Compra de apostilas</h3>
      <p>
        As apostilas em PDF são vendidas por uma plataforma de pagamento externa. Ao clicar em “Comprar”, você vai para
        a página dela, que recebe seus dados de pagamento e de entrega e segue a própria política de privacidade. O
        Atlas não vê nem guarda dados de cartão ou de Pix. O site só conta, sem identificar você, quantas vezes cada
        botão de compra foi clicado.
      </p>

      <h3 className="ini-h">Cadastro e diário</h3>
      <p>
        Para marcar temas, livros e usar o diário, você entra com seu e-mail. Guardamos o e-mail, os nomes que você der
        às crianças, as marcações e os registros do diário. Cada pessoa só vê os próprios registros. Esses dados ficam no
        Supabase, o serviço de banco de dados do site, e não são enviados ao Google Analytics, vendidos ou compartilhados.
        Para proteger as crianças, sugerimos usar só o primeiro nome ou um apelido.
      </p>

      <h3 className="ini-h">Pedido de planejamento gratuito</h3>
      <p>
        Quem pede um planejamento informa nome, e-mail, WhatsApp, cidade, dados sobre a rotina da família, sobre a criança
        (primeiro nome, idade, ano escolar, como está na leitura e na matemática) e os horários disponíveis. Esses dados
        ficam no Supabase, só Stephanie Kamarry tem acesso, e são usados apenas para entrar em contato e preparar o
        planejamento. Não são vendidos nem compartilhados. Para apagar o seu pedido, basta escrever para o e-mail abaixo.
      </p>

      <h3 className="ini-h">Apagar seus dados</h3>
      <p>
        Você pode excluir registros do diário e crianças cadastradas a qualquer momento no próprio site. Para apagar a
        conta inteira, peça pelo e-mail abaixo.
      </p>

      <h3 className="ini-h">Contato</h3>
      <p>
        Responsável: Stephanie Kamarry{CONTATO.email ? <>. E-mail: <a href={`mailto:${CONTATO.email}`}>{CONTATO.email}</a></> : null}.
      </p>
    </div>
  );
}
