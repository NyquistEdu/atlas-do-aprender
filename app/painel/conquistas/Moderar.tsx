"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { ADMIN_EMAIL } from "@/lib/admin";

type C = { id: string; criado_em: string; tema: string; texto: string; autor: string; foto: string; status: string };
const fotoUrl = (p: string) => (p && supabase ? supabase.storage.from("conquistas").getPublicUrl(p).data.publicUrl : "");

export default function Moderar() {
  const { user, carregando } = useAtlas();
  const admin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [lista, setLista] = useState<C[] | null>(null);
  const [aba, setAba] = useState<"pendente" | "aprovada" | "recusada">("pendente");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!admin || !supabase) return;
    supabase.from("conquistas").select("id,criado_em,tema,texto,autor,foto,status").order("criado_em", { ascending: false }).limit(500).then(({ data, error }) => {
      if (error) setErro(error.code === "42P01" ? "O mural ainda não foi ativado. Rode o arquivo supabase/conquistas.sql no SQL Editor do Supabase." : error.message);
      else setLista(data as C[]);
    });
  }, [admin]);

  const mudar = async (id: string, status: string) => {
    const { error } = await supabase!.from("conquistas").update({ status }).eq("id", id);
    if (error) return setErro(error.message);
    setLista((l) => l && l.map((c) => (c.id === id ? { ...c, status } : c)));
  };
  const apagar = async (c: C) => {
    if (c.foto) await supabase!.storage.from("conquistas").remove([c.foto]);
    const { error } = await supabase!.from("conquistas").delete().eq("id", c.id);
    if (!error) setLista((l) => l && l.filter((x) => x.id !== c.id));
  };
  const tirarFoto = async (c: C) => {
    if (c.foto) await supabase!.storage.from("conquistas").remove([c.foto]);
    const { error } = await supabase!.from("conquistas").update({ foto: "" }).eq("id", c.id);
    if (!error) setLista((l) => l && l.map((x) => (x.id === c.id ? { ...x, foto: "" } : x)));
  };

  if (carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  if (!admin) return <div className="wrap"><h1>Mural de conquistas</h1><p>Área restrita. <Link href="/entrar?volta=/painel/conquistas">Entrar</Link></p></div>;
  const conta = (s: string) => (lista || []).filter((c) => c.status === s).length;
  const vis = (lista || []).filter((c) => c.status === aba);
  return (
    <div className="wrap">
      <p className="meta"><Link href="/painel">Painel</Link> › Mural de conquistas</p>
      <h1>Mural de conquistas</h1>
      <p className="lead">Confira cada foto antes de aprovar: nada de rosto de criança, uniforme com nome da escola, documentos ou endereço. Se o texto for bom e a foto não, use “Tirar a foto” e aprove só o texto.</p>
      {erro && <p className="warn">{erro}</p>}
      <div className="seg">
        {(["pendente", "aprovada", "recusada"] as const).map((s) => (
          <button key={s} type="button" aria-pressed={aba === s} onClick={() => setAba(s)}>{{ pendente: "Aguardando", aprovada: "Aprovadas", recusada: "Recusadas" }[s]} ({conta(s)})</button>
        ))}
      </div>
      {lista && !vis.length && <p className="empty">Nada por aqui.</p>}
      <div className="list">
        {vis.map((c) => (
          <article className="card mod-conq" key={c.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {c.foto && <a href={fotoUrl(c.foto)} target="_blank" rel="noopener"><img src={fotoUrl(c.foto)} alt="Foto enviada" /></a>}
            <div style={{ display: "grid", gap: 8 }}>
              <p className="meta" style={{ margin: 0 }}>{new Date(c.criado_em).toLocaleString("pt-BR")}{c.tema ? ` · fase ${c.tema}` : ""}</p>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{c.texto}</p>
              <p className="meta" style={{ margin: 0 }}>— {c.autor}</p>
              <div className="row">
                {c.status !== "aprovada" && <button className="btn small" type="button" onClick={() => mudar(c.id, "aprovada")}>Aprovar</button>}
                {c.status !== "recusada" && <button className="btn small ghost" type="button" onClick={() => mudar(c.id, "recusada")}>Recusar</button>}
                {c.foto && <button className="btn small ghost" type="button" onClick={() => tirarFoto(c)}>Tirar a foto</button>}
                <button className="btn small danger" type="button" onClick={() => apagar(c)}>Apagar</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
