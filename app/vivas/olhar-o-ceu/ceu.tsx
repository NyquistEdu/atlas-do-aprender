"use client";
/** Desenhos do céu: a Lua vista daqui do Brasil, o Sol e a sombra do palito, a Terra com dia e noite. */

export const DIA_LUA = 29.5;
export type NomeFase = "Nova" | "Crescente" | "Cheia" | "Minguante";

export function nomeFase(f: number): NomeFase {
  const x = ((f % 1) + 1) % 1;
  if (x < 0.04 || x > 0.96) return "Nova";
  if (x < 0.46) return "Crescente";
  if (x < 0.54) return "Cheia";
  return "Minguante";
}

/** Fase da Lua como vemos no hemisfério sul: na crescente, o lado iluminado fica à esquerda. */
export function Lua({ f, r = 60, rotulo }: { f: number; r?: number; rotulo?: string }) {
  const x = ((f % 1) + 1) % 1;
  const k = (1 - Math.cos(2 * Math.PI * x)) / 2;
  const s = r * 2 + 8, c = s / 2;
  const litRight = x >= 0.5;
  const crescente = k < 0.5;
  const rx = r * Math.abs(1 - 2 * k);
  const caminho = `M ${c} ${c - r} A ${r} ${r} 0 0 ${litRight ? 1 : 0} ${c} ${c + r} A ${rx} ${r} 0 0 ${crescente === litRight ? 0 : 1} ${c} ${c - r} Z`;
  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} role="img" aria-label={rotulo || `Lua ${nomeFase(x).toLowerCase()}`}>
      <circle cx={c} cy={c} r={r} fill="#2b3350" stroke="#55638f" strokeWidth="1.5" />
      {k > 0.98 ? <circle cx={c} cy={c} r={r} fill="#f3efe2" /> : k > 0.02 ? <path d={caminho} fill="#f3efe2" /> : null}
      {k > 0.02 && [[-0.3, -0.25, 0.16], [0.2, 0.1, 0.12], [-0.05, 0.42, 0.1], [0.35, -0.35, 0.08]].map(([dx, dy, rr], i) => (
        <circle key={i} cx={c + dx * r} cy={c + dy * r} r={rr * r} fill="#000" opacity=".06" />
      ))}
    </svg>
  );
}

export function momento(h: number) {
  const x = ((Math.round(h) % 24) + 24) % 24;
  if (x === 6) return { nome: "nascer do Sol", e: "🌅", dia: true };
  if (x === 18) return { nome: "pôr do Sol", e: "🌇", dia: true };
  if (x === 12) return { nome: "meio-dia", e: "☀️", dia: true };
  if (x > 6 && x < 12) return { nome: "manhã", e: "🌤️", dia: true };
  if (x > 12 && x < 18) return { nome: "tarde", e: "🌤️", dia: true };
  if (x === 0) return { nome: "meia-noite", e: "🌙", dia: false };
  return { nome: x < 6 ? "madrugada" : "noite", e: "🌙", dia: false };
}

/** Posição do Sol no céu (leste à direita) e ponta da sombra de um palito. */
export function sombra(h: number, cx: number, chao: number, R: number, H: number) {
  const th = (Math.PI * (h - 6)) / 12;
  const sx = cx + Math.cos(th) * R, sy = chao - Math.sin(th) * R;
  const s = Math.sin(th);
  const ponta = s > 0.05 ? cx - (H * Math.cos(th)) / s : cx;
  return { sx, sy, ponta: Math.max(cx - R * 1.15, Math.min(cx + R * 1.15, ponta)), visivel: s > 0 };
}

/** Céu com o Sol, o palito e a sombra. */
export function SolPalito({ h, w = 320, alto = 170, alvo, semSombra }: { h: number; w?: number; alto?: number; alvo?: number; semSombra?: boolean }) {
  const cx = w / 2, chao = alto - 34, R = Math.min(w * 0.42, alto - 46), H = 40;
  const s = sombra(h, cx, chao, R, H);
  const dia = h > 6 && h < 18;
  const a = alvo !== undefined ? sombra(alvo, cx, chao, R, H) : null;
  return (
    <svg viewBox={`0 0 ${w} ${alto}`} width="100%" style={{ maxWidth: w }} role="img" aria-label={`Sol e sombra às ${h} horas`}>
      <rect width={w} height={chao} fill={dia ? "#cfe8ff" : "#1b2340"} />
      <path d={`M ${cx - R} ${chao} A ${R} ${R} 0 0 1 ${cx + R} ${chao}`} fill="none" stroke={dia ? "#9cc3ea" : "#3a4672"} strokeDasharray="4 5" />
      {s.visivel ? <circle cx={s.sx} cy={s.sy} r="13" fill="#ffc94a" stroke="#f0a92e" strokeWidth="3" /> : <text x={w - 30} y="30" fontSize="20">🌙</text>}
      <rect y={chao} width={w} height={alto - chao} fill="#8cc56b" />
      <text x="8" y={alto - 10} fontSize="12" fontWeight="800" fill="#2c4a1f">OESTE</text>
      <text x={w - 8} y={alto - 10} fontSize="12" fontWeight="800" fill="#2c4a1f" textAnchor="end">LESTE</text>
      {a && <g><ellipse cx={a.ponta} cy={chao + 4} rx="9" ry="5" fill="#8b8f99" /><text x={a.ponta} y={chao + 22} fontSize="10" textAnchor="middle" fontWeight="800" fill="#1d2433">pedra</text></g>}
      {!semSombra && dia && <line x1={cx} y1={chao + 2} x2={s.ponta} y2={chao + 2} stroke="#2a3050" strokeWidth="6" strokeLinecap="round" opacity=".55" />}
      <rect x={cx - 3} y={chao - H} width="6" height={H} fill="#8a5a3b" rx="2" />
    </svg>
  );
}

/** Terra vista de cima: lado esquerdo iluminado pelo Sol, com a casinha num ângulo (graus, 0 = do lado oposto ao Sol). */
export function TerraDN({ ang }: { ang: number }) {
  const a = (ang * Math.PI) / 180, cx = 112, cy = 62, r = 44;
  const px = cx + Math.cos(a) * r, py = cy - Math.sin(a) * r;
  return (
    <svg viewBox="0 0 170 124" width="190" height="138" role="img" aria-label="Terra com o lado do Sol iluminado">
      <circle cx="16" cy="62" r="14" fill="#ffc94a" />
      {[-24, 0, 24].map((d) => <line key={d} x1="34" y1={62 + d * 0.6} x2="62" y2={62 + d * 0.6} stroke="#f0a92e" strokeDasharray="3 3" />)}
      <circle cx={cx} cy={cy} r={r} fill="#1f2a4a" />
      <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`} fill="#5aa0e6" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1d2433" strokeWidth="2" />
      <circle cx={px} cy={py} r="7" fill="#ffd23f" stroke="#1d2433" strokeWidth="2" />
    </svg>
  );
}
