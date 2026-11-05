"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { abrirImpressao } from "@/lib/imprimir";
import { useAtlas } from "@/components/Providers";
import { ADMIN_EMAIL } from "@/lib/admin";
import { TRILHAS, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import { AGENDA_PADRAO, DIAS_NOME, DS, JUNTOS, MAT_INFO, ROTINA, ddmm, diaSemana, infoTema, iso, itensDoDia, somaDias, type ExtraPlano, type Plano, type TemaPlano } from "@/lib/plano";
import {
  COM_A_CRIANCA, CONVERSA, FECHAMENTO, LEITURA, MATEMATICA, NIVEIS, anoTrilha, diasPorExtenso, fichaDoPlano, novaCrianca, proximoTema, sugereLeitura, sugereMat, sugerir,
  type Ficha, type FichaCrianca, type Nivel, type SugCrianca, type Tarefa,
} from "@/lib/roteiro";

type Pedido = {
  id: string; nome: string; email: string; whatsapp: string; observacoes: string; status: string;
  familia: Record<string, string>; criancas: Record<string, string>[];
};

const proximaSegunda = () => { const d = new Date(); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() + (wd === 0 ? 0 : 7 - wd)); return iso(d); };
const novoId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
const chave = (pedido: string) => `atlas-ficha-${pedido || "nova"}`;

function fichaVazia(pedidoId?: string): Ficha {
  return {
    id: novoId(), pedidoId, email: "", familia: "", inicio: proximaSegunda(), dias: 30, acompanha: "", objetivo: "", como: "", obs: "",
    conversa: {}, criancas: [novaCrianca()], cieJuntos: true, extras: [],
  };
}

function doPedido(p: Pedido): Ficha {
  const f = fichaVazia(p.id);
  const cs = p.criancas.length ? p.criancas : [{}];
  return {
    ...f,
    email: p.email.trim().toLowerCase(),
    familia: `Família de ${cs.map((c) => (c.nome || "").split(" ")[0]).filter(Boolean).join(" e ") || p.nome.split(" ")[0]}`,
    acompanha: p.familia.quemAcompanha || "",
    objetivo: p.familia.objetivo || "",
    conversa: { confirmar: [p.familia.escola && `Escola: ${p.familia.escola}`, p.familia.tempo && `Tempo: ${p.familia.tempo}`].filter(Boolean).join(" · ") },
    obs: p.observacoes || "",
    criancas: cs.map((c) => novaCrianca({
      nome: c.nome || "", idade: c.idade || "", ano: c.ano || "",
      leituraNota: c.leitura ? `Formulário: ${c.leitura}` : "", matNota: c.matematica ? `Formulário: ${c.matematica}` : "",
      fortes: c.facilidades || "", gosta: c.interesses || "", reforcar: c.dificuldades ? `Formulário: ${c.dificuldades}` : "",
      cie: { materia: "cie", ano: anoTrilha(c.ano || ""), tema: 1 },
    })),
  };
}

/** Monta o plano que vai para a tabela planos (o mesmo formato de lib/plano.ts). */
export function montarPlano(f: Ficha): Plano {
  const ms = f.materias || ["por", "mat", "cie"];
  const ok = (t: TemaPlano | null) => !!t && ms.includes(t.materia);
  const juntos = f.cieJuntos && f.criancas.length > 1 && ms.includes("cie");
  const cieJ: TemaPlano[] = [];
  if (juntos) for (const c of f.criancas) if (c.cie && !cieJ.some((t) => t.ano === c.cie!.ano && t.tema === c.cie!.tema)) cieJ.push(c.cie);
  const como = [f.como.trim(), f.acompanha.trim() && `Quem acompanha: ${f.acompanha.trim()}.`].filter(Boolean).join(" ");
  return {
    familia: f.familia.trim() || "Meu plano",
    inicio: f.inicio, dias: f.dias || 30,
    objetivo: f.objetivo.trim() || undefined,
    como: como || undefined,
    criancas: f.criancas.filter((c) => c.nome.trim()).map((c) => ({
      nome: c.nome.trim(), ano: c.ano || undefined, idade: Number(c.idade) || undefined,
      temas: [c.por, c.matT, juntos ? null : c.cie].filter(ok) as TemaPlano[],
      reforcar: c.reforcar.replace(/^Formulário:\s*/, "").trim() || undefined,
    })),
    juntos: (() => {
      const l = [...cieJ.slice(0, 1), ...(f.juntosTemas || [])].filter(ok);
      const u = l.filter((t, k) => l.findIndex((x) => x.materia === t.materia && x.ano === t.ano && x.tema === t.tema) === k);
      return u.length ? u : undefined;
    })(),
    extras: f.extras.filter((e) => e.texto.trim() && e.dias.length),
    eventos: (f.eventos || []).filter((e) => e.texto.trim()),
    agenda: f.agenda,
  };
}

