import Link from "next/link";
import { CONTATO } from "@/lib/contato";
import PreferenciasCookies from "./PreferenciasCookies";
import { PEDIR_CONSENTIMENTO } from "@/lib/consentimento";
import { AMAZON_TAG, AVISO_AFILIADO } from "@/lib/afiliados";

export default function Footer() {
  const { email, whatsapp, instagram } = CONTATO;
  const assunto = encodeURIComponent("Sugestão para o Atlas do Aprender");
  const temContato = !!(email || whatsapp || instagram);
  return (
    <footer className="credit">
      <div className="wrap" style={{ display: "grid", gap: 16 }}>
        {temContato && (
          <div className="feedback">
            <p className="feedback-t">Me ajude a melhorar o Atlas</p>
            <p>
              Encontrou algo que não funcionou ou que não achou legal? Tem uma ideia de melhoria, ou um livro, jogo ou
              material para indicar? Me conta.
            </p>
            <div className="row">
              {email && <a className="btn small" href={`mailto:${email}?subject=${assunto}`}>E-mail: {email}</a>}
              {whatsapp && (
                <a className="btn small ghost" href={`https://wa.me/${whatsapp}?text=${assunto}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              )}
              {instagram && (
                <a className="btn small ghost" href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">Instagram @{instagram}</a>
              )}
            </div>
          </div>
        )}
        <p>
          <b>Atlas do Aprender</b> foi criado por <b>Stephanie Kamarry</b>, com base na experiência de acompanhar a
          formação dos próprios filhos e em anos de estudo sobre educação e aprendizagem.
        </p>
        {AMAZON_TAG && <p className="afiliado">{AVISO_AFILIADO}</p>}
        {PEDIR_CONSENTIMENTO && <p className="footer-links"><Link href="/privacidade">Privacidade</Link> <PreferenciasCookies /></p>}
      </div>
    </footer>
  );
}
