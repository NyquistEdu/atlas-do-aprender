"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "./Providers";

const ADIAR = "atlas-emails-depois";

/** Grava a escolha de e-mails feita no cadastro e, para quem já tinha conta, pergunta uma vez se quer receber. */
export default function ConsentimentoEmail() {
  const { user } = useAtlas();
  const path = usePathname() || "/";
  const [perguntar, setPerguntar] = useState(false);
  const [feito, setFeito] = useState("");

  useEffect(() => {
    if (!user || !supabase) return;
    let cancelado = false;
    (async () => {
      const { data, error } = await supabase!.from("preferencias_email").select("quer").eq("user_id", user.id).maybeSingle();
      if (error || cancelado) return; // tabela ainda não criada: não faz nada
      if (data) return; // já escolheu
      let intencao: string | null = null;
      try { intencao = localStorage.getItem("atlas-quer-emails"); } catch {}
      if (intencao === "sim" || intencao === "nao") {
        await salvar(intencao === "sim");
        try { localStorage.removeItem("atlas-quer-emails"); } catch {}
        return;
      }
      let adiado = 0;
      try { adiado = Number(localStorage.getItem(ADIAR) || 0); } catch {}
      if (Date.now() - adiado > 14 * 86400000) setPerguntar(true);
    })();
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function salvar(quer: boolean) {
    if (!supabase || !user) return;
    // insert só com user_id e quer; se a família já tiver registro, atualiza (a permissão de cada coluna é diferente).
    let { error } = await supabase.from("preferencias_email").insert({ user_id: user.id, quer });
    if (error?.code === "23505") ({ error } = await supabase.from("preferencias_email").update({ quer, atualizado_em: new Date().toISOString() }).eq("user_id", user.id));
    if (error || !quer) return;
    const { data } = await supabase.auth.getSession();
    const t = data.session?.access_token;
    if (t) fetch("/api/emails/boas-vindas", { method: "POST", headers: { authorization: `Bearer ${t}` } }).catch(() => {});
  }

  if (feito) return <div className="consent-aviso" role="status"><p>{feito}</p></div>;
  if (!perguntar || path.startsWith("/painel") || path === "/emails") return null;
  return (
    <div className="consent-aviso" role="dialog" aria-label="E-mails do Atlas">
      <p><b>Quer receber o Atlas por e-mail?</b> Dicas para usar em casa, o desafio do mês e as novidades. Uns poucos e-mails por mês, e dá para cancelar quando quiser.</p>
      <div className="row">
        <button className="btn small" type="button" onClick={async () => { setPerguntar(false); await salvar(true); setFeito("Combinado! Em breve chega um e-mail de boas-vindas."); setTimeout(() => setFeito(""), 5000); }}>Quero receber</button>
        <button className="btn small ghost" type="button" onClick={async () => { setPerguntar(false); await salvar(false); }}>Não, obrigada</button>
        <button className="lnk" type="button" onClick={() => { setPerguntar(false); try { localStorage.setItem(ADIAR, String(Date.now())); } catch {} }}>Depois</button>
        <Link href="/privacidade" className="meta">Privacidade</Link>
      </div>
    </div>
  );
}
