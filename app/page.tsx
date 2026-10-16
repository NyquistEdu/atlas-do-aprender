import Link from "next/link";
import { ANOS, ESTANTE, EXPERIMENTOS, JOGOS, TRILHAS } from "@/lib/data";

export default function Inicio() {
  const temas = Object.values(TRILHAS).reduce((a, anos) => a + Object.values(anos).reduce((b, l) => b + l.length, 0), 0);
  const livros = Object.values(TRILHAS).reduce((a, anos) => a + Object.values(anos).reduce((b, l) => b + l.reduce((c, t) => c + (t.l?.length || 0), 0), 0), 0)
    + ESTANTE.reduce((a, [, l]) => a + l.length, 0);
  const cards: [string, string, string, string][] = [
    ["/trilhas/portugues/1-ano", "Trilhas", `${temas} temas de Português, Matemática e Ciências, do 1º ao ${ANOS.length}º ano`, "var(--por)"],
    ["/livros", "Livros", `${livros} indicações de paradidáticos e livros de formação`, "var(--jog)"],
    ["/jogos", "Jogos", `${JOGOS.length} jogos comentados, do jogo da memória ao GeoMundo`, "var(--jog)"],
    ["/mao-na-massa", "Mão na massa", `${EXPERIMENTOS.length} experimentos e atividades com material de casa`, "var(--cie)"],
    ["/diario", "Diário", "Registre o que cada criança fez e descobriu", "var(--mat)"],
    ["/guia", "Guia de uso", "Como usar o Atlas, em PDF", "var(--line)"],
  ];
  return (
    <div className="wrap hero">
      <h2>Um caminho de estudo para fazer em casa</h2>
      <p className="lead">
        Cada tema reúne livros, exercícios, filmes, áudios, jogos e uma atividade prática. Tudo está aberto para consulta.
        Para registrar o progresso e usar o diário, basta entrar com seu e-mail.
      </p>
      <div className="home-grid">
        {cards.map(([href, t, d, c]) => (
          <Link key={href} href={href} className="home-card" style={{ ["--sc" as string]: c }}>
            <b>{t}</b><span>{d}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
