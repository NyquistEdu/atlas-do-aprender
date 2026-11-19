"use client";
/**
 * Frações em 3D: uma pizza (ou uma barra de chocolate) cortada em n partes, iguais ou não.
 * Os k pedaços pegos voam para o prato (ou para a caixa da pizzaria) mantendo o formato,
 * então dá para ver a fração montada do outro lado. "servido" fecha a caixa e ela sai.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

export type Forma = "pizza" | "chocolate";
export type CasoFracao = { n: number; k: number; desiguais?: number[]; legenda?: string; forma?: Forma };

const R = 2.1, H = 0.26, MESA = 0; // pizza
const CX = -2.7, DX = 2.7; // centro da pizza inteira e do prato/caixa
const nomeParte = (n: number) => ["inteiro", "metades", "terços", "quartos", "quintos", "sextos", "sétimos", "oitavos", "nonos", "décimos"][n - 1];

type Peca = { obj: THREE.Object3D; casa: THREE.Vector3; prato: THREE.Vector3; pego: boolean; de: THREE.Vector3; t0: number };

export default function Fracoes3D({ n, k, forma = "pizza", desiguais, destino = "prato", servido = false, casos, onCaso, altura = 380 }: {
  n: number; k: number; forma?: Forma; desiguais?: number[]; destino?: "prato" | "caixa"; servido?: boolean; casos?: CasoFracao[]; onCaso?: (c: CasoFracao) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (n: number, k: number, forma: Forma, des?: number[]) => void; servir: (s: boolean) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const caixa = destino === "caixa";
    const p = criarPalco(ref.current!, { fundo: caixa ? 0x2a1f1a : 0x1d2433, az: 0, el: 0.62, dist: 13.5, distRetrato: 21, alvo: [0, 0.2, 0.3], sombras: true, elMin: 0.25, elMax: 1.4 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, 0x3a3020, 1.0));
    const sol = new THREE.DirectionalLight(0xfff4e0, 1.6); sol.position.set(4, 12, 7); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7 }); cena.add(sol);
    const mat = (c: number, r = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

    // mesa com toalha xadrez
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g2 = cv.getContext("2d")!; g2.fillStyle = "#fbf6ea"; g2.fillRect(0, 0, 64, 64); g2.fillStyle = caixa ? "#d9483b" : "#7aa2e3"; g2.globalAlpha = 0.55;
    g2.fillRect(0, 0, 32, 64); g2.fillRect(0, 0, 64, 32); g2.globalAlpha = 0.85; g2.fillRect(0, 0, 32, 32);
    const tx = new THREE.CanvasTexture(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(9, 5); tx.magFilter = THREE.NearestFilter;
    const mesa = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 7.5), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.9 })); mesa.position.set(0, MESA - 0.15, 0.3); mesa.receiveShadow = true; cena.add(mesa);
    // tábua da pizza
    const tabua = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.35, R + 0.35, 0.1, 48), mat(0xb98352, 0.8)); tabua.position.set(CX, 0.05, 0); tabua.receiveShadow = true; cena.add(tabua);
    // prato ou caixa
    const lado = new THREE.Group(); lado.position.set(DX, 0, 0); cena.add(lado);
    let tampa: THREE.Group | null = null;
    if (caixa) {
      const papelao = mat(0xd7b27a, 0.9);
      const fundo = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 5), papelao); fundo.position.y = 0.04; fundo.receiveShadow = true; lado.add(fundo);
      [[0, 2.5, 5, 0.06], [0, -2.5, 5, 0.06]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.45, d), papelao); m.position.set(x, 0.25, z); m.castShadow = true; lado.add(m); });
      [-2.5, 2.5].forEach((x) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 5), papelao); m.position.set(x, 0.25, 0); lado.add(m); });
      tampa = new THREE.Group(); tampa.position.set(0, 0.47, -2.5); lado.add(tampa);
      const t = new THREE.Mesh(new THREE.BoxGeometry(5, 0.06, 5), papelao); t.position.set(0, 0, 2.5); t.castShadow = true; tampa.add(t);
      const logo = plaquinha("PIZZARIA ATLAS", { largura: 460, fundo: "#d9483b", cor: "#ffffff", escala: 1.4 }); logo.position.set(0, 0.2, 2.5); tampa.add(logo); logo.visible = false; tampa.userData.logo = logo;
      tampa.rotation.x = -1.9;
    } else {
      const prato = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.45, R + 0.2, 0.12, 48), mat(0xffffff, 0.3)); prato.position.y = 0.06; prato.receiveShadow = true; lado.add(prato);
      const borda = new THREE.Mesh(new THREE.TorusGeometry(R + 0.4, 0.06, 8, 64), mat(0x6f93e0, 0.4)); borda.rotation.x = Math.PI / 2; borda.position.y = 0.13; lado.add(borda);
    }

    // ---------- peças
    const queijo = mat(0xf4c55a, 0.55), massa = mat(0xd49048, 0.7), calabresa = mat(0xc4483b, 0.6), folha = mat(0x3f8f4a, 0.6);
    const choco = mat(0x6b3b22, 0.45), chocoTopo = mat(0x7d4a2c, 0.4);
    const gCal = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16), gFolha = new THREE.SphereGeometry(0.08, 8, 6);
    let pecas: Peca[] = [];
    let raiz = new THREE.Group(); cena.add(raiz);
    let etqA: THREE.Sprite | null = null, etqB: THREE.Sprite | null = null;
    let t = 0, N = 0, K = 0, F: Forma = "pizza", DES = "";
    let caixaX = 0, fechar = 0, servindo = false;

    const fatia = (a0: number, a1: number) => {
      const g = new THREE.Group();
      const sh = new THREE.Shape();
      if (a1 - a0 >= Math.PI * 2 - 1e-6) sh.absarc(0, 0, R, 0, Math.PI * 2, false);
      else { sh.moveTo(0, 0); sh.absarc(0, 0, R, a0, a1, false); sh.lineTo(0, 0); }
      const geo = new THREE.ExtrudeGeometry(sh, { depth: H, bevelEnabled: false, curveSegments: 40 });
      const m = new THREE.Mesh(geo, [queijo, massa]); m.rotation.x = -Math.PI / 2; m.castShadow = true; m.receiveShadow = true; g.add(m);
      // a casquinha da borda
      const gb = new THREE.TorusGeometry(R - 0.1, 0.12, 8, 40, a1 - a0); gb.rotateZ(a0);
      const borda = new THREE.Mesh(gb, massa); borda.rotation.x = -Math.PI / 2; borda.position.y = H; borda.castShadow = true; g.add(borda);
      // coberturas em posições fixas da pizza inteira (assim continuam no lugar quando corta)
      let s = 7; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      for (let i = 0; i < 26; i++) {
        const ang = rnd() * Math.PI * 2, rr = 0.35 + Math.sqrt(rnd()) * (R - 0.65), tipo = rnd();
        let a = ang; while (a < a0) a += Math.PI * 2; while (a >= a0 + Math.PI * 2) a -= Math.PI * 2;
        if (a > a1 - 0.06 || a < a0 + 0.06) continue;
        const o = new THREE.Mesh(tipo < 0.62 ? gCal : gFolha, tipo < 0.62 ? calabresa : folha);
        o.position.set(Math.cos(ang) * rr, H + 0.03, -Math.sin(ang) * rr); g.add(o);
      }
      return g;
    };
    const bloco = (w: number) => {
      const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.32, 1.8), choco); b.position.y = 0.16; b.castShadow = true; b.receiveShadow = true; g.add(b);
      const topo = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.05, w - 0.16), 0.08, 1.6), chocoTopo); topo.position.y = 0.35; g.add(topo);
      return g;
    };

    const etiquetas = () => {
      [etqA, etqB].forEach((s) => s && raiz.remove(s));
      const des = DES !== "";
      etqA = plaquinha(des ? `${N} partes DIFERENTES` : N === 1 ? "inteira" : `${N} partes iguais · ${nomeParte(N)}`, { largura: 560, escala: 1.0, fundo: des ? "#ffd6d1" : "#fff6d6" });
      etqA.position.set(CX, 2.3, -1.6); raiz.add(etqA);
      etqB = plaquinha(des ? "isso não é fração!" : K === 0 ? "prato vazio" : K === N ? `${K}/${N} = inteira` : `${K}/${N}`, { largura: des ? 460 : 300, escala: des ? 1.0 : 1.5, fundo: des ? "#ffd6d1" : "#ffffff" });
      etqB.position.set(DX, 2.4, -1.6); raiz.add(etqB);
    };

    const montar = (n: number, k: number, forma: Forma, des?: number[]) => {
      n = Math.max(1, Math.min(10, n)); k = Math.max(0, Math.min(n, k));
      const chaveDes = des ? des.join(",") : "";
      if (n !== N || forma !== F || chaveDes !== DES) {
        cena.remove(raiz); raiz = new THREE.Group(); cena.add(raiz);
        const partes = des && des.length === n ? des : Array.from({ length: n }, () => 1 / n);
        pecas = [];
        let acum = 0;
        partes.forEach((fr, i) => {
          if (forma === "pizza") {
            const a0 = acum * Math.PI * 2 + Math.PI / 2, a1 = (acum + fr) * Math.PI * 2 + Math.PI / 2; acum += fr;
            const meio = (a0 + a1) / 2, gap = n === 1 ? 0 : 0.09;
            const obj = fatia(a0, a1);
            const casa = new THREE.Vector3(CX + Math.cos(meio) * gap, 0.1, -Math.sin(meio) * gap);
            const prato = new THREE.Vector3(DX + Math.cos(meio) * gap, 0.12, -Math.sin(meio) * gap);
            obj.position.set(CX, 0.1, 0); raiz.add(obj);
            pecas.push({ obj, casa, prato, pego: false, de: obj.position.clone(), t0: -9 });
          } else {
            const L = 5.0, gap = n === 1 ? 0 : 0.1, w = fr * (L - gap * (n - 1));
            const x = -L / 2 + acum * (L - gap * (n - 1)) + i * gap + w / 2; acum += fr;
            const obj = bloco(w);
            const casa = new THREE.Vector3(CX + x * 0.86 + 0.2, 0.1, 0), prato = new THREE.Vector3(DX + x * 0.86 + 0.2, 0.12, 0);
            obj.scale.x = 0.86; obj.position.set(CX + x * 0.86 + 0.2, 0.1, 0); raiz.add(obj);
            pecas.push({ obj, casa, prato, pego: false, de: obj.position.clone(), t0: -9 });
          }
        });
        N = n; F = forma; DES = chaveDes; K = 0;
      }
      // quais vão para o prato: os primeiros k
      pecas.forEach((pc, i) => {
        const quer = i < k;
        if (quer !== pc.pego) { pc.de = pc.obj.position.clone(); pc.t0 = t + (quer ? (i - K) : (K - 1 - i)) * 0.08; pc.pego = quer; }
      });
      K = k; etiquetas();
    };
    api.current = {
      montar,
      servir: (s) => { servindo = s; if (!s) { caixaX = 0; fechar = 0; lado.position.x = DX; } },
    };

    const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    p.aoQuadro((dt) => {
      t += dt;
      if (caixa && tampa) {
        if (servindo) { fechar = Math.min(1.6, fechar + dt * 1.1); if (fechar >= 1.6) caixaX += dt * (0.8 + caixaX * 0.6); }
        tampa.rotation.x = -1.9 * (1 - ease(Math.min(1, fechar)));
        (tampa.userData.logo as THREE.Sprite).visible = fechar > 0.9;
        lado.position.x = DX + caixaX;
      }
      for (const pc of pecas) {
        const fim = pc.pego ? pc.prato.clone().setX(pc.prato.x + caixaX) : pc.casa;
        const u = Math.max(0, Math.min(1, (t - pc.t0) / 0.7));
        if (u <= 0) { pc.obj.position.copy(pc.de); continue; }
        const e = ease(u);
        pc.obj.position.lerpVectors(pc.de, fim, e);
        pc.obj.position.y += Math.sin(Math.PI * u) * 1.3;
        if (u >= 1) pc.de = fim.clone();
      }
    });
    return () => { api.current = null; p.destruir(); };
  }, [destino]);

  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { const c = casos[i]; api.current?.montar(c.n, c.k, c.forma ?? "pizza", c.desiguais); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(mostrar, 60);
      const id = setInterval(mostrar, 3400);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(n, k, forma, desiguais);
  }, [casos, n, k, forma, desiguais, destino]);
  useEffect(() => { api.current?.servir(servido); }, [servido, destino]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`${forma === "pizza" ? "Pizza" : "Barra de chocolate"} em 3D cortada em ${n} partes; ${k} ${k === 1 ? "pedaço foi" : "pedaços foram"} para o ${destino}: ${k}/${n}`} />;
}
