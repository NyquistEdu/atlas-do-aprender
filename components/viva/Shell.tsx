"use client";
/** Moldura da Fase Viva: barra com as 7 telas, modo, XP ou placar, som e tela cheia. */
import { contar } from "@/lib/contagem";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";
import { ESTADO_INICIAL, TIMES, carregar, nivelDe, quemTime, salvar, som, type EstadoViva, type Modo, type Time } from "@/lib/viva";

type Api = {
  e: EstadoViva;
  modo: Modo;
  tela: number;
  irPara: (t: number) => void;
  definirModo: (m: Modo) => void;
  /** Acerto: no modo sozinho dá XP; no juntos, ponto para o time da vez (e passa a vez). */
  acertou: (hab: string, xp?: number, msg?: string) => void;
  errou: (hab: string, msg?: string) => void;
  passarVez: () => void;
  missao: (id: string, estrelas: number) => void;
  sequencia: (jogo: string, n: number) => void;
  zerarPlacar: () => void;
  recomecar: () => void;
  aviso: (txt: string, tipo?: "ok" | "erro" | "info") => void;
  toggleSom: () => void;
  /** Criança que está jogando (conta do Atlas) ou "" para visitante. */
  jogador: string;
  /** Registra a vitória sobre o chefão no diário da criança (uma vez). */
  venceuChefao: (acertos: number, total: number) => void;
};

const Ctx = createContext<Api | null>(null);
export const useViva = () => { const c = useContext(Ctx); if (!c) throw new Error("fora da Fase Viva"); return c; };

export type Tela = { n: number; nome: string; curto: string; icone: string };

const LS_JOGADOR = "atlas-viva-jogador";

