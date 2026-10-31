/** Desenho (emoji) de cada fase do mapa da trilha, pela chave do tema (matéria + ano + índice). */
export const EMOJI_FASE: Record<string, string> = {
  "por1-0": "🎵", "por1-1": "🔤", "por1-2": "✏️", "por1-3": "📜",
  "por2-0": "🧩", "por2-1": "📖", "por2-2": "🏰", "por2-3": "💌",
  "por3-0": "📝", "por3-1": "❗", "por3-2": "🦊", "por3-3": "🎭", "por3-4": "🏷️",
  "por4-0": "📰", "por4-1": "⏳", "por4-2": "🎯", "por4-3": "📚",
  "por5-0": "💬", "por5-1": "🔍", "por5-2": "🇧🇷", "por5-3": "🎤",
  "mat1-0": "🔢", "mat1-1": "⚖️", "mat1-2": "➕", "mat1-3": "🔷",
  "mat2-0": "🧮", "mat2-1": "➗", "mat2-2": "💰", "mat2-3": "⏰", "mat2-4": "🧊",
  "mat3-0": "✖️", "mat3-1": "🍕", "mat3-2": "📏", "mat3-3": "📊", "mat3-4": "🥧",
  "mat4-0": "🔢", "mat4-1": "🍰", "mat4-2": "🪙", "mat4-3": "📐", "mat4-4": "🧭",
  "mat5-0": "💯", "mat5-1": "🌍", "mat5-2": "🧃", "mat5-3": "🎲", "mat5-4": "🗺️",
  "cie1-0": "👀", "cie1-1": "🧼", "cie1-2": "🪵", "cie1-3": "🌙",
  "cie2-0": "🐸", "cie2-1": "🌱", "cie2-2": "☀️", "cie2-3": "🐾",
  "cie3-0": "🐛", "cie3-1": "🥁", "cie3-2": "💧", "cie3-3": "⭐",
  "cie4-0": "🦁", "cie4-1": "🦠", "cie4-2": "🧪", "cie4-3": "🧭",
  "cie5-0": "🫀", "cie5-1": "🌧️", "cie5-2": "🪐", "cie5-3": "⚡", "cie5-4": "♻️",
};

/** Enfeites espalhados pelo mapa de cada matéria. */
export const ENFEITES: Record<string, string[]> = {
  por: ["🌳", "📚", "⛰️", "🌲", "🏡", "🌻"],
  mat: ["⛰️", "🌳", "🏠", "🌲", "🗻", "🌵"],
  cie: ["🌳", "🌋", "🌊", "🌲", "🦋", "🍄"],
};

export const NOME_REGIAO: Record<string, string> = { "1": "Vale dos Primeiros Passos", "2": "Floresta das Descobertas", "3": "Montanhas do Saber", "4": "Rio das Ideias", "5": "Ilha dos Desafios" };
