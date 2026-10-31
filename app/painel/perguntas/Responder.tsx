"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { ADMIN_EMAIL } from "@/lib/admin";
import { anoNome } from "@/lib/apostilas";

type Perg = { id: string; criado_em: string; pergunta: string; ano: string; status: string; titulo: string; resposta: string; publica: boolean };
type Rasc = { titulo: string; resposta: string; publica: boolean };

export default function Responder() {
  const { user, carregando } = useAtlas();
  const admin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [lista, setLista] = useState<Perg[] | null>(null);
  const [rasc, setRasc] = useState<Record<string, Rasc>>({});
  const [aba, setAba] = useState<"nova" | "respondida" | "arquivada">("nova");
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState("");

  useEffect(() => {
    if (!admin || !supabase) return;
    supabase.from("perguntas").select("id,criado_em,pergunta,ano,status,titulo,resposta,publica").order("criado_em", { ascending: false }).limit(500).then(({ data, error }) => {
      if (error) return setErro(error.code === "42P01" ? "A tabela de perguntas ainda não existe. Rode o arquivo supabase/perguntas.sql no SQL Editor do Supabase." : error.message);
      const l = data as Perg[];
      setLista(l);
      setRasc(Object.fromEntries(l.map((p) => [p.id, { titulo: p.titulo || p.pergunta.slice(0, 160), resposta: p.resposta, publica: p.publica }])));
    });
  }, [admin]);

  const mudar = (id: string, k: keyof Rasc, v: string | boolean) => setRasc((r) => ({ ...r, [id]: { ...r[id], [k]: v } }));
  const salvar = async (p: Perg, status: string) => {
    const r = rasc[p.id];
    if (status === "respondida" && r.resposta.trim().length < 5) return setErro("Escreva a resposta antes de salvar.");
    if (status === "respondida" && r.publica && r.titulo.trim().length < 5) return setErro("Para publicar, escreva o título da pergunta.");
    setErro("");
    const campos = { status, titulo: r.titulo.trim(), resposta: r.resposta.trim(), publica: status === "respondida" && r.publica, respondida_em: status === "respondida" ? new Date().toISOString() : null };
    const { error } = await supabase!.from("perguntas").update(campos).eq("id", p.id);
    if (error) return setErro(error.message);
    setLista((l) => l && l.map((x) => (x.id === p.id ? { ...x, ...campos } : x)));
    setSalvo(p.id); setTimeout(() => setSalvo(""), 2000);
  };
  const apagar = async (id: string) => {
    const { error } = await supabase!.from("perguntas").delete().eq("id", id);
    if (!error) setLista((l) => l && l.filter((x) => x.id !== id));
  };

  if (carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  if (!admin) return <div className="wrap"><h1>Perguntas das famílias</h1><p>Área restrita. <Link href="/entrar?volta=/painel/perguntas">Entrar</Link></p></div>;
  const conta = (s: string) => (lista || []).filter((p) => p.status === s).length;
  const vis = (lista || []).filter((p) => p.status === aba);
  return (
    <div className="wrap">
      <p className="meta"><Link href="/painel">Painel</Link> › Perguntas das famílias</p>
      <h1>Pergunte à professora</h1>
      <p className="lead">A resposta aparece para a família na página Pergunte à professora. Marque “publicar” para virar uma página pública: aparecem só o título que você escrever e a resposta, nunca o texto original nem quem perguntou. Separe parágrafos com uma linha em branco.</p>
      {erro && <p className="warn">{erro}</p>}
      <div className="seg">
        {(["nova", "respondida", "arquivada"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={aba === s} onClick={() => setAba(s)}>{{ nova: "Novas", respondida: "Respondidas", arquivada: "Arquivadas" }[s]} ({conta(s)})</button>
        ))}
      </div>
      {lista && !vis.length && <p className="empty">Nada por aqui.</p>}
      <div className="list">
        {vis.map((p) => {
          const r = rasc[p.id];
          return (
            <article className="card" key={p.id}>
              <p className="meta" style={{ margin: 0 }}>{new Date(p.criado_em).toLocaleString("pt-BR")}{p.ano ? ` · ${anoNome(p.ano)}` : ""}{p.publica ? " · publicada" : ""}</p>
              <p style={{ margin: 0, fontSize: "1.05rem" }}><b>Pergunta:</b> {p.pergunta}</p>
              <label className="f">Resposta
                <textarea rows={7} maxLength={8000} value={r?.resposta || ""} onChange={(e) => mudar(p.id, "resposta", e.target.value)} />
              </label>
              <label className="f" style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700, color: "var(--ink)" }}>
                <input type="checkbox" checked={!!r?.publica} onChange={(e) => mudar(p.id, "publica", e.target.checked)} style={{ width: "auto" }} /> Publicar no site, sem identificar a família
              </label>
              {r?.publica && (
                <label className="f">Título da página (reescreva a pergunta sem dados da família)
                  <input maxLength={160} value={r.titulo} onChange={(e) => mudar(p.id, "titulo", e.target.value)} />
                </label>
              )}
              <div className="row">
                <button className="btn small" type="button" onClick={() => salvar(p, "respondida")}>{p.status === "respondida" ? "Salvar alterações" : "Responder"}</button>
                {p.status !== "arquivada" && <button className="btn small ghost" type="button" onClick={() => salvar(p, "arquivada")}>Arquivar</button>}
                <button className="btn small danger" type="button" onClick={() => apagar(p.id)}>Apagar</button>
                {p.publica && p.status === "respondida" && <Link className="btn small ghost" href={`/duvidas/r/${p.id}`} target="_blank">Ver página</Link>}
                {salvo === p.id && <span className="dicas-ok">Salvo ✓</span>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
