"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CHAVE = "atlas-consentimento-analytics";
type Escolha = "sim" | "nao" | null;

/** Abre de novo o aviso de cookies (usado pelo link do rodapé). */
export function abrirPreferencias() {
  window.dispatchEvent(new Event("atlas-preferencias-cookies"));
}

/**
 * Google Analytics 4 só é carregado depois que a pessoa aceita.
 * Sem NEXT_PUBLIC_GA_ID, nada aparece e nada é carregado.
 */
export default function Analytics() {
  const [escolha, setEscolha] = useState<Escolha>(null);
  const [pronto, setPronto] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    let v: Escolha = null;
    try { v = (localStorage.getItem(CHAVE) as Escolha) || null; } catch {}
    setEscolha(v);
    setAberto(v === null);
    setPronto(true);
    const abrir = () => setAberto(true);
    window.addEventListener("atlas-preferencias-cookies", abrir);
    return () => window.removeEventListener("atlas-preferencias-cookies", abrir);
  }, []);

  if (!GA_ID || !pronto) return null;

  const decidir = (v: "sim" | "nao") => {
    try { localStorage.setItem(CHAVE, v); } catch {}
    if (v === "nao" && escolha === "sim") {
      // Desliga a coleta já carregada nesta visita.
      (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
    }
    setEscolha(v);
    setAberto(false);
  };

  return (
    <>
      {escolha === "sim" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {aberto && (
        <div className="cookies" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
          <p>
            Usamos o Google Analytics para saber quantas pessoas visitam o Atlas e quais páginas são mais úteis. Ele só
            é ativado se você aceitar. <Link href="/privacidade">Saiba mais</Link>.
          </p>
          <div className="row">
            <button className="btn small" type="button" onClick={() => decidir("sim")}>Aceitar</button>
            <button className="btn small ghost" type="button" onClick={() => decidir("nao")}>Recusar</button>
          </div>
        </div>
      )}
    </>
  );
}
