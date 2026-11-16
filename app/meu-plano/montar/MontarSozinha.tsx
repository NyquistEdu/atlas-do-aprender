"use client";
/**
 * A família monta o próprio plano, partindo do padrão do Atlas: um tema por matéria do ano escolar,
 * a agenda padrão da semana e 30 dias. Ela muda o que quiser (temas, apostila ou treino, dias) e publica em /meu-plano.
 * Grava em public.planos com origem "familia" (regra de acesso em supabase/plano-proprio.sql).
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";
import { EditorAgenda, EscolheTema, MaisTemas } from "@/components/EditorPlano";
import { anoNome } from "@/lib/apostilas";
import { rastrear } from "@/lib/rastreio";
import { CHAVE_PLANO_PROPRIO } from "@/lib/planoAutomatico";
import { AGENDA_PADRAO, DIAS_NOME, DS, JUNTOS, MAT_INFO, ddmm, diaSemana, fimDoPlano, iso, itensDoDia, somaDias, type Plano, type TemaPlano } from "@/lib/plano";
import { diasPorExtenso, fichaDoPlano, montarPlano, novaCrianca, type Ficha, type FichaCrianca } from "@/lib/roteiro";
import type { Materia } from "@/lib/data";

const ANOS = ["1", "2", "3", "4", "5"];
const RASCUNHO = "atlas-montar-meu-plano";

/** Os três temas de partida do ano escolar: o primeiro tema de cada matéria, fazendo a apostila. */
const temasDoAno = (ano: string): Pick<FichaCrianca, "por" | "matT" | "cie"> => ({
  por: { materia: "por", ano, tema: 1, faz: "apostila" },
  matT: { materia: "mat", ano, tema: 1, faz: "apostila" },
  cie: { materia: "cie", ano, tema: 1, faz: "apostila" },
});

function fichaPadrao(email: string, nomes: string[]): Ficha {
  return {
    id: "familia", email, familia: "Minha família", inicio: iso(new Date()), dias: 30, acompanha: "", objetivo: "", como: "", obs: "", conversa: {},
    criancas: (nomes.length ? nomes : [""]).map((nome) => novaCrianca({ nome, ano: "1", ...temasDoAno("1") })),
    cieJuntos: false, juntosTemas: [], extras: [],
  };
}

