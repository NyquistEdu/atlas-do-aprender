"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { rastrear } from "@/lib/rastreio";
import { useAtlas } from "./Providers";

/** Selo curto repetido em todo convite de conta. */
export const SELO_CONTA = "Conta gratuita · acesso por e-mail, sem senha";

/** Endereço da tela de acesso, voltando para a página atual (com o que a pessoa ia fazer). */
export function linkAcesso(volta: string, origem: string) {
  return `/entrar?${new URLSearchParams({ volta, origem }).toString()}`;
}

/**
 * Convite no topo das páginas para quem ainda não entrou.
 * Diz o que a conta guarda naquela página específica. Some quando a pessoa já entrou.
 */
export function ConviteConta({ origem, titulo, texto, acao = "Criar conta grátis", href }: { origem: string; titulo: string; texto: string; acao?: string; href?: string }) {
  const { configurado, carregando, user } = useAtlas();
  const path = usePathname() || "/";
  const ref = useRef<HTMLDivElement>(null);
  const visto = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visto.current) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting) && !visto.current) {
        visto.current = true;
        rastrear("ConviteVisto", { origem });
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [origem, user, carregando]);

  if (!configurado || carregando || user) return null;
  return (
    <div className="convite" ref={ref}>
      <div>
        <b>{titulo}</b>
        <span>{texto}</span>
        <small>{SELO_CONTA}</small>
      </div>
      <Link className="btn small" href={href || linkAcesso(path, origem)}>{acao}</Link>
    </div>
  );
}

/** Formulário de e-mail (link mágico). Usado na tela Entrar e dentro do diário. */
export function FormAcesso({ volta, origem, botao = "Receber link de acesso" }: { volta: string; origem: string; botao?: string }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "enviado" | "erro">("");
  const [msgErro, setMsgErro] = useState("");
  const aberto = useRef(false);

  useEffect(() => {
    if (aberto.current) return;
    aberto.current = true;
    rastrear("AcessoAberto", { origem });
  }, [origem]);

  if (!supabase) return <div className="empty">O acesso ainda não foi configurado neste site.</div>;

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
      rastrear("LinkSolicitado", { origem });
    }
  };

  if (estado === "enviado")
    return (
      <div className="card">
        <h3>Confira seu e-mail</h3>
        <p style={{ margin: 0 }}>
          Enviamos um link para <b>{email}</b>. Abra no mesmo aparelho e navegador: você entra e volta direto para onde estava.
          Se não chegar em alguns minutos, olhe a caixa de spam ou promoções.
        </p>
        <div><button className="btn small ghost" type="button" onClick={() => setEstado("")}>Usar outro e-mail</button></div>
      </div>
    );

  return (
    <form className="diary" onSubmit={enviar}>
      <label className="f">Seu e-mail<input type="email" maxLength={100} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" /></label>
      <div className="row">
        <button className="btn" type="submit" disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : botao}</button>
        {estado === "erro" && (
          <span className="meta" role="status" style={{ color: "var(--mat, #dc2626)" }}>
            {msgErro ? `Erro: ${msgErro}` : "Não consegui enviar. Confira o e-mail e tente de novo em alguns minutos."}
          </span>
        )}
      </div>
      <p className="meta" style={{ margin: 0 }}>Primeira vez? É só digitar seu e-mail: a conta é criada quando você abre o link. Já tem conta? O caminho é o mesmo.</p>
    </form>
  );
}

/** Prévia de como fica o diário depois de entrar (dados de exemplo). */
export function PreviaDiario() {
  return (
    <div className="previa" aria-label="Exemplo de como fica o diário">
      <span className="previa-rot">Exemplo de como fica o seu diário</span>
      <div className="stats">
        <div className="stat"><b>12</b><span>registros neste mês</span></div>
        <div className="stat"><b>7 h</b><span>de atividades</span></div>
        <div className="stat"><b>5</b><span>experimentos</span></div>
      </div>
      <article className="entry" style={{ ["--sc" as string]: "var(--cie)" }}>
        <span className="k">14/10 · Ana · Ciências · Experimento · 30 min · envolvimento 5/5</span>
        <h4>Flor que muda de cor</h4>
        <p><b>Descobertas:</b> “A água sobe pelo caule igual canudinho!” Quis repetir com uma folha de alface.</p>
        <p><b>Próximo passo:</b> testar com água quente e fria.</p>
      </article>
      <article className="entry" style={{ ["--sc" as string]: "var(--por)" }}>
        <span className="k">12/10 · Ana · Português · Leitura · 20 min · envolvimento 4/5</span>
        <h4>Leitura de “Bruxa, bruxa, venha à minha festa”</h4>
        <p><b>Descobertas:</b> adivinhou o próximo personagem pela rima.</p>
      </article>
    </div>
  );
}
