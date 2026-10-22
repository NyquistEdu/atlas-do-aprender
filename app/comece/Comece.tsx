"use client";

import Link from "next/link";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";

/** Bloco do pedido: formulário de e-mail para quem não entrou; atalho para as trilhas para quem já tem conta. */
export default function Comece() {
  const { user, configurado } = useAtlas();
  if (user || !configurado) {
    return (
      <div className="row">
        <Link className="btn" href="/trilhas/portugues/1-ano">Abrir as trilhas</Link>
      </div>
    );
  }
  return (
    <section className="card" style={{ borderTop: "5px solid var(--cie)" }} aria-labelledby="comece-t">
      <h2 id="comece-t" style={{ margin: 0, fontSize: "1.3rem" }}>Comece grátis</h2>
      <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b> Digite seu e-mail e abra o link que vamos enviar: você já entra nas trilhas.</p>
      <FormAcesso volta="/trilhas/portugues/1-ano" origem="comece" botao="Criar minha conta grátis" />
    </section>
  );
}
