/**
 * Contagem anônima, sem cookies e sem consentimento necessário.
 *
 * Cada ação importante (visita de entrada, clique em Comprar, download, cadastro...) soma +1
 * numa tabela de totais por dia no Supabase (public.contagens, via a função public.contar).
 * Não há identificador de pessoa: nada de IP, e-mail, ID de usuário ou cookie. Só "evento",
 * um detalhe curto (página, apostila, arquivo) e a origem da visita (ex.: "meta / 04-ideia").
 *
 * A origem fica guardada no próprio navegador (localStorage, 30 dias) apenas como um rótulo de
 * campanha, para que o cadastro feito depois, ao voltar pelo link do e-mail, ainda saiba de onde veio.
 */
import { supabase } from "@/lib/supabase";

const CHAVE_ORIGEM = "atlas-origem";
const VALIDADE = 30 * 24 * 60 * 60 * 1000;

/** Nomes usados no código (rastrear) → nome curto na tabela. Eventos fora daqui não são contados. */
const MAPA: Record<string, string> = {
  CompleteRegistration: "cadastro",
  Lead: "pedido_planejamento",
  ViewContent: "viu_apostila",
  InitiateCheckout: "comprar",
  CliqueAfiliado: "afiliado",
  BaixouMaterial: "baixou",
  ConviteVisto: "convite_visto",
  AcessoAberto: "abriu_entrar",
  LinkSolicitado: "pediu_link",
  Entrou: "entrou",
  AtividadeRegistrada: "registrou_atividade",
};

function limpar(s: string | null | undefined, max = 40) {
  return (s || "").toLowerCase().replace(/[^a-z0-9._\-/ ]/g, "").trim().slice(0, max);
}

/** Lê a origem desta visita a partir da URL (utm_*, fbclid, gclid) ou do site que mandou a pessoa. */
function origemDaUrl(): string | null {
  try {
    const u = new URL(location.href);
    const src = limpar(u.searchParams.get("utm_source"));
    const camp = limpar(u.searchParams.get("utm_content") || u.searchParams.get("utm_campaign"));
    if (src) return camp ? `${src} / ${camp}` : src;
    if (u.searchParams.has("fbclid")) return "meta";
    if (u.searchParams.has("gclid")) return "google-ads";
    const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    if (ref && !ref.endsWith("atlasdoaprender.com.br")) {
      if (/(facebook|instagram|fb)\./.test(ref) || ref === "l.facebook.com" || ref === "l.instagram.com") return "meta-organico";
      if (/whatsapp|wa\.me/.test(ref)) return "whatsapp";
      if (/google\./.test(ref)) return "google";
      return limpar(ref);
    }
  } catch {}
  return null;
}

/** Origem atual: a da URL, se houver; senão a última guardada (até 30 dias); senão "direto". */
export function origem(): string {
  if (typeof window === "undefined") return "";
  const daUrl = origemDaUrl();
  try {
    if (daUrl) {
      localStorage.setItem(CHAVE_ORIGEM, JSON.stringify({ o: daUrl, t: Date.now() }));
      return daUrl;
    }
    const salvo = JSON.parse(localStorage.getItem(CHAVE_ORIGEM) || "null") as { o: string; t: number } | null;
    if (salvo && Date.now() - salvo.t < VALIDADE) return salvo.o;
  } catch {}
  return daUrl || "direto";
}

/** Soma +1 no total do dia. Nunca lança erro e nunca atrasa a página. */
export function contar(evento: string, detalhe = "") {
  if (typeof window === "undefined" || !supabase) return;
  const nome = MAPA[evento] || evento;
  try {
    void supabase
      .rpc("contar", { p_evento: nome, p_detalhe: limpar(detalhe, 80), p_origem: origem() })
      .then(() => {}, () => {});
  } catch {}
}
