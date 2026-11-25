"use client";
import { useEffect, useState } from "react";

/** Contagem até 1º de dezembro (horário de Brasília). Calculada no navegador para nunca ficar velha. */
export default function Faltam() {
  const [txt, setTxt] = useState<string | null>(null);
  useEffect(() => {
    const agora = new Date();
    const ano = agora.getUTCFullYear();
    // meia-noite de 1º/12 em Brasília = 03:00 UTC
    const inicio = Date.UTC(ano, 11, 1, 3);
    const natal = Date.UTC(ano, 11, 25, 3);
    const dias = Math.ceil((inicio - agora.getTime()) / 86400000);
    if (dias > 1) setTxt(`Faltam ${dias} dias para o 1º de dezembro. Imprima esta semana e comece no dia certo.`);
    else if (dias === 1) setTxt("O Advento começa amanhã! Compre hoje, imprima à noite e esconda o primeiro cartão.");
    else if (agora.getTime() < natal) setTxt("Já é dezembro? Sem problema: comece hoje e faça dois cartões por dia até alcançar a data.");
    else setTxt("Guarde para o próximo Natal: a licença vale para imprimir de novo todo ano.");
  }, []);
  if (!txt) return null;
  return <p className="tico-faltam" role="status">⏳ {txt}</p>;
}
