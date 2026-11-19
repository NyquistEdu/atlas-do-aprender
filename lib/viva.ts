/**
 * Fase Viva: a fase da trilha em versão interativa, com 7 telas e dois modos.
 * - Sozinho: XP, níveis, missões com estrelas e progresso salvo neste aparelho.
 * - Juntos: dois times (Sol e Lua), placar, cronômetro "Valendo!" e resolução revelada passo a passo.
 */

export type Modo = "sozinho" | "juntos";
export type Time = "sol" | "lua";

export type EstadoViva = {
  modo: Modo | null;
  xp: number;
  missoes: Record<string, number>; // id → estrelas (1 a 3)
  placar: Record<Time, number>;
  vez: Time;
  erros: Record<string, number>; // habilidade → erros
  acertos: Record<string, number>; // habilidade → acertos
  melhor: Record<string, number>; // jogo → melhor sequência
  vistas: number[]; // telas visitadas
  som: boolean;
};

export const ESTADO_INICIAL: EstadoViva = {
  modo: null, xp: 0, missoes: {}, placar: { sol: 0, lua: 0 }, vez: "sol",
  erros: {}, acertos: {}, melhor: {}, vistas: [], som: true,
};

export const NIVEIS: { nome: string; xp: number; icone: string }[] = [
  { nome: "Semente", xp: 0, icone: "🌱" },
  { nome: "Broto", xp: 60, icone: "🌿" },
  { nome: "Explorador", xp: 150, icone: "🧭" },
  { nome: "Craque", xp: 280, icone: "⭐" },
  { nome: "Mestre", xp: 450, icone: "🏆" },
];

export function nivelDe(xp: number) {
  let i = 0;
  NIVEIS.forEach((n, k) => { if (xp >= n.xp) i = k; });
  const prox = NIVEIS[i + 1];
  const base = NIVEIS[i].xp;
  return { i, ...NIVEIS[i], prox, pct: prox ? Math.min(1, (xp - base) / (prox.xp - base)) : 1 };
}

export const TIMES: Record<Time, { nome: string; icone: string; cor: string }> = {
  sol: { nome: "Time Sol", icone: "☀️", cor: "#e39b16" },
  lua: { nome: "Time Lua", icone: "🌙", cor: "#5b6fd6" },
};

export function carregar(chave: string): EstadoViva {
  try {
    const x = JSON.parse(localStorage.getItem(chave) || "null");
    if (x && typeof x === "object") return { ...ESTADO_INICIAL, ...x, placar: { ...ESTADO_INICIAL.placar, ...(x.placar || {}) } };
  } catch {}
  return ESTADO_INICIAL;
}

export function salvar(chave: string, e: EstadoViva) {
  try { localStorage.setItem(chave, JSON.stringify(e)); } catch {}
}

/** Divisão inteira com resto. */
export const div = (n: number, k: number) => ({ q: Math.floor(n / k), r: n % k });

/** Inteiro aleatório entre a e b (inclusive). */
export const sorteio = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

export function embaralhar<T>(l: T[]): T[] {
  const a = [...l];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Alternativas: a certa e distratores plausíveis, sem repetir e sem negativos. */
export function alternativas(certa: number, distratores: number[], total = 4): number[] {
  const s = new Set<number>([certa]);
  for (const d of distratores) if (d >= 0 && s.size < total) s.add(d);
  let k = 1;
  while (s.size < total) { if (certa + k >= 0) s.add(certa + k); if (s.size < total && certa - k >= 0) s.add(certa - k); k++; }
  return embaralhar([...s]);
}

/** Sons curtos feitos na hora (sem arquivos). */
let ctx: AudioContext | null = null;
export function som(tipo: "certo" | "errado" | "clique" | "nivel") {
  try {
    ctx = ctx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notas = tipo === "certo" ? [660, 880] : tipo === "nivel" ? [523, 659, 784, 1046] : tipo === "errado" ? [220, 180] : [500];
    notas.forEach((f, i) => {
      const o = ctx!.createOscillator(), g = ctx!.createGain();
      o.type = tipo === "errado" ? "triangle" : "sine";
      o.frequency.value = f;
      const t = ctx!.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(ctx!.destination);
      o.start(t); o.stop(t + 0.25);
    });
  } catch {}
}
