"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { linkAcesso } from "@/components/Acesso";

/** Página onde a família liga ou desliga os e-mails do Atlas. */
export default function Preferencias() {
  const { user, carregando } = useAtlas();
  const [quer, setQuer] = useState<boolean | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [indisp, setIndisp] = useState(false);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("preferencias_email").select("quer").eq("user_id", user.id).maybeSingle().then(({ data, error }) => {
      if (error) setIndisp(true); else setQuer(!!data?.quer);
    });
  }, [user]);

  const mudar = async (v: boolean) => {
    if (!supabase || !user) return;
    const { error } = await supabase.from("preferencias_email").upsert({ user_id: user.id, quer: v, atualizado_em: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) return;
    setQuer(v); setSalvo(true); setTimeout(() => setSalvo(false), 2500);
    if (v) {
      const { data } = await supabase.auth.getSession();
      const t = data.session?.access_token;
      if (t) fetch("/api/emails/boas-vindas", { method: "POST", headers: { authorization: `Bearer ${t}` } }).catch(() => {});
    }
  };

  if (carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  return (
    <div className="wrap" style={{ maxWidth: 680 }}>
      <h1>E-mails do Atlas</h1>
      <p className="lead">Dicas para usar o Atlas em casa, o desafio do mês, as novidades e, quando vocês sumirem por um tempo, um lembrete da próxima fase da criança. Poucos e-mails por mês, nunca propaganda de terceiros.</p>
      {!user ? (
        <p><Link className="btn" href={linkAcesso("/emails", "emails")}>Entrar para escolher</Link></p>
      ) : indisp ? (
        <p className="note">As preferências de e-mail ainda estão sendo preparadas. Volte em breve.</p>
      ) : quer === null ? (
        <p className="status">Carregando…</p>
      ) : (
        <section className="card" style={{ gap: 12 }}>
          <p style={{ margin: 0 }}>{quer ? <>Você <b>está recebendo</b> os e-mails do Atlas em <b>{user.email}</b>.</> : <>Você <b>não está recebendo</b> os e-mails do Atlas.</>}</p>
          <div className="row">
            {quer ? <button className="btn ghost" type="button" onClick={() => mudar(false)}>Parar de receber</button> : <button className="btn" type="button" onClick={() => mudar(true)}>Quero receber</button>}
            {salvo && <span className="dicas-ok">Salvo ✓</span>}
          </div>
          <p className="meta" style={{ margin: 0 }}>Sua conta, as crianças e tudo o que vocês registraram não mudam com esta escolha.</p>
        </section>
      )}
    </div>
  );
}
