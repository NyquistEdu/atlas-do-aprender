"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";

export default function Entrar() {
  const q = useSearchParams();
  const router = useRouter();
  const { user } = useAtlas();
  const volta = q.get("volta") && q.get("volta")!.startsWith("/") ? q.get("volta")! : "/diario";
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "enviado" | "erro">("");
  const [msgErro, setMsgErro] = useState("");

  useEffect(() => { if (user) router.replace(volta); }, [user, volta, router]);

  if (!supabase) return <div className="wrap"><h2>Entrar</h2><div className="empty">O login ainda não foi configurado neste site.</div></div>;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setMsgErro("");
    const { error } = await supabase!.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}${volta}` },
    });
    if (error) {
      console.error("Erro Supabase signInWithOtp:", error);
      setEstado("erro");
      setMsgErro(error.message);
    } else {
      setEstado("enviado");
    }
  };

  return (
    <div className="wrap">
      <h2>Entrar</h2>
      <p className="lead">Tudo no Atlas está aberto para consulta. O login serve só para registrar: marcar temas e livros e usar o diário. Não precisa de senha: enviamos um link de acesso para o seu e-mail.</p>
      {estado === "enviado" ? (
        <div className="card"><h3>Confira seu e-mail</h3><p>Enviamos um link para <b>{email}</b>. Abra no mesmo aparelho e navegador para entrar. Se não chegar em alguns minutos, olhe a caixa de spam.</p></div>
      ) : (
        <form className="diary" onSubmit={enviar}>
          <label className="f">Seu e-mail<input id="email" type="email" maxLength={100} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" /></label>
          <div className="row">
            <button className="btn" type="submit" disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : "Enviar link de acesso"}</button>
            {estado === "erro" && (
              <span className="meta" role="status" style={{ color: "var(--mat, #dc2626)" }}>
                {msgErro ? `Erro: ${msgErro}` : "Não consegui enviar. Confira o e-mail e tente de novo em alguns minutos."}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