export default function Shell({ chave: chaveBase, titulo, telas, children, rodape, materia = "", nomeFase = titulo }: {
  chave: string; titulo: string; telas: Tela[]; children: (tela: number) => React.ReactNode; rodape?: React.ReactNode; materia?: string; nomeFase?: string;
}) {
  const a = useAtlas();
  const [jogador, setJogadorState] = useState("");
  // escolhe a criança: a última que jogou neste aparelho, ou a criança marcada no topo do Atlas
  useEffect(() => {
    if (!a.user || !a.criancas.length) { setJogadorState(""); return; }
    let j = ""; try { j = localStorage.getItem(LS_JOGADOR) || ""; } catch {}
    setJogadorState(a.criancas.includes(j) ? j : a.criancas.includes(a.crianca) ? a.crianca : a.criancas[0]);
  }, [a.user, a.criancas, a.crianca]);
  const setJogador = (n: string) => { setJogadorState(n); try { localStorage.setItem(LS_JOGADOR, n); } catch {} };
  const chave = jogador ? `${chaveBase}|${jogador}` : chaveBase;
  const [e, setE] = useState<EstadoViva>(ESTADO_INICIAL);
  const [pronto, setPronto] = useState(false);
  const [tela, setTela] = useState(1);
  const [versao, setVersao] = useState(0);
  const [outros, setOutros] = useState<Partial<Record<Time, boolean>>>({});
  const [toast, setToast] = useState<{ txt: string; tipo: string; id: number } | null>(null);
  const palco = useRef<HTMLDivElement>(null);

  const ultimaChave = useRef(chave);
  useEffect(() => { setE(carregar(chave)); setPronto(true); setVersao((x) => x + 1); }, [chave]);
  useEffect(() => {
    // quando troca a criança, espera o estado dela carregar antes de salvar
    if (ultimaChave.current !== chave) { ultimaChave.current = chave; return; }
    if (pronto) salvar(chave, e);
  }, [e, pronto, chave]);

  // Contagem anônima para o painel: começou a jogar (passou da capa) e chegou ao treino, 1 vez por sessão.
  const slug = chaveBase.replace(/^viva-/, "");
  useEffect(() => {
    const uma = (ev: string) => { try { const k = `atlas-${ev}-${slug}`; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch {} contar(ev, slug); };
    if (tela >= 2) uma("VivaJogou");
    if (tela >= 3 && !(a.configurado && !a.carregando && !a.user) && !a.carregando) uma("VivaTreino");
  }, [tela, slug, a.configurado, a.carregando, a.user]);

  const aviso = useCallback((txt: string, tipo: "ok" | "erro" | "info" = "info") => {
    const id = Date.now();
    setToast({ txt, tipo, id });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2200);
  }, []);

  const tocar = useCallback((t: Parameters<typeof som>[0]) => { if (e.som) som(t); }, [e.som]);

  const irPara = useCallback((t: number) => {
    const n = Math.max(1, Math.min(telas.length, t));
    setTela(n);
    setE((x) => (x.vistas.includes(n) ? x : { ...x, vistas: [...x.vistas, n] }));
    palco.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [telas.length]);

  const acertou = useCallback((hab: string, xp = 10, msg?: string) => {
    tocar("certo");
    setE((x) => {
      const acertos = { ...x.acertos, [hab]: (x.acertos[hab] || 0) + 1 };
      if (x.modo === "juntos") {
        const v = x.vez;
        aviso(`${msg ? msg + " " : ""}Ponto para ${quemTime(x, v)}! ${TIMES[v].icone}`, "ok");
        return { ...x, acertos, placar: { ...x.placar, [v]: x.placar[v] + 1 }, vez: v === "sol" ? "lua" : "sol" };
      }
      const antes = nivelDe(x.xp).i, depois = nivelDe(x.xp + xp).i;
      if (depois > antes) { setTimeout(() => { if (x.som) som("nivel"); }, 250); aviso(`Subiu de nível: ${nivelDe(x.xp + xp).icone} ${nivelDe(x.xp + xp).nome}!`, "ok"); }
      else aviso(msg ? `${msg} +${xp} XP` : `+${xp} XP`, "ok");
      return { ...x, acertos, xp: x.xp + xp };
    });
  }, [aviso, tocar]);

  const errou = useCallback((hab: string, msg?: string) => {
    tocar("errado");
    setE((x) => {
      const erros = { ...x.erros, [hab]: (x.erros[hab] || 0) + 1 };
      if (x.modo === "juntos") {
        const prox: Time = x.vez === "sol" ? "lua" : "sol";
        aviso(msg ? `${msg} Agora é a vez de ${quemTime(x, prox)}.` : `Não foi dessa vez. Vez de ${quemTime(x, prox)}!`, "erro");
        return { ...x, erros, vez: prox };
      }
      if (msg) aviso(msg, "erro");
      return { ...x, erros };
    });
  }, [aviso, tocar]);

  const api: Api = {
    e, modo: e.modo || "sozinho", tela, irPara, aviso, acertou, errou,
    definirModo: (m) => { setE((x) => ({ ...x, modo: m })); tocar("clique"); },
    passarVez: () => setE((x) => ({ ...x, vez: x.vez === "sol" ? "lua" : "sol" })),
    missao: (id, estrelas) => setE((x) => ({ ...x, missoes: { ...x.missoes, [id]: Math.max(estrelas, x.missoes[id] || 0) } })),
    sequencia: (jogo, n) => setE((x) => (n > (x.melhor[jogo] || 0) ? { ...x, melhor: { ...x.melhor, [jogo]: n } } : x)),
    zerarPlacar: () => setE((x) => ({ ...x, placar: { sol: 0, lua: 0 }, vez: "sol" })),
    recomecar: () => { setE({ ...ESTADO_INICIAL, modo: e.modo, som: e.som }); setVersao((x) => x + 1); },
    toggleSom: () => setE((x) => ({ ...x, som: !x.som })),
    jogador,
    venceuChefao: (acertos, total) => {
      if (!e.chefao) contar("VivaChefao", slug);
      if (e.chefao || !a.user || !jogador || e.modo === "juntos") { setE((x) => ({ ...x, chefao: true })); return; }
      setE((x) => ({ ...x, chefao: true }));
      const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const nv = nivelDe(e.xp);
      a.addEntrada({ data: d.toISOString().slice(0, 10), crianca: jogador, area: materia, tipo: "Jogo", minutos: 20,
        titulo: `Fase Viva ${nomeFase}: venceu o chefão`, o_que: `Acertou ${acertos} de ${total} questões do desafio do chefão. Nível ${nv.nome}, ${e.xp} XP, ${Object.keys(e.missoes).length} missões cumpridas.`,
        descobertas: "", envolvimento: 4, proximo: "" }).then((err) => { if (!err) aviso(`Vitória registrada no diário de ${jogador}! 📓`, "ok"); });
    },
  };

  // setas do teclado (e passador de slides) trocam de tela
  useEffect(() => {
    const f = (ev: KeyboardEvent) => {
      const alvo = ev.target as HTMLElement;
      if (alvo && /INPUT|TEXTAREA|SELECT/.test(alvo.tagName)) return;
      if (ev.key === "ArrowRight" || ev.key === "PageDown") irPara(tela + 1);
      if (ev.key === "ArrowLeft" || ev.key === "PageUp") irPara(tela - 1);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [tela, irPara]);

  const telaCheia = () => {
    const el = palco.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };

  const nv = nivelDe(e.xp);
  // capa e laboratório abertos; do treino em diante, só com a conta do Atlas
  const bloqueada = tela >= 3 && a.configurado && !a.carregando && !a.user;
  const modo = e.modo || "sozinho";

  return (
    <Ctx.Provider value={api}>
      <div className="viva" ref={palco} data-modo={modo}>
        <div className="viva-barra">
          <div className="viva-marca"><b>Fase Viva</b><span>{titulo}</span></div>
          <nav className="viva-telas" aria-label="Telas da fase">
            {telas.map((t) => (
              <button key={t.n} type="button" aria-current={tela === t.n ? "page" : undefined} onClick={() => irPara(t.n)} title={t.nome}>
                <i>{t.n}</i><span>{t.curto}</span>
              </button>
            ))}
          </nav>
          <div className="viva-ctrl">
            {a.user && a.criancas.length > 0 ? (
              <label className="viva-quem" title="Quem está jogando">
                <span>Quem joga</span>
                <select value={jogador} onChange={(ev) => setJogador(ev.target.value)}>
                  {a.criancas.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            ) : a.configurado && !a.carregando && !a.user ? (
              <a className="viva-quem link" href={`/entrar?volta=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/vivas")}`}>Entrar para salvar por criança</a>
            ) : null}
            <div className="viva-modo" role="group" aria-label="Modo">
              <button type="button" aria-pressed={modo === "sozinho"} onClick={() => api.definirModo("sozinho")}>Sozinho</button>
              <button type="button" aria-pressed={modo === "juntos"} onClick={() => api.definirModo("juntos")}>Juntos</button>
            </div>
            {modo === "sozinho" ? (
              <div className="viva-xp" title={`${e.xp} XP`}>
                <span className="viva-nv">{nv.icone} {nv.nome}</span>
                <span className="viva-bar"><i style={{ width: `${nv.pct * 100}%` }} /></span>
                <small>{e.xp} XP</small>
              </div>
            ) : (
              <div className="viva-placar">
                {(["sol", "lua"] as Time[]).map((t) => (
                  <span key={t} className={e.vez === t ? "vez" : ""} style={{ ["--tc" as string]: TIMES[t].cor }} title={quemTime(e, t, false)}>{TIMES[t].icone}{e.nomes?.[t] ? <small> {e.nomes[t]}</small> : null} <b>{e.placar[t]}</b></span>
                ))}
              </div>
            )}
            <button type="button" className="viva-ico viva-reset" onClick={() => {
              if (window.confirm("Recomeçar a fase do zero? Isso apaga XP, missões, estrelas, sequências e placar neste aparelho.")) { api.recomecar(); setTela(1); api.aviso("Fase zerada. Bom jogo!", "info"); }
            }} aria-label="Recomeçar a fase do zero" title="Recomeçar do zero">↺</button>
            <button type="button" className="viva-ico" onClick={api.toggleSom} aria-label={e.som ? "Desligar som" : "Ligar som"}>{e.som ? "🔊" : "🔇"}</button>
            <button type="button" className="viva-ico" onClick={telaCheia} aria-label="Tela cheia">⛶</button>
          </div>
        </div>

        {modo === "juntos" && tela > 1 && tela < 7 && (
          <div className="viva-vez" style={{ ["--tc" as string]: TIMES[e.vez].cor }}>
            É a vez de <b>{TIMES[e.vez].icone} {quemTime(e, e.vez, false)}</b>
            <button type="button" className="link-btn" onClick={api.passarVez}>passar a vez</button>
          </div>
        )}

        {modo === "juntos" && tela === 1 && (
          <div className="viva-times">
            <span>Quem joga em cada time?</span>
            {(["sol", "lua"] as Time[]).map((t) => {
              const opcoes = [...a.criancas, "Mamãe", "Papai", "Professora"];
              const atual = e.nomes?.[t] || "";
              const outro = atual !== "" && !opcoes.includes(atual) || outros[t];
              const mudar = (n: string) => setE((x) => ({ ...x, nomes: { ...(x.nomes || {}), [t]: n } }));
              return (
                <label key={t} style={{ ["--tc" as string]: TIMES[t].cor }}>
                  {TIMES[t].icone}
                  <select value={outro ? "__outro" : atual} onChange={(ev) => {
                    const n = ev.target.value;
                    if (n === "__outro") { setOutros((o) => ({ ...o, [t]: true })); mudar(""); }
                    else { setOutros((o) => ({ ...o, [t]: false })); mudar(n); }
                  }}>
                    <option value="">{TIMES[t].nome}</option>
                    {opcoes.map((n) => <option key={n} value={n}>{n}</option>)}
                    <option value="__outro">Outro nome…</option>
                  </select>
                  {outro && <input autoFocus placeholder="Digite o nome" value={atual} maxLength={24} onChange={(ev) => mudar(ev.target.value)} />}
                </label>
              );
            })}
          </div>
        )}
        <div className="viva-palco" key={versao}>{bloqueada ? (
          <div className="viva-portao">
            <p className="viva-portao-e">🔒</p>
            <p className="viva-kick">Telas 1 e 2 liberadas para todos</p>
            <h2>Para continuar no {telas[tela - 1]?.nome.toLowerCase()}, entre na sua conta</h2>
            <p className="viva-sub">A conta do Atlas é grátis. Com ela, o progresso fica salvo para cada criança, e a vitória sobre o chefão vai para o diário.</p>
            <div className="viva-portao-form">
              <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b> Enviamos um link para o seu e-mail; ao abrir, você volta para esta fase.</p>
              <FormAcesso volta={typeof window !== "undefined" ? window.location.pathname : "/vivas"} origem="fase-viva" botao="Receber link e continuar" />
            </div>
            <button type="button" className="viva-btn ghost" onClick={() => irPara(2)}>Voltar ao laboratório</button>
          </div>
        ) : children(tela)}</div>

        <div className="viva-nav">
          <button type="button" className="viva-seta" onClick={() => irPara(tela - 1)} disabled={tela === 1} aria-label="Tela anterior">‹</button>
          <span>{telas[tela - 1]?.icone} {telas[tela - 1]?.nome} · {tela} de {telas.length}</span>
          <button type="button" className="viva-seta" onClick={() => irPara(tela + 1)} disabled={tela === telas.length} aria-label="Próxima tela">›</button>
        </div>
        {rodape}
        {toast && <div className={`viva-toast ${toast.tipo}`} role="status" key={toast.id}>{toast.txt}</div>}
      </div>
    </Ctx.Provider>
  );
}

/** Caixinha de conta que confere o que a criança digitou e dá a dica daquele passo. */
export function Caixa({ certo, onCerto, dica, largura = 3, rotulo }: { certo: number; onCerto?: () => void; dica: string; largura?: number; rotulo?: string }) {
  const [v, setV] = useState("");
  const [st, setSt] = useState<"" | "ok" | "erro">("");
  const conferir = (txt: string) => {
    if (txt.trim() === "") { setSt(""); return; }
    const ok = Number(txt.replace(",", ".")) === certo;
    setSt(ok ? "ok" : "erro");
    if (ok) onCerto?.();
  };
  return (
    <span className={`viva-caixa ${st}`}>
      <input
        inputMode="numeric" aria-label={rotulo || "resposta"} value={v} size={largura}
        disabled={st === "ok"}
        onChange={(ev) => { setV(ev.target.value.replace(/[^\d]/g, "")); setSt(""); }}
        onBlur={(ev) => conferir(ev.target.value)}
        onKeyDown={(ev) => { if (ev.key === "Enter") conferir((ev.target as HTMLInputElement).value); }}
      />
      {st === "erro" && <small className="viva-dica">{dica}</small>}
    </span>
  );
}

/** Cronômetro "Valendo!" do modo juntos. */
export function Cronometro({ segundos, rodando, onFim, chaveReinicio }: { segundos: number; rodando: boolean; onFim?: () => void; chaveReinicio?: unknown }) {
  const [t, setT] = useState(segundos);
  const fim = useRef(onFim);
  fim.current = onFim;
  useEffect(() => { setT(segundos); }, [segundos, chaveReinicio]);
  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => setT((x) => {
      if (x <= 1) { clearInterval(id); fim.current?.(); return 0; }
      return x - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [rodando, chaveReinicio]);
  const m = Math.floor(t / 60), s = String(t % 60).padStart(2, "0");
  return <span className={`viva-crono ${t <= 10 && rodando ? "fim" : ""}`}>{m}:{s}</span>;
}
