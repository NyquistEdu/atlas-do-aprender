# Planejamento gratuito: ferramentas

Ferramentas para o atendimento do planejamento gratuito (página /planejamento do site).

## Fluxo

1. A família preenche o formulário em /planejamento. Os pedidos aparecem em /planejamento/pedidos (só para a administradora) e ficam na tabela `pedidos_planejamento` do Supabase.
2. Na videochamada, use o **Roteiro do diagnóstico** (`roteiro.py`): conversa com a família, tarefas de leitura e de matemática, tabela "onde começar no Atlas" e a ficha para o plano.
3. Com a ficha preenchida, monte um arquivo como `exemplo.json` e gere o planejamento com `gerar.py`.

## Comandos

```bash
python3 ferramentas/planejamento/roteiro.py Roteiro-do-diagnostico.pdf
python3 ferramentas/planejamento/gerar.py ferramentas/planejamento/exemplo.json Planejamento-Familia.pdf
```

Precisa de Python com Playwright (Chromium) e Pillow, e da fonte Noto Color Emoji instalada.

## Formato do arquivo da família (`exemplo.json`)

- `familia`, `inicio` (AAAA-MM-DD), `dias` (padrão 30), `objetivo`, `como` (texto livre sobre a rotina combinada).
- `criancas`: lista com `nome`, `idade`, `ano`, `diagnostico` (`leitura`, `matematica`, `pontos_fortes`, `reforcar`, `interesses`) e `temas` individuais.
- `juntos`: temas feitos pelos irmãos juntos.
- `extras`: atividades extras com dias fixos, por exemplo `{"quem": "Lia", "texto": "Olimpíada: apostila do livro", "icone": "🏅", "dias": ["Seg","Ter","Qua"]}` (`quem` pode ser `"juntos"`).
- Cada tema é `{"materia": "por" | "mat" | "cie", "ano": "1".."5", "tema": número}`, igual às trilhas do site. A apostila do tema aparece sozinha quando existe em `lib/apostilas.ts`.

A semana segue o padrão do Atlas: Português segunda, quarta e sexta; Matemática terça e quinta; Ciências segunda e quarta; episódios na terça à noite, filme na sexta, mão na massa no sábado e jogo no domingo.
