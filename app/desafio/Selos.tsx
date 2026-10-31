"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import type { DesafioInfo } from "../mural/Mural";

/** Selos que a família já ganhou (participações aprovadas em desafios). */
export function Selos({ info }: { info: Record<string, DesafioInfo> }) {
  const { user } = useAtlas();
  const [ids, setIds] = useState<string[] | null>(null);
  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("conquistas").select("desafio").eq("user_id", user.id).eq("status", "aprovada").neq("desafio", "").then(({ data, error }) => {
      if (!error) setIds([...new Set((data as { desafio: string }[]).map((d) => d.desafio))].sort());
    });
  }, [user]);
  if (!user || !ids) return null;
  return (
    <div className="selos">
      <b>Seus selos</b>
      {ids.length ? (
        <div className="selos-lista">{ids.map((id) => info[id] && <span key={id} className="selo-mini" title={`Desafio de ${info[id].mes}`}><i aria-hidden="true">{info[id].emoji}</i>{info[id].mes}</span>)}</div>
      ) : (
        <p className="meta" style={{ margin: 0 }}>Ainda nenhum. Faça o desafio deste mês e ganhe o primeiro!</p>
      )}
    </div>
  );
}

/** Quantas famílias já mostraram o resultado do desafio. */
export function Participantes({ desafio }: { desafio: string }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.rpc("participantes_desafio", { p_desafio: desafio }).then(({ data, error }) => { if (!error) setN(data as number); });
  }, [desafio]);
  return n ? <span>👏 {n} {n === 1 ? "família já participou" : "famílias já participaram"}</span> : null;
}
