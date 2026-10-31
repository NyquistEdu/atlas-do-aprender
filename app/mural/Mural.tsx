"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAtlas } from "@/components/Providers";
import { linkAcesso } from "@/components/Acesso";

export type FaseInfo = { nome: string; rot: string; href: string; emoji: string; cor: string };
type Item = { id: string; criado_em: string; tema: string; texto: string; autor: string; foto: string; palmas: number; aplaudi: boolean };
type Minha = { id: string; criado_em: string; texto: string; status: string };

const CHAVE_AUTOR = "atlas-autor-dica";
const fotoUrl = (p: string) => (p && supabase ? supabase.storage.from("conquistas").getPublicUrl(p).data.publicUrl : "");

/** Reduz a foto no próprio aparelho (máx. 1280 px) e regrava em JPEG: isso também apaga os dados escondidos da imagem, como a localização. */
async function prepararFoto(f: File): Promise<Blob> {
  const url = URL.createObjectURL(f);
  try {
    const img = await new Promise<HTMLImageElement>((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = url; });
    const max = 1280, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise<Blob>((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error("foto"))), "image/jpeg", 0.82));
  } finally { URL.revokeObjectURL(url); }
}

export default function Mural({ fases }: { fases: Record<string, FaseInfo> }) {
  const { configurado, user } = useAtlas();
  const [itens, setItens] = useState<Item[] | null>(null);
  const [mais, setMais] = useState(false);
  const [indisponivel, setIndisponivel] = useState(false);
  const [minhas, setMinhas] = useState<Minha[]>([]);
  const [tema, setTema] = useState("");
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previa, setPrevia] = useState("");
  const [semRosto, setSemRosto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const carregar = async (antes?: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.rpc("mural", { p_limite: 60, p_antes: antes ?? null });
    if (error) { setIndisponivel(true); return; }
    const novos = data as Item[];
    setItens((l) => (antes ? [...(l || []), ...novos] : novos));
    setMais(novos.length === 60);
  };

  useEffect(() => { carregar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [user]);
  useEffect(() => {
    try { setAutor(localStorage.getItem(CHAVE_AUTOR) || ""); } catch {}
    const t = new URLSearchParams(window.location.search).get("tema");
    if (t && fases[t]) setTema(t);
  }, [fases]);
  useEffect(() => {
    if (!user || !supabase) return;
    supabase.from("conquistas").select("id,criado_em,texto,status").eq("user_id", user.id).neq("status", "aprovada").order("criado_em", { ascending: false }).then(({ data }) => setMinhas((data as Minha[]) || []));
  }, [user]);

  const escolherFoto = (f: File | null) => {
    setFoto(f); setSemRosto(false);
    setPrevia((p) => { if (p) URL.revokeObjectURL(p); return f ? URL.createObjectURL(f) : ""; });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (texto.trim().length < 5) return setErro("Conte qual foi a conquista.");
    if (autor.trim().length < 2) return setErro("Escreva como você quer aparecer, por exemplo: Ana, mãe do Theo.");
    if (foto && !semRosto) return setErro("Confirme que a foto não mostra o rosto de nenhuma criança.");
    setEnviando(true);
    try {
      let caminho = "";
      if (foto) {
        const blob = await prepararFoto(foto);
        caminho = `${user!.id}/${crypto.randomUUID()}.jpg`;
        const up = await supabase!.storage.from("conquistas").upload(caminho, blob, { contentType: "image/jpeg", upsert: false });
        if (up.error) throw up.error;
      }
      const { data, error } = await supabase!.from("conquistas").insert({ tema, texto: texto.trim(), autor: autor.trim(), foto: caminho }).select("id,criado_em,texto,status").single();
      if (error) throw error;
      try { localStorage.setItem(CHAVE_AUTOR, autor.trim()); } catch {}
      setMinhas((l) => [data as Minha, ...l]);
      setTexto(""); escolherFoto(null); setOk(true);
    } catch {
      setErro("Não deu para enviar agora. Se tiver foto, tente uma imagem menor ou envie sem foto.");
    }
    setEnviando(false);
  };

  const aplaudir = async (it: Item) => {
    if (!user || !supabase) return;
    setItens((l) => l && l.map((x) => (x.id === it.id ? { ...x, aplaudi: !x.aplaudi, palmas: x.palmas + (x.aplaudi ? -1 : 1) } : x)));
    const { data, error } = await supabase.rpc("aplaudir", { p_id: it.id });
    if (!error) setItens((l) => l && l.map((x) => (x.id === it.id ? { ...x, palmas: data as number } : x)));
  };

  if (!configurado || indisponivel) return <p className="note">O mural está sendo preparado. Volte em breve!</p>;

  const opcoes = Object.entries(fases);
  return (
    <>
      <section className="perg card mural-form" id="compartilhar">
        <div className="perg-topo">
          <span className="perg-em" aria-hidden="true">🏆</span>
          <div>
            <h2>Compartilhe uma conquista</h2>
            <p>Conte uma vitória da sua criança, grande ou pequena. Se quiser, mande uma foto da atividade, do desenho ou do caderno. Para proteger as crianças, não aceitamos fotos de rosto, e toda conquista passa por aprovação antes de aparecer.</p>
          </div>
        </div>
        {!user ? (
          <Link className="btn" href={linkAcesso("/mural", "mural")}>Entrar para compartilhar</Link>
        ) : (
          <form ref={formRef} className="perg-form" onSubmit={enviar}>
            <label className="f">A conquista
              <textarea rows={3} maxLength={300} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ex.: Hoje ela leu o primeiro livro inteirinho sozinha!" />
            </label>
            <div className="fgrid">
              <label className="f">Fase da trilha (opcional)
                <select value={tema} onChange={(e) => setTema(e.target.value)}>
                  <option value="">Nenhuma em especial</option>
                  {opcoes.map(([id, f]) => <option key={id} value={id}>{f.rot} · {f.nome}</option>)}
                </select>
              </label>
              <label className="f">Como você quer aparecer
                <input value={autor} maxLength={60} onChange={(e) => setAutor(e.target.value)} placeholder="Ex.: Ana, mãe do Theo" />
              </label>
            </div>
            <label className="f">Foto da atividade (opcional)
              <input type="file" accept="image/*" onChange={(e) => escolherFoto(e.target.files?.[0] || null)} />
            </label>
            {previa && (
              <div className="mural-previa">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previa} alt="Prévia da foto" />
                <label className="f" style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700, color: "var(--ink)" }}>
                  <input type="checkbox" checked={semRosto} onChange={(e) => setSemRosto(e.target.checked)} style={{ width: "auto" }} /> A foto não mostra o rosto de nenhuma criança
                </label>
              </div>
            )}
            <p className="meta" style={{ margin: 0 }}>Não escreva o nome completo nem a escola da criança. A foto é reduzida no seu aparelho antes de enviar, e a localização dela é apagada. {texto.length}/300</p>
            {erro && <p className="warn" style={{ margin: 0 }}>{erro}</p>}
            {ok && <p className="dicas-ok" style={{ margin: 0 }}>Obrigada! Sua conquista foi enviada e aparece no mural assim que for aprovada.</p>}
            <div className="row"><button className="btn" disabled={enviando}>{enviando ? "Enviando…" : "Compartilhar"}</button></div>
          </form>
        )}
        {minhas.length > 0 && (
          <div className="perg-minhas">
            <h3>Minhas conquistas aguardando</h3>
            {minhas.map((m) => <p key={m.id} className="meta" style={{ margin: 0 }}>“{m.texto}” · {m.status === "recusada" ? "não aprovada" : "aguardando aprovação"}</p>)}
          </div>
        )}
      </section>

      {itens && !itens.length && <p className="fase-dica">O mural ainda está vazio. Que tal ser a primeira família a comemorar aqui?</p>}
      <div className="mural">
        {itens?.map((it) => {
          const f = fases[it.tema];
          const src = fotoUrl(it.foto);
          return (
            <article key={it.id} className={`conq ${src ? "" : "sem-foto"}`} style={f ? { ["--sc" as string]: `var(--${f.cor})` } : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {src && <img src={src} alt={`Foto da conquista: ${it.texto}`} loading="lazy" />}
              <div className="conq-txt">
                {!src && <span className="conq-em" aria-hidden="true">{f?.emoji || "🏆"}</span>}
                <p>{it.texto}</p>
                <span className="conq-autor">{it.autor} · {new Date(it.criado_em).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
                {f && <Link className="conq-fase" href={f.href}>{f.emoji} {f.nome}</Link>}
                {user ? (
                  <button type="button" className={`palma${it.aplaudi ? " on" : ""}`} onClick={() => aplaudir(it)} aria-pressed={it.aplaudi} aria-label="Aplaudir">👏 <b>{it.palmas || ""}</b></button>
                ) : (
                  <Link className="palma" href={linkAcesso("/mural", "palma")} aria-label="Entrar para aplaudir">👏 <b>{it.palmas || ""}</b></Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {mais && itens && <div className="row" style={{ justifyContent: "center" }}><button type="button" className="btn ghost" onClick={() => carregar(itens[itens.length - 1].criado_em)}>Ver mais conquistas</button></div>}
    </>
  );
}
