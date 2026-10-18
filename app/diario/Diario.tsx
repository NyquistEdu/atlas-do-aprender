"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAtlas } from "@/components/Providers";
import { AREAS } from "@/lib/data";
import { FormAcesso, PreviaDiario, SELO_CONTA } from "@/components/Acesso";

const TIPOS = ["Estudo da trilha", "Leitura", "Exercício", "Jogo", "Experimento", "Filme ou documentário", "Podcast ou áudio", "Passeio ou visita", "Conversa"];
const hoje = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };

export default function Diario() {
  const a = useAtlas();
  const q = useSearchParams();
  const [f, setF] = useState({ data: hoje(), crianca: "", area: "por", tipo: TIPOS[0], minutos: 30, titulo: "", o_que: "", descobertas: "", envolvimento: 4, proximo: "" });
  const [msg, setMsg] = useState("");
  const [filtro, setFiltro] = useState("all");
  const [apagar, setApagar] = useState<string | null>(null);
  const [nova, setNova] = useState("");

  useEffect(() => {
    const area = q.get("area"), tipo = q.get("tipo"), titulo = q.get("titulo");
    if (area || tipo || titulo) setF((x) => ({ ...x, area: area && AREAS[area] ? area : x.area, tipo: tipo && TIPOS.includes(tipo) ? tipo : x.tipo, titulo: titulo || x.titulo }));
  }, [q]);
  useEffect(() => { if (a.crianca) setF((x) => ({ ...x, crianca: x.crianca || a.crianca })); }, [a.crianca]);

  if (!a.configurado)
    return <div className="wrap"><h2>Diário de aprendizagem</h2><div className="empty">O diário ainda não está ligado a um banco de dados. Veja o arquivo README.md do projeto para configurar o Supabase.</div></div>;
  if (a.carregando) return <div className="wrap"><p className="status">Carregando…</p></div>;
  if (!a.user) {
    const titulo = q.get("titulo");
    const volta = `/diario${q.toString() ? `?${q.toString()}` : ""}`;
    return (
      <div className="wrap">
        <h2>Diário de aprendizagem</h2>
        <p className="lead">Um caderno para guardar o que cada criança fez, o que descobriu e o que disse. Com o tempo, você vê o caminho de cada uma e lembra do que funcionou.</p>
        {titulo && <p className="pendente">Você vai guardar: <b>{titulo}</b>. Depois de entrar, o registro já abre preenchido com essa atividade.</p>}
        <div className="acesso-diario">
          <div>
            <h3 style={{ marginTop: 0 }}>Comece em 1 minuto</h3>
            <ul className="ganhos">
              <li>Registros privados: só você vê.</li>
              <li>Salvos na sua conta, em qualquer aparelho.</li>
              <li>Separados por criança, com o resumo do mês.</li>
            </ul>
            <p className="meta" style={{ margin: "0 0 8px" }}><b>{SELO_CONTA}.</b></p>
            <FormAcesso volta={volta} origem="diario" botao="Receber link e começar" />
          </div>
          <PreviaDiario />
        </div>
      </div>
    );
  }

  const set = (k: string, v: string | number) => setF((x) => ({ ...x, [k]: v }));
  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.titulo.trim()) { setMsg("Escreva um título."); return; }
    const r = await a.addEntrada({ ...f, crianca: f.crianca || a.crianca, titulo: f.titulo.trim() });
    if (r) { setMsg(r); return; }
    setMsg("Registro salvo.");
    setF((x) => ({ ...x, titulo: "", o_que: "", descobertas: "", proximo: "", minutos: 30, envolvimento: 4, data: hoje() }));
  };
  const lista = a.entradas.filter((e) => filtro === "all" || e.crianca === filtro || e.crianca === "Todos juntos");
  const mes = hoje().slice(0, 7);
  const doMes = lista.filter((e) => (e.data || "").startsWith(mes));
  const por = (x: string) => doMes.filter((e) => e.area === x).length;
  const horas = Math.round(doMes.reduce((s, e) => s + (e.minutos || 0), 0) / 6) / 10;

  return (
    <div className="wrap">
      <h2>Diário de aprendizagem</h2>
      <p className="lead">Registre o que fizeram, o que a criança descobriu e como ela se envolveu. Com o tempo, o diário mostra o caminho de cada um.</p>
      <p className="status">Conectado como {a.user.email}. <button className="btn small ghost" type="button" onClick={a.sair}>Sair</button></p>
      {a.erro && <p className="warn">{a.erro}</p>}
      <form className="diary" onSubmit={salvar}>
        <div className="fgrid">
          <label className="f">Data<input id="dData" type="date" value={f.data} onChange={(e) => set("data", e.target.value)} required /></label>
          <label className="f">Criança<select id="dCrianca" value={f.crianca || a.crianca} onChange={(e) => set("crianca", e.target.value)}>
            {a.criancas.map((n) => <option key={n}>{n}</option>)}<option>Todos juntos</option></select></label>
          <label className="f">Área<select id="dArea" value={f.area} onChange={(e) => set("area", e.target.value)}>
            {Object.entries(AREAS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label className="f">Tipo<select id="dTipo" value={f.tipo} onChange={(e) => set("tipo", e.target.value)}>
            {TIPOS.map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="f">Minutos<input id="dMin" type="number" min={0} max={1440} step={5} value={f.minutos} onChange={(e) => set("minutos", Math.min(1440, Math.max(0, +e.target.value || 0)))} /></label>
        </div>
        <label className="f">Título<input id="dTitulo" maxLength={150} value={f.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Ex.: Flor que muda de cor" required /></label>
        <label className="f">O que fizemos<textarea id="dOque" maxLength={2000} value={f.o_que} onChange={(e) => set("o_que", e.target.value)} placeholder="Passos, material usado, como foi" /></label>
        <label className="f">O que a criança descobriu ou disse<textarea id="dDesc" maxLength={2000} value={f.descobertas} onChange={(e) => set("descobertas", e.target.value)} placeholder="Frases dela, perguntas que surgiram, dificuldades" /></label>
        <div className="row"><span className="meta">Envolvimento</span><div className="stars">
          {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={n <= f.envolvimento} onClick={() => set("envolvimento", n)}>{n}</button>)}
        </div></div>
        <label className="f">Próximo passo<input id="dProx" maxLength={300} value={f.proximo} onChange={(e) => set("proximo", e.target.value)} placeholder="Ex.: ler mais fábulas de Esopo" /></label>
        <div className="row"><button className="btn" type="submit">Salvar no diário</button>{msg && <span className="meta" role="status">{msg}</span>}</div>
      </form>
      <div className="row"><span className="meta">Ver registros de</span><div className="seg">
        {[["all", "Todos"], ...a.criancas.map((k) => [k, k])].map(([v, l]) => <button key={v} type="button" aria-pressed={filtro === v} onClick={() => setFiltro(v)}>{l}</button>)}
      </div></div>
      <div className="stats">
        {([[doMes.length, "registros neste mês"], [`${horas} h`, "de atividades no mês"], [por("por"), "Português"], [por("mat"), "Matemática"], [por("cie"), "Ciências"], [por("jog"), "Jogos"]] as [string | number, string][]).map(([b, s]) => (
          <div className="stat" key={s}><b>{b}</b><span>{s}</span></div>
        ))}
      </div>
      <div className="list">
        {lista.length ? lista.map((e) => {
          const sc = ["por", "mat", "cie", "jog"].includes(e.area) ? `var(--${e.area})` : "var(--line)";
          return (
            <article className="entry" key={e.id} style={{ ["--sc" as string]: sc }}>
              <span className="k">{(e.data || "").split("-").reverse().join("/")} · {e.crianca} · {AREAS[e.area] || ""} · {e.tipo}{e.minutos ? ` · ${e.minutos} min` : ""} · envolvimento {e.envolvimento || "-"}/5</span>
              <h4>{e.titulo}</h4>
              {e.o_que && <p>{e.o_que}</p>}
              {e.descobertas && <p><b>Descobertas:</b> {e.descobertas}</p>}
              {e.proximo && <p><b>Próximo passo:</b> {e.proximo}</p>}
              <div><button type="button" className={`btn small ${apagar === e.id ? "danger" : "ghost"}`}
                onClick={() => { if (apagar !== e.id) { setApagar(e.id); return; } setApagar(null); a.removeEntrada(e.id); }}>
                {apagar === e.id ? "Confirmar exclusão" : "Excluir"}</button></div>
            </article>
          );
        }) : <div className="empty">Nenhum registro ainda. Escreva o primeiro acima ou use “Guardar no diário” em qualquer tema, jogo ou experimento.</div>}
      </div>
      <details className="card"><summary><b>Gerenciar crianças</b></summary>
        <div className="row" style={{ marginTop: 10 }}>
          <input id="novaCrianca" maxLength={50} value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nome" />
          <button className="btn small" type="button" onClick={async () => { const r = await a.addCrianca(nova); setMsg(r || ""); if (!r) setNova(""); }}>Adicionar</button>
        </div>
        <div className="tags">{a.criancas.map((n) => (
          <span className="tag" key={n}>{n} {a.criancas.length > 1 && <button className="btn small ghost" type="button" aria-label={`Remover ${n}`} onClick={() => a.removeCrianca(n)}>×</button>}</span>
        ))}</div>
      </details>
    </div>
  );
}
