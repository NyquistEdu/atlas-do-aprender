"use client";
/**
 * Botão de baixar PDF que exige conta: quem já entrou baixa na hora; quem não entrou vê o acesso
 * (e-mail ou Google). O pedido fica guardado neste navegador e, quando a pessoa volta logada,
 * o download começa sozinho (ver BaixarPendente, montado no Providers).
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAtlas } from "./Providers";
import { FormAcesso, SELO_CONTA } from "./Acesso";

const CHAVE = "atlas-baixar-pendente";
type Pendente = { href: string; nome?: string; titulo?: string; t: number };

export function baixarAgora(href: string, nome?: string) {
  const a = document.createElement("a");
  a.href = href; if (nome) a.download = nome; else a.setAttribute("download", "");
  a.style.display = "none"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 500);
}

export default function BaixarComLogin({ href, nome, titulo, className = "btn", children = "Baixar grátis", onClick, ariaLabel }: {
  href: string; nome?: string; titulo?: string; className?: string; children?: React.ReactNode; onClick?: () => void; ariaLabel?: string;
}) {
  const { configurado, user } = useAtlas();
  const path = usePathname() || "/";
  const [aberto, setAberto] = useState(false);
  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc);
  }, [aberto]); // eslint-disable-line react-hooks/exhaustive-deps

  // sem login configurado (ambiente de teste) ou já logado: baixa direto
  if (!configurado || user) return <a className={className} href={href} download={nome || true} onClick={onClick} aria-label={ariaLabel}>{children}</a>;

  const abrir = (e: React.MouseEvent) => {
    e.preventDefault(); onClick?.();
    try { localStorage.setItem(CHAVE, JSON.stringify({ href, nome, titulo, t: Date.now() } satisfies Pendente)); } catch {}
    setAberto(true);
  };
  function fechar() { setAberto(false); try { localStorage.removeItem(CHAVE); } catch {} }
  return (
    <>
      <a className={className} href={href} onClick={abrir} aria-label={ariaLabel} aria-haspopup="dialog">{children}</a>
      {aberto && (
        <div className="baixar-fundo" onClick={fechar}>
          <div className="baixar-caixa card" role="dialog" aria-modal="true" aria-labelledby="baixar-tit" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="baixar-x" onClick={fechar} aria-label="Fechar">✕</button>
            <h3 id="baixar-tit" style={{ margin: 0 }}>📥 Entre para baixar{titulo ? ` “${titulo}”` : ""}</h3>
            <p style={{ margin: 0 }}>Os materiais do Atlas são grátis para famílias com conta. É rapidinho: você entra e <b>o download começa sozinho</b>, aqui nesta página.</p>
            <FormAcesso volta={path} origem="baixar-apostila" botao="Receber link e baixar" />
            <small className="meta">{SELO_CONTA}. Com a conta você também guarda o diário, o planejamento e o progresso nas Fases Vivas.</small>
          </div>
        </div>
      )}
    </>
  );
}

/** Montado uma vez no site: quando a pessoa volta logada e havia um download pedido, ele começa sozinho. */
export function BaixarPendente() {
  const { user } = useAtlas();
  const [aviso, setAviso] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    try {
      const p = JSON.parse(localStorage.getItem(CHAVE) || "null") as Pendente | null;
      if (!p) return;
      localStorage.removeItem(CHAVE);
      if (Date.now() - p.t > 2 * 24 * 3600 * 1000 || !p.href.startsWith("/")) return;
      setTimeout(() => baixarAgora(p.href, p.nome), 600);
      setAviso(p.titulo ? `Pronto! O download de “${p.titulo}” começou.` : "Pronto! O download começou.");
      setTimeout(() => setAviso(null), 7000);
    } catch {}
  }, [user]);
  if (!aviso) return null;
  return <div className="baixar-aviso" role="status">✅ {aviso}</div>;
}