export default function Montar() {
  const { user, carregando } = useAtlas();
  const admin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [pedidoId, setPedidoId] = useState("");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [f, setF] = useState<Ficha | null>(null);
  const [aviso, setAviso] = useState("");
  const [publicando, setPublicando] = useState(false);
  const [aplicado, setAplicado] = useState(false);
  const [renovarEmail, setRenovarEmail] = useState("");
  const [pronto, setPronto] = useState<{ email: string; nomes: string } | null>(null);
  const carregado = useRef(false);

  // qual pedido (na URL ?pedido=)
  useEffect(() => { setPedidoId(new URLSearchParams(window.location.search).get("pedido") || ""); }, []);

  // carrega: ficha salva no banco > rascunho do navegador > dados do pedido
  useEffect(() => {
    if (!admin || !supabase || carregado.current) return;
    carregado.current = true;
    (async () => {
      let ped: Pedido | null = null;
      if (pedidoId) {
        const { data } = await supabase!.from("pedidos_planejamento").select("*").eq("id", pedidoId).maybeSingle();
        ped = (data as Pedido) || null; setPedido(ped);
      }
      if (pedidoId) {
        const { data } = await supabase!.from("fichas_planejamento").select("dados").eq("pedido_id", pedidoId).order("atualizado_em", { ascending: false }).limit(1);
        if (data?.[0]?.dados) { setF(data[0].dados as Ficha); return; }
      }
      try { const loc = localStorage.getItem(chave(pedidoId)); if (loc) { setF(JSON.parse(loc)); return; } } catch {}
      setF(ped ? doPedido(ped) : fichaVazia());
    })();
  }, [admin, pedidoId]);

  // rascunho automático no navegador
  useEffect(() => { if (f) try { localStorage.setItem(chave(f.pedidoId || ""), JSON.stringify(f)); } catch {} }, [f]);

  const plano = useMemo(() => (f ? montarPlano(f) : null), [f]);

  if (carregando) return <div className="wrap"><p className="meta">Carregando…</p></div>;
  if (!user) return <div className="wrap"><h1>Montar planejamento</h1><p>Área restrita. <Link href="/entrar?volta=/planejamento/montar">Entrar</Link></p></div>;
  if (!admin) return <div className="wrap"><h1>Montar planejamento</h1><p>Esta área é só da administradora do site.</p></div>;
  if (!f || !plano) return <div className="wrap"><p className="meta">Abrindo a ficha…</p></div>;

  const up = (p: Partial<Ficha>) => setF((x) => x && { ...x, ...p });
  const upC = (i: number, p: Partial<FichaCrianca>) => setF((x) => x && { ...x, criancas: x.criancas.map((c, j) => (j === i ? { ...c, ...p } : c)) });
  const upE = (i: number, p: Partial<ExtraPlano>) => setF((x) => x && { ...x, extras: x.extras.map((e, j) => (j === i ? { ...e, ...p } : e)) });

  const renovar = async () => {
    const email = (renovarEmail || user?.email || "").trim().toLowerCase();
    const { data, error } = await supabase!.from("planos").select("dados,criado_em").eq("email", email).eq("ativo", true).order("criado_em", { ascending: false });
    if (error || !data?.length) { setAviso(`Não achei plano ativo para ${email}.`); return; }
    const p = (data.map((x) => x.dados as Plano)).sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
    if (!window.confirm(`Carregar o plano “${p.familia}” (começou em ${ddmm(p.inicio)}) e preparar os próximos ${p.dias || 30} dias? A ficha aberta agora será trocada.`)) return;
    setF(fichaDoPlano(email, p, novoId())); setAplicado(false);
    setAviso(`Plano carregado. O novo começa em ${ddmm(somaDias(p.inicio, p.dias || 30))}. Atualize os temas (o botão “próximo →” avança para o tema seguinte da trilha), confira os extras e publique.`);
  };

  const sug = f.sugestao;
  const upS = (i: number, p: Partial<SugCrianca>) => setF((x) => x && x.sugestao ? { ...x, sugestao: { ...x.sugestao, criancas: x.sugestao.criancas.map((c, j) => (j === i ? { ...c, ...p } : c)) } } : x);
  const gerar = () => {
    if (sug && !window.confirm("Gerar de novo? As mudanças que você fez na sugestão serão perdidas.")) return;
    up({ sugestao: sugerir(f) }); setAplicado(false);
  };
  const aplicar = () => {
    if (!sug) return;
    setF((x) => {
      if (!x || !x.sugestao) return x;
      const s2 = x.sugestao;
      const links = new Set(s2.criancas.flatMap((c) => c.extras.map((e) => `${e.quem}|${e.link || e.texto}`)));
      const extras = [...x.extras.filter((e) => !links.has(`${e.quem}|${e.link || e.texto}`)), ...s2.criancas.flatMap((c) => c.extras)];
      return {
        ...x,
        objetivo: s2.objetivo || x.objetivo,
        como: s2.como || x.como,
        criancas: x.criancas.map((c) => { const sc = s2.criancas.find((y) => y.nome === c.nome.trim()); return sc ? { ...c, por: sc.por, matT: sc.mat, cie: sc.cie, reforcar: sc.reforcar } : c; }),
        extras,
        eventos: s2.criancas.flatMap((c) => c.eventos),
      };
    });
    setAplicado(true);
    setTimeout(() => document.getElementById("mt-previa")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const salvarFicha = async (extra: Partial<Ficha> = {}) => {
    const dados = { ...f, ...extra };
    const { error } = await supabase!.from("fichas_planejamento").upsert({ id: dados.id, pedido_id: dados.pedidoId || null, email: dados.email, dados, atualizado_em: new Date().toISOString() });
    return error;
  };

  const rascunho = async () => {
    const e = await salvarFicha();
    setAviso(e ? "Rascunho salvo só neste navegador (a tabela de fichas ainda não existe no banco; veja o SQL)." : "Rascunho salvo.");
  };

  const problemas: string[] = [];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) problemas.push("o e-mail da mãe");
  if (!plano.criancas.length) problemas.push("o nome de pelo menos uma criança");
  if (!(f.materias || ["por", "mat", "cie"]).length) problemas.push("pelo menos uma matéria");
  for (const m of f.materias || (["por", "mat", "cie"] as Materia[])) if (!({ ...AGENDA_PADRAO, ...(f.agenda || {}) })[m].length) problemas.push(`os dias de ${MAT_INFO[m][0]}`);
  plano.criancas.forEach((c) => { if (!c.temas.length && !plano.juntos?.length) problemas.push(`os temas de ${c.nome}`); });

  const publicar = async () => {
    if (problemas.length || !supabase) return;
    if (!window.confirm(`Publicar o planejamento de ${plano.dias} dias (${ddmm(plano.inicio)} a ${ddmm(somaDias(plano.inicio, (plano.dias || 30) - 1))}) para ${f.email.trim().toLowerCase()}? Um plano ativo que cubra esses mesmos dias é substituído; o plano que termina antes continua até o fim.`)) return;
    setPublicando(true); setAviso("");
    const email = f.email.trim().toLowerCase();
    // desativa só os planos ativos que se sobrepõem a este período (o plano atual continua até o fim)
    const fimNovo = somaDias(plano.inicio, (plano.dias || 30) - 1);
    const { data: ativos } = await supabase.from("planos").select("id,dados").eq("email", email).eq("ativo", true);
    for (const a of ativos || []) {
      const d = a.dados as Plano;
      const fimA = somaDias(d.inicio, (d.dias || 30) - 1);
      if (d.inicio <= fimNovo && fimA >= plano.inicio) await supabase.from("planos").update({ ativo: false }).eq("id", a.id);
    }
    const { error } = await supabase.from("planos").insert({ email, dados: plano, ativo: true });
    if (error) { setAviso(`Não consegui publicar: ${error.message}`); setPublicando(false); return; }
    if (f.pedidoId) await supabase.from("pedidos_planejamento").update({ status: "concluido" }).eq("id", f.pedidoId);
    const pub = iso(new Date());
    await salvarFicha({ publicado: pub });
    up({ publicado: pub });
    setPublicando(false);
    setPronto({ email, nomes: plano.criancas.map((c) => c.nome).join(" e ") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const semana = Array.from({ length: 7 }, (_, k) => somaDias(f.inicio, k));
  const nomeQuem = (q: string) => (q === JUNTOS ? "Juntos" : q);

  return (
    <div className="wrap mt" style={{ maxWidth: 900 }}>
      <p className="eyebrow-i" style={{ margin: 0 }}>Só para a administradora · <Link href="/planejamento/pedidos">Pedidos</Link></p>
      <h1 style={{ marginBottom: 4 }}>Montar planejamento</h1>
      <p className="meta" style={{ marginTop: 0 }}>{pedido ? <>Pedido de <b>{pedido.nome}</b> · {pedido.email}{pedido.whatsapp && ` · WhatsApp ${pedido.whatsapp}`}</> : "Ficha nova, sem pedido do formulário."} {f.publicado && <b> · Publicado em {f.publicado.split("-").reverse().join("/")}</b>}</p>

      {!pedido && (
        <section className="card mt-sec mt-renova">
          <h2>Renovar um plano</h2>
          <p className="meta" style={{ margin: 0 }}>Para o mês seguinte de uma família que já tem plano (inclusive o seu): carrega as crianças, os temas, os extras e a rotina do plano atual e começa no dia seguinte ao fim dele.</p>
          <div className="row" style={{ gap: 10, alignItems: "end" }}>
            <label className="f" style={{ flex: 1, minWidth: 220 }}>E-mail da família<input type="email" value={renovarEmail} onChange={(e) => setRenovarEmail(e.target.value)} placeholder={user?.email || "mae@email.com"} /></label>
            <button type="button" className="btn small" onClick={renovar}>Carregar o plano atual</button>
          </div>
          <p className="meta" style={{ margin: 0 }}>Em branco, carrega o seu próprio plano.</p>
        </section>
      )}
      {aviso && !pronto && <p className="note">{aviso}</p>}

      {pronto && (
        <section className="card mt-ok">
          <h2 style={{ margin: 0 }}>Planejamento publicado ✓</h2>
          <p style={{ margin: 0 }}>Já está em <b>Meu Plano</b> para <b>{pronto.email}</b>. Ela precisa entrar no site com esse mesmo e-mail.</p>
          <p className="meta" style={{ margin: 0 }}>Mensagem para mandar a ela:</p>
          <textarea readOnly rows={6} value={`Oi! O planejamento de ${pronto.nomes} está pronto 💛\n\nÉ só entrar em atlasdoaprender.com.br/meu-plano com o e-mail ${pronto.email}. Lá você vê o que fazer a cada dia, a semana inteira e os temas de cada um. Ao marcar uma tarefa como feita, ela fica registrada no diário.\n\nUm pouquinho, todo dia, com amor. Qualquer dúvida, me chama!`} onFocus={(e) => e.currentTarget.select()} />
          <div className="row" style={{ gap: 10 }}>
            <button type="button" className="btn small" onClick={() => plano && abrirImpressao(plano, "semana")}>PDF · A semana</button>
            <button type="button" className="btn small" onClick={() => plano && abrirImpressao(plano, "marcar")}>PDF · O que fizemos</button>
            <a className="btn small" href={`mailto:${pronto.email}?subject=${encodeURIComponent("Seu planejamento no Atlas do Aprender")}`}>Abrir no e-mail</a>
            {pedido?.whatsapp && <a className="btn small ghost" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${(() => { const z = pedido.whatsapp.replace(/\D/g, ""); return z.length <= 11 ? "55" + z : z; })()}`}>Abrir WhatsApp</a>}
          </div>
        </section>
      )}

      {/* 1 · FAMÍLIA */}
      <section className="card mt-sec">
        <h2>1 · A família</h2>
        <div className="mt-g2">
          <label className="f">E-mail da mãe (é com ele que ela entra) *<input type="email" value={f.email} onChange={(e) => up({ email: e.target.value })} placeholder="mae@email.com" /></label>
          <label className="f">Nome que aparece no plano<input value={f.familia} onChange={(e) => up({ familia: e.target.value })} placeholder="Família de Lia e Theo" /></label>
          <label className="f">Começa em<input type="date" value={f.inicio} onChange={(e) => up({ inicio: e.target.value })} /></label>
          <label className="f">Quem acompanha<input value={f.acompanha} onChange={(e) => up({ acompanha: e.target.value })} placeholder="mãe, avó…" /></label>
        </div>
        <label className="f">Objetivo (aparece no topo do plano)<textarea rows={2} value={f.objetivo} onChange={(e) => up({ objetivo: e.target.value })} /></label>
      </section>

      {/* 2 · CONVERSA */}
      <section className="card mt-sec">
        <h2>2 · Conversa com a família <span className="meta">15 min</span></h2>
        {CONVERSA.map(([k, q]) => (
          <label key={k} className="f">{q}<textarea rows={2} value={f.conversa[k] || ""} onChange={(e) => up({ conversa: { ...f.conversa, [k]: e.target.value } })} /></label>
        ))}
      </section>

      {/* 3 · CRIANÇAS */}
      {f.criancas.map((c, i) => {
        const sl = sugereLeitura(c.leitura, c.ano), sm = sugereMat(c.mat);
        return (
          <section className="card mt-sec" key={i}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2>3 · Com a criança {f.criancas.length > 1 ? `(${i + 1})` : ""} <span className="meta">20 min</span></h2>
              {f.criancas.length > 1 && <button type="button" className="link-btn" onClick={() => window.confirm(`Tirar ${c.nome || "esta criança"} da ficha?`) && up({ criancas: f.criancas.filter((_, j) => j !== i) })}>Remover</button>}
            </div>
            <div className="mt-g3">
              <label className="f">Nome *<input value={c.nome} onChange={(e) => upC(i, { nome: e.target.value })} /></label>
              <label className="f">Idade<input inputMode="numeric" value={c.idade} onChange={(e) => upC(i, { idade: e.target.value })} /></label>
              <label className="f">Ano escolar<input value={c.ano} onChange={(e) => upC(i, { ano: e.target.value })} placeholder="2º ano" /></label>
            </div>
            <details className="mt-dica"><summary>Lembretes para esta parte</summary><ul>{COM_A_CRIANCA.map((t) => <li key={t}>{t}</li>)}</ul></details>

            <h3 className="mt-h">Leitura e escrita</h3>
            <Tarefas lista={LEITURA} niveis={c.leitura} muda={(n) => upC(i, { leitura: n })} />
            <label className="f">O que observei na leitura<textarea rows={2} value={c.leituraNota} onChange={(e) => upC(i, { leituraNota: e.target.value })} /></label>
            {sl && <Sugestao s={sl} atual={c.por} usar={() => upC(i, { por: sl.tema })} />}

            <h3 className="mt-h">Matemática</h3>
            <Tarefas lista={MATEMATICA} niveis={c.mat} muda={(n) => upC(i, { mat: n })} />
            <label className="f">O que observei na matemática<textarea rows={2} value={c.matNota} onChange={(e) => upC(i, { matNota: e.target.value })} /></label>
            {sm && <Sugestao s={sm} atual={c.matT} usar={() => upC(i, { matT: sm.tema })} />}

            <h3 className="mt-h">Ficha para o plano</h3>
            <div className="mt-g2">
              <label className="f">Pontos fortes<textarea rows={2} value={c.fortes} onChange={(e) => upC(i, { fortes: e.target.value })} /></label>
              <label className="f">Do que gosta<textarea rows={2} value={c.gosta} onChange={(e) => upC(i, { gosta: e.target.value })} /></label>
            </div>
            <label className="f">O que vamos reforçar primeiro (aparece para a mãe no plano)<textarea rows={2} value={c.reforcar} onChange={(e) => upC(i, { reforcar: e.target.value })} /></label>
            <div className="mt-g3">
              {(f.materias || ["por", "mat", "cie"]).includes("por") && <EscolheTema m="por" v={c.por} muda={(t) => upC(i, { por: t })} />}
              {(f.materias || ["por", "mat", "cie"]).includes("mat") && <EscolheTema m="mat" v={c.matT} muda={(t) => upC(i, { matT: t })} />}
              {(f.materias || ["por", "mat", "cie"]).includes("cie") && <EscolheTema m="cie" v={c.cie} muda={(t) => upC(i, { cie: t })} />}
            </div>
            <p className="meta" style={{ margin: 0 }}>Ciências não precisa de teste: escolha o tema do ano que mais combina com o que a criança gosta. Deixe “nenhum” em qualquer matéria que não vai entrar agora.</p>
          </section>
        );
      })}
      <div className="row"><button type="button" className="btn small ghost" onClick={() => up({ criancas: [...f.criancas, novaCrianca()] })}>+ Outra criança</button></div>

      {/* 4 · FECHAMENTO */}
      <section className="card mt-sec">
        <h2>4 · Fechamento e rotina <span className="meta">5 min</span></h2>
        <details className="mt-dica"><summary>Lembretes para o fechamento</summary><ul>{FECHAMENTO.map((t) => <li key={t}>{t}</li>)}</ul></details>
        <label className="f">Rotina combinada: dias, horário e tempo (aparece em “Como vamos fazer”)<textarea rows={3} value={f.como} onChange={(e) => up({ como: e.target.value })} placeholder="Encontros de 15 minutos depois do lanche, de segunda a sexta…" /></label>
        {f.criancas.length > 1 && (
          <label className="mt-check"><input type="checkbox" checked={f.cieJuntos} onChange={(e) => up({ cieJuntos: e.target.checked })} /> Ciências com os irmãos juntos (usa o tema de Ciências da primeira criança)</label>
        )}
        <h3 className="mt-h">Matérias e dias deste plano <span className="meta">cada família e cada mês do seu jeito</span></h3>
        {(() => {
          const ms = f.materias || ["por", "mat", "cie"];
          const ag = { ...AGENDA_PADRAO, ...(f.agenda || {}) };
          const setDias = (k: keyof typeof AGENDA_PADRAO, d: string) => up({ agenda: { ...ag, [k]: ag[k].includes(d) ? ag[k].filter((x) => x !== d) : DS.filter((x) => x === d || ag[k].includes(x)) } });
          return (
            <div className="mt-agenda">
              <div className="mt-item"><b>Matérias</b><div className="seg">{(["por", "mat", "cie"] as Materia[]).map((m) => (
                <button key={m} type="button" aria-pressed={ms.includes(m)} onClick={() => up({ materias: ms.includes(m) ? ms.filter((x) => x !== m) : (["por", "mat", "cie"] as Materia[]).filter((x) => x === m || ms.includes(x)) })}>{MAT_INFO[m][1]} {MAT_INFO[m][0]}</button>
              ))}</div></div>
              {(["por", "mat", "cie"] as Materia[]).filter((m) => ms.includes(m)).map((m) => (
                <div key={m} className="mt-item"><span>{MAT_INFO[m][1]} {MAT_INFO[m][0]}</span><div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={ag[m].includes(d)} onClick={() => setDias(m, d)}>{d}</button>)}</div></div>
              ))}
              {ROTINA.map(([k, ic, tx]) => (
                <div key={k} className="mt-item"><span>{ic} {(() => { const t = tx.replace("À noite: ", ""); return t[0].toUpperCase() + t.slice(1) + (tx.startsWith("À noite") ? " (à noite)" : ""); })()}</span><div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={ag[k].includes(d)} onClick={() => setDias(k, d)}>{d}</button>)}</div></div>
              ))}
              <div className="row" style={{ gap: 10 }}>
                <button type="button" className="link-btn" onClick={() => up({ agenda: undefined, materias: undefined })}>Voltar ao padrão do Atlas</button>
                <span className="meta">Dia sem marcação = não entra. Desmarque todos os dias de um momento da rotina para tirá-lo.</span>
              </div>
            </div>
          );
        })()}

        <h3 className="mt-h">Temas que fazem juntos <span className="meta">aparecem para todos, nos dias da matéria</span></h3>
        {(f.juntosTemas || []).map((t, k) => (
          <div key={k} className="mt-item">
            <select value={t.materia} style={{ width: "auto" }} onChange={(e) => up({ juntosTemas: (f.juntosTemas || []).map((x, j) => (j === k ? { materia: e.target.value as Materia, ano: x.ano, tema: 1 } : x)) })}>{(["por", "mat", "cie"] as Materia[]).map((m) => <option key={m} value={m}>{MAT_INFO[m][0]}</option>)}</select>
            <div style={{ flex: 1 }}><EscolheTema m={t.materia} v={t} muda={(n) => up({ juntosTemas: (f.juntosTemas || []).map((x, j) => (j === k ? n || x : x)) })} /></div>
            <button type="button" className="link-btn" onClick={() => up({ juntosTemas: (f.juntosTemas || []).filter((_, j) => j !== k) })}>tirar</button>
          </div>
        ))}
        <div className="row"><button type="button" className="btn small ghost" onClick={() => up({ juntosTemas: [...(f.juntosTemas || []), { materia: "cie", ano: "1", tema: 1 }] })}>+ Tema juntos</button></div>

        <h3 className="mt-h">Extras com dia fixo <span className="meta">olimpíada, livro da escola, prova, treino diário…</span></h3>
        {f.extras.map((e, i) => (
          <div key={i} className="mt-extra">
            <div className="mt-g3">
              <label className="f">Para quem<select value={e.quem} onChange={(ev) => upE(i, { quem: ev.target.value })}>{[...f.criancas.map((c) => c.nome).filter(Boolean), JUNTOS].map((q) => <option key={q} value={q}>{nomeQuem(q)}</option>)}</select></label>
              <label className="f" style={{ gridColumn: "span 2" }}>O que fazer<input value={e.texto} onChange={(ev) => upE(i, { texto: ev.target.value })} placeholder="Treino Diário · T ou D?: uma folha" /></label>
            </div>
            <div className="mt-g3">
              <label className="f">Ícone<select value={e.icone || "⭐"} onChange={(ev) => upE(i, { icone: ev.target.value })}>{["⭐", "📚", "🔤", "🔢", "🔭", "🏅", "🧪", "🎲"].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label className="f">Link no site (opcional)<input value={e.link || ""} onChange={(ev) => upE(i, { link: ev.target.value || undefined })} placeholder="/apostilas/treino-t-ou-d" /></label>
              <label className="f">A partir de (opcional)<input type="date" value={e.de || ""} onChange={(ev) => upE(i, { de: ev.target.value || undefined })} /></label>
              <label className="f">Até (opcional)<input type="date" value={e.ate || ""} onChange={(ev) => upE(i, { ate: ev.target.value || undefined })} /></label>
              <div className="f" style={{ gridColumn: "1 / -1" }}><span>Dias</span><div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={e.dias.includes(d)} onClick={() => upE(i, { dias: e.dias.includes(d) ? e.dias.filter((x) => x !== d) : [...e.dias, d] })}>{d}</button>)}</div></div>
            </div>
            <button type="button" className="link-btn" onClick={() => up({ extras: f.extras.filter((_, j) => j !== i) })}>Remover extra</button>
          </div>
        ))}
        <div className="row"><button type="button" className="btn small ghost" onClick={() => up({ extras: [...f.extras, { quem: f.criancas[0]?.nome || JUNTOS, texto: "", icone: "⭐", dias: ["Seg", "Qua", "Sex"] }] })}>+ Extra</button></div>
        <label className="f">Observações (ficam só na ficha, a mãe não vê)<textarea rows={3} value={f.obs} onChange={(e) => up({ obs: e.target.value })} /></label>
      </section>

      {/* 5 · SUGESTÃO */}
      <section className="card mt-sec">
        <h2>5 · Ponto de partida sugerido</h2>
        <p className="meta" style={{ margin: 0 }}>Depois da conversa e das tarefas, gere a sugestão. O Atlas lê o que você marcou e propõe por onde começar, o que reforçar, os treinos e a rotina. Mude o que quiser aqui e, quando estiver bom, aplique ao plano.</p>
        <div className="row"><button type="button" className="btn" onClick={gerar}>{sug ? "Gerar de novo" : "Gerar sugestão"}</button></div>
        {sug && (
          <>
            {sug.criancas.length === 0 && <p className="warn" style={{ margin: 0 }}>Preencha o nome de pelo menos uma criança.</p>}
            {sug.criancas.map((c, i) => (
              <div key={c.nome} className="mt-sugc">
                <h3 className="mt-h" style={{ marginTop: 0 }}>{c.nome}</h3>
                {c.sabe.length > 0 && <p style={{ margin: 0 }}><b>Já faz sozinha:</b> {c.sabe.join(", ").toLowerCase()}.</p>}
                {c.lacunas.length > 0 ? <p style={{ margin: 0 }}><b>{c.lacunas.length} {c.lacunas.length === 1 ? "lacuna" : "lacunas"}:</b> {c.lacunas.join(", ").toLowerCase()}.</p> : <p className="meta" style={{ margin: 0 }}>Nenhuma lacuna nas tarefas marcadas.</p>}
                <div className="mt-g3">
                  {(f.materias || ["por", "mat", "cie"]).includes("por") && <div><EscolheTema m="por" v={c.por} muda={(t) => upS(i, { por: t })} /><small className="meta">{c.porPorque}</small></div>}
                  {(f.materias || ["por", "mat", "cie"]).includes("mat") && <div><EscolheTema m="mat" v={c.mat} muda={(t) => upS(i, { mat: t })} /><small className="meta">{c.matPorque}</small></div>}
                  {(f.materias || ["por", "mat", "cie"]).includes("cie") && <div><EscolheTema m="cie" v={c.cie} muda={(t) => upS(i, { cie: t })} /><small className="meta">{c.ciePorque}</small></div>}
                </div>
                <label className="f">O que vamos reforçar primeiro<textarea rows={2} value={c.reforcar} onChange={(e) => upS(i, { reforcar: e.target.value })} /></label>
                <div className="mt-lista">
                  <b>Extras sugeridos</b>
                  {c.extras.length === 0 && <span className="meta">Nenhum treino diário ligado a estes temas.</span>}
                  {c.extras.map((e, k) => (
                    <div key={k} className="mt-item">
                      <span>{e.icone} {e.texto}</span>
                      <div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={e.dias.includes(d)} onClick={() => upS(i, { extras: c.extras.map((x, j) => (j === k ? { ...x, dias: x.dias.includes(d) ? x.dias.filter((y) => y !== d) : [...x.dias, d] } : x)) })}>{d}</button>)}</div>
                      <button type="button" className="link-btn" onClick={() => upS(i, { extras: c.extras.filter((_, j) => j !== k) })}>tirar</button>
                    </div>
                  ))}
                  {c.eventos.map((e, k) => (
                    <div key={"ev" + k} className="mt-item">
                      <span>{e.icone} {ddmm(e.data)}: {e.texto}</span>
                      <button type="button" className="link-btn" onClick={() => upS(i, { eventos: c.eventos.filter((_, j) => j !== k) })}>tirar</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <label className="f">Objetivo do plano<textarea rows={2} value={sug.objetivo} onChange={(e) => up({ sugestao: { ...sug, objetivo: e.target.value } })} /></label>
            <label className="f">Como vamos fazer (rotina)<textarea rows={3} value={sug.como} onChange={(e) => up({ sugestao: { ...sug, como: e.target.value } })} /></label>
            <div className="row" style={{ gap: 10, alignItems: "center" }}>
              <button type="button" className="btn" onClick={aplicar} disabled={!sug.criancas.length}>Aceitar e aplicar ao plano</button>
              {aplicado && <span className="meta">✓ Aplicado. Os temas, o reforço, os extras e a rotina foram para a ficha acima; dá para ajustar lá também.</span>}
            </div>
          </>
        )}
      </section>

      {/* 6 · PRÉVIA E PUBLICAR */}
      <section className="card mt-sec" id="mt-previa">
        <h2>6 · Prévia da primeira semana</h2>
        <p className="meta" style={{ margin: 0 }}>{plano.dias} dias, de {ddmm(f.inicio)} a {ddmm(somaDias(f.inicio, plano.dias! - 1))}. {" "}{(() => { const ag = { ...AGENDA_PADRAO, ...(f.agenda || {}) }; return (f.materias || ["por", "mat", "cie"]).map((m) => `${MAT_INFO[m][0]}: ${diasPorExtenso(ag[m as "por"])}`).join(" · ") || "Nenhuma matéria marcada."; })()}</p>
        <div className="mt-prev">
          {semana.map((d) => (
            <div key={d} className="mt-dia">
              <b>{DIAS_NOME[diaSemana(d)]} · {ddmm(d)}</b>
              <ul>{itensDoDia(plano, d).map((it, k) => <li key={k}>{it.icone} <span className="meta">{nomeQuem(it.quem)}:</span> {it.texto}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-temas">
          {plano.criancas.map((c) => (
            <p key={c.nome} style={{ margin: 0 }}><b>{c.nome}</b>: {c.temas.map((t) => `${MAT_INFO[t.materia][0]} · ${infoTema(t).tema?.t || "?"} (${anoNome(t.ano)})`).join(" · ") || "sem temas"}</p>
          ))}
          {plano.juntos?.map((t) => <p key={t.materia + t.ano + t.tema} style={{ margin: 0 }}><b>Juntos</b>: {MAT_INFO[t.materia][0]} · {infoTema(t).tema?.t} ({anoNome(t.ano)})</p>)}
        </div>
        {problemas.length > 0 && <p className="warn" style={{ margin: 0 }}>Falta preencher: {problemas.join(", ")}.</p>}
        {aviso && <p className="note" style={{ margin: 0 }}>{aviso}</p>}
        <div className="row" style={{ gap: 10 }}>
          <button type="button" className="btn" disabled={!!problemas.length || publicando} onClick={publicar}>{publicando ? "Publicando…" : f.publicado ? "Publicar de novo (substitui o plano)" : "Publicar o planejamento de 30 dias"}</button>
          <button type="button" className="btn ghost" onClick={rascunho}>Salvar rascunho</button>
          <button type="button" className="btn ghost" disabled={!plano.criancas.length} onClick={() => abrirImpressao(plano, "semana")}>PDF · A semana</button>
          <button type="button" className="btn ghost" disabled={!plano.criancas.length} onClick={() => abrirImpressao(plano, "marcar")}>PDF · O que fizemos</button>
        </div>
        <p className="meta" style={{ margin: 0 }}>A ficha também fica salva sozinha neste navegador enquanto você preenche.</p>
      </section>
    </div>
  );
}

function Tarefas({ lista, niveis, muda }: { lista: Tarefa[]; niveis: Nivel[]; muda: (n: Nivel[]) => void }) {
  return (
    <ol className="mt-tarefas">
      {lista.map((t, k) => (
        <li key={t.t}>
          <div className="mt-tt"><b>{t.t}</b>
            <div className="seg">{NIVEIS.map(([v, l]) => <button key={v} type="button" aria-pressed={niveis[k] === v} className={`n-${v}`} onClick={() => muda(niveis.map((x, j) => (j === k ? (x === v ? "" : v) : x)))}>{l}</button>)}</div>
          </div>
          <div className="mt-mostra">{t.mostrar}</div>
          {t.obs && <small className="meta">{t.obs}</small>}
        </li>
      ))}
    </ol>
  );
}

function Sugestao({ s, atual, usar }: { s: { tema: TemaPlano; porque: string }; atual: TemaPlano | null; usar: () => void }) {
  const igual = atual && atual.materia === s.tema.materia && atual.ano === s.tema.ano && atual.tema === s.tema.tema;
  const i = infoTema(s.tema);
  return (
    <div className="mt-sug">
      <span><b>Onde começar no Atlas:</b> {anoNome(s.tema.ano)} · tema {s.tema.tema}, {i.tema?.t}{i.apostila ? ` (apostila ${i.apostila.titulo})` : ""}. <span className="meta">{s.porque}</span></span>
      {igual ? <span className="meta">✓ escolhido</span> : <button type="button" className="btn small" onClick={usar}>Usar este tema</button>}
    </div>
  );
}

function EscolheTema({ m, v, muda }: { m: Materia; v: TemaPlano | null; muda: (t: TemaPlano | null) => void }) {
  const val = v ? `${v.ano}|${v.tema}` : "";
  return (
    <label className="f">{MAT_INFO[m][1]} {MAT_INFO[m][0]}
      <select value={val} onChange={(e) => { const [a, t] = e.target.value.split("|"); muda(e.target.value ? { materia: m, ano: a, tema: Number(t) } : null); }}>
        <option value="">nenhum agora</option>
        {Object.entries(TRILHAS[m] || {}).map(([ano, temas]) => (
          <optgroup key={ano} label={anoNome(ano)}>
            {temas.map((t, k) => <option key={k} value={`${ano}|${k + 1}`}>{k + 1}. {t.t}</option>)}
          </optgroup>
        ))}
      </select>
      {v && <button type="button" className="link-btn" style={{ justifySelf: "start", fontSize: ".82rem" }} onClick={(e) => { e.preventDefault(); muda(proximoTema(v)); }}>próximo →</button>}
    </label>
  );
}
