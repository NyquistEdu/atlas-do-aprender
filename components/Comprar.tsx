"use client";

import { track } from "@vercel/analytics";

type Gtag = (...a: unknown[]) => void;

/** Botão de compra: leva ao checkout da plataforma e registra o clique nas estatísticas. */
export default function Comprar({ slug, titulo, checkout, preco, grande = false }: { slug: string; titulo: string; checkout: string; preco: string; grande?: boolean }) {
  if (!checkout) {
    return <span className={`btn ${grande ? "" : "small "}ghost em-breve`} aria-disabled="true">Em breve</span>;
  }
  const clicar = () => {
    try { track("comprar_apostila", { apostila: slug }); } catch {}
    try { (window as unknown as { gtag?: Gtag }).gtag?.("event", "begin_checkout", { items: [{ item_id: slug, item_name: titulo }] }); } catch {}
  };
  return (
    <a className={`btn ${grande ? "" : "small"}`} href={checkout} target="_blank" rel="noopener" onClick={clicar}>
      {preco ? `Comprar · ${preco}` : "Comprar"}
    </a>
  );
}