export default function MontarSozinha() {
  const a = useAtlas();
  const router = useRouter();
  const [f, setF] = useState<Ficha | null>(null);
  const [atual, setAtual] = useState<Plano | null>(null);
  const [publicando, setPublicando] = useState(false);
  const email = (a.user?.email || "").toLowerCase();

  // começa do rascunho deste navegador; senão do padrão do Atlas com as crianças da conta
  useEffect(() => {
    if (!a.user || f || (a.criancas.length === 0 && a.carregando)) return;
    try { const r = JSON.parse(localStorage.getItem(RASCUNHO) || "null"); if (r && r.email === email) { setF(r); return; } } catch {}
    setF(fichaPadrao(email, a.criancas));
  }, [a.user, a.criancas, a.carregando, f, email]);
  useEffect(() => { if (f) try { localStorage.setItem(RASCUNHO, JSON.stringify(f)); } catch {} }, [f]);

  // plano ativo (para poder partir dele)
  useEffect(() => {
    if (!supabase || !a.user) return;
    supabase.from("planos").select("dados").eq("email", email).eq("ativo", true).order("criado_em", { ascending: false }).limit(1)
      .then(({ data }) => setAtual((data?.[0]?.dados as Plano) || null));
  }, [a.user, email]);

  const plano = useMemo(() => {
    if (!f) return null;
    const p = montarPlano(f);
    const ms = f.materias || ["por", "mat", "cie"];
    const ag = { ...AGENDA_PADRAO, ...(f.agenda || {}) };
    const dias = DS.filter((d) => ms.some((m) => ag[m].includes(d)));
    p.como = `Encontros curtos (15 a 20 minutos), ${diasPorExtenso(dias)}, sempre no mesmo horário. Comece pela tarefa de hoje e pare antes de cansar.`;
    p.objetivo = "Um pouquinho por dia, no ritmo da criança.";
    p.origem = "familia";
    return p;
  }, [f]);

  if (!a.configurado) return <div className="wrap"><div className="empty">O acesso ainda não foi configurado neste site.</div></div>;
  if (a.carregando) return <div className="wrap"><p className="meta">Carregando…</p></div>;
  if (!a.user)
    return (
      <div className="wrap" style={{ maxWidth: 640 }}>
        <h1>Monte o seu plano de estudos</h1>
        <p className="lead">Comece pelo formato do Atlas e ajuste do seu jeito: os temas de cada criança, a apostila ou o treino diário, e os dias da semana. Entre na sua conta para montar.</p>
        <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b></p>
        <FormAcesso volta="/meu-plano/montar" origem="montar-plano" />
      </div>
    );
  if (!f || !plano) return <div className="wrap"><p className="meta">Abrindo…</p></div>;

  const up = (p: Partial<Ficha>) => setF((x) => x && { ...x, ...p });
  const upC = (i: number, p: Partial<FichaCrianca>) => setF((x) => x && { ...x, criancas: x.criancas.map((c, j) => (j === i ? { ...c, ...p } : c)) });
  const ms = f.materias || (["por", "mat", "cie"] as Materia[]);

  const problemas: string[] = [];
  if (!plano.criancas.length) problemas.push("o nome de pelo menos uma criança");
  if (!ms.length) problemas.push("pelo menos uma matéria");
  for (const m of ms) if (!({ ...AGENDA_PADRAO, ...(f.agenda || {}) })[m].length) problemas.push(`os dias de ${MAT_INFO[m][0]}`);
  plano.criancas.forEach((c) => { if (!c.temas.length && !plano.juntos?.length) problemas.push(`pelo menos um tema para ${c.nome}`); });

  const publicar = async () => {
    if (problemas.length || !supabase) return;
    const fim = fimDoPlano(plano);
    if (!window.confirm(`Começar este plano de ${plano.dias} dias (${ddmm(plano.inicio)} a ${ddmm(fim)})? Se você já tem um plano nesses dias, ele é trocado por este.`)) return;
    setPublicando(true);
    // nomes novos viram crianças da conta (para marcar as tarefas e o diário)
    for (const c of plano.criancas) if (!a.criancas.includes(c.nome)) await a.addCrianca(c.nome);
    const { data: ativos } = await supabase.from("planos").select("id,dados").eq("email", email).eq("ativo", true);
    for (const x of ativos || []) {
      const d = x.dados as Plano;
      if (d.inicio <= fim && fimDoPlano(d) >= plano.inicio) await supabase.from("planos").update({ ativo: false }).eq("id", x.id);
    }
    const { error } = await supabase.from("planos").insert({ email, dados: plano, ativo: true });
    if (error) {
      // banco ainda sem a regra para a família gravar: o plano fica neste aparelho
      try { localStorage.setItem(CHAVE_PLANO_PROPRIO, JSON.stringify(plano)); } catch {}
    }
    rastrear("PlanoCriado", { tipo: error ? "proprio_so_neste_aparelho" : "proprio" });
    try { localStorage.removeItem(RASCUNHO); } catch {}
    router.push(`/meu-plano?montado=${error ? "local" : "1"}`);
  };

  const semana = Array.from({ length: 7 }, (_, k) => somaDias(f.inicio, k));
  const nomeQuem = (q: string) => (q === JUNTOS ? "Juntos" : q);

  return (
    <div className="wrap" style={{ maxWidth: 880 }}>
      <p className="eyebrow-i">Faça você mesma</p>
      <h1 className="hero-t">Monte o seu plano de estudos</h1>
      <p className="lead">Já começa no formato do Atlas: um tema de cada matéria do ano escolar, Português na segunda, quarta e sexta, Matemática na terça e na quinta, Ciências na segunda e na quarta, e no fim de semana mão na massa e jogo. Mude o que quiser.</p>
      <p className="meta">Não sabe por onde começar? Faça o <Link href="/diagnostico">diagnóstico grátis</Link> (5 minutos) para encontrar as lacunas, ou <Link href="/planejamento">peça o planejamento comigo</Link> por videochamada.</p>

      {atual && (
        <div className="note row" style={{ justifyContent: "space-between", gap: 10 }}>
          <span>Você já tem um plano ({ddmm(atual.inicio)} a {ddmm(fimDoPlano(atual))}).</span>
          <span className="row" style={{ gap: 8 }}>
            <button type="button" className="btn small ghost" onClick={() => setF({ ...fichaDoPlano(email, atual, "familia"), inicio: atual.inicio })}>Ajustar o plano atual</button>
            <button type="button" className="btn small ghost" onClick={() => setF(fichaDoPlano(email, atual, "familia"))}>Continuar no mês seguinte</button>
          </span>
        </div>
      )}

      <section className="card mt-sec">
        <h2>1 · Quando começa</h2>
        <div className="mt-g3">
          <label className="f">Primeiro dia<input type="date" value={f.inicio} onChange={(e) => up({ inicio: e.target.value || iso(new Date()) })} /></label>
          <label className="f">Duração<select value={f.dias} onChange={(e) => up({ dias: Number(e.target.value) })}>{[15, 30, 60].map((d) => <option key={d} value={d}>{d} dias</option>)}</select></label>
          <div className="f"><span>Termina em</span><b style={{ color: "var(--ink)", fontSize: "1rem" }}>{ddmm(fimDoPlano(plano))}</b></div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="link-btn" onClick={() => { if (window.confirm("Voltar tudo para o padrão do Atlas?")) setF(fichaPadrao(email, a.criancas)); }}>Recomeçar do padrão do Atlas</button>
        </div>
      </section>

      {f.criancas.map((c, i) => (
        <section className="card mt-sec" key={i}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>2 · {c.nome || "Criança"}</h2>
            {f.criancas.length > 1 && <button type="button" className="link-btn" onClick={() => up({ criancas: f.criancas.filter((_, j) => j !== i) })}>Tirar do plano</button>}
          </div>
          <div className="mt-g2">
            <label className="f">Nome<input value={c.nome} onChange={(e) => upC(i, { nome: e.target.value })} placeholder="Nome ou apelido" /></label>
            <label className="f">Ano escolar (os temas começam por aqui)
              <select value={c.ano} onChange={(e) => upC(i, { ano: e.target.value, ...temasDoAno(e.target.value) })}>{ANOS.map((x) => <option key={x} value={x}>{anoNome(x)}{x === "1" ? " (1º ano)" : ""}</option>)}</select>
            </label>
          </div>
          <div className="mt-g3">
            {ms.includes("por") && <EscolheTema m="por" v={c.por} muda={(t) => upC(i, { por: t })} />}
            {ms.includes("mat") && <EscolheTema m="mat" v={c.matT} muda={(t) => upC(i, { matT: t })} />}
            {ms.includes("cie") && <EscolheTema m="cie" v={c.cie} muda={(t) => upC(i, { cie: t })} />}
          </div>
          <p className="meta" style={{ margin: 0 }}>Pode escolher um tema de outro ano, se a criança precisa revisar ou já está adiantada. Em cada tema, escolha se ela faz a <b>apostila</b>, o <b>treino diário</b> (uma folha por dia) ou <b>os dois</b>.</p>
          <h3 className="mt-h">Mais temas ao mesmo tempo <span className="meta">ex.: revisar um tema da alfabetização junto com o tema do ano</span></h3>
          <MaisTemas temas={c.outros || []} ano={c.ano || "1"} muda={(outros) => upC(i, { outros })} rotulo="+ Outro tema" />
        </section>
      ))}
      <div className="row"><button type="button" className="btn small ghost" onClick={() => up({ criancas: [...f.criancas, novaCrianca({ ano: "1", ...temasDoAno("1") })] })}>+ Outra criança</button></div>

      {f.criancas.length > 1 && (
        <section className="card mt-sec">
          <h2>Temas que os irmãos fazem juntos</h2>
          <p className="meta" style={{ margin: 0 }}>Aparecem para todos, nos dias da matéria. Ciências costuma funcionar bem junto.</p>
          <MaisTemas temas={f.juntosTemas || []} ano="1" materiaNova="cie" muda={(juntosTemas: TemaPlano[]) => up({ juntosTemas })} rotulo="+ Tema juntos" />
        </section>
      )}

      <section className="card mt-sec">
        <h2>3 · Os dias da semana</h2>
        <EditorAgenda materias={f.materias} agenda={f.agenda} muda={(materias, agenda) => up({ materias, agenda })} />
      </section>

      <section className="card mt-sec">
        <h2>4 · Como fica a primeira semana</h2>
        <div className="mt-prev">
          {semana.map((d) => (
            <div key={d} className="mt-dia">
              <b>{DIAS_NOME[diaSemana(d)]} · {ddmm(d)}</b>
              <ul>{itensDoDia(plano, d).map((it, k) => <li key={k}>{it.icone} <span className="meta">{nomeQuem(it.quem)}:</span> {it.texto}</li>)}</ul>
            </div>
          ))}
        </div>
        {problemas.length > 0 && <p className="warn" style={{ margin: 0 }}>Falta: {problemas.join(", ")}.</p>}
        <div className="row"><button type="button" className="btn" disabled={!!problemas.length || publicando} onClick={publicar}>{publicando ? "Salvando…" : "Começar este plano"}</button></div>
        <p className="meta" style={{ margin: 0 }}>Depois é só abrir <b>Meu Plano</b> todo dia: as tarefas de hoje aparecem lá, e cada uma marcada vai para o diário.</p>
      </section>
    </div>
  );
}
