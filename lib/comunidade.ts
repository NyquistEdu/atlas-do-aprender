import { supabase } from "@/lib/supabase";

export type ConquistaPub = { id: string; criado_em: string; tema: string; texto: string; autor: string; foto: string; desafio: string; palmas: number };
export type DicaPub = { id: string; criado_em: string; tema: string; autor: string; texto: string };

/** Últimas conquistas aprovadas do mural (com a foto já em endereço público). */
export async function ultimasConquistas(n = 6): Promise<ConquistaPub[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.rpc("mural", { p_limite: n, p_antes: null, p_desafio: null });
    if (error || !data) return [];
    return (data as ConquistaPub[]).map((c) => ({ ...c, foto: c.foto ? supabase!.storage.from("conquistas").getPublicUrl(c.foto).data.publicUrl : "" }));
  } catch { return []; }
}

/** Últimas dicas aprovadas, de qualquer fase. */
export async function ultimasDicas(n = 4): Promise<DicaPub[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from("dicas").select("id,criado_em,tema,autor,texto").eq("status", "aprovada").order("criado_em", { ascending: false }).limit(n);
    return error || !data ? [] : (data as DicaPub[]);
  } catch { return []; }
}

/** Quantas famílias já participaram do desafio. */
export async function participantes(desafio: string): Promise<number> {
  if (!supabase) return 0;
  try {
    const { data, error } = await supabase.rpc("participantes_desafio", { p_desafio: desafio });
    return error ? 0 : (data as number) || 0;
  } catch { return 0; }
}
