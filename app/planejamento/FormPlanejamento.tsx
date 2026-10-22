"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { rastrear } from "@/lib/rastreio";

const ANOS = ["Ainda não está na escola", "Educação infantil", "1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano ou mais"];
const LEITURA = ["Ainda não reconhece as letras", "Conhece as letras, mas não lê", "Lê sílabas e palavras simples", "Lê frases com alguma dificuldade", "Lê textos com fluência"];
const MAT = ["Ainda conta com dificuldade", "Conta até 100", "Soma e subtrai", "Já multiplica e divide", "Trabalha com frações e decimais"];
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const TURNOS = ["Manhã", "Tarde", "Noite"];

type Crianca = { nome: string; idade: string; ano: string; leitura: string; matematica: string; facilidades: string; dificuldades: string; interesses: string };
const nova = (): Crianca => ({ nome: "", idade: "", ano: "", leitura: "", matematica: "", facilidades: "", dificuldades: "", interesses: "" });

export default function FormPlanejamento() {
  const [r, setR] = useState({ nome: "", email: "", whatsapp: "", cidade: "", comoConheceu: "" });
  const [f, setF] = useState({ escola: "", quemAcompanha: "", tempo: "", objetivo: "" });
  const [cs, setCs] = useState<Crianca[]>([nova()]);
  const [disp, setDisp] = useState<Record<string, string[]>>({});
  const [obs, setObs] = useState("");
  const [ok, setOk] = useState(false);
  const [mel, setMel] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "enviado" | "erro">("");
  const [erro, setErro] = useState("");

  if (!supabase) return <div className="empty">O formulário ainda não está disponível. Escreva para stephaniekamarryas@gmail.com.</div>;

  const muda = (i: number, k: keyof Crianca, v: string) => setCs(cs.map((c, j) => (j === i ? { ...c, [k]: v } : c)));
  const alterna = (d: string, t: string) => {
    const atual = disp[d] || [];
    setDisp({ ...disp, [d]: atual.includes(t) ? atual.filter((x) => x !== t) : [...atual, t] });
  };
  const temHorario = Object.values(disp).some((l) => l.length);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mel) return; // robôs preenchem o campo escondido
    if (!temHorario) { setErro("Marque pelo menos um dia e turno disponível."); setEstado("erro"); return; }
    setEstado("enviando"); setErro("");
    const { error } = await supabase!.from("pedidos_planejamento").insert({
      nome: r.nome.trim(), email: r.email.trim(), whatsapp: r.whatsapp.trim(), cidade: r.cidade.trim(),
      familia: { ...f, comoConheceu: r.comoConheceu },
      criancas: cs.filter((c) => c.nome.trim() || c.ano),
      disponibilidade: disp, observacoes: obs.trim(), consentimento: ok,
    });
    if (error) { console.error(error); setErro("Não consegui enviar agora. Tente de novo em alguns minutos ou escreva para stephaniekamarryas@gmail.com."); setEstado("erro"); return; }
    setEstado("enviado");
    rastrear("Lead", { origem: "planejamento", criancas: cs.length });
    window.scrollTo({ top: document.getElementById("formulario")?.offsetTop || 0, behavior: "smooth" });
  };

  if (estado === "enviado")
    return (
      <div className="card" style={{ borderTop: "5px solid var(--cie)" }}>
        <h3 style={{ margin: 0 }}>Recebi o seu pedido!</h3>
        <p style={{ margin: 0 }}>Obrigada, {r.nome.split(" ")[0]}. Vou entrar em contato pelo WhatsApp ou pelo e-mail <b>{r.email}</b> para combinarmos o dia da videochamada, dentro dos horários que você marcou.</p>
        <p className="meta" style={{ margin: 0 }}>Enquanto isso, você pode explorar as trilhas do Atlas com a criança.</p>
      </div>
    );

  return (
    <form className="diary plan-form" onSubmit={enviar}>
      <fieldset>
        <legend>Sobre você</legend>
        <div className="fgrid">
          <label className="f">Seu nome *<input required maxLength={120} value={r.nome} onChange={(e) => setR({ ...r, nome: e.target.value })} autoComplete="name" /></label>
          <label className="f">E-mail *<input required type="email" maxLength={200} value={r.email} onChange={(e) => setR({ ...r, email: e.target.value })} autoComplete="email" /></label>
          <label className="f">WhatsApp *<input required type="tel" maxLength={40} value={r.whatsapp} onChange={(e) => setR({ ...r, whatsapp: e.target.value })} placeholder="(79) 99999-9999" autoComplete="tel" /></label>
          <label className="f">Cidade e estado<input maxLength={120} value={r.cidade} onChange={(e) => setR({ ...r, cidade: e.target.value })} placeholder="Aracaju, SE" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Sobre a família e a rotina</legend>
        <div className="fgrid">
          <label className="f">A criança frequenta a escola? *
            <select required value={f.escola} onChange={(e) => setF({ ...f, escola: e.target.value })}>
              <option value="">Escolha</option><option>Sim, pela manhã</option><option>Sim, à tarde</option><option>Sim, em tempo integral</option><option>Não, estudamos em casa</option><option>Depende da criança</option>
            </select></label>
          <label className="f">Quem vai acompanhar o estudo em casa?<input maxLength={120} value={f.quemAcompanha} onChange={(e) => setF({ ...f, quemAcompanha: e.target.value })} placeholder="mãe, pai, avó…" /></label>
          <label className="f">Quanto tempo por dia vocês têm? *
            <select required value={f.tempo} onChange={(e) => setF({ ...f, tempo: e.target.value })}>
              <option value="">Escolha</option><option>Até 20 minutos</option><option>De 20 a 40 minutos</option><option>De 40 minutos a 1 hora</option><option>Mais de 1 hora</option><option>Só nos fins de semana</option>
            </select></label>
          <label className="f">Como conheceu o Atlas?<input maxLength={120} value={r.comoConheceu} onChange={(e) => setR({ ...r, comoConheceu: e.target.value })} placeholder="Instagram, indicação, Google…" /></label>
        </div>
        <label className="f">O que você mais gostaria de alcançar? *<textarea required maxLength={600} value={f.objetivo} onChange={(e) => setF({ ...f, objetivo: e.target.value })} placeholder="Ex.: que ela aprenda a ler, reforçar a matemática, criar uma rotina, preparar para uma olimpíada…" /></label>
      </fieldset>

      {cs.map((c, i) => (
        <fieldset key={i}>
          <legend>Criança {cs.length > 1 ? i + 1 : ""}</legend>
          <div className="fgrid">
            <label className="f">Primeiro nome ou apelido *<input required maxLength={50} value={c.nome} onChange={(e) => muda(i, "nome", e.target.value)} /></label>
            <label className="f">Idade *<input required inputMode="numeric" maxLength={2} value={c.idade} onChange={(e) => muda(i, "idade", e.target.value.replace(/\D/g, ""))} /></label>
            <label className="f">Ano escolar *
              <select required value={c.ano} onChange={(e) => muda(i, "ano", e.target.value)}><option value="">Escolha</option>{ANOS.map((a) => <option key={a}>{a}</option>)}</select></label>
            <label className="f">Leitura hoje *
              <select required value={c.leitura} onChange={(e) => muda(i, "leitura", e.target.value)}><option value="">Escolha</option>{LEITURA.map((a) => <option key={a}>{a}</option>)}</select></label>
            <label className="f">Matemática hoje *
              <select required value={c.matematica} onChange={(e) => muda(i, "matematica", e.target.value)}><option value="">Escolha</option>{MAT.map((a) => <option key={a}>{a}</option>)}</select></label>
          </div>
          <div className="fgrid">
            <label className="f">No que ela vai bem?<textarea maxLength={400} value={c.facilidades} onChange={(e) => muda(i, "facilidades", e.target.value)} /></label>
            <label className="f">Onde sente mais dificuldade?<textarea maxLength={400} value={c.dificuldades} onChange={(e) => muda(i, "dificuldades", e.target.value)} /></label>
            <label className="f">Do que ela gosta? (temas, bichos, jogos…)<textarea maxLength={400} value={c.interesses} onChange={(e) => muda(i, "interesses", e.target.value)} /></label>
          </div>
          {cs.length > 1 && <div><button type="button" className="btn small ghost" onClick={() => setCs(cs.filter((_, j) => j !== i))}>Remover esta criança</button></div>}
        </fieldset>
      ))}
      {cs.length < 4 && <div><button type="button" className="btn small ghost" onClick={() => setCs([...cs, nova()])}>+ Adicionar outra criança</button></div>}

      <fieldset>
        <legend>Quando você pode conversar? *</legend>
        <p className="meta" style={{ margin: 0 }}>Toque nos dias e turnos em que pode fazer a videochamada (cerca de 40 minutos).</p>
        <div className="disp" role="group" aria-label="Disponibilidade">
          <span></span>{TURNOS.map((t) => <b key={t}>{t}</b>)}
          {DIAS.map((d) => (
            <div className="disp-l" key={d}>
              <b>{d}</b>
              {TURNOS.map((t) => (
                <button key={t} type="button" aria-pressed={(disp[d] || []).includes(t)} aria-label={`${d} ${t}`} onClick={() => alterna(d, t)}>{(disp[d] || []).includes(t) ? "✓" : ""}</button>
              ))}
            </div>
          ))}
        </div>
      </fieldset>

      <label className="f">Quer contar mais alguma coisa? (opcional)<textarea maxLength={2000} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Algo que ajude a entender a criança e a rotina de vocês." /></label>
      <label className="hp" aria-hidden="true">Não preencha<input tabIndex={-1} autoComplete="off" value={mel} onChange={(e) => setMel(e.target.value)} /></label>
      <label className="chk"><input type="checkbox" required checked={ok} onChange={(e) => setOk(e.target.checked)} /> Autorizo o uso destes dados para entrar em contato comigo e preparar o planejamento. *</label>
      <div className="row">
        <button className="btn" type="submit" disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : "Quero meu planejamento gratuito"}</button>
        {estado === "erro" && <span className="meta" role="status" style={{ color: "var(--por)" }}>{erro}</span>}
      </div>
    </form>
  );
}
