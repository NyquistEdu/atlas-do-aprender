"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { ADMIN_EMAIL } from "@/lib/admin";
import { TRILHAS, MATERIAS, SLUG, anoSlug, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";

type Dica = { id: string; criado_em: string; tema: string; autor: string; texto: string; status: string; resposta: string };

/** De "por3-1" para nome, link e rótulo da fase. */
function fase(tema: string) {
  const m = tema.match(/^(por|mat|cie)(\d)-(\d+)$/);
  if (!m) return { nome: tema, href: "/trilhas/portugues/1-ano", rot: tema };
  const s = m[1] as Materia, y = m[2], i = Number(m[3]);
  const t = TRILHAS[s]?.[y]?.[i];
  return { nome: t?.t || tema, href: `/trilhas/${SLUG[s]}/${anoSlug(y)}#tema-${i + 1}`, rot: `${MATERIAS[s]} · ${anoNome(y)} · fase ${i + 1}` };
}

export default function Moderar() {
  const { user, carregando } = useAtlas();
  const [lista, setLista] = useState<Dica[] | null>(null);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState<"pendente" | "aprovada" | "recusada">("pendente");
  const [resp, setResp] = useState<Record<string, string>>({});
  const admin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!admin || !supabase) return;
    supabase.from("dicas").select("id,criado_em,tema,autor,texto,status,resposta").order("criado_em", { ascending: false }).limit(500).then(({ data, error }) => {
      if (error) setErro(error.code === "42P01" ? "A tabela de dicas ainda não existe. Rode o arquivo supabase/dicas.sql no SQL Editor do Supabase." : error.message);
      else { setLista(data as Dica[]); setResp(Object.fromEntries((data as Dica[]).map((d) => [d.id, d.resposta]))); }
    });
  }, [admin]);

  const salvar = async (id: string, status: string) => {
    const resposta = (resp[id] || "").trim();
    const { error } = await supabase!.from("dicas").update({ status, resposta }).eq("id", id);
    if (error) return setErro(error.message);
    setLista((l) => l && l.map((d) => (d.id === id ? { ...d, status, resposta } : d)));
  };
  const apagar = async (id: string) => {
    const { error } = await supabase!.from("dicas").delete().eq("id", id);
    if (!error) setLista((l) => l && l.filter((d) => d.id !== id));
  };

  if (carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  if (!admin) return <div className="wrap"><h1>Dicas das famílias</h1><p>Área restrita. <Link href="/entrar?volta=/painel/dicas">Entrar</Link></p></div>;
  const conta = (s: string) => (lista || []).filter((d) => d.status === s).length;
  const vis = (lista || []).filter((d) => d.status === aba);
  return (
    <div className="wrap">
      <p className="meta"><Link href="/painel">Painel</Link> › Dicas das famílias</p>
      <h1>Dicas das famílias</h1>
      <p className="lead">As dicas enviadas nas fases do mapa só aparecem no site depois que você aprova. Se quiser, escreva uma resposta curta: ela aparece embaixo da dica, assinada por você.</p>
      {erro && <p className="warn">{erro}</p>}
      <div className="seg">
        {(["pendente", "aprovada", "recusada"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={aba === s} onClick={() => setAba(s)}>{{ pendente: "Aguardando", aprovada: "Aprovadas", recusada: "Recusadas" }[s]} ({conta(s)})</button>
        ))}
      </div>
      {lista && !vis.length && <p className="empty">Nada por aqui.</p>}
      <div className="list">
        {vis.map((d) => {
          const f = fase(d.tema);
          return (
            <article className="card" key={d.id}>
              <p className="meta" style={{ margin: 0 }}>{f.rot} · <Link href={f.href}>{f.nome}</Link> · {new Date(d.criado_em).toLocaleString("pt-BR")}</p>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{d.texto}</p>
              <p className="meta" style={{ margin: 0 }}>— {d.autor}</p>
              <label className="f">Sua resposta (opcional)
                <textarea rows={2} maxLength={600} value={resp[d.id] || ""} onChange={(e) => setResp((r) => ({ ...r, [d.id]: e.target.value }))} />
              </label>
              <div className="row">
                {d.status !== "aprovada" && <button className="btn small" type="button" onClick={() => salvar(d.id, "aprovada")}>Aprovar</button>}
                {d.status === "aprovada" && <button className="btn small" type="button" onClick={() => salvar(d.id, "aprovada")}>Salvar resposta</button>}
                {d.status !== "recusada" && <button className="btn small ghost" type="button" onClick={() => salvar(d.id, "recusada")}>Recusar</button>}
                <button className="btn small danger" type="button" onClick={() => apagar(d.id)}>Apagar</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
