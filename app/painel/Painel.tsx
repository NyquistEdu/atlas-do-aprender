"use client";

import Link from "next/link";
import DicasCard from "./DicasCard";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { APOSTILAS, GRATUITOS, KITS } from "@/lib/apostilas";
import { LOJA } from "@/lib/loja";
import { ADMIN_EMAIL } from "@/lib/admin";

type Linha = { d: string; e: string; n: number };
type Dados = {
  hoje: string; inicio: string; dias: number; desde: string | null;
  serie: Linha[]; origens: { o: string; e: string; n: number }[]; detalhes: { e: string; k: string; n: number }[];
  contas: { total: number; entraram: number; com_crianca: number; ativas7: number; ativas30: number; por_dia: { d: string; n: number }[] };
  uso: { criancas: number; temas: number; temas_periodo: number; andamento: number; livros: number; registros: number; registros_periodo: number; minutos_periodo: number; planos_ativos: number };
  pedidos: { planejamento: Record<string, number>; apostila: Record<string, number> };
};

const PERIODOS: [number, string][] = [[7, "7 dias"], [30, "30 dias"], [90, "90 dias"], [365, "1 ano"]];
const METRICAS = [
  { k: "visita", nome: "Visitas", ajuda: "1 por sessão de navegação" },
  { k: "cadastros", nome: "Novos cadastros", ajuda: "contas criadas no site" },
  { k: "baixou", nome: "Downloads", ajuda: "cliques para baixar PDF" },
  { k: "comprar", nome: "Cliques em Comprar", ajuda: "cliques que levam à Kiwify" },
  { k: "diag_fim", nome: "Diagnósticos concluídos", ajuda: "chegaram ao resultado" },
  { k: "loja", nome: "Cliques na Loja", ajuda: "idas ao Mercado Livre/Shopee" },
] as const;

const fmt = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");
const addDias = (d: string, k: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + k); return x.toISOString().slice(0, 10); };
const ddmm = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;
const soma = (a: number[]) => a.reduce((x, y) => x + y, 0);

const NOMES: Record<string, string> = Object.fromEntries([
  ...APOSTILAS.map((a) => [a.slug, a.titulo]), ...KITS.map((k) => [k.slug, k.titulo]), ...GRATUITOS.map((g) => [g.slug, g.titulo]),
  ...GRATUITOS.map((g) => [g.arquivo, g.titulo]),
  ...APOSTILAS.filter((a) => a.arquivo).map((a) => [a.arquivo!, a.titulo]),
]);
const nomeDetalhe = (e: string, k: string) => {
  if (e === "loja") { const [slug, loja] = k.split("/"); const p = LOJA.find((x) => x.slug === slug); return `${p?.nome || slug}${loja ? ` · ${loja === "ml" || loja === "mercadolivre" ? "Mercado Livre" : loja[0].toUpperCase() + loja.slice(1)}` : ""}`; }
  if (NOMES[k]) return NOMES[k];
  if (k.endsWith(".pdf")) { const s = k.split("/").pop()!.replace(".pdf", ""); return NOMES[s] || s.replace(/-/g, " "); }
  if (e === "visita") return k === "/" ? "Página inicial" : k;
  return k;
};
const nomeOrigem = (o: string) => ({ direto: "Direto / sem origem", "meta-organico": "Instagram/Facebook (orgânico)", meta: "Anúncios Meta", google: "Google (busca)", "google-ads": "Google Ads", whatsapp: "WhatsApp", instagram: "Instagram (link com UTM)" } as Record<string, string>)[o] || o;

