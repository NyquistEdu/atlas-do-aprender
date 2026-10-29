"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { ANOS, SLUG, TRILHAS, anoSlug, temaId, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import { temasDe, type Plano } from "@/lib/plano";

const MATS: [Materia, string][] = [["por", "Português"], ["mat", "Matemática"], ["cie", "Ciências"]];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const ddmm = (d: string) => (d ? d.slice(8, 10) + "/" + d.slice(5, 7) : "");
const linkTema = (m: Materia, ano: string, i: number) => `/trilhas/${SLUG[m]}/${anoSlug(ano)}#tema-${i + 1}`;

type Info = { m: Materia; ano: string; i: number; id: string; nome: string; status: "feito" | "andamento" | "nada"; concluido: string; comecou: string; registros: number };

/**
 * O caminho de cada criança nas trilhas: mapa dos temas (concluídos, em andamento, a fazer),
 * o que está sendo trabalhado agora e uma linha do tempo com o que começou e terminou em cada mês.
 * "Em andamento" vem de: marcado no tema ("Estamos trabalhando neste tema"), estar no plano de estudos ativo
 * ou ter registro "Estudo da trilha" no diário com o nome do tema.
 */
export default function Caminho() {
  const a = useAtlas();
  const [quem, setQuem] = useState("");
  const [plano, setPlano] = useState<Plano | null>(null);
  const c = quem && a.criancas.includes(quem) ? quem : a.crianca;

  useEffect(() => {
    if (!supabase || !a.user) return;
    supabase.from("planos").select("dados").eq("ativo", true).order("criado_em", { ascending: false }).limit(1)
      .then(({ data }) => setPlano((data?.[0]?.dados as Plano) || null), () => {});
  }, [a.user]);

  const temas = useMemo<Info[]>(() => {
    if (!c) return [];
    const doPlano = new Set(plano ? temasDe(plano, c).map(({ t }) => temaId(t.materia, t.ano, t.tema - 1)) : []);
    const regs = a.entradas.filter((e) => (e.crianca === c || e.crianca === "Todos juntos") && e.tipo === "Estudo da trilha");
    const out: Info[] = [];
    for (const [m] of MATS) {
      for (const [ano] of ANOS) {
        (TRILHAS[m][ano] || []).forEach((t, i) => {
          const id = temaId(m, ano, i);
          const concluido = a.dataDe(id, c);
          const marcado = a.dataDe("andamento|" + id, c);
          const rs = regs.filter((e) => e.area === m && e.titulo.trim().toLowerCase() === t.t.trim().toLowerCase());
          const datas = [marcado, doPlano.has(id) && plano ? plano.inicio : "", ...rs.map((e) => e.data)].filter(Boolean).sort();
          const status = concluido ? "feito" : marcado || doPlano.has(id) || rs.length ? "andamento" : "nada";
          out.push({ m, ano, i, id, nome: t.t, status, concluido, comecou: datas[0] || "", registros: rs.length });
        });
      }
    }
    return out;
  }, [c, plano, a]);

  if (!a.user || !c) return null;

  const agora = temas.filter((t) => t.status === "andamento");
  const feitos = temas.filter((t) => t.status === "feito");
  // Próximo passo: em cada matéria sem tema em andamento, o primeiro tema depois do último concluído.
  const proximos = MATS.map(([m]) => {
    if (agora.some((t) => t.m === m)) return null;
    const lista = temas.filter((t) => t.m === m);
    const ult = lista.map((t, k) => (t.status === "feito" ? k : -1)).reduce((x, y) => Math.max(x, y), -1);
    if (ult < 0) return null;
    return lista.slice(ult + 1).find((t) => t.status === "nada") || null;
  }).filter(Boolean) as Info[];

  // Linha do tempo: começou e concluiu, agrupado por mês (mais recente primeiro).
  const eventos = [
    ...feitos.map((t) => ({ d: t.concluido, tipo: "concluiu" as const, t })),
    ...temas.filter((t) => t.comecou && t.status !== "nada").map((t) => ({ d: t.comecou, tipo: "comecou" as const, t })),
  ].sort((x, y) => (y.d + (y.tipo === "concluiu" ? "1" : "0")).localeCompare(x.d + (x.tipo === "concluiu" ? "1" : "0")));
  const meses: [string, typeof eventos][] = [];
  for (const ev of eventos) {
    const k = ev.d.slice(0, 7);
    if (!meses.length || meses[meses.length - 1][0] !== k) meses.push([k, []]);
    meses[meses.length - 1][1].push(ev);
  }

  return (
    <section className="caminho" aria-labelledby="caminho-t">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p className="eyebrow-i" style={{ margin: 0 }}>Linha do tempo</p>
          <h2 id="caminho-t" style={{ margin: 0 }}>O caminho de {c}</h2>
        </div>
        {a.criancas.length > 1 && (
          <div className="seg">{a.criancas.map((n) => <button key={n} type="button" aria-pressed={n === c} onClick={() => setQuem(n)}>{n}</button>)}</div>
        )}
      </div>

      <div className="stats">
        <div className="stat"><b>{feitos.length}</b><span>temas concluídos</span></div>
        <div className="stat"><b>{agora.length}</b><span>em andamento</span></div>
        {MATS.map(([m, nome]) => <div className="stat" key={m}><b>{feitos.filter((t) => t.m === m).length}</b><span>{nome}</span></div>)}
      </div>

      <div className="card">
        <h3 style={{ margin: 0 }}>Agora</h3>
        {agora.length ? (
          <div className="cam-agora">
            {agora.map((t) => (
              <article key={t.id} className="cam-card" style={{ ["--sc" as string]: `var(--${t.m})` }}>
                <span className="k">{MATS.find((x) => x[0] === t.m)![1]} · {anoNome(t.ano)} · tema {t.i + 1}</span>
                <b>{t.nome}</b>
                <span className="meta">{t.comecou ? `Começou em ${ddmm(t.comecou)}` : "Em andamento"}{t.registros ? ` · ${t.registros} ${t.registros === 1 ? "registro" : "registros"} no diário` : ""}</span>
                <div className="row">
                  <Link className="btn small ghost" href={linkTema(t.m, t.ano, t.i)}>Abrir o tema</Link>
                  <button className="btn small" type="button" onClick={() => a.alternar(t.id, c)}>Marcar como concluído</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="meta" style={{ margin: 0 }}>Nenhum tema em andamento. Na página de um tema, use <b>“Estamos trabalhando neste tema”</b> ou guarde um registro de “Estudo da trilha” no diário.</p>
        )}
        {proximos.length > 0 && (
          <p className="meta" style={{ margin: "6px 0 0" }}>Sugestão de próximo passo: {proximos.map((t, k) => (
            <span key={t.id}>{k > 0 && " · "}<Link href={linkTema(t.m, t.ano, t.i)}>{MATS.find((x) => x[0] === t.m)![1]}: {t.nome}</Link></span>
          ))}</p>
        )}
      </div>

      <div className="card">
        <h3 style={{ margin: 0 }}>Mapa das trilhas</h3>
        <p className="meta" style={{ margin: 0 }}><span className="cam-leg feito">✓</span> concluído <span className="cam-leg andamento">●</span> em andamento <span className="cam-leg">·</span> ainda não. Toque num tema para abrir.</p>
        <div className="cam-mapa">
          {MATS.map(([m, nome]) => (
            <div key={m} className="cam-mat" style={{ ["--sc" as string]: `var(--${m})` }}>
              <b>{nome}</b>
              {ANOS.map(([ano]) => (
                <div className="cam-linha" key={ano}>
                  <span className="cam-ano">{ano === "1" ? "Alf." : `${ano}º`}</span>
                  {temas.filter((t) => t.m === m && t.ano === ano).map((t) => (
                    <Link key={t.id} href={linkTema(m, ano, t.i)} className={`cam-tema ${t.status}`} title={`${anoNome(ano)}, tema ${t.i + 1}: ${t.nome}${t.concluido ? ` (concluído em ${ddmm(t.concluido)})` : t.status === "andamento" ? " (em andamento)" : ""}`}>
                      {t.status === "feito" ? "✓" : t.i + 1}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: 0 }}>Linha do tempo</h3>
        {meses.length ? (
          <div className="cam-tl">
            {meses.map(([k, evs]) => (
              <div key={k} className="cam-mes">
                <p className="cam-mes-t">{MESES[Number(k.slice(5, 7)) - 1]} de {k.slice(0, 4)}</p>
                <ul>
                  {evs.map((ev) => (
                    <li key={ev.tipo + ev.t.id} className={ev.tipo} style={{ ["--sc" as string]: `var(--${ev.t.m})` }}>
                      <span className="cam-dia">{ddmm(ev.d)}</span>
                      <span><b>{ev.tipo === "concluiu" ? "Concluiu" : "Começou"}</b> {MATS.find((x) => x[0] === ev.t.m)![1]} · {anoNome(ev.t.ano)} · <Link href={linkTema(ev.t.m, ev.t.ano, ev.t.i)}>{ev.t.nome}</Link></span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="meta" style={{ margin: 0 }}>A linha do tempo aparece quando você começa ou conclui temas nas trilhas.</p>
        )}
      </div>
    </section>
  );
}
