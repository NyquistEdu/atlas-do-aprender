"""Gera o PDF 'Roteiro do diagnóstico' para usar na videochamada com a família.
Uso: python3 ferramentas/planejamento/roteiro.py saida.pdf"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerar import fontes

SQ = '<span class="sq"></span>'
NIV = f'<span class="niv">{SQ} consegue {SQ} com ajuda {SQ} ainda não</span>'


def tarefa(n, titulo, mostrar, obs=""):
    return f'<div class="t"><div class="tn">{n}</div><div class="tb"><div class="tt"><b>{titulo}</b>{NIV}</div><div class="mostra">{mostrar}</div>{f"<small>{obs}</small>" if obs else ""}</div></div>'


def pagina(titulo, kicker, corpo, n):
    return f'''<section class="pg"><div class="band"><span>{kicker}</span><span>ROTEIRO DO DIAGNÓSTICO</span></div><div class="in"><h1>{titulo}</h1>{corpo}</div>
<div class="foot"><span><b>Atlas do Aprender</b> · Planejamento gratuito · © Stephanie Kamarry</span><b>{n}</b></div></section>'''


P = []
P.append(pagina("Antes de começar", "A CONVERSA", f'''
<p class="sub">Uma videochamada de uns 40 minutos: 15 com a família, 20 com a criança, 5 para combinar os próximos passos.</p>
<div class="box"><p class="lbl">1 · Com a família (15 min)</p><ul>
<li>Confirmar o que veio no formulário: ano escolar, escola ou estudo em casa, quem acompanha, quanto tempo por dia.</li>
<li>Como é um dia comum da criança? Em que horário ela está mais disposta?</li>
<li>O que já tentaram? O que funcionou e o que virou briga?</li>
<li>Do que a criança gosta muito? (vai entrar nos exemplos e nas atividades)</li>
<li>O que a família espera daqui a um mês? E daqui a seis meses?</li>
<li>Há alguma avaliação, acompanhamento ou necessidade específica que ajude a entender a criança?</li></ul></div>
<div class="box"><p class="lbl">2 · Com a criança (20 min)</p><ul>
<li>Comece conversando sobre o que ela gosta. Diga que não é prova: “quero conhecer você para preparar atividades legais”.</li>
<li>Siga as tarefas de leitura (p. 2) e de matemática (p. 3) <b>na ordem</b>, e pare quando ela travar duas vezes seguidas: dali começa o plano.</li>
<li>Peça para a família mostrar o caderno da escola, se houver.</li>
<li>Elogie o esforço. Se cansar, pare: dá para completar depois.</li></ul></div>
<div class="box"><p class="lbl">3 · Fechamento (5 min)</p><ul>
<li>Contar à família o que você observou, sempre começando pelo que a criança já sabe.</li>
<li>Combinar a rotina possível (dias, horário e tempo) e quem acompanha.</li>
<li>Avisar quando o planejamento vai chegar e por onde.</li></ul></div>
<p class="dica">Dica: deixe esta folha e a ficha da p. 4 abertas durante a chamada. As tarefas podem ser mostradas na tela ou escritas num papel que a família segura para a criança.</p>''', 1))

leitura = "".join([
    tarefa(1, "Nomear letras", '<span class="big">B&nbsp; M&nbsp; A&nbsp; S&nbsp; T&nbsp; O&nbsp; R&nbsp; L&nbsp; E&nbsp; P&nbsp; U&nbsp; F</span>', "Pergunte o nome e o som de cada letra."),
    tarefa(2, "Separar em sílabas com palmas", "pato · boneca · sol · borboleta", "Quantas palmas tem cada palavra?"),
    tarefa(3, "Rima", "gato · pato · bola (qual não rima?) · Que palavra rima com “mão”?"),
    tarefa(4, "Ler sílabas", '<span class="big">BA&nbsp; MI&nbsp; TO&nbsp; LU&nbsp; PE&nbsp; FA</span>'),
    tarefa(5, "Ler palavras simples e complexas", '<span class="big">bola&nbsp; casa&nbsp; menino&nbsp; prato&nbsp; chuva&nbsp; flor</span>'),
    tarefa(6, "Ler uma frase", '<span class="big">O gato subiu no muro e miou.</span>'),
    tarefa(7, "Ler um texto curto e entender", "“Lia tinha um cachorro chamado Pipoca. Um dia, Pipoca fugiu atrás de uma borboleta. Lia o encontrou dormindo debaixo da mangueira.” → Qual era o nome do cachorro? Por que ele fugiu? Onde estava?"),
    tarefa(8, "Escrever", "Ditado: sapo · janela · prato · e a frase “Eu gosto de brincar.”", "Peça para mostrar o papel na câmera."),
])
P.append(pagina("Leitura e escrita", "PORTUGUÊS", f'''<p class="sub">Siga a ordem e pare quando a criança travar duas vezes seguidas.</p>{leitura}
<div class="box verde"><p class="lbl">Onde começar no Atlas</p><table>
<tr><td>Parou nas tarefas 1 a 3</td><td>Alfabetização · tema 1 (rimas e sílabas) · apostila <b>Brincar com as Palavras</b></td></tr>
<tr><td>Parou na tarefa 4</td><td>Alfabetização · tema 2 (letras e seus sons) · apostila <b>Ouvir as Letras</b></td></tr>
<tr><td>Parou nas tarefas 5 e 6</td><td>Alfabetização · temas 3 e 4, depois 2º ano · temas 1 e 2</td></tr>
<tr><td>Lê, mas não entende (tarefa 7)</td><td>2º ano · tema 2 e 3º ano · temas 3 e 4 (fábulas, poesia), com perguntas do Caderno de Conversa</td></tr>
<tr><td>Fez tudo</td><td>Temas do ano escolar; reforçar ortografia (3º ano · tema 1) e produção de texto</td></tr></table></div>''', 2))

mat = "".join([
    tarefa(1, "Contar objetos", "Peça para contar 15 objetos de verdade (tampinhas, lápis).", "Repara se aponta um a um, sem pular e sem repetir."),
    tarefa(2, "Sequência e números", '<span class="big">7&nbsp; 15&nbsp; 48&nbsp; 102</span> · contar de 10 em 10 até 100', "Ler os números e dizer qual é o maior."),
    tarefa(3, "Somar e subtrair", '<span class="big">3 + 4&nbsp;&nbsp; 9 − 5&nbsp;&nbsp; 27 + 15&nbsp;&nbsp; 50 − 18</span>', "Pode usar os dedos ou papel; observe a estratégia."),
    tarefa(4, "Multiplicar", '<span class="big">3 × 4&nbsp;&nbsp; 6 × 7</span> · “3 pacotes com 5 balas, quantas balas?”'),
    tarefa(5, "Dividir", "“12 balas para 3 crianças, quantas para cada uma?”"),
    tarefa(6, "Frações e medidas", "Metade de 10 · Qual é maior, 1/2 ou 1/4? · Quantos centímetros tem 1 metro?"),
    tarefa(7, "Problema", "“Comprei um lanche de R$ 7 e paguei com R$ 10. Quanto recebi de troco?”"),
])
P.append(pagina("Matemática", "MATEMÁTICA", f'''<p class="sub">Siga a ordem e pare quando a criança travar duas vezes seguidas.</p>{mat}
<div class="box azul"><p class="lbl">Onde começar no Atlas</p><table>
<tr><td>Parou nas tarefas 1 e 2</td><td>Alfabetização · tema 1 (contagem e números até 100) · apostila <b>Contar até Cem</b></td></tr>
<tr><td>Parou na tarefa 3</td><td>Alfabetização · tema 3 e 2º ano · temas 1 e 2 (numeração, adição e subtração)</td></tr>
<tr><td>Parou nas tarefas 4 e 5</td><td>3º ano · temas 1 e 2 (multiplicação, divisão)</td></tr>
<tr><td>Parou na tarefa 6</td><td>3º ano · temas 3 e 5 · apostilas <b>Medir o Mundo</b> e <b>Pedaço por Pedaço</b></td></tr>
<tr><td>Fez tudo</td><td>Temas do 4º e 5º ano</td></tr></table></div>
<p class="dica"><b>Ciências:</b> não precisa de teste. Escolha o tema do ano escolar que mais combina com os interesses da criança; é ótimo para fazer junto com irmãos.</p>''', 3))

def campo(t, h=12):
    return f'<div class="campo"><b>{t}</b><div style="height:{h}mm"></div></div>'

P.append(pagina("Ficha para o plano", "ANOTAÇÕES", f'''<p class="sub">Uma ficha por criança. É com ela que o planejamento é montado.</p>
<div class="g2">{campo("Família", 8)}{campo("Criança, idade e ano escolar", 8)}</div>
<div class="g2">{campo("Leitura: onde parou e o que observei")}{campo("Matemática: onde parou e o que observei")}</div>
<div class="g2">{campo("Pontos fortes")}{campo("Do que gosta")}</div>
{campo("O que vamos reforçar primeiro", 14)}
<div class="g3">{campo("Tema de Português", 14)}{campo("Tema de Matemática", 14)}{campo("Tema de Ciências (ou juntos)", 14)}</div>
<div class="g2">{campo("Rotina combinada: dias, horário e tempo", 14)}{campo("Quem acompanha e como prefere receber o plano", 14)}</div>
{campo("Extras (olimpíada, livro da escola, prova…) e observações", 16)}''', 4))

CSS = r"""
@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0}
body{font:11pt/1.42 "Atkinson Hyperlegible",sans-serif;color:#1d2433;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;position:relative;overflow:hidden;break-after:page}.pg:last-child{break-after:auto}
.band{height:9mm;display:flex;justify-content:space-between;align-items:center;padding:0 15mm;background:#1d2433;color:#fff;font-weight:700;font-size:8pt;letter-spacing:.16em}
.in{padding:8mm 15mm 0;display:flex;flex-direction:column;gap:2.6mm}
h1{font:400 24pt/1.1 "Young Serif",serif;margin:0}
.sub{margin:-1mm 0 0;color:#5b6476}
.box{border:1.2pt solid #9aa3b5;background:#f2f4f7;border-radius:3mm;padding:3mm 4mm}.box.verde{border-color:#2f7d4f;background:#e6f3ea}.box.azul{border-color:#2a5db0;background:#e9f0fb}
.lbl{margin:0 0 1.4mm;font-size:7.8pt;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#5b6476}
.box ul{margin:0;padding-left:5mm}.box li{margin-bottom:1mm}.box p{margin:0}
.t{display:flex;gap:3mm;border-bottom:.6pt dashed #cfd3c8;padding-bottom:1.4mm}
.tn{width:7mm;height:7mm;border-radius:50%;background:#1d2433;color:#fff;display:grid;place-items:center;font-weight:700;font-size:9.6pt;flex:none}
.tb{flex:1;display:grid;gap:.5mm}.tt{display:flex;justify-content:space-between;gap:3mm;align-items:center}.tb small{color:#5b6476;font-size:9pt}
.mostra{font-size:10.6pt}.big{font-family:"Young Serif",serif;font-size:14pt;letter-spacing:.02em}
.niv{font-size:9pt;color:#5b6476;display:flex;gap:2mm;align-items:center}
.sq{display:inline-block;width:4mm;height:4mm;border:.8pt solid #1d2433;border-radius:1mm;vertical-align:middle}
table{border-collapse:collapse;width:100%;font-size:9.8pt}td{border-top:.6pt solid #0002;padding:1.4mm 2mm;vertical-align:top}td:first-child{width:38%;font-weight:700}
.dica{font-size:9.4pt;color:#5b6476;margin:0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:3mm}.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.campo{border:.8pt solid #cfd3c8;border-radius:2mm;padding:2mm 3mm}.campo b{font-size:8.4pt;letter-spacing:.08em;text-transform:uppercase;color:#5b6476}
.foot{position:absolute;left:15mm;right:15mm;bottom:8mm;border-top:.6pt solid #dfe2d8;padding-top:2mm;display:flex;justify-content:space-between;font-size:7.4pt;color:#5b6476}
"""

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "roteiro.pdf"
    tmp = os.path.abspath(out) + ".html"
    open(tmp, "w").write(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>{fontes()}{CSS}</style></head><body>{"".join(P)}</body></html>')
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 794, "height": 1123})
        pg.goto("file://" + tmp); pg.wait_for_timeout(1000)
        print("folga:", pg.evaluate("()=>[...document.querySelectorAll('.pg')].map(s=>{const f=s.querySelector('.foot').getBoundingClientRect().top;let m=0;s.querySelectorAll('.in *').forEach(e=>{m=Math.max(m,e.getBoundingClientRect().bottom)});return Math.round(f-m)})"))
        pg.pdf(path=out, format="A4", print_background=True)
        b.close()
    os.remove(tmp)
    print("PDF gerado:", out)
