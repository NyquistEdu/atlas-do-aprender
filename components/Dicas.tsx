"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "./Providers";
import { linkAcesso } from "./Acesso";

type Dica = { id: string; criado_em: string; user_id: string; autor: string; texto: string; status: string; resposta: string };

const CHAVE_AUTOR = "atlas-autor-dica";

/** "Como foi aqui em casa": dicas das famílias em cada fase do mapa. Só aparecem depois de aprovadas. */
export default function Dicas({ tema, titulo }: { tema: string; titulo: string }) {
  const { configurado, user } = useAtlas();
  const path = usePathname() || "/";
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const [lista, setLista] = useState<Dica[] | null>(null);
  const [indisponivel, setIndisponivel] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Só busca as dicas quando o painel da fase aparece na tela.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setVisivel(true); io.disconnect(); } });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visivel || !supabase) return;
    supabase.from("dicas").select("id,criado_em,user_id,autor,texto,status,resposta").eq("tema", tema).neq("status", "recusada").order("criado_em", { ascending: false }).limit(50)
      .then(({ data, error }) => { if (error) setIndisponivel(true); else setLista(data as Dica[]); });
  }, [visivel, tema, user]);

  useEffect(() => { try { setAutor(localStorage.getItem(CHAVE_AUTOR) || ""); } catch {} }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (autor.trim().length < 2) return setErro("Escreva como você quer aparecer, por exemplo: Ana, mãe de 2.");
    if (texto.trim().length < 10) return setErro("Conte um pouco mais: o que vocês fizeram e como foi?");
    setEnviando(true);
    const { data, error } = await supabase!.from("dicas").insert({ tema, autor: autor.trim(), texto: texto.trim() }).select("id,criado_em,user_id,autor,texto,status,resposta").single();
    setEnviando(false);
    if (error) return setErro("Não deu para enviar agora. Tente de novo daqui a pouco.");
    try { localStorage.setItem(CHAVE_AUTOR, autor.trim()); } catch {}
    setLista((l) => [data as Dica, ...(l || [])]);
    setTexto(""); setOk(true); setAberto(false);
  };

  const apagar = async (id: string) => {
    const { error } = await supabase!.from("dicas").delete().eq("id", id);
    if (!error) setLista((l) => (l || []).filter((d) => d.id !== id));
  };

  if (!configurado || indisponivel) return <div ref={ref} />;
  const aprovadas = (lista || []).filter((d) => d.status === "aprovada");
  const minhas = (lista || []).filter((d) => d.status === "pendente" && user && d.user_id === user.id);

  return (
    <section className="dicas" ref={ref} aria-label="Dicas das famílias">
      <div className="dicas-topo">
        <h4>Como foi aqui em casa <span className="dicas-n">{aprovadas.length ? `${aprovadas.length} ${aprovadas.length === 1 ? "dica" : "dicas"}` : ""}</span></h4>
        <p>Dicas de outras famílias que já passaram por esta fase.</p>
      </div>
      {lista && !aprovadas.length && !minhas.length && <p className="dicas-vazio">Ainda não há dicas aqui. Que tal ser a primeira família a contar como foi?</p>}
      <ul className="dicas-lista">
        {minhas.map((d) => (
          <li key={d.id} className="dfam pendente">
            <p>{d.texto}</p>
            <span className="dfam-autor">{d.autor} · <b>aguardando aprovação</b> · <button type="button" onClick={() => apagar(d.id)}>apagar</button></span>
          </li>
        ))}
        {aprovadas.map((d) => (
          <li key={d.id} className="dfam">
            <p>{d.texto}</p>
            <span className="dfam-autor">{d.autor} · {new Date(d.criado_em).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}</span>
            {d.resposta && <p className="dfam-resp"><b>Stephanie:</b> {d.resposta}</p>}
          </li>
        ))}
      </ul>
      {ok && <p className="dicas-ok">Obrigada! Sua dica foi enviada e aparece aqui assim que for aprovada.</p>}
      {!user ? (
        <Link className="btn small ghost" href={linkAcesso(path, "dicas")}>Entrar para contar como foi</Link>
      ) : !aberto ? (
        <button type="button" className="btn small ghost" onClick={() => { setAberto(true); setOk(false); }}>Contar como foi aqui em casa</button>
      ) : (
        <form className="dfam-form" onSubmit={enviar}>
          <label className="f">Sua dica sobre “{titulo}”
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={600} rows={4} placeholder="O que vocês fizeram, o que funcionou, um livro ou jogo que ajudou…" />
          </label>
          <label className="f">Como você quer aparecer
            <input value={autor} onChange={(e) => setAutor(e.target.value)} maxLength={60} placeholder="Ex.: Ana, mãe de 2 · Recife" />
          </label>
          <p className="meta" style={{ margin: 0 }}>Para proteger as crianças, não escreva o nome completo nem a escola delas. Toda dica passa por aprovação antes de aparecer. {texto.length}/600</p>
          {erro && <p className="warn" style={{ margin: 0 }}>{erro}</p>}
          <div className="row">
            <button className="btn small" disabled={enviando}>{enviando ? "Enviando…" : "Enviar dica"}</button>
            <button type="button" className="btn small ghost" onClick={() => setAberto(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </section>
  );
}
