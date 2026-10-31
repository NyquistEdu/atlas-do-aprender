/** Novidades do mês para o e-mail mensal (edite a cada mês). A chave é "ano-mês" do envio. */
export type Novidade = { titulo: string; texto: string; href: string };

export const NOVIDADES: Record<string, Novidade[]> = {
  "2026-11": [
    { titulo: "As trilhas viraram um mapa", texto: "Cada tema agora é uma fase num caminho, com o “Você está aqui” mostrando onde a criança parou.", href: "/trilhas/portugues/1-ano" },
    { titulo: "Apostila grátis: Escrever o Nome", texto: "Alfabetização, tema 3: o próprio nome, as letras que ele tem e as primeiras palavras. Com treino diário de 30 folhas.", href: "/apostilas/escrever-o-nome" },
    { titulo: "Apostila grátis: Ontem, Hoje e Amanhã", texto: "4º ano, verbos e tempos verbais, com cartas de mímica e dados do tempo para montar.", href: "/apostilas/ontem-hoje-e-amanha" },
    { titulo: "A comunidade do Atlas", texto: "Mural de conquistas, dicas das famílias em cada fase e um espaço para perguntar direto para mim.", href: "/comunidade" },
  ],
};
