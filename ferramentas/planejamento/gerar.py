"""
Gera o PDF de planejamento de estudos de uma família, no padrão do Atlas do Aprender.

Uso:
    python3 ferramentas/planejamento/gerar.py exemplo.json saida.pdf

O PDF (A4 deitado) tem:
  1. Diagnóstico de cada criança e objetivo da família
  2. A semana (o que fazer em cada dia)
  3. Os temas de cada criança (apostila, livros, filme, jogo, mão na massa)
  4. Calendário para marcar o que foi feito

Os temas vêm de data/conteudo.json e as apostilas de lib/apostilas.ts, então o plano acompanha o site.
Veja o formato do arquivo de entrada em exemplo.json.
"""
import base64, datetime as D, io, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
DADOS = json.load(open(os.path.join(RAIZ, "data", "conteudo.json")))
CORES = ["#1f6f78", "#c4672a", "#a8456e", "#2a5db0"]
JUNTOS = "#6b4fa0"
MAT = {"por": ("Português", "🔤", "#c4483b"), "mat": ("Matemática", "🔢", "#2a5db0"), "cie": ("Ciências", "🔭", "#2f7d4f")}
ANO = lambda a: "Alfabetização" if a == "1" else f"{a}º ano"
DS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
DIA_MATERIA = {0: ["por", "cie"], 1: ["mat"], 2: ["por", "cie"], 3: ["mat"], 4: ["por"]}


def fontes():
    out = []
    for fam, arq, w in [("Atkinson Hyperlegible", "atkinson-hyperlegible-latin{}-400-normal.woff2", 400), ("Atkinson Hyperlegible", "atkinson-hyperlegible-latin{}-700-normal.woff2", 700),
                        ("Young Serif", "young-serif-latin{}-400-normal.woff2", 400)]:
        for sub in ("", "-ext"):
            p = os.path.join(AQUI, "fonts", arq.format(sub))
            b = base64.b64encode(open(p, "rb").read()).decode()
            out.append(f'@font-face{{font-family:"{fam}";src:url(data:font/woff2;base64,{b}) format("woff2");font-weight:{w}}}')
    return "\n".join(out)


def apostilas():
    """Lê slug, título, matéria, ano e tema das apostilas do site."""
    txt = open(os.path.join(RAIZ, "lib", "apostilas.ts")).read()
    out = {}
    for m in re.finditer(r'slug: "([^"]+)",\s*titulo: "([^"]+)",.*?materia: "(\w+)", ano: "(\d)", tema: (\d+)', txt, re.S):
        slug, tit, mat, ano, tema = m.groups()
        out[(mat, ano, int(tema))] = (slug, tit)
    return out


AP = apostilas()


def capa(slug, w=11):
    p = os.path.join(RAIZ, "public", "apostilas", slug, "capa.webp")
    if not os.path.exists(p):
        return ""
    from PIL import Image
    im = Image.open(p).convert("RGB"); im.thumbnail((200, 283)); b = io.BytesIO(); im.save(b, "JPEG", quality=84)
    return f'<img src="data:image/jpeg;base64,{base64.b64encode(b.getvalue()).decode()}" style="width:{w}mm;border-radius:.8mm;box-shadow:0 0 0 .4pt #0003">'


def tema(t):
    d = DADOS["T"][t["materia"]][t["ano"]][t["tema"] - 1]
    ap = AP.get((t["materia"], t["ano"], t["tema"]))
    return d, ap


def rotulo(t):
    d, ap = tema(t)
    return f"Apostila {ap[1]}" if ap else f"Trilha: {d['t']}"


def primeiros(lst, k=1):
    return [re.sub(r"\s+—\s+.*$", "", x) for x in (lst or []) if x.strip() != "—"][:k]


