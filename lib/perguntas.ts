import { supabase } from "@/lib/supabase";

/** Resposta da professora publicada no site (sem o texto original nem quem perguntou). */
export type Resposta = { id: string; titulo: string; resposta: string; ano: string; respondida_em: string | null };

export async function respostasPublicas(): Promise<Resposta[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.rpc("respostas_publicas");
    return error || !data ? [] : (data as Resposta[]);
  } catch { return []; }
}

export async function respostaPublica(id: string): Promise<Resposta | null> {
  if (!supabase || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  try {
    const { data, error } = await supabase.rpc("resposta_publica", { p_id: id });
    return error || !data?.length ? null : (data[0] as Resposta);
  } catch { return null; }
}

/** Primeiras palavras da resposta, para a lista e a descrição da página. */
export const resumoDe = (t: string, n = 160) => { const s = t.replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, s.lastIndexOf(" ", n)) + "…" : s; };
