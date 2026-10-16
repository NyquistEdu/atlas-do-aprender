import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** null quando o projeto ainda não foi ligado ao Supabase: o site funciona só para leitura. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
