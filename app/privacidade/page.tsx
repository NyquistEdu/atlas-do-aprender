import type { Metadata } from "next";
import { CONTATO } from "@/lib/contato";

export const metadata: Metadata = { title: "Privacidade" };

export default function Privacidade() {
  return (
    <div className="wrap" style={{ maxWidth: 760 }}>
      <h2>Privacidade</h2>
      <p className="lead">Como o Atlas do Aprender trata as informações de quem usa o site.</p>

      <h3 className="ini-h">O que é aberto, sem cadastro</h3>
      <p>Trilhas, livros, jogos, experimentos e o guia podem ser consultados sem criar conta e sem informar nenhum dado.</p>

      <h3 className="ini-h">Estatísticas de visita (Google Analytics)</h3>
      <p>
        Se você aceitar no aviso de cookies, usamos o Google Analytics para contar visitas e entender quais páginas são
        mais usadas: por exemplo, quantas pessoas abriram as trilhas de Matemática ou de onde vieram (Instagram,
        WhatsApp, buscas). O endereço IP é anonimizado e não usamos esses dados para anúncios. Se você recusar, o Google
        Analytics não é carregado. Você pode mudar sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.
      </p>

      <h3 className="ini-h">Cadastro e diário</h3>
      <p>
        Para marcar temas, livros e usar o diário, você entra com seu e-mail. Guardamos o e-mail, os nomes que você der
        às crianças, as marcações e os registros do diário. Cada pessoa só vê os próprios registros. Esses dados ficam no
        Supabase, o serviço de banco de dados do site, e não são enviados ao Google Analytics, vendidos ou compartilhados.
        Para proteger as crianças, sugerimos usar só o primeiro nome ou um apelido.
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
