// Gera ferramentas/mao-na-massa/PROMPTS-FOTOS.md com o prompt da foto de cada atividade.
// Rodar: node ferramentas/mao-na-massa/gerar-prompts.mjs
import fs from "node:fs";
const xs = JSON.parse(fs.readFileSync("data/mao-na-massa.json", "utf8"));
const prompt = (x) => `Foto realista, luz natural de janela, ambiente de casa brasileira, cores alegres e foco no objeto pronto: ${x.foto}. Sem texto, sem marcas e sem logotipos na imagem. Formato quadrado 4:3, alta resolução.`;
let md = "# Fotos das atividades mão na massa\n\nSalve cada foto em `public/mao-na-massa/<arquivo>` no formato **.webp** (4:3, por volta de 1200 × 900). Assim que o arquivo existir, a foto aparece sozinha no card e na página da atividade.\n\nMelhor ainda que gerar: fotografar a atividade feita de verdade em casa.\n\n";
for (const x of xs) md += `## ${x.n}\n\nArquivo: \`${x.slug}.webp\`\n\n> ${prompt(x)}\n\n`;
fs.writeFileSync("ferramentas/mao-na-massa/PROMPTS-FOTOS.md", md);
console.log(`${xs.length} prompts gerados.`);