function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Gráfico de barras por dia (ou por semana em períodos longos), com tooltip ao passar o mouse ou tocar. */
function Barras({ valores, datas, nome, semanal }: { valores: number[]; datas: string[]; nome: string; semanal: boolean }) {
  const [ref, w] = useLargura<HTMLDivElement>();
  const [hov, setHov] = useState<number | null>(null);
  const H = 240, padL = 40, padB = 26, padT = 12;
  const max = Math.max(1, ...valores);
  const passo = Math.pow(10, Math.floor(Math.log10(max)));
  const topo = [1, 2, 2.5, 5, 10].map((m) => m * passo).find((v) => v >= max) || max;
  const ticks = [0, topo / 2, topo];
  const n = valores.length, iw = Math.max(10, w - padL - 4), bw = iw / n, gap = Math.min(2, bw * .25);
  const y = (v: number) => padT + (H - padT - padB) * (1 - v / topo);
  const onMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const i = Math.floor((ev.clientX - r.left - padL) / bw);
    setHov(i >= 0 && i < n ? i : null);
  };
  const rotulo = (i: number) => (semanal ? `semana de ${ddmm(datas[i])}` : new Date(datas[i] + "T12:00:00Z").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" }));
  const marcas = n <= 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];
  return (
    <div className="pn-chart" ref={ref}>
      <svg width={w} height={H} onPointerMove={onMove} onPointerLeave={() => setHov(null)} role="img" aria-label={`${nome} por ${semanal ? "semana" : "dia"}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={w} y1={y(t)} y2={y(t)} className="pn-grid" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="pn-ax">{fmt(Math.round(t))}</text>
          </g>
        ))}
        {valores.map((v, i) => {
          const x = padL + i * bw + gap / 2, bh = Math.max(v > 0 ? 2 : 0, y(0) - y(v)), ww = Math.max(1, bw - gap), r = Math.min(4, ww / 2, bh);
          return v > 0 ? (
            <path key={i} className={`pn-bar${hov === i ? " on" : ""}`}
              d={`M${x},${y(0)} V${y(0) - bh + r} Q${x},${y(0) - bh} ${x + r},${y(0) - bh} H${x + ww - r} Q${x + ww},${y(0) - bh} ${x + ww},${y(0) - bh + r} V${y(0)} Z`} />
          ) : null;
        })}
        {marcas.map((i) => <text key={i} x={padL + i * bw + bw / 2} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="pn-ax">{ddmm(datas[i])}</text>)}
        {hov !== null && <line x1={padL + hov * bw + bw / 2} x2={padL + hov * bw + bw / 2} y1={padT} y2={y(0)} className="pn-cross" />}
      </svg>
      {hov !== null && (
        <div className="pn-tip" style={{ left: Math.min(Math.max(padL + hov * bw + bw / 2, 70), w - 70), top: Math.max(0, y(valores[hov]) - 58) }}>
          <b>{fmt(valores[hov])}</b> {nome.toLowerCase()}<br /><span>{rotulo(hov)}</span>
        </div>
      )}
    </div>
  );
}

function Spark({ v }: { v: number[] }) {
  const w = 120, h = 34, max = Math.max(1, ...v);
  const pts = v.map((x, i) => `${(i / Math.max(1, v.length - 1)) * w},${h - 3 - (x / max) * (h - 6)}`).join(" ");
  return <svg width={w} height={h} className="pn-spark" aria-hidden="true"><polyline points={pts} /></svg>;
}

function Ranking({ itens, total, vazio }: { itens: [string, number, string?][]; total?: number; vazio: string }) {
  if (!itens.length) return <p className="meta" style={{ margin: 0 }}>{vazio}</p>;
  const max = Math.max(...itens.map((i) => i[1]));
  return (
    <ol className="pn-rank">
      {itens.map(([nome, n, extra]) => (
        <li key={nome}>
          <div className="pn-rank-t"><span>{nome}</span><b>{fmt(n)}{extra ? <small> {extra}</small> : total ? <small> {pct(n, total)}</small> : null}</b></div>
          <div className="pn-track"><i style={{ width: `${(n / max) * 100}%` }} /></div>
        </li>
      ))}
    </ol>
  );
}

function Funil({ etapas }: { etapas: [string, number][] }) {
  const base = etapas[0][1];
  return (
    <ol className="pn-funil">
      {etapas.map(([nome, n], i) => (
        <li key={nome}>
          <div className="pn-rank-t"><span>{nome}</span><b>{fmt(n)} <small>{i === 0 ? "" : `${pct(n, etapas[i - 1][1])} da etapa anterior`}</small></b></div>
          <div className="pn-track big"><i style={{ width: `${base ? Math.max(n ? 1.5 : 0, (n / base) * 100) : 0}%` }} /></div>
        </li>
      ))}
    </ol>
  );
}

export default function Painel() {
  const { user, carregando } = useAtlas();
  const [dias, setDias] = useState(30);
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [metrica, setMetrica] = useState<string>("visita");
  const [hora, setHora] = useState("");
  const admin = !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL;

  const buscar = useCallback(async () => {
    if (!supabase || !admin) return;
    setBuscando(true);
    const { data, error } = await supabase.rpc("painel_dados", { p_dias: dias });
    setBuscando(false);
    if (error) { setErro(error.message); return; }
    setErro(""); setDados(data as Dados); setHora(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  }, [admin, dias]);
  useEffect(() => { void buscar(); }, [buscar]);
  // Atualiza sozinho a cada minuto enquanto a aba está aberta, e na hora em que você volta para ela.
  useEffect(() => {
    const vis = () => { if (document.visibilityState === "visible") void buscar(); };
    const id = window.setInterval(vis, 60_000);
    document.addEventListener("visibilitychange", vis);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", vis); };
  }, [buscar]);

  const calc = useMemo(() => {
    if (!dados) return null;
    const N = dados.dias, ini0 = addDias(dados.inicio, -N);
    const datas = Array.from({ length: 2 * N }, (_, i) => addDias(ini0, i));
    const idx = new Map(datas.map((d, i) => [d, i]));
    const serie: Record<string, number[]> = {};
    const add = (e: string, d: string, n: number) => { const i = idx.get(d); if (i === undefined) return; (serie[e] ||= Array(2 * N).fill(0))[i] += n; };
    dados.serie.forEach((l) => add(l.e, l.d, l.n));
    dados.contas.por_dia.forEach((l) => add("cadastros", l.d, l.n));
    const de = (e: string) => serie[e] || Array(2 * N).fill(0);
    const atual = (e: string) => de(e).slice(N), antes = (e: string) => de(e).slice(0, N);
    const tot = (e: string) => soma(atual(e));
    const det = (e: string) => dados.detalhes.filter((x) => x.e === e).map((x) => [nomeDetalhe(e, x.k), x.n] as [string, number]);
    const juntar = (l: [string, number][]) => { const m = new Map<string, number>(); l.forEach(([k, n]) => m.set(k, (m.get(k) || 0) + n)); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
    // origens
    const ori = new Map<string, Record<string, number>>();
    dados.origens.forEach((x) => { const o = ori.get(x.o) || {}; o[x.e] = (o[x.e] || 0) + x.n; ori.set(x.o, o); });
    const origens = [...ori.entries()].map(([o, v]) => ({ o, v })).sort((a, b) => (b.v.visita || 0) - (a.v.visita || 0) || soma(Object.values(b.v)) - soma(Object.values(a.v)));
    // apostilas: vistas x cliques em comprar
    const vistas = new Map(dados.detalhes.filter((x) => x.e === "viu_apostila").map((x) => [x.k, x.n]));
    const compras = new Map(dados.detalhes.filter((x) => x.e === "comprar").map((x) => [x.k, x.n]));
    const slugs = [...new Set([...vistas.keys(), ...compras.keys()])].filter((s) => APOSTILAS.some((a) => a.slug === s) || KITS.some((k) => k.slug === s));
    const apostilas = slugs.map((s) => ({ s, nome: NOMES[s] || s, v: vistas.get(s) || 0, c: compras.get(s) || 0 })).sort((a, b) => b.c - a.c || b.v - a.v);
    const gratisVistos = [...vistas.entries()].filter(([s]) => GRATUITOS.some((g) => g.slug === s)).map(([s, n]) => [NOMES[s] || s, n] as [string, number]).sort((a, b) => b[1] - a[1]);
    return { N, datas, atual, antes, tot, det, juntar, origens, apostilas, gratisVistos };
  }, [dados]);

  if (carregando) return <div className="wrap pn"><p className="status">Carregando…</p></div>;
  if (!user) return <div className="wrap pn"><h1>Painel do Atlas</h1><p>Área restrita. <Link href="/entrar?volta=/painel">Entrar</Link></p></div>;
  if (!admin) return <div className="wrap pn"><h1>Painel do Atlas</h1><p>Esta área é só da administradora do site.</p></div>;

  const semFuncao = /painel_dados|function/i.test(erro);
  const m = METRICAS.find((x) => x.k === metrica)!;
  let valores: number[] = [], datas: string[] = [], semanal = false;
  if (calc) {
    valores = calc.atual(metrica); datas = calc.datas.slice(calc.N);
    if (calc.N > 90) { semanal = true; const v: number[] = [], d: string[] = []; for (let i = valores.length; i > 0; i -= 7) { const a = Math.max(0, i - 7); v.unshift(soma(valores.slice(a, i))); d.unshift(datas[a]); } valores = v; datas = d; }
  }
  const pend = (r: Record<string, number> | undefined) => (r?.novo || 0);

  return (
    <div className="wrap pn">
      <header className="pn-head">
        <div>
          <p className="eyebrow-i" style={{ margin: 0 }}>Só você vê esta página</p>
          <h1>Painel do Atlas</h1>
          {dados && <p className="meta" style={{ margin: 0 }}>{ddmm(dados.inicio)} a {ddmm(dados.hoje)} · atualizado às {hora} · atualiza sozinho a cada minuto</p>}
        </div>
        <div className="pn-ctrl">
          <div className="seg" role="group" aria-label="Período">
            {PERIODOS.map(([d, r]) => <button key={d} type="button" aria-pressed={dias === d} onClick={() => setDias(d)}>{r}</button>)}
          </div>
          <button type="button" className="btn small ghost" onClick={() => void buscar()} disabled={buscando}>{buscando ? "Atualizando…" : "Atualizar"}</button>
        </div>
      </header>

      {erro && (semFuncao ? (
        <div className="card warn-card">
          <h3 style={{ margin: 0 }}>Falta um passo no Supabase</h3>
          <p style={{ margin: 0 }}>O painel lê os números por uma função protegida que ainda não existe no banco. No Supabase, abra <b>SQL Editor › New query</b>, cole o conteúdo do arquivo <code>supabase/painel.sql</code> do projeto e clique em <b>Run</b>. Depois, clique em Atualizar aqui.</p>
          <p className="meta" style={{ margin: 0 }}>Detalhe técnico: {erro}</p>
        </div>
      ) : <p className="warn">{erro}</p>)}

      {calc && dados && (
        <>
          <section className="pn-hoje" aria-label="Hoje">
            <span className="pn-hoje-t">Hoje</span>
            {([["visita", "visitas"], ["cadastros", "cadastros"], ["baixou", "downloads"], ["comprar", "cliques em Comprar"], ["diag_fim", "diagnósticos"]] as [string, string][]).map(([k, nome]) => {
              const v = calc.atual(k), h = v[v.length - 1] || 0, o = v[v.length - 2] || 0;
              return <span key={k} className="pn-hoje-i"><b>{fmt(h)}</b> {nome}<small>{o ? ` · ontem ${fmt(o)}` : ""}</small></span>;
            })}
          </section>

          <section className="pn-kpis" aria-label="Resumo do período">
            {METRICAS.map((x) => {
              const a = calc.tot(x.k), b = soma(calc.antes(x.k)); const d = b ? Math.round(((a - b) / b) * 100) : null;
              return (
                <button key={x.k} type="button" className={`pn-kpi${metrica === x.k ? " on" : ""}`} onClick={() => setMetrica(x.k)} aria-pressed={metrica === x.k}>
                  <span className="pn-kpi-n">{x.nome}</span>
                  <b>{fmt(a)}</b>
                  <span className="pn-kpi-d">{d === null ? (a ? "novo no período" : "sem dados ainda") : `${d >= 0 ? "▲" : "▼"} ${Math.abs(d)}% vs. ${calc.N} dias antes`}</span>
                  <Spark v={calc.atual(x.k)} />
                </button>
              );
            })}
          </section>

          <section className="card pn-main">
            <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
              <h2>{m.nome} por {semanal ? "semana" : "dia"}</h2>
              <span className="meta">{m.ajuda} · total {fmt(soma(valores))}</span>
            </div>
            <Barras valores={valores} datas={datas} nome={m.nome} semanal={semanal} />
          </section>

          <section className="pn-grid2">
            <div className="card">
              <h3 style={{ margin: 0 }}>Da visita à compra</h3>
              <Funil etapas={[["Visitas", calc.tot("visita")], ["Viram uma apostila ou kit", calc.tot("viu_apostila")], ["Clicaram em Comprar", calc.tot("comprar")]]} />
              <p className="meta" style={{ margin: 0 }}>As vendas em si ficam na Kiwify; aqui é o clique que leva até lá.</p>
            </div>
            <div className="card">
              <h3 style={{ margin: 0 }}>Da visita ao cadastro</h3>
              <Funil etapas={[["Visitas", calc.tot("visita")], ["Começaram o diagnóstico", calc.tot("diag_inicio")], ["Concluíram o diagnóstico", calc.tot("diag_fim")], ["Criaram conta", calc.tot("cadastros")]]} />
            </div>
          </section>

          <section className="card">
            <h3 style={{ margin: 0 }}>De onde vêm as pessoas</h3>
            {calc.origens.length ? (
              <div className="pn-table-wrap">
                <table className="pn-table">
                  <thead><tr><th>Origem</th><th>Visitas</th><th>Cadastros</th><th>Downloads</th><th>Comprar</th><th>Cadastro / visita</th></tr></thead>
                  <tbody>
                    {calc.origens.slice(0, 12).map(({ o, v }) => {
                      const maxV = Math.max(1, ...calc.origens.map((x) => x.v.visita || 0));
                      return (
                        <tr key={o}>
                          <td><span className="pn-ori">{nomeOrigem(o)}</span><span className="pn-track sm"><i style={{ width: `${((v.visita || 0) / maxV) * 100}%` }} /></span></td>
                          <td>{fmt(v.visita || 0)}</td><td>{fmt(v.cadastro || 0)}</td><td>{fmt(v.baixou || 0)}</td><td>{fmt(v.comprar || 0)}</td><td>{pct(v.cadastro || 0, v.visita || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : <p className="meta" style={{ margin: 0 }}>Ainda sem visitas no período.</p>}
            <p className="meta" style={{ margin: 0 }}>Links com <code>?utm_source=instagram</code> aparecem separados. A origem é lembrada por 30 dias, então o cadastro feito depois ainda conta para quem trouxe a pessoa.</p>
          </section>

          <section className="pn-grid2">
            <div className="card">
              <h3 style={{ margin: 0 }}>Apostilas e kits pagos</h3>
              {calc.apostilas.length ? (
                <div className="pn-table-wrap">
                  <table className="pn-table">
                    <thead><tr><th>Produto</th><th>Vistas</th><th>Comprar</th><th>Taxa</th></tr></thead>
                    <tbody>{calc.apostilas.slice(0, 12).map((a) => <tr key={a.s}><td>{a.nome}</td><td>{fmt(a.v)}</td><td>{fmt(a.c)}</td><td>{pct(a.c, a.v)}</td></tr>)}</tbody>
                  </table>
                </div>
              ) : <p className="meta" style={{ margin: 0 }}>Nenhuma apostila vista no período.</p>}
            </div>
            <div className="card">
              <h3 style={{ margin: 0 }}>Materiais mais baixados</h3>
              <Ranking itens={calc.juntar(calc.det("baixou")).slice(0, 8)} total={calc.tot("baixou")} vazio="Nenhum download no período." />
            </div>
          </section>

          <section className="pn-grid3">
            <div className="card">
              <h3 style={{ margin: 0 }}>Páginas de entrada</h3>
              <Ranking itens={calc.juntar(calc.det("visita")).slice(0, 8)} total={calc.tot("visita")} vazio="Sem visitas no período." />
            </div>
            <div className="card">
              <h3 style={{ margin: 0 }}>Gratuitos mais vistos</h3>
              <Ranking itens={calc.gratisVistos.slice(0, 8)} vazio="Nenhum gratuito visto no período." />
            </div>
            <div className="card">
              <h3 style={{ margin: 0 }}>Cliques na Loja</h3>
              <Ranking itens={calc.juntar(calc.det("loja")).slice(0, 8)} vazio="Nenhum clique na Loja no período." />
            </div>
          </section>

          <section className="card">
            <h3 style={{ margin: 0 }}>Famílias usando o Atlas</h3>
            <div className="pn-uso">
              <div><b>{fmt(dados.contas.total)}</b><span>contas no total</span></div>
              <div><b>{fmt(dados.contas.entraram)}</b><span>já entraram pelo link</span></div>
              <div><b>{fmt(dados.contas.com_crianca)}</b><span>cadastraram criança</span></div>
              <div><b>{fmt(dados.contas.ativas7)}</b><span>ativas nos últimos 7 dias</span></div>
              <div><b>{fmt(dados.contas.ativas30)}</b><span>ativas nos últimos 30 dias</span></div>
              <div><b>{fmt(dados.uso.criancas)}</b><span>crianças cadastradas</span></div>
              <div><b>{fmt(dados.uso.temas_periodo)}</b><span>temas concluídos no período ({fmt(dados.uso.temas)} no total)</span></div>
              <div><b>{fmt(dados.uso.andamento)}</b><span>temas em andamento</span></div>
              <div><b>{fmt(dados.uso.livros)}</b><span>livros marcados como lidos</span></div>
              <div><b>{fmt(dados.uso.registros_periodo)}</b><span>registros no diário no período</span></div>
              <div><b>{fmt(Math.round(dados.uso.minutos_periodo / 60))} h</b><span>de estudo registradas no período</span></div>
              <div><b>{fmt(dados.uso.planos_ativos)}</b><span>planos de estudo ativos</span></div>
            </div>
            <p className="meta" style={{ margin: 0 }}>Ativa = registrou algo no diário ou marcou um tema no período.</p>
          </section>

          <section className="pn-grid2">
            <Link href="/planejamento/pedidos" className="card pn-pend">
              <span className="pn-kpi-n">Pedidos de planejamento</span>
              <b>{fmt(pend(dados.pedidos.planejamento))} {pend(dados.pedidos.planejamento) === 1 ? "novo" : "novos"}</b>
              <span className="meta">{fmt(soma(Object.values(dados.pedidos.planejamento)))} no total · abrir a lista →</span>
            </Link>
            <div className="card pn-pend">
              <span className="pn-kpi-n">Pedidos de apostila sob medida</span>
              <b>{fmt(pend(dados.pedidos.apostila))} {pend(dados.pedidos.apostila) === 1 ? "novo" : "novos"}</b>
              <span className="meta">{fmt(soma(Object.values(dados.pedidos.apostila)))} no total · chegam também por e-mail</span>
            </div>
            <DicasCard />
          </section>

          <p className="meta pn-nota">Contagem anônima, sem cookies, desde {dados.desde ? new Date(dados.desde + "T12:00:00Z").toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—"}. Visita conta 1 vez por sessão; downloads e cliques contam cada clique. Vendas e faturamento ficam na Kiwify.</p>
        </>
      )}
    </div>
  );
}
