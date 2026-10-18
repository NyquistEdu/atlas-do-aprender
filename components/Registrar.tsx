"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAtlas } from "./Providers";
import { linkAcesso } from "./Acesso";

/**
 * Botões que gravam algo. Sem conta, o botão mostra a mesma ação e leva à tela de acesso;
 * a marcação pendente volta no link (?marcar=) e é aplicada sozinha depois que a pessoa entra.
 */
export function Marcar({ chave, rotulo = ["Marcar como concluído", "Desmarcar"], origem = "marcar" }: { chave: string; rotulo?: [string, string]; origem?: string }) {
  const { user, configurado, crianca, feito, alternar } = useAtlas();
  const path = usePathname() || "/";
  const aplicado = useRef(false);

  useEffect(() => {
    if (!user || !crianca || aplicado.current || typeof window === "undefined") return;
    const u = new URL(window.location.href);
    if (u.searchParams.get("marcar") !== chave) return;
    aplicado.current = true;
    if (!feito(chave)) alternar(chave);
    u.searchParams.delete("marcar");
    window.history.replaceState(null, "", u.pathname + (u.search ? u.search : "") + u.hash);
    setTimeout(() => {
      const el = document.querySelector(`[data-chave="${CSS.escape(chave)}"]`);
      const det = el?.closest("details");
      if (det) det.open = true;
      el?.scrollIntoView({ block: "center" });
    }, 300);
  }, [user, crianca, chave, feito, alternar]);

  if (!configurado) return null;
  if (!user) {
    const volta = `${path}?${new URLSearchParams({ marcar: chave }).toString()}`;
    return <Link className="btn small" data-chave={chave} href={linkAcesso(volta, origem)}>{rotulo[0]}</Link>;
  }
  const ok = feito(chave);
  return <button className="btn small" type="button" data-chave={chave} onClick={() => alternar(chave)}>{ok ? rotulo[1] : rotulo[0]}</button>;
}

export function ParaDiario({ area, tipo, titulo, texto = "Guardar no diário" }: { area: string; tipo: string; titulo: string; texto?: string }) {
  const { configurado } = useAtlas();
  if (!configurado) return null;
  const q = new URLSearchParams({ area, tipo, titulo }).toString();
  return <Link className="btn small ghost" href={`/diario?${q}`}>{texto}</Link>;
}

export function Feito({ chave, texto = "✓ concluído" }: { chave: string; texto?: string }) {
  const { user, feito } = useAtlas();
  return user && feito(chave) ? <span className="done-badge">{texto}</span> : null;
}
