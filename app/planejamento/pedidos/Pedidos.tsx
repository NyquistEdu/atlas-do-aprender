"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";

type Pedido = {
  id: string; criado_em: string; nome: string; email: string; whatsapp: string; cidade: string; status: string; observacoes: string;
  familia: Record<string, string>; criancas: Record<string, string>[]; disponibilidade: Record<string, string[]>;
};
const STATUS = ["novo", "contatado", "agendado", "concluido", "arquivado"];

export default function Pedidos() {
  const { user, carregando } = useAtlas();
  const [lista, setLista] = useState<Pedido[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("pedidos_planejamento").select("*").order("criado_em", { ascending: false }).then(({ data, error }) => {
      if (error) setErro(error.message); else setLista(data as Pedido[]);
    });
  }, [user]);

  const mudar = async (id: string, status: string) => {
    const { error } = await supabase!.from("pedidos_planejamento").update({ status }).eq("id", id);
    if (!error) setLista((l) => l && l.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  if (carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  if (!user) return <div className="wrap"><h1>Pedidos de planejamento</h1><p>Esta página é só para a administradora. <Link href="/entrar?volta=/planejamento/pedidos">Entrar</Link></p></div>;
  return (
    <div className="wrap">
      <h1>Pedidos de planejamento</h1>
      {erro && <p className="warn">{erro}</p>}
      {lista && !lista.length && <p className="empty">Nenhum pedido ainda (ou esta conta não tem acesso).</p>}
      <div className="list">
        {lista?.map((p) => {
          const zap = p.whatsapp.replace(/\D/g, "");
          return (
            <article className="card pedido" key={p.id}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ margin: 0 }}>{p.nome} <span className="meta">· {p.cidade}</span></h3>
                <select value={p.status} onChange={(e) => mudar(p.id, e.target.value)} style={{ width: "auto" }}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <p className="meta" style={{ margin: 0 }}>{new Date(p.criado_em).toLocaleString("pt-BR")} · <a href={`mailto:${p.email}`}>{p.email}</a>{zap && <> · <a href={`https://wa.me/${zap.length <= 11 ? "55" + zap : zap}`} target="_blank" rel="noopener noreferrer">WhatsApp {p.whatsapp}</a></>}</p>
              <p style={{ margin: 0 }}><b>Escola:</b> {p.familia.escola} · <b>Tempo:</b> {p.familia.tempo} · <b>Acompanha:</b> {p.familia.quemAcompanha || "—"} · <b>Conheceu por:</b> {p.familia.comoConheceu || "—"}</p>
              <p style={{ margin: 0 }}><b>Objetivo:</b> {p.familia.objetivo}</p>
              {p.criancas.map((c, i) => (
                <div key={i} className="books" style={{ background: "var(--mat-bg)" }}>
                  <b>{c.nome}, {c.idade} anos · {c.ano}</b>
                  <div className="meta">Leitura: {c.leitura} · Matemática: {c.matematica}</div>
                  {c.facilidades && <div>Vai bem: {c.facilidades}</div>}
                  {c.dificuldades && <div>Dificuldades: {c.dificuldades}</div>}
                  {c.interesses && <div>Gosta de: {c.interesses}</div>}
                </div>
              ))}
              <p style={{ margin: 0 }}><b>Horários:</b> {Object.entries(p.disponibilidade).filter(([, t]) => t.length).map(([d, t]) => `${d} (${t.join(", ").toLowerCase()})`).join(" · ")}</p>
              {p.observacoes && <p style={{ margin: 0 }}><b>Observações:</b> {p.observacoes}</p>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
