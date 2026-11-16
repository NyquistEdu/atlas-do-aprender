"use client";
/** Peças do editor de planejamento, usadas na ficha da administradora (/planejamento/montar) e no plano que a família monta sozinha (/meu-plano/montar). */
import { TRILHAS, type Materia } from "@/lib/data";
import { anoNome } from "@/lib/apostilas";
import { AGENDA_PADRAO, DS, FAZ_NOME, MAT_INFO, ROTINA, infoTema, type Agenda, type Faz, type TemaPlano } from "@/lib/plano";
import { proximoTema } from "@/lib/roteiro";

export function EscolheTema({ m, v, muda }: { m: Materia; v: TemaPlano | null; muda: (t: TemaPlano | null) => void }) {
  const val = v ? `${v.ano}|${v.tema}` : "";
  const i = v ? infoTema(v) : null;
  return (
    <label className="f">{MAT_INFO[m][1]} {MAT_INFO[m][0]}
      <select value={val} onChange={(e) => { const [a, t] = e.target.value.split("|"); muda(e.target.value ? { materia: m, ano: a, tema: Number(t), faz: v?.faz } : null); }}>
        <option value="">nenhum agora</option>
        {Object.entries(TRILHAS[m] || {}).map(([ano, temas]) => (
          <optgroup key={ano} label={anoNome(ano)}>
            {temas.map((t, k) => <option key={k} value={`${ano}|${k + 1}`}>{k + 1}. {t.t}</option>)}
          </optgroup>
        ))}
      </select>
      {v && i && (
        i.treino ? (
          <div className="seg" role="group" aria-label="O que a criança faz neste tema">
            {(["apostila", "treino", "ambos"] as Faz[]).map((x) => (
              <button key={x} type="button" aria-pressed={i.faz === x} onClick={(e) => { e.preventDefault(); muda({ ...v, faz: x }); }}>{x === "apostila" && !i.apostila ? "Trilha" : FAZ_NOME[x]}</button>
            ))}
          </div>
        ) : <small className="meta">{i.apostila ? "Faz a apostila (este tema ainda não tem treino diário)." : "Estuda pela trilha (sem apostila nem treino diário)."}</small>
      )}
      {v && <button type="button" className="link-btn" style={{ justifySelf: "start", fontSize: ".82rem" }} onClick={(e) => { e.preventDefault(); muda({ ...proximoTema(v), faz: v.faz }); }}>próximo →</button>}
    </label>
  );
}

/** Lista de temas a mais (vários da mesma matéria ao mesmo tempo, ou os temas que os irmãos fazem juntos). */
export function MaisTemas({ temas, ano, muda, rotulo, materiaNova = "mat" }: { temas: TemaPlano[]; ano: string; muda: (l: TemaPlano[]) => void; rotulo: string; materiaNova?: Materia }) {
  return (
    <>
      {temas.map((t, k) => (
        <div key={k} className="mt-item">
          <select value={t.materia} style={{ width: "auto" }} onChange={(e) => muda(temas.map((x, j) => (j === k ? { materia: e.target.value as Materia, ano: x.ano, tema: 1 } : x)))}>{(["por", "mat", "cie"] as Materia[]).map((m) => <option key={m} value={m}>{MAT_INFO[m][0]}</option>)}</select>
          <div style={{ flex: 1 }}><EscolheTema m={t.materia} v={t} muda={(n) => muda(temas.map((x, j) => (j === k ? n || x : x)))} /></div>
          <button type="button" className="link-btn" onClick={() => muda(temas.filter((_, j) => j !== k))}>tirar</button>
        </div>
      ))}
      <div className="row"><button type="button" className="btn small ghost" onClick={() => muda([...temas, { materia: materiaNova, ano, tema: 1 }])}>{rotulo}</button></div>
    </>
  );
}

/** Matérias do plano e os dias de cada matéria e de cada momento da rotina (parte do padrão do Atlas). */
export function EditorAgenda({ materias, agenda, muda }: { materias?: Materia[]; agenda?: Agenda; muda: (materias: Materia[] | undefined, agenda: Agenda | undefined) => void }) {
  const ms = materias || ["por", "mat", "cie"];
  const ag = { ...AGENDA_PADRAO, ...(agenda || {}) };
  const setDias = (k: keyof typeof AGENDA_PADRAO, d: string) => muda(materias, { ...ag, [k]: ag[k].includes(d) ? ag[k].filter((x) => x !== d) : DS.filter((x) => x === d || ag[k].includes(x)) });
  return (
    <div className="mt-agenda">
      <div className="mt-item"><b>Matérias</b><div className="seg">{(["por", "mat", "cie"] as Materia[]).map((m) => (
        <button key={m} type="button" aria-pressed={ms.includes(m)} onClick={() => muda(ms.includes(m) ? ms.filter((x) => x !== m) : (["por", "mat", "cie"] as Materia[]).filter((x) => x === m || ms.includes(x)), agenda)}>{MAT_INFO[m][1]} {MAT_INFO[m][0]}</button>
      ))}</div></div>
      {(["por", "mat", "cie"] as Materia[]).filter((m) => ms.includes(m)).map((m) => (
        <div key={m} className="mt-item"><span>{MAT_INFO[m][1]} {MAT_INFO[m][0]}</span><div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={ag[m].includes(d)} onClick={() => setDias(m, d)}>{d}</button>)}</div></div>
      ))}
      {ROTINA.map(([k, ic, tx]) => (
        <div key={k} className="mt-item"><span>{ic} {(() => { const t = tx.replace("À noite: ", ""); return t[0].toUpperCase() + t.slice(1) + (tx.startsWith("À noite") ? " (à noite)" : ""); })()}</span><div className="seg">{DS.map((d) => <button key={d} type="button" aria-pressed={ag[k].includes(d)} onClick={() => setDias(k, d)}>{d}</button>)}</div></div>
      ))}
      <div className="row" style={{ gap: 10 }}>
        <button type="button" className="link-btn" onClick={() => muda(undefined, undefined)}>Voltar ao padrão do Atlas</button>
        <span className="meta">Dia sem marcação = não entra. Desmarque todos os dias de um momento da rotina para tirá-lo.</span>
      </div>
    </div>
  );
}
