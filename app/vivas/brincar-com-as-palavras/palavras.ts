export type Palavra = { p: string; s: string[]; e: string };
const w = (p: string, s: string, e: string): Palavra => ({ p, s: s.split("-"), e });

export const PALAVRAS: Palavra[] = [
  w("sol", "SOL", "☀️"), w("pão", "PÃO", "🍞"), w("mão", "MÃO", "✋"), w("flor", "FLOR", "🌸"), w("boi", "BOI", "🐂"), w("pé", "PÉ", "🦶"), w("cão", "CÃO", "🐶"), w("mar", "MAR", "🌊"),
  w("bola", "BO-LA", "⚽"), w("gato", "GA-TO", "🐱"), w("pato", "PA-TO", "🦆"), w("casa", "CA-SA", "🏠"), w("uva", "U-VA", "🍇"), w("lua", "LU-A", "🌙"), w("sapo", "SA-PO", "🐸"),
  w("bota", "BO-TA", "👢"), w("peixe", "PEI-XE", "🐟"), w("rato", "RA-TO", "🐭"), w("dado", "DA-DO", "🎲"), w("vaca", "VA-CA", "🐄"), w("balão", "BA-LÃO", "🎈"), w("leão", "LE-ÃO", "🦁"), w("vela", "VE-LA", "🕯️"),
  w("macaco", "MA-CA-CO", "🐒"), w("sapato", "SA-PA-TO", "👟"), w("banana", "BA-NA-NA", "🍌"), w("cavalo", "CA-VA-LO", "🐴"), w("panela", "PA-NE-LA", "🍲"), w("tomate", "TO-MA-TE", "🍅"),
  w("girafa", "GI-RA-FA", "🦒"), w("coruja", "CO-RU-JA", "🦉"), w("janela", "JA-NE-LA", "🪟"), w("formiga", "FOR-MI-GA", "🐜"), w("jacaré", "JA-CA-RÉ", "🐊"), w("avião", "A-VI-ÃO", "✈️"),
  w("sabão", "SA-BÃO", "🧼"), w("foguete", "FO-GUE-TE", "🚀"), w("sorvete", "SOR-VE-TE", "🍦"), w("boneca", "BO-NE-CA", "🪆"), w("maçã", "MA-ÇÃ", "🍎"), w("cenoura", "CE-NOU-RA", "🥕"),
  w("borboleta", "BOR-BO-LE-TA", "🦋"), w("abacaxi", "A-BA-CA-XI", "🍍"), w("telefone", "TE-LE-FO-NE", "☎️"), w("bicicleta", "BI-CI-CLE-TA", "🚲"), w("tartaruga", "TAR-TA-RU-GA", "🐢"),
  w("chocolate", "CHO-CO-LA-TE", "🍫"), w("formiguinha", "FOR-MI-GUI-NHA", "🐜"), w("helicóptero", "HE-LI-CÓP-TE-RO", "🚁"),
];
export const P = (p: string) => PALAVRAS.find((x) => x.p === p)!;
/** famílias de rimas (o fim soa igual) */
export const RIMAS: string[][] = [
  ["pão", "mão", "cão", "balão", "leão", "avião", "sabão"],
  ["gato", "pato", "rato", "sapato"],
  ["panela", "janela", "vela"],
  ["foguete", "sorvete"],
  ["bola", "cola"].filter((x) => PALAVRAS.some((p) => p.p === x)),
  ["borboleta", "bicicleta"],
  ["macaco", "caco"].filter((x) => PALAVRAS.some((p) => p.p === x)),
].filter((g) => g.length >= 2);
/** "ma, ca, co": para a voz falar devagar, pedaço por pedaço */
export const silabado = (x: Palavra) => x.s.map((s) => s.toLowerCase()).join(", ");
export const rotulo = (x: Palavra) => `${x.e} ${x.p}`;
