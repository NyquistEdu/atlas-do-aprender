import type { Metadata } from "next";
import Link from "next/link";
import { desafioAtual } from "@/lib/desafios";
import { respostasPublicas, resumoDe } from "@/lib/perguntas";
import { participantes, ultimasConquistas, ultimasDicas } from "@/lib/comunidade";
import { todasFases } from "@/lib/fasesInfo";
import CartaoConquista from "@/components/CartaoConquista";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Comunidade: famílias que estudam juntas",
  description: "Desafio do mês, mural de conquistas das crianças, perguntas respondidas pela professora e dicas das famílias, tudo num só lugar.",
  alternates: { canonical: "/comunidade" },
};

export default async function Comunidade() {
  const d = desafioAtual();
  const [conqs, dicas, resps, n] = await Promise.all([ultimasConquistas(6), ultimasDicas(4), respostasPublicas(), participantes(d.id)]);
  const fases = todasFases();
  return (
    <div className="wrap largo">
      <p className="eyebrow-i">Comunidade do Atlas</p>
      <h1 className="hero-t">Famílias que aprendem juntas</h1>
      <p className="lead">Aqui as famílias trocam o que funcionou em casa, comemoram as conquistas das crianças, fazem o desafio do mês e tiram dúvidas comigo. Tudo com conta gratuita, e nada aparece sem passar pela minha leitura, para proteger as crianças.</p>

      <div className="com-portas">
        <Link href="/desafio" className="com-porta" style={{ ["--sc" as string]: "var(--cie)" }}><i aria-hidden="true">{d.emoji}</i><b>Desafio do mês</b><span>{d.titulo}{n ? ` · ${n} ${n === 1 ? "família" : "famílias"}` : ""}</span></Link>
        <Link href="/mural" className="com-porta" style={{ ["--sc" as string]: "var(--jog)" }}><i aria-hidden="true">🏆</i><b>Mural de conquistas</b><span>As vitórias das crianças, com 👏</span></Link>
        <Link href="/duvidas" className="com-porta" style={{ ["--sc" as string]: "var(--mat)" }}><i aria-hidden="true">💬</i><b>Pergunte à professora</b><span>Mande sua dúvida; eu respondo</span></Link>
        <Link href="/trilhas/portugues/1-ano" className="com-porta" style={{ ["--sc" as string]: "var(--por)" }}><i aria-hidden="true">💡</i><b>Dicas nas fases</b><span>Em cada fase do mapa, “Como foi aqui em casa”</span></Link>
      </div>

      <Link href="/desafio" className="ini-desafio">
        <span className="ini-desafio-em" aria-hidden="true">{d.emoji}</span>
        <span className="ini-desafio-t"><small>Desafio de {d.mes} · {d.prazo}</small><b>{d.titulo}</b><span>{d.resumo}</span></span>
        <span className="btn small">Participar →</span>
      </Link>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 className="ini-h"><span className="ini-kick">comemore junto</span><span className="marca">Últimas conquistas</span></h2>
        <Link href="/mural">Ver o mural →</Link>
      </div>
      {conqs.length ? (
        <div className="mural">{conqs.map((c) => <CartaoConquista key={c.id} c={c} fase={fases[c.tema]} />)}</div>
      ) : (
        <div className="card com-vazio"><p>O mural ainda está esperando a primeira conquista. Sua criança aprendeu algo novo esta semana? <Link href="/mural#compartilhar">Conte para todo mundo</Link>.</p></div>
      )}

      <div className="grid2 com-colunas">
        <section>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 className="ini-h"><span className="ini-kick">da professora</span><span className="marca">Perguntas respondidas</span></h2>
          </div>
          {resps.length ? (
            <div className="list">{resps.slice(0, 3).map((r) => <Link key={r.id} href={`/duvidas/r/${r.id}`} className="card duv"><b>{r.titulo}</b><span>{resumoDe(r.resposta, 120)}</span></Link>)}</div>
          ) : (
            <div className="card com-vazio"><p>Tem uma dúvida sobre leitura, matemática ou rotina de estudos? <Link href="/duvidas">Pergunte à professora</Link>.</p></div>
          )}
          <p style={{ margin: "10px 0 0" }}><Link href="/duvidas">Ver todas e perguntar →</Link></p>
        </section>
        <section>
          <h2 className="ini-h"><span className="ini-kick">funcionou aqui em casa</span><span className="marca">Dicas das famílias</span></h2>
          {dicas.length ? (
            <ul className="dicas-lista">{dicas.map((x) => {
              const f = fases[x.tema];
              return (
                <li key={x.id} className="dfam"><p>{x.texto}</p><span className="dfam-autor">{x.autor}{f ? <> · <Link href={f.href}>{f.emoji} {f.nome}</Link></> : null}</span></li>
              );
            })}</ul>
          ) : (
            <div className="card com-vazio"><p>As dicas ficam dentro de cada fase do mapa das trilhas. Abra uma fase que vocês já fizeram e conte como foi.</p></div>
          )}
          <p style={{ margin: "10px 0 0" }}><Link href="/trilhas/portugues/1-ano">Abrir o mapa das trilhas →</Link></p>
        </section>
      </div>
    </div>
  );
}
