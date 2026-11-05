import type { Plano } from "@/lib/plano";

export const CHAVE_IMPRIMIR = "atlas-plano-imprimir";

/** Guarda o plano e abre a folha (quadro da semana ou calendário de marcar) para imprimir ou salvar em PDF. */
export function abrirImpressao(p: Plano, folha: "semana" | "marcar") {
  try { localStorage.setItem(CHAVE_IMPRIMIR, JSON.stringify(p)); } catch {}
  window.open(`/planejamento/imprimir?folha=${folha}`, "_blank");
}
