"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAtlas } from "./Providers";
import { ADMIN_EMAIL } from "@/lib/admin";

// As 7 primeiras ficam sempre à vista no computador; as outras vão para o botão "Mais".
const ABAS: [string, string][] = [
  ["/", "Início"],
  ["/trilhas/portugues/1-ano", "Trilhas"],
  ["/diagnostico", "Diagnóstico"],
  ["/apostilas", "Apostilas"],
  ["/livros", "Livros"],
  ["/jogos", "Jogos"],
  ["/loja", "Loja"],
  ["/mao-na-massa", "Mão na massa"],
  ["/olimpiadas", "Olimpíadas"],
  ["/tematicas", "Temáticas"],
  ["/duvidas", "Dúvidas"],
  ["/planejamento", "Planejamento grátis"],
  ["/diario", "Diário"],
  ["/guia", "Guia"],
];

function Tema() {
  const [escuro, setEscuro] = useState(false);
  useEffect(() => {
    const r = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const atual = () => (r.getAttribute("data-theme") || (mq.matches ? "dark" : "light")) === "dark";
    setEscuro(atual());
    const f = () => setEscuro(atual());
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  const trocar = () => {
    const n = escuro ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", n);
    try { localStorage.setItem("tema", n); } catch {}
    setEscuro(!escuro);
  };
  return (
    <button className="tema" type="button" onClick={trocar} aria-label="Mudar entre fundo claro e escuro">
      <i></i><span>{escuro ? "Fundo claro" : "Fundo escuro"}</span>
    </button>
  );
}

export default function Header() {
  const path = usePathname() || "/";
  const { configurado, user, criancas, crianca, setCrianca } = useAtlas();
  const [aberto, setAberto] = useState(false);
  const [mais, setMais] = useState(false);
  const maisRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setAberto(false); setMais(false); }, [path]);
  useEffect(() => {
    if (!mais) return;
    const fora = (e: MouseEvent) => { if (maisRef.current && !maisRef.current.contains(e.target as Node)) setMais(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMais(false); };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", fora); document.removeEventListener("keydown", esc); };
  }, [mais]);
  const abas = user ? [ABAS[0], ["/meu-plano", "Meu plano"] as [string, string], ...ABAS.slice(1)] : ABAS;
  const ativa = (href: string) => {
    if (href === "/") return path === "/";
    const base = "/" + href.split("/")[1];
    return path === href || path.startsWith(base + "/") || path === base;
  };
  const atual = abas.find(([h]) => ativa(h))?.[1];
  const nPrincipais = user ? 8 : 7;
  const extras = abas.slice(nPrincipais);
  const extraAtual = extras.find(([h]) => ativa(h))?.[1];
  return (
    <header className="top">
      <div className="wrap largo">
        <div className="brand">
          <p className="logo"><Link href="/" style={{ textDecoration: "none" }}><span className="logo-dots" aria-hidden="true"><i style={{ background: "#e0675a" }} /><i style={{ background: "#6f97e0" }} /><i style={{ background: "#5fb37f" }} /></span>Atlas do Aprender</Link> <small>da alfabetização ao 5º ano</small></p>
          <div className="brand-r">
            {user && criancas.length > 0 && (
              <div className="kids so-pc" aria-label="Criança">
                <span className="lbl">Criança</span>
                {criancas.map((n) => (
                  <button key={n} className="chip" aria-pressed={n === crianca} onClick={() => setCrianca(n)}>{n}</button>
                ))}
              </div>
            )}
            {user?.email?.toLowerCase() === ADMIN_EMAIL && <Link className="btn small ghost so-pc" href="/painel">Painel</Link>}
            {configurado && !user && <Link className="btn small so-pc" href={`/entrar?volta=${encodeURIComponent(path)}&origem=header`}>Entrar</Link>}
            <Tema />
            <button type="button" className="menu-bt" aria-expanded={aberto} aria-controls="secoes" onClick={() => setAberto(!aberto)}>
              <i aria-hidden="true"><b /><b /><b /></i>{aberto ? "Fechar" : "Menu"}
            </button>
          </div>
        </div>
        {user && criancas.length > 0 && (
          <div className="kids kids-cel so-cel" aria-label="Criança">
            <span className="lbl">Criança</span>
            {criancas.map((n) => (
              <button key={n} className="chip" aria-pressed={n === crianca} onClick={() => setCrianca(n)}>{n}</button>
            ))}
          </div>
        )}
        {atual && !aberto && <p className="menu-atual">Você está em: <b>{atual}</b></p>}
        <nav id="secoes" className={`tabs${aberto ? " aberto" : ""}`} aria-label="Seções">
          {abas.map(([href, nome], i) => (
            <Link key={href} href={href} className={i >= nPrincipais ? "extra" : undefined} aria-current={ativa(href) ? "page" : undefined}>{nome}</Link>
          ))}
          <div className="mais" ref={maisRef}>
            <button type="button" className={`mais-bt${extraAtual ? " ativo" : ""}`} aria-expanded={mais} aria-haspopup="true" onClick={() => setMais(!mais)}>
              {extraAtual ?? "Mais"} <span aria-hidden="true">▾</span>
            </button>
            {mais && (
              <div className="mais-lista">
                {extras.map(([href, nome]) => (
                  <Link key={href} href={href} aria-current={ativa(href) ? "page" : undefined}>{nome}</Link>
                ))}
              </div>
            )}
          </div>
          {configurado && !user && <Link className="so-cel menu-extra" href={`/entrar?volta=${encodeURIComponent(path)}&origem=menu`}>Entrar na conta</Link>}
          {user?.email?.toLowerCase() === ADMIN_EMAIL && <Link className="so-cel menu-extra" href="/painel">Painel</Link>}
        </nav>
      </div>
    </header>
  );
}
