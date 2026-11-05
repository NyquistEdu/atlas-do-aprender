"use client";

import { useEffect, useState } from "react";
import { DIAS_NOME, DS, JUNTOS, MAT_INFO, ddmm, deISO, diaSemana, fimDoPlano, infoTema, itensDoDia, somaDias, type Item, type Plano } from "@/lib/plano";
import { CHAVE_IMPRIMIR } from "@/lib/imprimir";


const CORES = ["#1f6f78", "#c4672a", "#3d7a3a", "#9a3f7a", "#2f5aa8"];
const COR_JUNTOS = "#6b4fa0";
const NOITE = new Set(["📺", "🎬"]);

type Quem = { nome: string; letra: string; cor: string };

function quemDe(p: Plano): Quem[] {
  const letras = new Set<string>();
  return p.criancas.map((c, i) => {
    let l = c.nome.trim()[0]?.toUpperCase() || "?";
    if (letras.has(l)) l = c.nome.trim().slice(0, 2);
    letras.add(l);
    return { nome: c.nome, letra: l, cor: CORES[i % CORES.length] };
  });
}

const nomes = (p: Plano) => { const n = p.criancas.map((c) => c.nome); return n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}` : n[0] || ""; };

/** Rótulo curto de um item para a legenda. */
function rotulo(it: Item): string {
  for (const m of ["por", "mat", "cie"] as const) if (it.icone === MAT_INFO[m][1]) return MAT_INFO[m][0];
  if (it.icone === "📺") return "Episódios";
  if (it.icone === "🎬") return "Filme";
  if (it.icone === "🧪") return "Mão na massa";
  if (it.icone === "🎲") return "Jogo";
  return it.texto.split(/[:·(]/)[0].replace(/^(Apostila|Trilha)\s+/, "").trim().slice(0, 22);
}

/** Texto curto do item no quadro da semana. */
const curto = (it: Item) => it.texto.replace(/^(Apostila|Trilha):?\s+/, "").replace(/^À noite:\s*/, "");

export default function Imprimir() {
  const [p, setP] = useState<Plano | null>(null);
  const [folha, setFolha] = useState<"semana" | "marcar">("semana");
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("folha");
    setFolha(f === "marcar" ? "marcar" : "semana");
    try { const v = localStorage.getItem(CHAVE_IMPRIMIR); if (v) setP(JSON.parse(v)); else setErro(true); } catch { setErro(true); }
  }, []);
  useEffect(() => {
    if (!p) return;
    document.title = `${folha === "semana" ? "A semana" : "O que fizemos"} · ${nomes(p)}`;
    const t = setTimeout(() => { (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => window.print()); }, 600);
    return () => clearTimeout(t);
  }, [p, folha]);

  if (erro) return <div className="wrap"><p>Não achei o plano para imprimir. Volte à ficha ou ao Meu Plano e clique de novo no botão do PDF.</p></div>;
  if (!p) return <div className="wrap"><p className="meta">Preparando…</p></div>;

  return (
    <div className="imp">
      <div className="imp-barra">
        <span>Na janela de impressão, escolha <b>Salvar como PDF</b>, papel <b>A4</b> e orientação <b>paisagem</b>.</span>
        <button className="btn small" type="button" onClick={() => window.print()}>Imprimir ou salvar PDF</button>
      </div>
      {folha === "semana" ? <Semana p={p} /> : <Marcar p={p} />}
    </div>
  );
}

function Legenda({ p, its }: { p: Plano; its: Item[] }) {
  const q = quemDe(p);
  const vistos = new Map<string, string>();
  for (const it of its) if (!vistos.has(it.icone)) vistos.set(it.icone, rotulo(it));
  return (
    <div className="imp-leg">
      {q.map((x) => <span key={x.nome}><b className="imp-w" style={{ background: x.cor }}>{x.letra}</b>{x.nome}</span>)}
      {its.some((i) => i.quem === JUNTOS) && <span><b className="imp-w" style={{ background: COR_JUNTOS }}>★</b>Juntos</span>}
      {[...vistos].map(([ic, l]) => <span key={ic}><span className="imp-em">{ic}</span>{l}</span>)}
    </div>
  );
}

function Selo({ quem, q }: { quem: string; q: Quem[] }) {
  const x = q.find((y) => y.nome === quem);
  return <b className="imp-w" style={{ background: x ? x.cor : COR_JUNTOS }}>{x ? x.letra : "★"}</b>;
}

// ------------------------------------------------------------------ A SEMANA
function Semana({ p }: { p: Plano }) {
  const q = quemDe(p);
  const fim = fimDoPlano(p);
  // um dia de cada dia da semana, a partir do início do plano
  const dias = Array.from({ length: 7 }, (_, k) => somaDias(p.inicio, k)).sort((a, b) => diaSemana(a) - diaSemana(b));
  const itens = dias.map((d) => itensDoDia(p, d).filter((it) => !it.destaque));
  const ate = (it: Item) => {
    const e = (p.extras || []).find((x) => x.texto === it.texto && x.quem === it.quem);
    return e?.ate && e.ate < fim ? ` (até ${ddmm(e.ate)})` : "";
  };
  const eventos = (p.eventos || []).slice().sort((a, b) => a.data.localeCompare(b.data));
  const grupos = [...p.criancas.map((c, i) => ({ nome: c.nome, cor: q[i].cor, temas: c.temas })), ...(p.juntos?.length ? [{ nome: "★ Juntos", cor: COR_JUNTOS, temas: p.juntos }] : [])];
  return (
    <section className="imp-folha">
      <header className="imp-cab">
        <div>
          <h1>A semana de {nomes(p)}</h1>
          <p>Cada um faz a apostila do dia no seu ritmo, em blocos de 15 a 20 minutos. {ddmm(p.inicio)} a {ddmm(fim)}.{eventos.length > 0 && <b> {eventos.slice(0, 2).map((e) => `${e.texto.split(/[:(]/)[0].trim()}: ${DIAS_NOME[diaSemana(e.data)].toLowerCase()}, ${ddmm(e.data)}`).join(" · ")}.</b>}</p>
        </div>
        <Legenda p={p} its={itens.flat()} />
      </header>
      <div className="imp-semana">
        {dias.map((d, k) => {
          const wd = diaSemana(d);
          const leitura = itens[k].filter((it) => /^leitura da noite/i.test(it.texto));
          const resto = itens[k].filter((it) => !NOITE.has(it.icone) && !/^leitura da noite/i.test(it.texto));
          // mesma atividade para todas as crianças (ex.: "Olimpíada: livro de cada um") vira uma linha só
          const prefixo = (it: Item) => `${it.icone}|${it.texto.split(":")[0].trim()}`;
          const dia: Item[] = [];
          for (const it of resto) {
            if (it.quem === JUNTOS || !it.texto.includes(":") || p.criancas.length < 2) { dia.push(it); continue; }
            const iguais = resto.filter((x) => x.quem !== JUNTOS && prefixo(x) === prefixo(it));
            if (new Set(iguais.map((x) => x.quem)).size < p.criancas.length) { dia.push(it); continue; }
            if (iguais[0] === it) dia.push({ ...it, quem: JUNTOS, texto: `${it.texto.split(":")[0].trim()}: cada um o seu${ate(it)}` });
          }
          const noite = itens[k].filter((it) => NOITE.has(it.icone));
          return (
            <div key={d} className={`imp-dia${wd >= 5 ? " fds" : ""}${dia.length > 5 ? " dens" : ""}`}>
              <h3>{DIAS_NOME[wd]}</h3>
              {dia.map((it, j) => <div key={j} className="imp-it"><Selo quem={it.quem} q={q} /><span className="imp-em">{it.icone}</span><span>{curto(it)}<i>{ate(it)}</i></span></div>)}
              {noite.map((it, j) => <div key={"n" + j} className="imp-noite"><span className="imp-em">{it.icone}</span><span><i>À noite:</i> {curto(it)}</span></div>)}
              {leitura.length > 0 && <div className="imp-lt"><span className="imp-em">📚</span> Leitura da noite{(() => { const t = leitura.map((x) => x.texto.split(":")[1]?.trim()).filter(Boolean); return t.length ? `: ${[...new Set(t)].join(" · ")}` : ""; })()}<i>{ate(leitura[0])}</i></div>}
            </div>
          );
        })}
      </div>
      <div className="imp-base" style={{ gridTemplateColumns: `repeat(${grupos.length}, 1fr)` }}>
        {grupos.map((g) => (
          <div key={g.nome} className="imp-grp">
            <h4 style={{ color: g.cor }}>{g.nome}</h4>
            {g.temas.map((t, j) => {
              const i = infoTema(t);
              return (
                <div key={j} className="imp-liv">
                  {i.apostila ? <img src={`/apostilas/${i.apostila.slug}/capa.webp`} alt="" /> : <span className="imp-capa">{MAT_INFO[t.materia][1]}</span>}
                  <div><b>{i.apostila ? i.apostila.titulo : i.tema?.t}</b><span>{MAT_INFO[t.materia][0]}</span></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <footer className="imp-rod"><span><b>Pouco e todo dia</b> · pare antes do cansaço</span><span>Atlas do Aprender · © Stephanie Kamarry</span></footer>
    </section>
  );
}

// ------------------------------------------------------------------ O QUE FIZEMOS
function Marcar({ p }: { p: Plano }) {
  const q = quemDe(p);
  const fim = fimDoPlano(p);
  const seg0 = somaDias(p.inicio, -diaSemana(p.inicio));
  const total = Math.round((deISO(fim).getTime() - deISO(seg0).getTime()) / 86400000) + 1;
  const semanas = Math.ceil(total / 7);
  const cel = Array.from({ length: semanas * 7 }, (_, k) => somaDias(seg0, k));
  const sobra = semanas * 7 - total; // células depois do fim, na última semana
  const todos: Item[] = [];
  const mes = (s: string) => deISO(s).toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
  return (
    <section className="imp-folha">
      <header className="imp-cab">
        <div>
          <h1>O que fizemos · {nomes(p)}</h1>
          <p>{mes(p.inicio)} a {mes(fim)} · marque cada quadradinho quando a atividade for feita</p>
        </div>
        <Legenda p={p} its={(() => { for (let k = 0; k < 7; k++) todos.push(...itensDoDia(p, somaDias(p.inicio, k))); return todos.filter((i) => !i.destaque); })()} />
      </header>
      <div className="imp-dh">{DS.map((d) => <span key={d}>{d}</span>)}</div>
      <div className="imp-cal" style={{ gridTemplateRows: `repeat(${semanas}, 1fr)` }}>
        {cel.map((d, k) => {
          if (d < p.inicio) return <div key={d} className="imp-c off" />;
          if (d > fim) {
            if (sobra < 3) return <div key={d} className="imp-c off" />;
            return k === cel.length - sobra ? <div key="notas" className="imp-c notas" style={{ gridColumn: `span ${sobra}` }}><b>Anotações</b><i /><i /><i /></div> : null;
          }
          const wd = diaSemana(d);
          const its = itensDoDia(p, d);
          const ev = its.filter((i) => i.destaque);
          const linhas = [...q.map((x) => ({ quem: x.nome, its: its.filter((i) => i.quem === x.nome && !i.destaque) })), { quem: JUNTOS, its: its.filter((i) => i.quem === JUNTOS && !i.destaque) }].filter((l) => l.its.length);
          return (
            <div key={d} className={`imp-c${wd >= 5 ? " fds" : ""}${ev.length ? " ev" : ""}`}>
              <div className="imp-h"><b>{ddmm(d)}</b><span>{DS[wd]}</span></div>
              {ev.map((e, j) => <div key={j} className="imp-pv"><span className="imp-em">{e.icone}</span> {e.texto.split(/[:(]/)[0].trim()}</div>)}
              {linhas.map((l) => (
                <div key={l.quem} className="imp-f"><Selo quem={l.quem} q={q} />{l.its.map((i, j) => <span key={j} className="imp-b" style={{ ["--c" as string]: q.find((x) => x.nome === l.quem)?.cor || COR_JUNTOS }}><i /><span className="imp-em">{i.icone}</span></span>)}</div>
              ))}
            </div>
          );
        })}
      </div>
      <footer className="imp-rod"><span>Não precisa marcar tudo: o que importa é o ritmo. Dias com quadradinhos vazios também fazem parte.</span><span>Atlas do Aprender · © Stephanie Kamarry</span></footer>
    </section>
  );
}

