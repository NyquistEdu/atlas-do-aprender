"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Cartão do painel com o número de perguntas das famílias ainda sem resposta. */
export default function PerguntasCard() {
  const [n, setN] = useState<number | null>(null);
  const [sem, setSem] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("perguntas").select("id", { count: "exact", head: true }).eq("status", "nova").then(({ count, error }) => {
      if (error) setSem(true); else setN(count ?? 0);
    });
  }, []);
  return (
    <Link href="/painel/perguntas" className="card pn-pend">
      <span className="pn-kpi-n">Pergunte à professora</span>
      <b>{sem ? "—" : n === null ? "…" : `${n} ${n === 1 ? "pergunta nova" : "perguntas novas"}`}</b>
      <span className="meta">{sem ? "rode o arquivo supabase/perguntas.sql para ativar" : "responder e publicar →"}</span>
    </Link>
  );
}
