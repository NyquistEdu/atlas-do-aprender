"use client";
/**
 * Mesa de escrever em 3D: uma prancheta com a folha do texto (notícia, carta ou receita)
 * desenhada de verdade. As partes que faltam aparecem como caixas tracejadas; a última parte
 * colocada fica marcada com marca-texto. Ao lado, objetos do gênero: jornais, envelope ou tigela.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { criarPalco } from "./palco3d";

export type GeneroP = "noticia" | "carta" | "receita";
export type ParteP = { id: string; nome: string; txt: string };
export type FolhaP = { genero: GeneroP; partes: ParteP[]; feitas: number; destaque?: boolean };
export type CasoPapel = { folha: FolhaP; legenda?: string };

const W = 860, H = 1180;

function quebrar(g: CanvasRenderingContext2D, txt: string, larg: number) {
  const linhas: string[] = [];
  txt.split("\n").forEach((par) => {
    let atual = "";
    par.split(" ").forEach((p) => { const t = atual ? `${atual} ${p}` : p; if (g.measureText(t).width > larg && atual) { linhas.push(atual); atual = p; } else atual = t; });
    linhas.push(atual);
  });
  return linhas;
}

function desenhar(c: HTMLCanvasElement, f: FolhaP) {
  const g = c.getContext("2d")!;
  const { genero, partes, feitas } = f;
  const serif = "Georgia, 'Times New Roman', serif", sans = "'Atkinson Hyperlegible', system-ui, sans-serif", mao = "'Caveat', 'Comic Sans MS', cursive";
  // fundo
  if (genero === "noticia") { g.fillStyle = "#f3efe4"; g.fillRect(0, 0, W, H); }
  else if (genero === "carta") {
    g.fillStyle = "#fffdf6"; g.fillRect(0, 0, W, H);
    g.strokeStyle = "#c9dcf2"; g.lineWidth = 2; for (let y = 150; y < H - 40; y += 56) { g.beginPath(); g.moveTo(40, y); g.lineTo(W - 40, y); g.stroke(); }
    g.strokeStyle = "#f2a3a3"; g.lineWidth = 3; g.beginPath(); g.moveTo(110, 40); g.lineTo(110, H - 30); g.stroke();
  } else {
    g.fillStyle = "#fffaf0"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#4fb37a"; g.fillRect(0, 0, W, 26);
    g.strokeStyle = "#e7dcc4"; g.lineWidth = 2; g.strokeRect(24, 40, W - 48, H - 64);
  }
  let y = 60;
  const margem = genero === "carta" ? 130 : 70, larg = W - margem - 70;
  if (genero === "noticia") {
    g.fillStyle = "#1d2433"; g.font = `900 72px ${serif}`; g.textAlign = "center"; g.fillText("JORNAL DO ATLAS", W / 2, 120);
    g.font = `600 24px ${sans}`; g.fillStyle = "#56607a"; g.fillText("Aracaju · edição de hoje · Cidade", W / 2, 160);
    g.fillStyle = "#1d2433"; g.fillRect(60, 180, W - 120, 5); g.fillRect(60, 190, W - 120, 2);
    g.textAlign = "left"; y = 240;
  }
  const marca = (y0: number, h: number) => { g.fillStyle = "rgba(246, 211, 91, .55)"; g.fillRect(margem - 14, y0 - 8, larg + 28, h + 10); };
  const vazio = (y0: number, h: number, rot: string) => {
    g.save(); g.setLineDash([14, 10]); g.strokeStyle = "#b9b2a0"; g.lineWidth = 4; g.strokeRect(margem - 6, y0, larg + 12, h);
    g.restore(); g.fillStyle = "#b9b2a0"; g.font = `700 30px ${sans}`; g.textAlign = "center"; g.fillText(`? ${rot}`, W / 2, y0 + h / 2 + 10); g.textAlign = "left";
  };
  partes.forEach((p, i) => {
    const pronta = i < feitas, ultima = f.destaque && i === feitas - 1;
    // tipografia de cada parte
    let fonte = `400 31px ${sans}`, lh = 42, alinhar: CanvasTextAlign = "left", cor = "#1d2433", antes = 14, altVazio = 90;
    if (genero === "noticia") {
      if (p.id === "titulo") { fonte = `800 60px ${serif}`; lh = 66; altVazio = 140; antes = 6; }
      else if (p.id === "fina") { fonte = `italic 400 32px ${serif}`; lh = 42; cor = "#56607a"; altVazio = 80; }
      else if (p.id === "lide") { fonte = `700 31px ${serif}`; lh = 43; altVazio = 150; antes = 22; }
      else { fonte = `400 31px ${serif}`; lh = 43; altVazio = 170; }
    } else if (genero === "carta") {
      fonte = `700 46px ${mao}`; lh = 56; cor = "#24408f";
      if (p.id === "local") { alinhar = "right"; altVazio = 60; antes = 40; }
      else if (p.id === "saudacao") { altVazio = 60; antes = 40; }
      else if (p.id === "mensagem") { altVazio = 280; antes = 12; }
      else if (p.id === "despedida") { altVazio = 60; antes = 40; }
      else { alinhar = "right"; altVazio = 60; antes = 10; }
    } else {
      if (p.id === "rtitulo") { fonte = `800 56px ${serif}`; lh = 62; cor = "#2f7a4f"; altVazio = 80; antes = 30; }
      else if (p.id === "rendimento") { fonte = `600 28px ${sans}`; cor = "#56607a"; altVazio = 50; }
      else { altVazio = p.id === "ingredientes" ? 200 : 300; antes = 26; }
    }
    y += antes;
    if (!pronta) { vazio(y, altVazio, p.nome); y += altVazio; return; }
    g.font = fonte;
    const cabec = genero === "receita" && (p.id === "ingredientes" || p.id === "preparo");
    const linhas = quebrar(g, p.txt, larg);
    const h = linhas.length * lh + (cabec ? 54 : 0) + (genero === "noticia" && p.id === "fina" ? 130 : 0);
    if (ultima) marca(y, h);
    if (cabec) { g.fillStyle = "#2f7a4f"; g.font = `800 34px ${sans}`; g.fillText(p.id === "ingredientes" ? "Ingredientes" : "Modo de preparo", margem, y + 34); y += 54; g.font = fonte; }
    g.fillStyle = cor; g.textAlign = alinhar;
    linhas.forEach((l, k) => g.fillText(l, alinhar === "right" ? W - 70 : margem, y + (k + 0.8) * lh));
    g.textAlign = "left";
    y += linhas.length * lh;
    if (genero === "noticia" && p.id === "fina") {
      // "foto" desenhada da notícia
      const fy = y + 14; const grd = g.createLinearGradient(0, fy, 0, fy + 110); grd.addColorStop(0, "#bfe0ff"); grd.addColorStop(0.6, "#7fb6e8"); grd.addColorStop(1, "#e8d3a6");
      g.fillStyle = grd; g.fillRect(margem, fy, larg, 110); g.fillStyle = "#f6d35b"; g.beginPath(); g.arc(margem + larg - 90, fy + 45, 26, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#ffffff"; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(margem + 40 + k * 180, fy + 95); g.quadraticCurveTo(margem + 90 + k * 180, fy + 80, margem + 140 + k * 180, fy + 95); g.stroke(); }
      y += 130;
    }
  });
}

export default function Papel3D({ folha, casos, onCaso, altura = 420 }: { folha: FolhaP; casos?: CasoPapel[]; onCaso?: (c: CasoPapel) => void; altura?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ mostrar: (f: FolhaP) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0xe6eef5, az: -0.1, el: 0.3, dist: 8.4, distRetrato: 12.5, alvo: [0.5, 2.45, 0.2], sombras: true, elMin: 0.2, elMax: 1.2 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, 0xb08a5a, 1.1));
    const sol = new THREE.DirectionalLight(0xfff3e0, 1.6); sol.position.set(-4, 10, 7); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024); sol.shadow.bias = -0.0004;
    Object.assign(sol.shadow.camera, { left: -7, right: 7, top: 7, bottom: -5 }); cena.add(sol);
    const mat = (c: number, r = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

    // mesa de madeira
    const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
    const gc = cv.getContext("2d")!;
    for (let i = 0; i < 8; i++) { gc.fillStyle = ["#b97e4b", "#b07444", "#bd8350", "#b37848"][i % 4]; gc.fillRect(0, i * 32, 256, 32); gc.fillStyle = "rgba(70,40,15,.3)"; gc.fillRect(0, i * 32, 256, 2); }
    const tMesa = new THREE.CanvasTexture(cv); tMesa.wrapS = tMesa.wrapT = THREE.RepeatWrapping; tMesa.repeat.set(2, 2); tMesa.colorSpace = THREE.SRGBColorSpace;
    const mesa = new THREE.Mesh(new RoundedBoxGeometry(14, 0.4, 8, 3, 0.15), new THREE.MeshStandardMaterial({ map: tMesa, roughness: 0.75 })); mesa.position.set(0, -0.2, 0.5); mesa.receiveShadow = true; cena.add(mesa);

    // prancheta com a folha
    const pr = new THREE.Group(); pr.position.set(-0.2, 0, 0); pr.rotation.x = -0.16; cena.add(pr);
    const placa = new THREE.Mesh(new RoundedBoxGeometry(3.9, 5.2, 0.12, 3, 0.1), mat(0x9a6a3e, 0.7)); placa.position.y = 2.6; placa.castShadow = true; pr.add(placa);
    const canv = document.createElement("canvas"); canv.width = W; canv.height = H;
    const tex = new THREE.CanvasTexture(canv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const folhaM = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5 * (H / W)), new THREE.MeshBasicMaterial({ map: tex })); folhaM.position.set(0, 2.5, 0.07); pr.add(folhaM);
    const clipe = new THREE.Mesh(new RoundedBoxGeometry(1.3, 0.38, 0.22, 3, 0.07), mat(0xc0c7d4, 0.25)); clipe.position.set(0, 5.05, 0.12); clipe.castShadow = true; pr.add(clipe);

    // objetos de cada gênero
    const grupos: Record<GeneroP, THREE.Group> = { noticia: new THREE.Group(), carta: new THREE.Group(), receita: new THREE.Group() };
    Object.values(grupos).forEach((gr) => { gr.position.set(3.4, 0, 0.6); gr.scale.setScalar(0.01); cena.add(gr); });
    { // jornais dobrados e um microfone
      const gr = grupos.noticia;
      const ct = document.createElement("canvas"); ct.width = 256; ct.height = 160; const gx = ct.getContext("2d")!;
      gx.fillStyle = "#f3efe4"; gx.fillRect(0, 0, 256, 160); gx.fillStyle = "#1d2433"; gx.font = "900 26px Georgia"; gx.fillText("JORNAL", 70, 34);
      gx.fillRect(16, 46, 224, 3); for (let i = 0; i < 9; i++) gx.fillRect(16 + (i % 2) * 118, 60 + Math.floor(i / 2) * 18, 104, 6);
      const tj = new THREE.CanvasTexture(ct); tj.colorSpace = THREE.SRGBColorSpace;
      for (let i = 0; i < 3; i++) { const j = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.4), [mat(0xe9e4d6), mat(0xe9e4d6), new THREE.MeshStandardMaterial({ map: tj, roughness: 0.9 }), mat(0xe9e4d6), mat(0xe9e4d6), mat(0xe9e4d6)]); j.position.set(0, 0.05 + i * 0.09, 0); j.rotation.y = i * 0.18 - 0.2; j.castShadow = true; gr.add(j); }
      const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 1.1, 16), mat(0x1d2433, 0.4)); cabo.position.set(0.3, 0.75, -1.2); cabo.rotation.z = -0.5; cabo.castShadow = true; gr.add(cabo);
      const cab = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), mat(0x8a93a8, 0.3)); cab.position.set(0.58, 1.25, -1.2); gr.add(cab);
    }
    { // envelope com selo e uma caneta
      const gr = grupos.carta;
      const env = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.06, 1.5), mat(0xf6ead2, 0.8)); env.position.y = 0.04; env.rotation.y = -0.15; env.castShadow = true; gr.add(env);
      const tri = new THREE.BufferGeometry(); tri.setAttribute("position", new THREE.Float32BufferAttribute([-1.15, 0, -0.75, 1.15, 0, -0.75, 0, 0, 0.15], 3)); tri.computeVertexNormals();
      const aba = new THREE.Mesh(tri, new THREE.MeshStandardMaterial({ color: 0xeaddc1, side: THREE.DoubleSide, roughness: 0.8 })); aba.position.y = 0.08; aba.rotation.y = -0.15; gr.add(aba);
      const selo = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.42), mat(0xef6f5e, 0.6)); selo.position.set(0.78, 0.09, -0.48); selo.rotation.y = -0.15; gr.add(selo);
      const caneta = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12), mat(0x24408f, 0.3)); caneta.rotation.z = Math.PI / 2; caneta.rotation.y = 0.6; caneta.position.set(0.1, 0.12, 1.15); caneta.castShadow = true; gr.add(caneta);
      const ponta = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 12), mat(0xc0c7d4, 0.3)); ponta.rotation.z = -Math.PI / 2; ponta.rotation.y = 0.6; ponta.position.set(0.82, 0.12, 0.68); gr.add(ponta);
    }
    { // tigela, colher, ovo e laranja
      const gr = grupos.receita;
      const perfil = [new THREE.Vector2(0.01, 0), new THREE.Vector2(0.55, 0.02), new THREE.Vector2(0.95, 0.35), new THREE.Vector2(1.1, 0.8), new THREE.Vector2(1.05, 0.82), new THREE.Vector2(0.9, 0.4), new THREE.Vector2(0.5, 0.08), new THREE.Vector2(0.01, 0.06)];
      const tig = new THREE.Mesh(new THREE.LatheGeometry(perfil, 40), new THREE.MeshStandardMaterial({ color: 0x6fc3a8, roughness: 0.4, side: THREE.DoubleSide })); tig.castShadow = true; gr.add(tig);
      const massa = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.6, 0.1, 32), mat(0xf2d27a, 0.6)); massa.position.y = 0.42; gr.add(massa);
      const colher = new THREE.Group(); colher.position.set(0.2, 0.75, 0); colher.rotation.z = -0.6; gr.add(colher);
      const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.5, 10), mat(0xc8935a)); cabo.position.y = 0.6; colher.add(cabo);
      const conc = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 10), mat(0xc8935a)); conc.scale.set(1, 0.4, 1.4); colher.add(conc);
      const ovo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), mat(0xfaf3e6, 0.5)); ovo.scale.y = 1.3; ovo.position.set(-1.0, 0.28, 1.0); ovo.castShadow = true; gr.add(ovo);
      const lar = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 16), mat(0xf28c28, 0.55)); lar.position.set(0.9, 0.32, 1.15); lar.castShadow = true; gr.add(lar);
      const fol = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), mat(0x4fb37a)); fol.scale.set(1.5, 0.4, 0.8); fol.position.set(0.95, 0.66, 1.15); gr.add(fol);
    }

    let atual: GeneroP | null = null, pulo = -9, t = 0;
    let ultimo: FolhaP | null = null;
    const pintar = () => { if (ultimo) { desenhar(canv, ultimo); tex.needsUpdate = true; } };
    const mostrar = (f: FolhaP) => {
      const mudou = !ultimo || ultimo.feitas !== f.feitas;
      ultimo = f; pintar();
      if (f.genero !== atual) atual = f.genero;
      if (mudou) pulo = t;
    };
    api.current = { mostrar };
    // quando as fontes chegam, redesenha (a carta usa letra de mão)
    (document as Document & { fonts?: FontFaceSet }).fonts?.load("700 40px Caveat").then(pintar).catch(() => {});
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(pintar);

    p.aoQuadro((dt) => {
      t += dt;
      (Object.keys(grupos) as GeneroP[]).forEach((k) => {
        const gr = grupos[k]; const quer = k === atual ? 1 : 0.01;
        const s = gr.scale.x + (quer - gr.scale.x) * Math.min(1, dt * 7); gr.scale.setScalar(s); gr.visible = s > 0.02;
        if (k === atual) gr.rotation.y = Math.sin(t * 0.6) * 0.08;
      });
      const u = (t - pulo) / 0.45;
      pr.position.y = u > 0 && u < 1 ? Math.sin(Math.PI * u) * 0.18 : 0;
      pr.rotation.z = u > 0 && u < 1 ? Math.sin(Math.PI * u * 2) * 0.015 : 0;
    });
    return () => { api.current = null; p.destruir(); };
  }, []);

  const chave = JSON.stringify(folha);
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const ir = () => { const c = casos[i]; api.current?.mostrar(c.folha); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(ir, 60);
      const id = setInterval(ir, 2400);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.mostrar(folha);
  }, [casos, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`Prancheta em 3D com um texto do gênero ${folha.genero}: ${folha.partes.slice(0, folha.feitas).map((p) => p.txt).join(" ")}`} />;
}
