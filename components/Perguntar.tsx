"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "./Providers";
import { linkAcesso } from "./Acesso";

type Minha = { id: string; criado_em: string; pergunta: string; status: string; resposta: string; publica: boolean; titulo: string };
const ANOS: [string, string][] = [["", "Prefiro não dizer"], ["1", "Alfabetização (1º ano)"], ["2", "2º ano"], ["3", "3º ano"], ["4", "4º ano"], ["5", "5º ano"]];

/** Formulário "Pergunte à professora" e as perguntas da própria família, com as respostas. */
export default function Perguntar() {
  const { configurado, user } = useAtlas();
  const [minhas, setMinhas] = useState<Minha[] | null>(null);
  const [indisponivel, setIndisponivel] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [ano, setAno] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("perguntas").select("id,criado_em,pergunta,status,resposta,publica,titulo").eq("user_id", user.id).order("criado_em", { ascending: false }).then(({ data, error }) => {
      if (error) setIndisponivel(true); else setMinhas(data as Minha[]);
    });
  }, [user]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (pergunta.trim().length < 10) return setErro("Conte um pouco mais sobre a sua dúvida.");
    setEnviando(true);
    const { data, error } = await supabase!.from("perguntas").insert({ pergunta: pergunta.trim(), ano }).select("id,criado_em,pergunta,status,resposta,publica,titulo").single();
    setEnviando(false);
    if (error) return setErro("Não deu para enviar agora. Tente de novo daqui a pouco.");
    setMinhas((l) => [data as Minha, ...(l || [])]);
    setPergunta(""); setOk(true);
  };
  const apagar = async (id: string) => {
    const { error } = await supabase!.from("perguntas").delete().eq("id", id);
    if (!error) setMinhas((l) => (l || []).filter((m) => m.id !== id));
  };

  if (!configurado || indisponivel) return null;
  return (
    <section className="perg card">
      <div className="perg-topo">
        <span className="perg-em" aria-hidden="true">💬</span>
        <div>
          <h2>Mande a sua pergunta</h2>
          <p>Leitura, matemática, rotina, uma dificuldade da criança: pergunte. Eu respondo pessoalmente, aqui mesmo nesta página. Algumas respostas, sem identificar a família, viram páginas para ajudar outras mães e pais.</p>
        </div>
      </div>
      {!user ? (
        <Link className="btn" href={linkAcesso("/duvidas", "perguntar")}>Entrar para perguntar</Link>
      ) : (
        <form className="perg-form" onSubmit={enviar}>
          <label className="f">Sua pergunta
            <textarea rows={4} maxLength={800} value={pergunta} onChange={(e) => setPergunta(e.target.value)} placeholder="Ex.: Meu filho tem 7 anos e troca o b pelo d. É normal? Como posso ajudar?" />
          </label>
          <label className="f">Ano da criança
            <select value={ano} onChange={(e) => setAno(e.target.value)}>{ANOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <p className="meta" style={{ margin: 0 }}>Não escreva o nome completo nem a escola da criança. Se a resposta for publicada, a sua pergunta aparece reescrita, sem nenhum dado da família. {pergunta.length}/800</p>
          {erro && <p className="warn" style={{ margin: 0 }}>{erro}</p>}
          {ok && <p className="dicas-ok" style={{ margin: 0 }}>Pergunta enviada! A resposta aparece aqui embaixo, em “Minhas perguntas”.</p>}
          <div className="row"><button className="btn" disabled={enviando}>{enviando ? "Enviando…" : "Enviar pergunta"}</button></div>
        </form>
      )}
      {user && minhas && minhas.length > 0 && (
        <div className="perg-minhas">
          <h3>Minhas perguntas</h3>
          {minhas.map((m) => (
            <article key={m.id} className={`perg-m ${m.status}`}>
              <p className="perg-q">{m.pergunta}</p>
              {m.status === "respondida" && m.resposta ? (
                <div className="perg-r"><b>Resposta da Stephanie</b>{m.resposta.split(/\n{2,}/).map((t, i) => <p key={i}>{t}</p>)}{m.publica && <p className="meta">Esta resposta também foi publicada no site, sem identificar você.</p>}</div>
              ) : m.status === "arquivada" ? (
                <p className="meta">Esta pergunta foi encerrada.</p>
              ) : (
                <p className="meta">{new Date(m.criado_em).toLocaleDateString("pt-BR")} · aguardando resposta · <button type="button" className="lnk" onClick={() => apagar(m.id)}>apagar</button></p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
