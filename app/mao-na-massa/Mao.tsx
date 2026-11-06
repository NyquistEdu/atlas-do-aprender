"use client";

import Link from "next/link";
import { useState } from "react";
import { ANOS, anoCurto } from "@/lib/data";
import { ESTACOES, NIVEIS, ORDEM_ESTACOES, caminhoFoto, type Cartao, type Estacao } from "@/lib/maoNaMassaInfo";
import { ConviteConta } from "@/components/Acesso";
import Caixote from "@/components/Caixote";

export default function Mao({ itens }: { itens: Cartao[] }) {
  const [e, setE] = useState<"all" | Estacao>("all");
  const [y, setY] = useState("all");
  const [soTrilha, setSoTrilha] = useState(false);
  const xs = itens.filter((x) => (e === "all" || x.est === e) && (y === "all" || +x.y <= +y) && (!soTrilha || x.tema));
  const grupos = ORDEM_ESTACOES.map((k) => [k, xs.filter((x) => x.est === k)] as const).filter(([, l]) => l.length);
  return (
    <div className="wrap largo">
      <div className="mm-topo">
        <div>
          <h1>Mão na massa</h1>
          <p className="lead">{itens.length} experimentos, invenções e atividades com material de casa. Cada uma tem a sua página: palpite antes de começar, passo a passo, a explicação de como funciona e um desafio para criar a própria versão.</p>
        </div>
        <Caixote size={96} />
      </div>

      <ol className="mm-metodo" aria-label="Como funciona cada atividade">
        <li><b>1. Palpite</b><span>A criança diz o que acha que vai acontecer.</span></li>
        <li><b>2. Construa e teste</b><span>Passos numerados; os do adulto vêm marcados.</span></li>
        <li><b>3. Descubra</b><span>A grande ideia explicada em palavras simples.</span></li>
        <li><b>4. Turbine</b><span>Um desafio para mudar algo e criar a própria versão.</span></li>
      </ol>

      <ConviteConta origem="mao-na-massa" titulo="Guarde o que a criança descobriu"
        texto="Anote as frases e perguntas dela em um minuto e releia quando quiser."
        acao="Ver como funciona o diário" href="/diario" />

      <div className="seg mm-est" role="group" aria-label="Estação">
        {([["all", "Todas"], ...ORDEM_ESTACOES.map((k) => [k, ESTACOES[k].curto])] as [string, string][]).map(([v, l]) => (
          <button key={v} type="button" data-e={v} aria-pressed={e === v} onClick={() => setE(v as "all" | Estacao)}>{l}</button>
        ))}
      </div>
      <div className="seg yr" role="group" aria-label="Ano escolar">
        {[["all", "Todos os anos"], ...ANOS.map(([v, l]) => [v, `para o ${anoCurto(l)}`])].map(([v, l]) => (
          <button key={v} type="button" aria-pressed={y === v} onClick={() => setY(v)}>{l}</button>
        ))}
      </div>
      <label className="mm-check"><input type="checkbox" checked={soTrilha} onChange={(ev) => setSoTrilha(ev.target.checked)} /> Só as sugeridas nos temas das trilhas</label>
      {e === "all" && y === "all" && <p className="dica">Para começar nesta semana: construa o <Link href="/mao-na-massa/caixote-o-robo-de-caixa">Caixote, o robô de caixa</Link>, ou faça o <Link href="/mao-na-massa/leite-magico">Leite mágico</Link>, que leva 15 minutos.</p>}

      {grupos.length ? grupos.map(([k, lista]) => (
        <section key={k} className="mm-grupo" data-e={k}>
          <div className="mm-grupo-t">
            <h2>{ESTACOES[k].nome}</h2>
            <p className="meta">{ESTACOES[k].desc} · {lista.length} atividades</p>
          </div>
          <div className="mm-grid">
            {lista.map((x) => (
              <Link key={x.slug} href={`/mao-na-massa/${x.slug}`} className="mm-card" data-e={x.est}>
                <div className="mm-card-img">
                  {x.foto
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={caminhoFoto(x.slug)} alt="" loading="lazy" width={400} height={300} />
                    : <span className="mm-card-num" aria-hidden="true">{x.num}</span>}
                </div>
                <div className="mm-card-txt">
                  <h3>{x.n}</h3>
                  <p>{x.sub}</p>
                  <div className="tags">
                    <span className="tag mm-tag">{x.idade}</span>
                    <span className="tag mm-tag-n">{x.tm}</span>
                    <span className="tag mm-tag-n">{NIVEIS[x.nivel]}</span>
                    {x.tema && <span className="tag mm-tag-n">na trilha</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )) : <div className="empty">Nenhuma atividade com esse filtro.</div>}
    </div>
  );
}
