"use client";

import { rastrear } from "@/lib/rastreio";

/** Link para o anúncio na plataforma; registra o clique (contagem anônima + Pixel/GA). */
export default function BotaoLoja({ slug, loja, href, rotulo, ghost = false }: { slug: string; loja: "mercadolivre" | "shopee"; href: string; rotulo: string; ghost?: boolean }) {
  return (
    <a
      className={`btn small${ghost ? " ghost" : ""}`}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => rastrear("CliqueLoja", { content_ids: [`${slug}/${loja}`], loja })}
    >
      {rotulo}
    </a>
  );
}
