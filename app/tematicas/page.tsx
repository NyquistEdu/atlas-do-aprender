import type { Metadata } from "next";
import Link from "next/link";
import { TEMATICAS } from "@/lib/tematicas";

export const metadata: Metadata = {
  title: "Temáticas",
  description: "Datas especiais do ano com livros, filmes, experimentos, jogos e atividades para viver o tema em família.",
};

export default function Tematicas() {
  return (
    <div className="wrap">
      <p className="eyebrow-i">Datas especiais</p>
      <h2 className="hero-t">Temáticas</h2>
      <p className="lead">Algumas datas do ano rendem um tema inteiro: livros para ler junto, filmes, experimentos, jogos e atividades de Português e Matemática ligadas à festa.</p>
      <div className="vitrine">
        {TEMATICAS.map((t) => (
          <Link key={t.slug} href={`/tematicas/${t.slug}`} className="card tema-card" style={{ textDecoration: "none" }}>
            <span className="tema-em" aria-hidden="true">{t.emoji}</span>
            <span className="tag">{t.quando}</span>
            <h3>{t.titulo}</h3>
            <p className="meta">{t.resumo}</p>
            <span className="ver">Ver o tema ›</span>
          </Link>
        ))}
      </div>
      <p className="note">Novos temas entram ao longo do ano.</p>
    </div>
  );
}