# ------------------------------------------------------------------ montagem
def montar(cfg):
    kids = cfg["criancas"]
    usadas = set()
    for i, c in enumerate(kids):
        c["cor"] = c.get("cor") or CORES[i % len(CORES)]
        l = c["nome"][0].upper()
        c["letra"] = l if l not in usadas else c["nome"][:2].title()
        usadas.add(c["letra"])
    juntos = cfg.get("juntos", [])
    extras = cfg.get("extras", [])  # {"quem": nome ou "juntos", "texto": "...", "icone": "🏅", "dias": ["Seg", ...]}
    WHO = {c["nome"]: (c["letra"], c["cor"]) for c in kids}
    WHO["juntos"] = ("★", JUNTOS)

    def linha(quem, ic, txt):
        l, cor = WHO[quem]
        return f'<div class="it"><b class="w" style="background:{cor}">{l}</b><span class="em">{ic}</span><span>{txt}</span></div>'

    def itens_dia(wd):
        out = []
        for m in DIA_MATERIA.get(wd, []):
            for c in kids:
                for t in c.get("temas", []):
                    if t["materia"] == m:
                        out.append((c["nome"], MAT[m][1], rotulo(t)))
            for t in juntos:
                if t["materia"] == m:
                    out.append(("juntos", MAT[m][1], rotulo(t)))
        for e in extras:
            if DS[wd] in e.get("dias", []):
                out.append((e["quem"], e.get("icone", "⭐"), e["texto"]))
        if wd == 5: out.append(("juntos", "🧪", "Mão na massa"))
        if wd == 6: out.append(("juntos", "🎲", "Jogo em família"))
        return out

    NOITE = {1: ("📺", "Episódios curtos ou documentário"), 4: ("🎬", "Filme em família")}
    familia = cfg.get("familia", "Família")
    inicio = D.date.fromisoformat(cfg["inicio"])
    ndias = cfg.get("dias", 30)
    fim = inicio + D.timedelta(days=ndias - 1)
    data_txt = lambda d: f"{d.day:02d}/{d.month:02d}"
    legenda = "".join(f'<span class="chip"><b class="w" style="background:{c["cor"]}">{c["letra"]}</b>{c["nome"]}</span>' for c in kids)
    if juntos or True:
        legenda += f'<span class="chip"><b class="w" style="background:{JUNTOS}">★</b>Juntos</span>'
    legenda += "".join(f'<span class="chip"><span class="em">{v[1]}</span>{v[0]}</span>' for v in MAT.values())
    rod = f'<footer><span>Planejamento feito por Stephanie Kamarry com o Atlas do Aprender · www.atlasdoaprender.com.br</span><span>{familia}</span></footer>'
    pags = []

    # 1. diagnóstico
    cards = ""
    for c in kids:
        dg = c.get("diagnostico", {})
        campos = [("📖", "Leitura", dg.get("leitura")), ("🔢", "Matemática", dg.get("matematica")), ("💪", "Pontos fortes", dg.get("pontos_fortes")),
                  ("🎯", "O que vamos reforçar", dg.get("reforcar")), ("💛", "Do que gosta", dg.get("interesses"))]
        cards += f'''<div class="dg" style="--c:{c["cor"]}"><div class="dg-h"><b class="w big" style="background:{c["cor"]}">{c["letra"]}</b><div><h3>{c["nome"]}</h3><span>{c.get("idade", "")} anos · {c.get("ano", "")}</span></div></div>
{"".join(f'<div class="dl"><span class="em">{e}</span><div><b>{n}</b>{v}</div></div>' for e, n, v in campos if v)}</div>'''
    pags.append(f'''<section class="pg"><div class="faixa"><i style="background:#c4483b"></i><i style="background:#2a5db0"></i><i style="background:#2f7d4f"></i><i style="background:#b07a12"></i></div>
<header><div><p class="k">Planejamento de estudos · {data_txt(inicio)} a {data_txt(fim)}/{fim.year}</p><h1>{familia}</h1></div></header>
{f'<div class="obj"><b>Objetivo da família:</b> {cfg["objetivo"]}</div>' if cfg.get("objetivo") else ""}
<div class="dgs" style="grid-template-columns:repeat({min(len(kids), 3)},1fr)">{cards}</div>
<div class="combina"><b>Como vamos fazer</b><span>{cfg.get("como", "Encontros curtos, de 15 a 20 minutos, quase todos os dias. Cada criança segue a apostila no seu ritmo; o que não der num dia fica para o outro. Pare antes do cansaço e comemore cada avanço.")}</span></div>
{rod}</section>''')

    # 2. semana
    dias = []
    for wd in range(7):
        its = "".join(linha(*x) for x in itens_dia(wd))
        n = f'<div class="noite"><span class="em">{NOITE[wd][0]}</span><span><i>À noite:</i> {NOITE[wd][1]}</span></div>' if wd in NOITE else ""
        dias.append(f'<div class="dia{" fds" if wd >= 5 else ""}"><h3>{["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"][wd]}</h3>{its}{n}<div class="lt"><span class="em">📚</span> Leitura da noite</div></div>')
    pags.append(f'''<section class="pg"><header><div><h1>A semana</h1><p class="sub">Blocos de 15 a 20 minutos. Cada um faz a apostila do dia no seu ritmo.</p></div><div class="leg">{legenda}</div></header>
<div class="semana">{"".join(dias)}</div>{rod}</section>''')

    # 3. temas por criança
    def card(t, junto=""):
        d, ap = tema(t)
        nome, ic, cor = MAT[t["materia"]]
        livros = [b for b, _ in d.get("l", [])][:2]
        ls = [("📚", "Livros", livros), ("🎬", "Filme ou série", primeiros(d.get("f"))), ("🎲", "Jogo", primeiros(d.get("j"), 2)), ("🧪", "Mão na massa", primeiros(d.get("p"), 2))]
        corpo = "".join(f'<div class="l"><span class="em">{e}</span><div><b>{n}</b>{"<br>".join(v)}</div></div>' for e, n, v in ls if v)
        apb = f'<div class="ap">{capa(ap[0])}<div><small>Apostila</small><b>{ap[1]}</b></div></div>' if ap else '<div class="ap"><div><small>Material</small><b>Trilha do site</b></div></div>'
        return f'''<div class="card" style="--c:{cor}"><div class="top"><p class="k2">{nome} · {ANO(t["ano"])} · tema {t["tema"]}</p><h3>{d["t"]}</h3>{f'<span class="junto">{junto}</span>' if junto else ""}</div>{apb}{corpo}</div>'''

    for c in kids:
        outros = [k["nome"] for k in kids if k is not c]
        cs = [card(t) for t in c.get("temas", [])] + [card(t, "juntos" if not outros else "com " + " e ".join(outros)) for t in juntos]
        pags.append(f'''<section class="pg"><header><div><h1>Os temas de <span style="color:{c["cor"]}">{c["nome"]}</span></h1><p class="sub">O essencial de cada tema. Escolha uma ou duas portas por semana.</p></div></header>
<div class="cards" style="grid-template-columns:repeat({max(min(len(cs), 5), 3)},minmax(0,1fr))">{"".join(cs)}</div>{rod}</section>''')

    # 4. calendário
    seg0 = inicio - D.timedelta(days=inicio.weekday())
    semanas = ((fim - seg0).days // 7) + 1
    def fila(l, cor, ics):
        return f'<div class="f"><b class="w" style="background:{cor}">{l}</b>{"".join(f"<span class=b style=--c:{cor}><i></i><span class=em>{x}</span></span>" for x in ics)}</div>'
    cels = []
    for k in range(semanas * 7):
        d = seg0 + D.timedelta(days=k)
        if d < inicio or d > fim:
            cels.append('<div class="c off"></div>'); continue
        wd = d.weekday()
        filas = ""
        for c in kids:
            ics = sorted({MAT[t["materia"]][1] for t in c.get("temas", []) if t["materia"] in DIA_MATERIA.get(wd, [])}, key="🔤🔢🔭".index)
            ics += [e.get("icone", "⭐") for e in extras if e["quem"] == c["nome"] and DS[wd] in e.get("dias", [])]
            filas += fila(c["letra"], c["cor"], ics + ["📚"])
        jics = sorted({MAT[t["materia"]][1] for t in juntos if t["materia"] in DIA_MATERIA.get(wd, [])}, key="🔤🔢🔭".index)
        jics += [e.get("icone", "⭐") for e in extras if e["quem"] == "juntos" and DS[wd] in e.get("dias", [])]
        jics += {1: ["📺"], 4: ["🎬"], 5: ["🧪"], 6: ["🎲"]}.get(wd, [])
        if jics: filas += fila("★", JUNTOS, jics)
        cels.append(f'<div class="c{" fds" if wd >= 5 else ""}"><div class="h"><b>{data_txt(d)}</b><span>{DS[wd]}</span></div>{filas}</div>')
    pags.append(f'''<section class="pg"><header><div><h1>O que fizemos</h1><p class="sub">{data_txt(inicio)} a {data_txt(fim)} · marque cada quadradinho quando a atividade for feita</p></div><div class="leg">{legenda}<span class="chip"><span class="em">📚</span>Leitura</span></div></header>
<div class="dh">{"".join(f"<span>{x}</span>" for x in DS)}</div><div class="cal" style="grid-template-rows:repeat({semanas},minmax(0,1fr))">{"".join(cels)}</div>{rod}</section>''')
    return "".join(pags)


CSS = r"""
@page{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0}
body{font:10.4pt/1.3 "Atkinson Hyperlegible",sans-serif;color:#1d2433;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.em{font-family:"Noto Color Emoji";line-height:1}
.pg{width:297mm;height:210mm;padding:8mm 9mm 6mm;display:flex;flex-direction:column;gap:3.4mm;break-after:page;overflow:hidden;position:relative}
.pg:last-child{break-after:auto}
.faixa{display:flex;height:6mm;margin:-8mm -9mm 2mm}.faixa i{flex:1}
header{display:flex;justify-content:space-between;align-items:flex-end;gap:5mm}
h1{font:400 23pt/1.05 "Young Serif",serif;margin:0}
.k{margin:0;font-size:8pt;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5b6476}
.sub{margin:1.4mm 0 0;font-size:10pt;color:#5b6476}
.leg{display:flex;flex-wrap:wrap;gap:1.4mm 3mm;justify-content:flex-end;max-width:150mm;font-size:8.6pt}
.chip{display:inline-flex;align-items:center;gap:1.2mm}
.w{display:inline-grid;place-items:center;min-width:5mm;height:5mm;padding:0 .8mm;border-radius:1.2mm;color:#fff;font-size:7.6pt;font-weight:700;flex:none}
.w.big{min-width:11mm;height:11mm;font-size:14pt;border-radius:2mm}
footer{margin-top:auto;font-size:7.8pt;color:#5b6476;display:flex;justify-content:space-between;border-top:.5pt solid #dfe2d8;padding-top:1.4mm}
.obj{background:#f6f7f2;border-radius:2.4mm;padding:3mm 4mm;font-size:11.4pt}
.dgs{display:grid;gap:4mm;flex:1;min-height:0}
.dg{border:1pt solid #dfe2d8;border-top:5px solid var(--c);border-radius:2.6mm;padding:3.4mm 4mm;display:flex;flex-direction:column;gap:2.6mm}
.dg-h{display:flex;gap:3mm;align-items:center}.dg h3{font:400 16pt/1 "Young Serif",serif;margin:0}.dg-h span{font-size:9.6pt;color:#5b6476}
.dl{display:flex;gap:2.4mm}.dl .em{font-size:13pt}.dl b{display:block;font-size:7.6pt;letter-spacing:.1em;text-transform:uppercase;color:var(--c)}
.combina{background:#fbf3e0;border-radius:2.4mm;padding:3mm 4mm;display:grid;gap:1mm;font-size:10.6pt}.combina b{font-family:"Young Serif",serif;font-weight:400;font-size:12pt}
.semana{flex:1;display:grid;grid-template-columns:repeat(7,1fr);gap:2.4mm;min-height:0}
.dia{border:1pt solid #1d2433;border-radius:2.6mm;padding:3mm 2.6mm;display:flex;flex-direction:column;gap:2.4mm}
.dia.fds{background:#faf8f3;border-color:#b9bdb0}
.dia h3{font:400 14pt/1 "Young Serif",serif;margin:0 0 1mm;text-align:center}
.it{display:flex;gap:1.4mm;align-items:flex-start;font-size:10pt}.it .em{font-size:10pt;margin-top:.3mm}
.noite{display:flex;gap:1.4mm;background:#1d2433;color:#fff;border-radius:1.8mm;padding:1.6mm 2mm;margin-top:auto;font-size:9.6pt}.noite i{font-style:normal;color:#ffd98a;font-weight:700}
.lt{font-size:8.6pt;color:#5b6476;border-top:.6pt dashed #dfe2d8;padding-top:1.6mm}
.dia:not(:has(.noite)) .lt{margin-top:auto}
.cards{flex:1;display:grid;gap:3mm;min-height:0}
.card{border:.8pt solid #dfe2d8;border-radius:2.6mm;overflow:hidden;display:flex;flex-direction:column}
.card .top{background:var(--c);color:#fff;padding:2.6mm 3mm;min-height:25mm}
.k2{margin:0;font-size:6.8pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;opacity:.9}
.card h3{font:400 12.6pt/1.12 "Young Serif",serif;margin:1mm 0 0}
.junto{display:inline-block;margin-top:1.4mm;background:#fff;color:var(--c);border-radius:1.4mm;padding:.3mm 1.8mm;font-size:7pt;font-weight:700}
.ap{display:flex;gap:2.4mm;align-items:center;padding:2.4mm 3mm;border-bottom:.6pt solid #dfe2d8;background:#f6f7f2}
.ap small{display:block;font-size:6.8pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--c)}.ap b{font-size:10pt}
.l{display:flex;gap:2mm;padding:2.2mm 3mm 0;font-size:9.6pt}.l .em{font-size:11pt;margin-top:.4mm}
.l b{display:block;font-size:7.2pt;letter-spacing:.1em;text-transform:uppercase;color:var(--c)}
.dh{display:grid;grid-template-columns:repeat(7,1fr);gap:1.6mm;font-weight:700;font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:#5b6476;text-align:center}
.cal{flex:1;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1.6mm;min-height:0}
.c{border:.8pt solid #cfd3c8;border-radius:2mm;padding:1.4mm 1.6mm;display:flex;flex-direction:column;gap:1.1mm;overflow:hidden}
.c.fds{background:#faf8f3}.c.off{background:#f2f3ee;border-style:dashed}
.h{display:flex;justify-content:space-between;align-items:baseline}.h b{font-size:10.4pt}.h span{font-size:7.4pt;color:#5b6476}
.f{display:flex;gap:.8mm;align-items:center}
.b{display:inline-flex;align-items:center;gap:.4mm}.b i{width:4.6mm;height:4.6mm;border:.8pt solid var(--c);border-radius:1mm;display:inline-block}.b .em{font-size:8.6pt}
"""


def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    cfg = json.load(open(sys.argv[1]))
    html = f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>{fontes()}{CSS}</style></head><body>{montar(cfg)}</body></html>'
    tmp = os.path.abspath(sys.argv[2]) + ".html"
    open(tmp, "w").write(html)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1123, "height": 794})
        pg.goto("file://" + tmp); pg.wait_for_timeout(1200)
        cheias = pg.evaluate("()=>[...document.querySelectorAll('.pg')].map((s,i)=>s.scrollHeight>s.clientHeight+1?i+1:0).filter(Boolean)")
        if cheias: print("Atenção: conteúdo passou do limite nas páginas", cheias)
        pg.pdf(path=sys.argv[2], width="297mm", height="210mm", print_background=True)
        b.close()
    os.remove(tmp)
    print("PDF gerado:", sys.argv[2])


if __name__ == "__main__":
    main()
