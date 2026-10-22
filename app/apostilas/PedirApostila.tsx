"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { rastrear } from "@/lib/rastreio";

const MATERIAS = ["Português", "Matemática", "Ciências", "Outra"];
const SERIES = ["Educação infantil", "1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano ou mais"];
/** Os pedidos chegam por e-mail (FormSubmit) e ficam guardados no Supabase como cópia. */
const EMAIL_DESTINO = "stephaniekamarryas@gmail.com";

/** Formulário "não encontrou a apostila?": tema, série e matéria, enviados para o e-mail da autora. */
export default function PedirApostila() {
  const [v, setV] = useState({ nome: "", email: "", materia: "", serie: "", tema: "", detalhes: "" });
  const [mel, setMel] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "enviado" | "erro">("");
  const muda = (k: keyof typeof v, x: string) => setV({ ...v, [k]: x });

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mel) return; // robôs preenchem o campo escondido
    setEstado("enviando");
    const dados = {
      nome: v.nome.trim(), email: v.email.trim(), materia: v.materia, serie: v.serie,
      tema: v.tema.trim(), detalhes: v.detalhes.trim(),
    };
    // 1) E-mail para a autora.
    let foiEmail = false;
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${EMAIL_DESTINO}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Pedido de apostila: ${dados.tema} (${dados.materia}, ${dados.serie})`,
          _template: "table",
          _captcha: "false",
          _replyto: dados.email,
          Nome: dados.nome, "E-mail": dados.email, Matéria: dados.materia, Série: dados.serie,
          Tema: dados.tema, Detalhes: dados.detalhes || "—",
        }),
      });
      foiEmail = r.ok;
    } catch {}
    // 2) Cópia no banco (se o e-mail falhar, o pedido não se perde).
    let foiBanco = false;
    if (supabase) {
      const { error } = await supabase.from("pedidos_apostila").insert(dados);
      foiBanco = !error;
    }
    if (!foiEmail && !foiBanco) { setEstado("erro"); return; }
    setEstado("enviado");
    rastrear("PedidoApostila", { tipo: dados.materia });
  };

  if (estado === "enviado")
    return (
      <div className="card" style={{ borderTop: "5px solid var(--cie)" }}>
        <h3 style={{ margin: 0 }}>Pedido recebido!</h3>
        <p style={{ margin: 0 }}>
          Obrigada, {v.nome.split(" ")[0] || "pelo pedido"}. Vou preparar a apostila de <b>{v.tema}</b> seguindo a metodologia do Atlas
          e aviso no e-mail <b>{v.email}</b> quando ela estiver pronta.
        </p>
      </div>
    );

  return (
    <form className="diary" onSubmit={enviar} aria-labelledby="pedir-t">
      <div>
        <h2 id="pedir-t" style={{ margin: 0, fontSize: "1.3rem" }}>Não encontrou a apostila que precisa?</h2>
        <p className="meta" style={{ margin: "4px 0 0" }}>
          Envie o tema, a série e a matéria, e eu preparo para você usando a metodologia do Atlas: explicação para a família,
          exercícios, revisões diárias, jogos e gabarito.
        </p>
      </div>
      <div className="grid2">
        <label className="f">Matéria *
          <select required value={v.materia} onChange={(e) => muda("materia", e.target.value)}>
            <option value="" disabled>Escolha</option>
            {MATERIAS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="f">Série *
          <select required value={v.serie} onChange={(e) => muda("serie", e.target.value)}>
            <option value="" disabled>Escolha</option>
            {SERIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <label className="f">Tema *<input required maxLength={160} value={v.tema} onChange={(e) => muda("tema", e.target.value)} placeholder="Ex.: divisão com resto, sílabas complexas, ciclo da água" /></label>
      <label className="f">Quer contar mais alguma coisa?<textarea maxLength={1000} value={v.detalhes} onChange={(e) => muda("detalhes", e.target.value)} placeholder="Onde a criança tem dificuldade, o que ela já sabe, para quando precisa…" /></label>
      <div className="grid2">
        <label className="f">Seu nome *<input required maxLength={120} value={v.nome} onChange={(e) => muda("nome", e.target.value)} autoComplete="name" /></label>
        <label className="f">Seu e-mail *<input required type="email" maxLength={200} value={v.email} onChange={(e) => muda("email", e.target.value)} autoComplete="email" /></label>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={mel} onChange={(e) => setMel(e.target.value)} style={{ position: "absolute", left: "-9999px" }} />
      <div className="row">
        <button className="btn" type="submit" disabled={estado === "enviando"}>{estado === "enviando" ? "Enviando…" : "Enviar pedido"}</button>
        {estado === "erro" && <span className="meta" role="status" style={{ color: "var(--mat, #dc2626)" }}>Não consegui enviar agora. Tente de novo ou escreva para {EMAIL_DESTINO}.</span>}
      </div>
    </form>
  );
}
