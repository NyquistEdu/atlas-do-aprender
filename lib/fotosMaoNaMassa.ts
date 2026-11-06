import fs from "node:fs";
import path from "node:path";
import { caminhoFoto } from "@/lib/maoNaMassaInfo";

/** Só no servidor: diz quais atividades já têm foto em public/mao-na-massa/<slug>.webp. */
export function temFoto(slug: string) {
  return fs.existsSync(path.join(process.cwd(), "public", caminhoFoto(slug)));
}
