"use client";
import Shell, { type Tela } from "@/components/viva/Shell";
import { Capa, Laboratorio } from "./CapaLab";
import { Treino, Van } from "./TreinoVan";
import { Desafio, Mundo, Resumo } from "./MundoDesafioResumo";

export const TELAS: Tela[] = [
  { n: 1, nome: "Capa", curto: "Capa", icone: "✨" },
  { n: 2, nome: "Laboratório", curto: "Laboratório", icone: "🧪" },
  { n: 3, nome: "Treino relâmpago", curto: "Treino", icone: "⚡" },
  { n: 4, nome: "A van do passeio", curto: "Van", icone: "🚐" },
  { n: 5, nome: "No mundo", curto: "No mundo", icone: "🌎" },
  { n: 6, nome: "Desafio do chefão", curto: "Desafio", icone: "🐙" },
  { n: 7, nome: "Resumo", curto: "Resumo", icone: "📌" },
];

export default function DivideAiViva() {
  return (
    <Shell chave="viva-divide-ai" titulo="Divide Aí! · Matemática · 3º ano" telas={TELAS}>
      {(t) => (
        <>
          {t === 1 && <Capa telas={TELAS} />}
          {t === 2 && <Laboratorio />}
          {t === 3 && <Treino />}
          {t === 4 && <Van />}
          {t === 5 && <Mundo />}
          {t === 6 && <Desafio />}
          {t === 7 && <Resumo />}
        </>
      )}
    </Shell>
  );
}
