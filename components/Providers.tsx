"use client";

import { rastrear } from "@/lib/rastreio";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type Entrada = {
  id: string;
  data: string;
  crianca: string;
  area: string;
  tipo: string;
  minutos: number;
  titulo: string;
  o_que: string;
  descobertas: string;
  envolvimento: number;
  proximo: string;
  criado_em?: string;
};
export type NovaEntrada = Omit<Entrada, "id" | "criado_em">;

type Atlas = {
  configurado: boolean;
  carregando: boolean;
  user: User | null;
  criancas: string[];
  crianca: string;
  setCrianca: (n: string) => void;
  addCrianca: (n: string) => Promise<string | null>;
  removeCrianca: (n: string) => Promise<void>;
  /** c: nome da criança; sem c, usa a criança escolhida no topo. */
  feito: (chave: string, c?: string) => boolean;
  alternar: (chave: string, c?: string) => Promise<void>;
  entradas: Entrada[];
  addEntrada: (e: NovaEntrada) => Promise<string | null>;
  removeEntrada: (id: string) => Promise<void>;
  sair: () => Promise<void>;
  erro: string;
};

const Ctx = createContext<Atlas | null>(null);
export const useAtlas = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAtlas fora do Providers");
  return c;
};

const LS_CRIANCA = "atlas-crianca";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(!!supabase);
  const [criancas, setCriancas] = useState<string[]>([]);
  const [crianca, setCriancaState] = useState("");
  const [progresso, setProgresso] = useState<Set<string>>(new Set());
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!supabase) return;
    // Chegou pelo link do e-mail? (token no endereço) Conta como "Entrou" no funil de cadastro.
    const veioDoLink = /access_token=|type=magiclink/.test(window.location.hash) || new URLSearchParams(window.location.search).has("code");
    if (veioDoLink) {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        if (s?.user) { rastrear("Entrou", { origem: "link_email" }); sub.subscription.unsubscribe(); }
      });
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const carregar = useCallback(async () => {
    if (!supabase || !user) {
      setCriancas([]); setProgresso(new Set()); setEntradas([]);
      return;
    }
    const [c, p, d] = await Promise.all([
      supabase.from("criancas").select("nome").order("criado_em"),
      supabase.from("progresso").select("crianca,chave"),
      supabase.from("diario").select("*").order("data", { ascending: false }).order("criado_em", { ascending: false }),
    ]);
    if (c.error || p.error || d.error) {
      setErro("Não consegui carregar seus registros. Verifique a conexão e recarregue a página.");
      return;
    }
    let nomes = (c.data ?? []).map((r) => r.nome as string);
    if (!nomes.length) {
      const ins = await supabase.from("criancas").insert({ nome: "Criança 1" });
      if (!ins.error) { nomes = ["Criança 1"]; rastrear("CompleteRegistration", { content_name: "conta" }); }
    }
    setCriancas(nomes);
    let salvo = "";
    try { salvo = localStorage.getItem(LS_CRIANCA) || ""; } catch {}
    setCriancaState(nomes.includes(salvo) ? salvo : nomes[0] || "");
    setProgresso(new Set((p.data ?? []).map((r) => `${r.crianca}|${r.chave}`)));
    setEntradas((d.data ?? []) as Entrada[]);
    setErro("");
  }, [user]);

  useEffect(() => { carregar(); }, [carregar]);

  const setCrianca = (n: string) => {
    setCriancaState(n);
    try { localStorage.setItem(LS_CRIANCA, n); } catch {}
  };

  const addCrianca = async (nome: string) => {
    const n = nome.trim();
    if (!supabase || !user) return "Entre na sua conta para cadastrar crianças.";
    if (!n) return "Escreva o nome.";
    if (n.length > 50) return "O nome deve ter no máximo 50 caracteres.";
    if (criancas.includes(n)) return "Esse nome já está cadastrado.";
    const r = await supabase.from("criancas").insert({ nome: n });
    if (r.error) return "Não consegui salvar. Tente de novo.";
    setCriancas((c) => [...c, n]);
    return null;
  };

  const removeCrianca = async (nome: string) => {
    if (!supabase || !user || criancas.length < 2) return;
    const r = await supabase.from("criancas").delete().eq("nome", nome);
    if (r.error) return;
    const resto = criancas.filter((x) => x !== nome);
    setCriancas(resto);
    if (crianca === nome) setCrianca(resto[0]);
  };

  const feito = (chave: string, c?: string) => progresso.has(`${c || crianca}|${chave}`);

  const alternar = async (chave: string, c?: string) => {
    const quem = c || crianca;
    if (!supabase || !user || !quem) return;
    const k = `${quem}|${chave}`;
    const tinha = progresso.has(k);
    setProgresso((p) => { const n = new Set(p); tinha ? n.delete(k) : n.add(k); return n; });
    const r = tinha
      ? await supabase.from("progresso").delete().match({ crianca: quem, chave })
      : await supabase.from("progresso").insert({ crianca: quem, chave });
    if (r.error) {
      setProgresso((p) => { const n = new Set(p); tinha ? n.add(k) : n.delete(k); return n; });
      setErro("Não consegui salvar a marcação. Tente de novo.");
    } else if (!tinha) {
      rastrear("AtividadeRegistrada", { tipo: chave.split("|")[0] || "marcacao" });
    }
  };

  const addEntrada = async (e: NovaEntrada) => {
    if (!supabase || !user) return "Entre na sua conta para registrar.";
    if (!e.titulo.trim()) return "Escreva um título.";
    if (e.titulo.length > 150) return "O título deve ter no máximo 150 caracteres.";
    if ((e.o_que || "").length > 2000) return "O campo 'O que fizemos' deve ter no máximo 2000 caracteres.";
    if ((e.descobertas || "").length > 2000) return "O campo 'Descobertas' deve ter no máximo 2000 caracteres.";
    if ((e.proximo || "").length > 300) return "O campo 'Próximo passo' deve ter no máximo 300 caracteres.";
    const r = await supabase.from("diario").insert(e).select().single();
    if (r.error) return "Não consegui salvar o registro. Tente de novo.";
    rastrear("AtividadeRegistrada", { tipo: "diario" });
    setEntradas((x) => [r.data as Entrada, ...x].sort((a, b) => (b.data + (b.criado_em || "")).localeCompare(a.data + (a.criado_em || ""))));
    return null;
  };

  const removeEntrada = async (id: string) => {
    if (!supabase || !user) return;
    const r = await supabase.from("diario").delete().eq("id", id);
    if (!r.error) setEntradas((x) => x.filter((e) => e.id !== id));
  };

  const sair = async () => { if (supabase) await supabase.auth.signOut(); };

  const valor = useMemo<Atlas>(() => ({
    configurado: !!supabase, carregando, user, criancas, crianca, setCrianca, addCrianca, removeCrianca,
    feito, alternar, entradas, addEntrada, removeEntrada, sair, erro,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [carregando, user, criancas, crianca, progresso, entradas, erro]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
