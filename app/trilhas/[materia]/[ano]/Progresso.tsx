"use client";

import { useAtlas } from "@/components/Providers";

export default function Progresso({ chaves, cor }: { chaves: string[]; cor: string }) {
  const { configurado, user, crianca, feito } = useAtlas();
  if (!configurado) return null;
  if (!user) return null;
  const n = chaves.filter(feito).length;
  return (
    <div className="prog">
      <span>{n ? `${crianca} já explorou ${n} ${n === 1 ? "tema" : "temas"} deste ano` : `Marque os temas que ${crianca} explorar para continuar de onde parou`}</span>
      <div className="bar"><i style={{ width: `${chaves.length ? (n / chaves.length) * 100 : 0}%`, ["--sc" as string]: cor }}></i></div>
    </div>
  );
}
