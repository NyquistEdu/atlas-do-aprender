"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rastrear } from "@/lib/rastreio";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
/** Há alguma ferramenta que depende de consentimento? */
export const TEM_RASTREIO = Boolean(GA_ID || PIXEL_ID);
const CHAVE = "atlas-consentimento-analytics";
type Escolha = "sim" | "nao" | null;

/** Abre de novo o aviso de cookies (usado pelo link do rodapé). */
export function abrirPreferencias() {
  window.dispatchEvent(new Event("atlas-preferencias-cookies"));
}

/** Uma visita de página a cada troca de rota, mais o ViewContent das páginas de apostila. */
function Rotas() {
  const path = usePathname();
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) primeira.current = false; // o PageView da primeira página sai junto com o init do pixel
    else rastrear("PageView");
    const m = path?.match(/^\/apostilas\/([^/]+)/);
    if (m) rastrear("ViewContent", { content_ids: [m[1]], content_type: "product" });
  }, [path]);
  useEffect(() => {
    // Cliques em links de afiliado e downloads de PDF, em qualquer página.
    const ouvir = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.href.includes("amazon.com.br")) rastrear("CliqueAfiliado", { loja: "amazon", pagina: location.pathname });
      else if (a.hasAttribute("download") || a.href.endsWith(".pdf")) rastrear("BaixouMaterial", { arquivo: a.pathname });
    };
    document.addEventListener("click", ouvir, true);
    return () => document.removeEventListener("click", ouvir, true);
  }, []);
  return null;
}

/**
 * Google Analytics 4 e Pixel da Meta só são carregados depois que a pessoa aceita.
 * Sem NEXT_PUBLIC_GA_ID e sem NEXT_PUBLIC_META_PIXEL_ID, nada aparece e nada é carregado.
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

  if (!TEM_RASTREIO || !pronto) return null;

  const decidir = (v: "sim" | "nao") => {
    try { localStorage.setItem(CHAVE, v); } catch {}
    if (v === "nao" && escolha === "sim") {
      // Desliga a coleta já carregada nesta visita.
      if (GA_ID) (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
      try { (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.("consent", "revoke"); } catch {}
    }
    setEscolha(v);
    setAberto(false);
  };

  return (
    <>
      {escolha === "sim" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {escolha === "sim" && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {escolha === "sim" && <Rotas />}
      {aberto && (
        <div className="cookies" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
          <p>
            {PIXEL_ID
              ? "Usamos cookies de medição (Google Analytics e Pixel da Meta) para saber quais páginas são úteis e se os anúncios do Atlas funcionam. Eles só são ativados se você aceitar. "
              : "Usamos o Google Analytics para saber quantas pessoas visitam o Atlas e quais páginas são mais úteis. Ele só é ativado se você aceitar. "}
            <Link href="/privacidade">Saiba mais</Link>.
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
