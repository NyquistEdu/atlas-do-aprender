/**
 * Eventos de medição (Pixel da Meta e Google Analytics).
 * Só têm efeito se a pessoa aceitou os cookies: sem consentimento, fbq e gtag não existem e nada é enviado.
 * Nunca envie aqui nome, e-mail, nome das crianças ou texto do diário.
 */
type Fbq = (...a: unknown[]) => void;
type Gtag = (...a: unknown[]) => void;

const PADRAO = new Set(["PageView", "ViewContent", "CompleteRegistration", "InitiateCheckout", "Lead", "Search"]);

export function rastrear(evento: string, params: Record<string, unknown> = {}, tentativa = 0) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };
  // Logo após carregar a página (ex.: volta do link do e-mail) os scripts podem ainda não estar prontos.
  if (!w.fbq && !w.gtag) {
    if (tentativa < 4) setTimeout(() => rastrear(evento, params, tentativa + 1), 1500);
    return;
  }
  try { w.fbq?.(PADRAO.has(evento) ? "track" : "trackCustom", evento, params); } catch {}
  try { w.gtag?.("event", evento, params); } catch {}
}
