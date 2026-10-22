"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtlas } from "@/components/Providers";
import { FormAcesso, SELO_CONTA } from "@/components/Acesso";

/** O que a pessoa estava tentando fazer, para a tela de acesso falar disso. */
const MOTIVOS: Record<string, string> = {
  livros: "Você vai poder guardar as leituras de cada criança, lembrar das histórias e escolher a próxima.",
  trilhas: "Você vai poder ver os temas que cada criança já explorou e continuar de onde parou.",
  "mao-na-massa": "Você vai poder guardar o que a criança descobriu em cada experimento e reler quando quiser.",
  diario: "Você vai poder guardar o que cada criança fez e descobriu, e consultar depois em qualquer aparelho.",
};

export default function Entrar() {
  const q = useSearchParams();
  const router = useRouter();
  const { user } = useAtlas();
  const volta = q.get("volta") && q.get("volta")!.startsWith("/") ? q.get("volta")! : "/diario";
  const origem = q.get("origem") || "entrar";
  const motivo = MOTIVOS[origem];

  useEffect(() => { if (user) router.replace(volta); }, [user, volta, router]);

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <h1>Entrar ou criar conta</h1>
      <p className="lead">
        {motivo ? `${motivo} ` : ""}Tudo no Atlas continua aberto sem conta; ela serve para guardar o que vocês fazem.
      </p>
      <p className="meta" style={{ margin: 0 }}><b>{SELO_CONTA}.</b> Enviamos um link para o seu e-mail; ao abrir, você entra e volta para onde estava.</p>
      <FormAcesso volta={volta} origem={origem} />
    </div>
  );
}
