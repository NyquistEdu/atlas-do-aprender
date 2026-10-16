"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtlas } from "@/components/Providers";

export default function Progresso({ chaves, cor }: { chaves: string[]; cor: string }) {
  const { configurado, user, crianca, feito } = useAtlas();
  const path = usePathname() || "/";
  if (!configurado) return null;
  if (!user)
    return (
      <div className="login-hint">
        <span>Para marcar temas concluídos e acompanhar o progresso de cada criança, entre com seu e-mail.</span>
        <Link className="btn small" href={`/entrar?volta=${encodeURIComponent(path)}`}>Entrar</Link>
      </div>
    );
  const n = chaves.filter(feito).length;
  return (
    <div className="prog">
      <span>{crianca}: {n} de {chaves.length} temas</span>
      <div className="bar"><i style={{ width: `${chaves.length ? (n / chaves.length) * 100 : 0}%`, ["--sc" as string]: cor }}></i></div>
    </div>
  );
}
