"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAtlas } from "./Providers";

const ABAS: [string, string][] = [
  ["/", "Início"],
  ["/trilhas/portugues/1-ano", "Trilhas"],
  ["/livros", "Livros"],
  ["/jogos", "Jogos"],
  ["/mao-na-massa", "Mão na massa"],
  ["/apostilas", "Apostilas"],
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
  const ativa = (href: string) => {
    if (href === "/") return path === "/";
    const base = "/" + href.split("/")[1];
    return path === href || path.startsWith(base + "/") || path === base;
  };
  return (
    <header className="top">
      <div className="wrap">
        <div className="brand">
          <h1><Link href="/" style={{ textDecoration: "none" }}>Atlas do Aprender</Link> <small>alfabetização ao 5º ano</small></h1>
          <div className="brand-r">
            {user && criancas.length > 0 && (
              <div className="kids" aria-label="Criança">
                <span className="lbl">Criança</span>
                {criancas.map((n) => (
                  <button key={n} className="chip" aria-pressed={n === crianca} onClick={() => setCrianca(n)}>{n}</button>
                ))}
              </div>
            )}
            {configurado && !user && <Link className="btn small" href={`/entrar?volta=${encodeURIComponent(path)}`}>Entrar</Link>}
            <Tema />
          </div>
        </div>
        <nav className="tabs" aria-label="Seções">
          {ABAS.map(([href, nome]) => (
            <Link key={href} href={href} aria-current={ativa(href) ? "page" : undefined}>{nome}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
