"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Cartão do painel com o número de dicas das famílias esperando aprovação. */
export default function DicasCard() {
  const [n, setN] = useState<number | null>(null);
  const [sem, setSem] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("dicas").select("id", { count: "exact", head: true }).eq("status", "pendente").then(({ count, error }) => {
      if (error) setSem(true); else setN(count ?? 0);
    });
  }, []);
  return (
    <Link href="/painel/dicas" className="card pn-pend">
      <span className="pn-kpi-n">Dicas das famílias</span>
      <b>{sem ? "—" : n === null ? "…" : `${n} ${n === 1 ? "aguardando" : "aguardando"}`}</b>
      <span className="meta">{sem ? "rode o arquivo supabase/dicas.sql para ativar" : "aprovar, responder ou recusar →"}</span>
    </Link>
  );
}
