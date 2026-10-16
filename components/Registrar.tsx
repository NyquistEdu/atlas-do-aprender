"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtlas } from "./Providers";

/** Botões que gravam algo. Sem login, levam à tela de entrada. */
export function Marcar({ chave, rotulo = ["Marcar como concluído", "Desmarcar"] }: { chave: string; rotulo?: [string, string] }) {
  const { user, configurado, feito, alternar } = useAtlas();
  const path = usePathname() || "/";
  if (!configurado) return null;
  if (!user) return <Link className="btn small" href={`/entrar?volta=${encodeURIComponent(path)}`}>Entre para marcar</Link>;
  const ok = feito(chave);
  return <button className="btn small" type="button" onClick={() => alternar(chave)}>{ok ? rotulo[1] : rotulo[0]}</button>;
}

export function ParaDiario({ area, tipo, titulo, texto = "Registrar no diário" }: { area: string; tipo: string; titulo: string; texto?: string }) {
  const { configurado } = useAtlas();
  if (!configurado) return null;
  const q = new URLSearchParams({ area, tipo, titulo }).toString();
  return <Link className="btn small ghost" href={`/diario?${q}`}>{texto}</Link>;
}

export function Feito({ chave, texto = "✓ concluído" }: { chave: string; texto?: string }) {
  const { user, feito } = useAtlas();
  return user && feito(chave) ? <span className="done-badge">{texto}</span> : null;
}
