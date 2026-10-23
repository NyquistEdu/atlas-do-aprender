"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";
import {
  DIAS_NOME, JUNTOS, MAT_INFO, MARCA_PLANO, chaveTarefa, ddmm, diaSemana, fimDoPlano, infoTema, iso, itensDoDia, somaDias, temasDe,
  type Item, type Plano,
} from "@/lib/plano";
import { anoNome } from "@/lib/apostilas";

const CORES = ["#1f6f78", "#c4672a", "#a8456e", "#2a5db0"];
const COR_JUNTOS = "#6b4fa0";
const primeiro = (l?: string[]) => (l || []).map((x) => x.replace(/\s+—\s+.*$/, "")).find((x) => x.trim() && x.trim() !== "—");

export default function MeuPlano() {
  const a = useAtlas();
  const [plano, setPlano] = useState<Plano | null>(null);
  const [estado, setEstado] = useState<"carregando" | "ok" | "sem" | "erro">("carregando");
  const [dia, setDia] = useState(() => iso(new Date()));

  useEffect(() => {
    if (!supabase || !a.user) return;
    let vivo = true;
    supabase.from("planos").select("dados").eq("ativo", true).order("criado_em", { ascending: false }).limit(1)
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error) { setEstado("erro"); return; }
        const p = data?.[0]?.dados as Plano | undefined;
        if (!p) { setEstado("sem"); return; }
        setPlano(p); setEstado("ok");
        const hoje = iso(new Date());
        // fora do período, abre no primeiro ou no último dia do plano
        if (hoje < p.inicio) setDia(p.inicio); else if (hoje > fimDoPlano(p)) setDia(fimDoPlano(p));
      });
    return () => { vivo = false; };
  }, [a.user]);

  const cores = useMemo(() => {
    const m: Record<string, string> = { [JUNTOS]: COR_JUNTOS };
    plano?.criancas.forEach((c, i) => { m[c.nome] = CORES[i % CORES.length]; });
    return m;
  }, [plano]);

  if (!a.configurado) return <div className="wrap"><div className="empty">O acesso ainda não foi configurado neste site.</div></div>;
  if (a.carregando) return <div className="wrap"><p className="meta">Carregando…</p></div>;
  if (!a.user)
    return (
      <div className="wrap" style={{ maxWidth: 640 }}>
        <h1>Meu plano de estudos</h1>
        <p className="lead">Aqui fica o planejamento que você segue com cada criança: o que fazer hoje, a semana e os temas. Entre na sua conta para ver.</p>
        <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b></p>
        <FormAcesso volta="/meu-plano" origem="meu-plano" />
      </div>
    );
  if (estado === "carregando") return <div className="wrap"><p className="meta">Carregando o seu plano…</p></div>;
  if (estado === "erro") return <div className="wrap"><p className="warn">Não consegui carregar o plano. Recarregue a página.</p></div>;
  if (estado === "sem" || !plano)
    return (
      <div className="wrap" style={{ maxWidth: 680 }}>
        <h1>Meu plano de estudos</h1>
        <div className="card">
          <h3 style={{ margin: 0 }}>Você ainda não tem um plano aqui</h3>
          <p style={{ margin: 0 }}>Quando você faz o planejamento gratuito, o plano da sua família aparece nesta página: o que fazer em cada dia, com cada criança, e os temas com livros, filmes e jogos.</p>
          <div className="row"><Link className="btn" href="/planejamento">Quero meu planejamento gratuito</Link><Link className="btn ghost" href="/trilhas/portugues/1-ano">Ver as trilhas</Link></div>
        </div>
      </div>
    );

  const p = plano;
  const fim = fimDoPlano(p);
  const total = p.dias || 30;
  const hoje = iso(new Date());
  const nDia = Math.min(total, Math.max(1, Math.round((+new Date(dia) - +new Date(p.inicio)) / 864e5) + 1));
  const itens = itensDoDia(p, dia);
  const de = (quem: string) => itens.filter((i) => i.quem === quem);
  const proximos = (p.eventos || []).filter((e) => e.data >= hoje).sort((x, y) => x.data.localeCompare(y.data)).slice(0, 4);
  const nomeQuem = (q: string) => (q === JUNTOS ? "Juntos" : q);
  const nomes = p.criancas.map((c) => c.nome);

  /** Marca ou desmarca a tarefa para uma criança; ao marcar, já cria o registro no diário; ao desmarcar, apaga esse registro. */
  const marcar = async (it: Item, crianca: string) => {
    const chave = chaveTarefa(dia, it);
    const estava = a.feito(chave, crianca);
    await a.alternar(chave, crianca);
    if (estava) {
      const e = a.entradas.find((x) => x.crianca === crianca && x.data === dia && x.titulo === it.texto && x.o_que.startsWith(MARCA_PLANO));
      if (e) await a.removeEntrada(e.id);
    } else {
      await a.addEntrada({ data: dia, crianca, area: it.area, tipo: it.tipo, minutos: it.minutos, titulo: it.texto, o_que: MARCA_PLANO, descobertas: "", envolvimento: 4, proximo: "" });
    }
  };

  const Texto = ({ i }: { i: Item }) =>
    i.link ? (i.link.endsWith(".pdf") ? <a href={i.link} download>{i.texto}</a> : i.link.startsWith("http") ? <a href={i.link} target="_blank" rel="noopener noreferrer">{i.texto}</a> : <Link href={i.link}>{i.texto}</Link>) : <span>{i.texto}</span>;

  const Caixa = ({ i, crianca, rotulo }: { i: Item; crianca: string; rotulo?: string }) => {
    const ok = a.feito(chaveTarefa(dia, i), crianca);
    return (
      <button type="button" className={`pl-check${ok ? " ok" : ""}`} aria-pressed={ok} onClick={() => marcar(i, crianca)}
        aria-label={`${ok ? "Desmarcar" : "Marcar"} ${i.texto}${rotulo ? ` para ${crianca}` : ""}`} title={ok ? "Feito (registrado no diário). Clique para desmarcar." : "Marcar como feito e registrar no diário"}
        style={rotulo ? { ["--cc" as string]: cores[crianca] } : undefined}>
        {rotulo ? <span>{rotulo}</span> : ok ? "✓" : ""}
      </button>
    );
  };

  /** Quantas tarefas cada criança fez no dia (as dela + as de todos juntos). */
  const feitas = (c: string) => {
    const t = [...de(c), ...de(JUNTOS)];
    return [t.filter((i) => a.feito(chaveTarefa(dia, i), c)).length, t.length];
  };

  return (
    <div className="wrap">
      <p className="eyebrow-i">Meu plano de estudos</p>
      <h1 className="hero-t">{p.familia}</h1>
      <p className="lead">{ddmm(p.inicio)} a {ddmm(fim)}/{fim.slice(0, 4)} · {hoje < p.inicio ? "começa em breve" : hoje > fim ? "plano concluído" : `dia ${nDia} de ${total}`}</p>
      <div className="pl-barra" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.max(0, ((+new Date(hoje) - +new Date(p.inicio)) / 864e5 + 1) / total * 100))}%` }} /></div>
      {p.objetivo && <p className="note" style={{ margin: 0 }}><b>Objetivo:</b> {p.objetivo}</p>}

      <div className="pl-nav">
        <button className="btn small ghost" type="button" disabled={dia <= p.inicio} onClick={() => setDia(somaDias(dia, -1))} aria-label="Dia anterior">‹</button>
        <div className="pl-dia">
          <b>{dia === hoje ? "Hoje" : DIAS_NOME[diaSemana(dia)]}</b>
          <span>{dia === hoje ? `${DIAS_NOME[diaSemana(dia)]}, ` : ""}{ddmm(dia)}</span>
        </div>
        <button className="btn small ghost" type="button" disabled={dia >= fim} onClick={() => setDia(somaDias(dia, 1))} aria-label="Próximo dia">›</button>
        {dia !== hoje && hoje >= p.inicio && hoje <= fim && <button className="btn small ghost" type="button" onClick={() => setDia(hoje)}>Voltar para hoje</button>}
      </div>

      <div className="pl-grade">
        {[...p.criancas.map((c) => c.nome), JUNTOS].map((q) => {
          const lista = de(q);
          if (q === JUNTOS && !lista.length) return null;
          const [f, t] = q === JUNTOS ? [0, 0] : feitas(q);
          return (
            <section className="card pl-col" key={q} style={{ ["--sc" as string]: cores[q] }}>
              <h3><b className="pl-letra" style={{ background: cores[q] }}>{q === JUNTOS ? "★" : q[0]}</b>{nomeQuem(q)}
                {q !== JUNTOS && t > 0 && <span className="pl-conta">{f} de {t}</span>}</h3>
              {lista.length ? (
                <ul className="pl-itens">
                  {lista.map((i) => (
                    <li key={i.id} className={i.destaque ? "pl-destaque" : undefined}>
                      {q === JUNTOS
                        ? <span className="pl-caixas">{nomes.map((n) => <Caixa key={n} i={i} crianca={n} rotulo={n[0]} />)}</span>
                        : <Caixa i={i} crianca={q} />}
                      <span className="em" aria-hidden="true">{i.icone}</span>
                      <Texto i={i} />
                    </li>
                  ))}
                </ul>
              ) : <p className="meta" style={{ margin: 0 }}>Dia livre.</p>}
            </section>
          );
        })}
      </div>
      <p className="meta" style={{ margin: 0 }}>Marque cada tarefa feita: ela entra sozinha no <Link href="/diario">diário</Link>, onde você pode anotar o que a criança descobriu. Em “Juntos”, marque a letra de quem fez. Pouco e todo dia: o que não der hoje fica para amanhã.</p>

      {proximos.length > 0 && (
        <>
          <h3 className="sec-t">Próximas datas</h3>
          <ul className="pl-marcos">
            {proximos.map((e) => (
              <li key={e.data + e.texto}><b>{ddmm(e.data)}</b> <span className="em">{e.icone || "📌"}</span> {e.quem !== JUNTOS && <span className="tag" style={{ color: cores[e.quem] }}>{e.quem}</span>} {e.texto}</li>
            ))}
          </ul>
        </>
      )}

      <h3 className="sec-t">Os temas de cada um</h3>
      <div className="pl-temas">
        {p.criancas.map((c) => (
          <section key={c.nome}>
            <h4 style={{ color: cores[c.nome] }}>{c.nome}{c.ano ? <span className="meta"> · {c.ano}</span> : null}</h4>
            <div className="list">
              {temasDe(p, c.nome).map(({ t, juntos }) => {
                const i = infoTema(t);
                const livro = i.tema?.l?.[0]?.[0];
                const filme = primeiro(i.tema?.f);
                const jogo = primeiro(i.tema?.j);
                const mao = primeiro(i.tema?.p);
                return (
                  <article className="card pl-tema" key={`${c.nome}-${t.materia}-${t.ano}-${t.tema}`} style={{ ["--sc" as string]: `var(--${t.materia})` }}>
                    <p className="k">{MAT_INFO[t.materia][1]} {MAT_INFO[t.materia][0]} · {anoNome(t.ano)} · tema {t.tema}{juntos ? " · juntos" : ""}</p>
                    <h4>{i.tema?.t}</h4>
                    <div className="row">
                      {i.apostila && <Link className="btn small" href={`/apostilas/${i.apostila.slug}`}>Apostila {i.apostila.titulo}</Link>}
                      <Link className="btn small ghost" href={i.link}>Abrir o tema</Link>
                    </div>
                    <ul className="pl-portas">
                      {livro && <li>📚 {livro}</li>}
                      {filme && <li>🎬 {filme}</li>}
                      {jogo && <li>🎲 {jogo}</li>}
                      {mao && <li>🧪 {mao}</li>}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {p.como && <div className="feedback"><p className="feedback-t">Como vamos fazer</p><p>{p.como}</p></div>}
    </div>
  );
}
