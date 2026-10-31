"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** Cartão do painel com o número de conquistas esperando aprovação. */
export default function ConquistasCard() {
  const [n, setN] = useState<number | null>(null);
  const [sem, setSem] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("conquistas").select("id", { count: "exact", head: true }).eq("status", "pendente").then(({ count, error }) => {
      if (error) setSem(true); else setN(count ?? 0);
    });
  }, []);
  return (
    <Link href="/painel/conquistas" className="card pn-pend">
      <span className="pn-kpi-n">Mural de conquistas</span>
      <b>{sem ? "—" : n === null ? "…" : `${n} aguardando`}</b>
      <span className="meta">{sem ? "rode o arquivo supabase/conquistas.sql para ativar" : "conferir as fotos e aprovar →"}</span>
    </Link>
  );
}
