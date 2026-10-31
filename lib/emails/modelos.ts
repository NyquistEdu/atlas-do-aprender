/**
 * Modelos dos e-mails do Atlas (HTML com estilos na própria tag, como os programas de e-mail exigem).
 * Visual: papel creme, marca em pílula com as três bolinhas, botões arredondados.
 */
import type { Novidade } from "@/lib/novidades";

export const SITE = "https://www.atlasdoaprender.com.br";
export type Email = { assunto: string; html: string; previa: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const utm = (href: string, tipo: string) => {
  const u = href.startsWith("http") ? href : SITE + href;
  const [base, hash] = u.split("#");
  return `${base}${base.includes("?") ? "&" : "?"}utm_source=email&utm_medium=email&utm_campaign=${tipo}${hash ? "#" + hash : ""}`;
};

const F = "font-family:'Atkinson Hyperlegible',Arial,Helvetica,sans-serif;";
const T = "font-family:'Bricolage Grotesque',Arial,Helvetica,sans-serif;font-weight:800;letter-spacing:-.02em;";

function botao(texto: string, href: string, tipo: string, cor = "#1d2433") {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 6px"><tr><td style="background:${cor};border-radius:999px;box-shadow:3px 3px 0 #F2B33D">
<a href="${utm(href, tipo)}" style="display:inline-block;padding:13px 24px;${F}font-weight:700;font-size:16px;color:#FFF8EC;text-decoration:none;border-radius:999px">${esc(texto)}</a></td></tr></table>`;
}
function p(t: string) { return `<p style="${F}font-size:16px;line-height:1.6;color:#1d2433;margin:0 0 14px">${t}</p>`; }
function bloco(emoji: string, titulo: string, texto: string, href: string, tipo: string) {
  return `<tr><td style="padding:0 0 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #1d2433;border-radius:14px"><tr>
<td width="56" valign="top" style="padding:14px 0 14px 14px;font-size:30px;line-height:1">${emoji}</td>
<td style="padding:14px 16px 14px 10px"><a href="${utm(href, tipo)}" style="${T}font-size:17px;color:#1d2433;text-decoration:none">${esc(titulo)}</a>
<p style="${F}font-size:14px;line-height:1.5;color:#56607a;margin:4px 0 0">${texto}</p></td></tr></table></td></tr>`;
}

function base(o: { tipo: string; previa: string; kicker: string; titulo: string; corpo: string; descadastro: string }) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.titulo)}</title></head>
<body style="margin:0;padding:0;background:#FFF8EC">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.previa)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8EC;background-image:linear-gradient(rgba(42,93,176,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(42,93,176,.06) 1px,transparent 1px);background-size:24px 24px"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
<tr><td style="padding:0 0 16px"><a href="${utm("/", o.tipo)}" style="display:inline-block;background:#1d2433;color:#FFF8EC;border-radius:999px;padding:9px 18px 9px 14px;${F}font-weight:700;font-size:15px;text-decoration:none"><span style="color:#e0675a">●</span><span style="color:#6f97e0">●</span><span style="color:#5fb37f">●</span>&nbsp; Atlas do Aprender</a></td></tr>
<tr><td style="background:#ffffff;border:2px solid #1d2433;border-radius:20px;box-shadow:6px 6px 0 #F2B33D;padding:28px 26px">
<p style="font-family:'Caveat','Comic Sans MS',cursive;font-size:22px;font-weight:700;color:#c4483b;margin:0 0 2px">${esc(o.kicker)}</p>
<h1 style="${T}font-size:28px;line-height:1.1;color:#1d2433;margin:0 0 18px">${esc(o.titulo)}</h1>
${o.corpo}
<p style="${F}font-size:16px;line-height:1.5;color:#1d2433;margin:22px 0 0">Um abraço,<br><b>Stephanie Kamarry</b><br><span style="color:#56607a;font-size:14px">professora, pesquisadora e mãe de três · criadora do Atlas</span></p>
</td></tr>
<tr><td style="padding:18px 8px 0;${F}font-size:12.5px;line-height:1.6;color:#56607a;text-align:center">
Você recebe este e-mail porque pediu dicas e novidades do Atlas do Aprender. É só responder para falar comigo.<br>
<a href="${o.descadastro}" style="color:#56607a">Não quero mais receber estes e-mails</a> · <a href="${utm("/", o.tipo)}" style="color:#56607a">atlasdoaprender.com.br</a>
</td></tr></table></td></tr></table></body></html>`;
}

export function boasVindas(descadastro: string, contaAntiga = false): Email {
  const tipo = contaAntiga ? "boas_vindas_antiga" : "boas_vindas";
  const previa = contaAntiga ? "O Atlas mudou bastante desde o seu cadastro. Três passos para aproveitar." : "Três passos para começar: o diagnóstico, o mapa da trilha e o desafio do mês.";
  const abertura = contaAntiga
    ? "Você criou sua conta no Atlas há um tempinho, e ele mudou bastante desde então: as trilhas viraram um mapa com fases, chegaram apostilas grátis, o desafio do mês e um espaço para perguntar direto para mim. Eu criei o Atlas quando precisei ensinar meu filho em casa, do jeito dele, sem pressão, e ele continua todo gratuito."
    : "Que bom ter vocês aqui! Eu criei o Atlas quando precisei ensinar meu filho em casa, do jeito dele, sem pressão. Agora ele é de vocês também, e é todo gratuito.";
  const corpo = `${p(abertura)}
${p("Para começar bem, sugiro três passos, um de cada vez:")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${bloco("🧭", "1. Faça o diagnóstico grátis", "Uns 5 minutos para descobrir o que a criança já domina em Português, Matemática e Ciências e por onde começar.", "/diagnostico", tipo)}
${bloco("🗺️", "2. Abra o mapa da trilha", "Cada tema é uma fase do caminho, com livros, jogos, filmes e atividades. Escolha a fase e entre.", "/trilhas/portugues/1-ano", tipo)}
${bloco("🌱", "3. Conheça o desafio do mês", "Uma atividade para fazer em família. Quem mostra o resultado no mural ganha um selo.", "/desafio", tipo)}
</table>
${botao("Fazer o diagnóstico agora", "/diagnostico", tipo)}`;
  return contaAntiga
    ? { assunto: "O Atlas mudou bastante desde que vocês chegaram 💛", previa, html: base({ tipo, previa, kicker: "que bom ter vocês de volta", titulo: "O Atlas cresceu, e está esperando vocês", corpo, descadastro }) }
    : { assunto: "Bem-vindos ao Atlas do Aprender 💛", previa, html: base({ tipo, previa, kicker: "que bom ter vocês aqui", titulo: "Bem-vindos ao Atlas do Aprender", corpo, descadastro }) };
}

export function dia2(descadastro: string): Email {
  const tipo = "seq_d2";
  const previa = "Cinco minutos para saber exatamente por onde começar com a sua criança.";
  const corpo = `${p("Uma das perguntas que mais recebo é: <b>“por onde eu começo?”</b>. A resposta mais honesta é: pelo que a criança já sabe.")}
${p("No diagnóstico do Atlas, você responde perguntas simples sobre o que ela já faz (por exemplo, se lê frases curtas ou se soma com reagrupamento). Em uns 5 minutos, ele mostra os temas que ela já domina e os que ficaram para trás, inclusive de anos anteriores.")}
${p("Com o resultado, você vai direto para a fase certa do mapa, sem perder tempo com o que ela já sabe nem pular o que ainda falta.")}
${botao("Fazer o diagnóstico", "/diagnostico", tipo)}`;
  return { assunto: "Por onde começar? Cinco minutos respondem", previa, html: base({ tipo, previa, kicker: "dica do dia 2", titulo: "Por onde começar com a sua criança", corpo, descadastro }) };
}

export function dia5(descadastro: string): Email {
  const tipo = "seq_d5";
  const previa = "Um tema de cada vez: como usar o mapa da trilha sem se perder.";
  const corpo = `${p("As trilhas do Atlas são um mapa: cada tema é uma <b>fase</b> no caminho, do começo ao fim do ano. Dentro de cada fase estão os livros, jogos, filmes, exercícios e atividades mão na massa daquele assunto.")}
${p("O segredo é ir devagar: <b>um tema por vez, uma ou duas atividades por semana</b>. Quando começarem uma fase, toque em “Estamos trabalhando neste tema”. Assim o mapa marca “Você está aqui” e você sempre sabe de onde continuar, em qualquer aparelho.")}
${p("E quando terminar, marque como concluída: a fase ganha um ✓ e o pin anda para a próxima. As crianças adoram ver o caminho avançar.")}
${botao("Abrir o mapa da trilha", "/trilhas/portugues/1-ano", tipo)}`;
  return { assunto: "Um tema de cada vez: o mapa da trilha", previa, html: base({ tipo, previa, kicker: "dica do dia 5", titulo: "Como usar o mapa sem se perder", corpo, descadastro }) };
}

export function dia10(descadastro: string): Email {
  const tipo = "seq_d10";
  const previa = "Materiais grátis para imprimir, um pouco por dia.";
  const corpo = `${p("Separei para vocês alguns materiais <b>grátis para imprimir</b>. São folhas curtas, de 5 a 10 minutos por dia, com gabarito, para treinar o que a criança está aprendendo:")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${bloco("🔤", "Alfabetização", "Treinos de letras, de rimas e sílabas e de escrita do nome, e a apostila Escrever o Nome.", "/apostilas", tipo)}
${bloco("🧮", "Matemática", "Treinos de contagem até 100, de medidas e de frações.", "/apostilas", tipo)}
${bloco("💬", "Caderno de Conversa", "Perguntas e respostas para conversar com a criança sobre mais de cem livros.", "/apostilas/caderno-de-conversa", tipo)}
</table>
${p("E se tiver alguma dúvida sobre o estudo da sua criança, pode perguntar direto para mim na página <b>Pergunte à professora</b>. Eu respondo pessoalmente.")}
${botao("Ver os materiais grátis", "/apostilas", tipo)}`;
  return { assunto: "Um presente para imprimir 🎁", previa, html: base({ tipo, previa, kicker: "presente do dia 10", titulo: "Materiais grátis para imprimir", corpo, descadastro }) };
}

export type DadosMensal = {
  mes: string; // "novembro"
  desafio: { titulo: string; resumo: string; emoji: string };
  conquistas: { texto: string; autor: string }[];
  novidades: Novidade[];
  resposta?: { titulo: string; id: string };
};

export function mensal(d: DadosMensal, descadastro: string): Email {
  const tipo = `mensal_${d.mes}`;
  const previa = `${d.desafio.emoji} Desafio de ${d.mes}: ${d.desafio.titulo}. E as novidades do Atlas.`;
  const conq = d.conquistas.length ? `<h2 style="${T}font-size:20px;color:#1d2433;margin:24px 0 10px">👏 Conquistas que emocionaram</h2>
${d.conquistas.map((c) => `<p style="${F}font-size:15px;line-height:1.5;color:#1d2433;margin:0 0 10px;padding:10px 14px;background:#FFF8EC;border-radius:12px;border-left:4px solid #F2B33D">“${esc(c.texto)}”<br><span style="color:#56607a;font-size:13px">${esc(c.autor)}</span></p>`).join("")}
<p style="${F}font-size:14px;margin:0"><a href="${utm("/mural", tipo)}" style="color:#1d2433">Ver o mural e aplaudir →</a></p>` : "";
  const nov = d.novidades.length ? `<h2 style="${T}font-size:20px;color:#1d2433;margin:24px 0 10px">✨ Novidades no Atlas</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${d.novidades.map((n) => bloco("•", n.titulo, esc(n.texto), n.href, tipo).replace('font-size:30px;line-height:1">•', 'font-size:22px;line-height:1;color:#F2B33D">●')).join("")}</table>` : "";
  const resp = d.resposta ? `<h2 style="${T}font-size:20px;color:#1d2433;margin:24px 0 10px">💬 Pergunta respondida</h2>
${p(`<a href="${utm(`/duvidas/r/${d.resposta.id}`, tipo)}" style="color:#1d2433;font-weight:700">${esc(d.resposta.titulo)}</a>`)}` : "";
  const corpo = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e6f3ea;border:2px solid #1d2433;border-radius:16px"><tr><td style="padding:18px">
<p style="font-family:'Caveat','Comic Sans MS',cursive;font-size:20px;font-weight:700;color:#2f7d4f;margin:0">desafio de ${esc(d.mes)}</p>
<p style="${T}font-size:22px;color:#1d2433;margin:2px 0 8px">${d.desafio.emoji} ${esc(d.desafio.titulo)}</p>
<p style="${F}font-size:15px;line-height:1.5;color:#3d4456;margin:0">${esc(d.desafio.resumo)}</p>
${botao("Ver o desafio", "/desafio", tipo, "#1d2433")}
</td></tr></table>
${conq}${nov}${resp}`;
  return { assunto: `${d.desafio.emoji} Desafio de ${d.mes} e novidades do Atlas`, previa, html: base({ tipo, previa, kicker: `novidades de ${d.mes}`, titulo: `O que tem de novo em ${d.mes}`, corpo, descadastro }) };
}

export type DadosSaudade = { crianca?: string; fase?: { nome: string; href: string; emoji: string } };

export function saudade(d: DadosSaudade, descadastro: string): Email {
  const tipo = "saudade";
  const quem = d.crianca ? esc(d.crianca) : "a sua criança";
  if (d.fase) {
    const previa = `A próxima fase de ${d.crianca || "vocês"} é ${d.fase.nome}. Que tal 15 minutos hoje?`;
    const corpo = `${p(`Faz um tempinho que vocês não passam pelo Atlas, e o mapa guardou o lugar de vocês. A próxima fase de ${quem} é:`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bloco(d.fase.emoji, d.fase.nome, "Lá estão os livros, jogos, filmes e atividades deste tema, prontos para continuar de onde pararam.", d.fase.href, tipo)}</table>
${p("Não precisa de muito: <b>15 minutos hoje</b> já mantêm o ritmo. Uma leitura, um jogo ou uma folha do treino diário.")}
${botao("Continuar de onde paramos", d.fase.href, tipo)}`;
    return { assunto: `${d.fase.emoji} A próxima fase de ${d.crianca || "vocês"} está esperando`, previa, html: base({ tipo, previa, kicker: "sentimos sua falta", titulo: `${d.crianca ? d.crianca + ", a" : "A"} próxima fase espera por você`, corpo, descadastro }) };
  }
  const previa = "Que tal 15 minutos hoje? O diagnóstico mostra por onde recomeçar.";
  const corpo = `${p(`Faz um tempinho que vocês não passam pelo Atlas. Tudo bem: a vida acontece! Quando der vontade de voltar, um bom jeito de recomeçar é o diagnóstico: em uns 5 minutos ele mostra o que ${quem} já domina e qual é a próxima fase do mapa.`)}
${p("Não precisa de muito: <b>15 minutos</b> por dia, algumas vezes por semana, já fazem diferença.")}
${botao("Recomeçar pelo diagnóstico", "/diagnostico", tipo)}`;
  return { assunto: "Sentimos sua falta no Atlas 💛", previa, html: base({ tipo, previa, kicker: "sentimos sua falta", titulo: "Que tal 15 minutos hoje?", corpo, descadastro }) };
}
