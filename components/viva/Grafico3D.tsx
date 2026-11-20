"use client";
/**
 * Gráfico de barras em 3D numa sala de aula: cada voto é um bloquinho de montar que uma criança
 * da fila joga no topo da torre da sua opção. Uma régua colorida faz o papel do eixo
 * e a pergunta fica escrita a giz no quadro. Com escala 2, cada bloquinho vale 2 (meio bloco vale 1).
 * Torres marcadas em "erradas" ficam vermelhas e tremem.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { criarPalco, plaquinha } from "./palco3d";

export type Barra = { rot: string; v: number };
export type CasoGrafico = { dados: Barra[]; escala?: number; legenda?: string; titulo?: string };
export const CORES_BARRA = [0xf2b33d, 0x5b8def, 0xef6f5e, 0x4fb37a, 0xb07fe0];
export const CORES_CSS = ["#f2b33d", "#6f93e0", "#e8786d", "#5fae7b", "#b48ad9"];

const BW = 0.82, BH = 0.5, NIVEIS = 10, ESP = 1.85, Z0 = 0;
const PELE = [0xf0c9a4, 0xd9a07a, 0xa8714f, 0x7b4a33];
const ROUPA = [0xef6f5e, 0x5b8def, 0xf2b33d, 0x4fb37a, 0xb07fe0, 0x4fb3b8, 0xe98fb8];

type Bloco = { g: THREE.Group; alvo: THREE.Vector3; meio: boolean; de: THREE.Vector3; t0: number; voa: boolean; torre: number };
type Crianca = { g: THREE.Group; base: THREE.Vector3; pulo: number };

function quadro(txt: string) {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2f5d46"; g.fillRect(0, 0, 1024, 160);
  g.fillStyle = "rgba(255,255,255,.06)"; for (let i = 0; i < 40; i++) g.fillRect(Math.random() * 1024, Math.random() * 160, 60, 2);
  g.fillStyle = "#f4f1e6"; g.textAlign = "center"; g.textBaseline = "middle";
  let tam = 68; g.font = `700 ${tam}px "Caveat", "Comic Sans MS", cursive`;
  while (g.measureText(txt).width > 960 && tam > 30) { tam -= 4; g.font = `700 ${tam}px "Caveat", "Comic Sans MS", cursive`; }
  g.fillText(txt, 512, 84);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default function Grafico3D({ dados, escala = 1, erradas = [], titulo, casos, onCaso, altura = 380 }: {
  dados: Barra[]; escala?: number; erradas?: number[]; titulo?: string; casos?: CasoGrafico[]; onCaso?: (c: CasoGrafico) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (d: Barra[], esc: number, err: number[], tit?: string) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const capa = !!casos;
    const p = criarPalco(ref.current!, { fundo: 0xf3e6cf, az: 0.1, el: capa ? 0.22 : 0.2, dist: capa ? 18 : 15.5, distRetrato: capa ? 31 : 29, alvo: capa ? [0.1, 2.7, 0.6] : [0.1, 3.7, 0.6], sombras: true, elMax: 1.1, elMin: 0.08 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xfff8ec, 0xb08a5a, 1.15));
    const sol = new THREE.DirectionalLight(0xfff1dc, 1.7); sol.position.set(-5, 11, 9); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024); sol.shadow.bias = -0.0004;
    Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -4, near: 1, far: 40 }); cena.add(sol);
    const mat = (c: number, r = 0.6, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });

    // ---------- sala: chão de tábuas, parede, rodapé, quadro e janela
    const cv = document.createElement("canvas"); cv.width = 256; cv.height = 256;
    const gc = cv.getContext("2d")!;
    for (let i = 0; i < 8; i++) { gc.fillStyle = ["#d9a46a", "#cf9a60", "#dcaa72", "#d39e64"][i % 4]; gc.fillRect(0, i * 32, 256, 32); gc.fillStyle = "rgba(90,55,25,.35)"; gc.fillRect(0, i * 32, 256, 2); gc.fillRect(((i * 97) % 256), i * 32, 2, 32); }
    const tPiso = new THREE.CanvasTexture(cv); tPiso.wrapS = tPiso.wrapT = THREE.RepeatWrapping; tPiso.repeat.set(3, 2); tPiso.colorSpace = THREE.SRGBColorSpace;
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: tPiso, roughness: 0.8 })); piso.rotation.x = -Math.PI / 2; piso.position.z = 3; piso.receiveShadow = true; cena.add(piso);
    const parede = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), mat(0xf6ead2, 0.95)); parede.position.set(0, 6, -2.2); parede.receiveShadow = true; cena.add(parede);
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(26, 1.1, 0.05), mat(0x9fd3c7, 0.9)); faixa.position.set(0, 0.55, -2.17); cena.add(faixa);
    const rodape = new THREE.Mesh(new THREE.BoxGeometry(26, 0.18, 0.12), mat(0x8a5a3b)); rodape.position.set(0, 0.09, -2.12); cena.add(rodape);
    const moldura = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.55, 0.12), mat(0x8a5a3b, 0.7)); moldura.position.set(0.3, 7.0, -2.12); moldura.castShadow = true; cena.add(moldura);
    const lousa = new THREE.Mesh(new THREE.PlaneGeometry(7.3, 1.28), new THREE.MeshStandardMaterial({ map: quadro("Pesquisa da turma"), roughness: 0.95 })); lousa.position.set(0.3, 7.0, -2.05); cena.add(lousa);
    // bandeirinhas
    const corda: THREE.Vector3[] = [];
    for (let i = 0; i <= 24; i++) { const x = -11 + i * (22 / 24); corda.push(new THREE.Vector3(x, 8.35 - Math.sin((i / 24) * Math.PI) * 0.5, -2.0)); }
    cena.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(corda), new THREE.LineBasicMaterial({ color: 0x8a5a3b })));
    const gBand = new THREE.BufferGeometry(); gBand.setAttribute("position", new THREE.Float32BufferAttribute([-0.22, 0, 0, 0.22, 0, 0, 0, -0.45, 0], 3)); gBand.computeVertexNormals();
    corda.forEach((v, i) => { if (i % 1) return; const b = new THREE.Mesh(gBand, mat(ROUPA[i % ROUPA.length], 0.8, { side: THREE.DoubleSide })); b.position.copy(v); b.position.z += 0.02; cena.add(b); });

    // régua colorida (o eixo)
    const regua = new THREE.Group(); cena.add(regua);
    const linhasNivel = new THREE.Group(); cena.add(linhasNivel);
    let numsRegua: THREE.Sprite[] = [];

    // fila de crianças
    const criancas: Crianca[] = [];
    const gCorpo = new THREE.CapsuleGeometry(0.2, 0.32, 4, 12), gCab = new THREE.SphereGeometry(0.19, 16, 12), gCabelo = new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    for (let i = 0; i < 7; i++) {
      const g = new THREE.Group();
      const corpo = new THREE.Mesh(gCorpo, mat(ROUPA[i], 0.7)); corpo.position.y = 0.42; corpo.castShadow = true; g.add(corpo);
      const cab = new THREE.Mesh(gCab, mat(PELE[i % PELE.length], 0.8)); cab.position.y = 0.92; cab.castShadow = true; g.add(cab);
      const cabelo = new THREE.Mesh(gCabelo, mat([0x2b1d14, 0x5a3a22, 0x1d2433, 0x8a5a3b][i % 4], 0.9)); cabelo.position.y = 0.95; cabelo.rotation.x = -0.25; g.add(cabelo);
      const base = new THREE.Vector3(-5.2 + i * 1.75, 0, 3.0 + (i % 2) * 0.35);
      g.position.copy(base); g.rotation.y = Math.PI + (base.x * -0.04); cena.add(g);
      criancas.push({ g, base, pulo: -9 });
    }

    // ---------- bloquinhos
    const gBloco = new RoundedBoxGeometry(BW, BH, BW, 3, 0.07);
    const gMeio = new RoundedBoxGeometry(BW, BH / 2, BW, 3, 0.05);
    const gPino = new THREE.CylinderGeometry(0.12, 0.12, 0.09, 14);
    const mats = CORES_BARRA.map((c) => mat(c, 0.35)), matErro = mat(0xd9483b, 0.35);
    const fazBloco = (i: number, meio: boolean) => {
      const g = new THREE.Group();
      const b = new THREE.Mesh(meio ? gMeio : gBloco, mats[i % mats.length]); b.castShadow = true; b.receiveShadow = true; g.add(b);
      const hy = (meio ? BH / 2 : BH) / 2 + 0.04;
      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([x, z]) => { const pn = new THREE.Mesh(gPino, b.material); pn.position.set(x, hy, z); pn.castShadow = true; g.add(pn); });
      return g;
    };
    const pintar = (bl: Bloco, m: THREE.Material) => bl.g.children.forEach((c) => ((c as THREE.Mesh).material = m));

    let torres: Bloco[][] = [];
    const morrendo: THREE.Group[] = [];
    let bases: THREE.Object3D[] = [], rotulos: THREE.Sprite[] = [], numeros: THREE.Sprite[] = [];
    let t = 0, escAtual = -1, nAtual = -1, titAtual = "", errAtual: number[] = [], vez = 0;
    const xDe = (i: number, n: number) => (i - (n - 1) / 2) * ESP + 0.5;
    const yDe = (k: number, meio: boolean) => (meio ? BH / 4 : BH / 2) + k * BH;

    const fazerRegua = (esc: number, n: number) => {
      regua.clear(); linhasNivel.clear(); numsRegua.forEach((s) => cena.remove(s)); numsRegua = [];
      const xr = xDe(0, Math.max(n, 4)) - 1.45;
      for (let k = 0; k < NIVEIS; k++) {
        const seg = new THREE.Mesh(new THREE.BoxGeometry(0.34, BH, 0.16), mat(k % 2 ? 0xffffff : 0xf6d35b, 0.6)); seg.position.set(xr, BH / 2 + k * BH, -1.6); seg.castShadow = true; regua.add(seg);
        const l = new THREE.Mesh(new THREE.BoxGeometry(11, 0.025, 0.01), new THREE.MeshBasicMaterial({ color: 0xd8c7a6 })); l.position.set(xr + 5.6, (k + 1) * BH, -2.13); linhasNivel.add(l);
      }
      const topo = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 4), mat(0xef6f5e)); topo.position.set(xr, NIVEIS * BH + 0.17, -1.6); topo.rotation.y = Math.PI / 4; regua.add(topo);
      for (let k = 0; k <= NIVEIS; k++) {
        if (esc === 1 && k % 2) continue;
        const s = plaquinha(String(k * esc), { largura: 120, escala: 0.85, fundo: "#ffffff" }); s.position.set(xr - 0.6, k * BH, -1.55); cena.add(s); numsRegua.push(s);
      }
    };

    const montar = (d: Barra[], esc: number, err: number[], tit?: string) => {
      const n = d.length;
      if (esc !== escAtual || n !== nAtual) { fazerRegua(esc, n); }
      if ((tit ?? "") !== titAtual) { (lousa.material as THREE.MeshStandardMaterial).map = quadro(tit || "Pesquisa da turma"); (lousa.material as THREE.MeshStandardMaterial).needsUpdate = true; titAtual = tit ?? ""; }
      if (n !== nAtual || esc !== escAtual) {
        torres.forEach((tr) => tr.forEach((b) => morrendo.push(b.g))); torres = Array.from({ length: n }, () => []);
        bases.forEach((o) => cena.remove(o)); bases = [];
        for (let i = 0; i < n; i++) {
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.1, 32), mat(CORES_BARRA[i % 5], 0.5, { transparent: true, opacity: 0.55 })); pad.position.set(xDe(i, n), 0.05, Z0); pad.receiveShadow = true; cena.add(pad); bases.push(pad);
        }
        nAtual = n; escAtual = esc;
      }
      rotulos.forEach((s) => cena.remove(s)); numeros.forEach((s) => cena.remove(s)); rotulos = []; numeros = [];
      d.forEach((b, i) => {
        const v = Math.max(0, Math.min(NIVEIS * esc, Math.round(b.v)));
        const cheios = Math.floor(v / esc), meio = v % esc !== 0, quer = cheios + (meio ? 1 : 0);
        const lista = torres[i];
        // o meio bloco no topo é outra peça: se mudou, tira o topo e põe de novo
        if (lista.length && lista[lista.length - 1].meio !== (meio && lista.length === quer)) { const x = lista.pop()!; morrendo.push(x.g); }
        while (lista.length > quer) morrendo.push(lista.pop()!.g);
        const antes = lista.length;
        while (lista.length < quer) {
          const k = lista.length, ehMeio = meio && k === quer - 1;
          const g = fazBloco(i, ehMeio);
          const cr = criancas[vez++ % criancas.length];
          const de = cr.base.clone().add(new THREE.Vector3(0, 1.2, 0));
          g.position.copy(de); g.visible = false; cena.add(g);
          const t0 = t + (k - antes) * 0.16;
          cr.pulo = t0 - 0.12;
          lista.push({ g, alvo: new THREE.Vector3(xDe(i, n), yDe(k, ehMeio), Z0), meio: ehMeio, de, t0, voa: true, torre: i });
        }
        const errada = err.includes(i);
        lista.forEach((bl) => pintar(bl, errada ? matErro : mats[i % mats.length]));
        const r = plaquinha(b.rot, { largura: Math.min(440, 90 + b.rot.length * 30), escala: 0.95, fundo: errada ? "#ffd6d1" : "#ffffff", cor: errada ? "#c4483b" : "#1d2433" });
        r.position.set(xDe(i, n), 0.32, Z0 + 0.95 + (i % 2) * 0.6); cena.add(r); rotulos.push(r);
        const nm = plaquinha(String(v), { largura: 112, escala: 1.0, fundo: "#fff6d6" }); nm.position.set(xDe(i, n), Math.max(quer, 0.4) * BH + (meio ? -BH / 2 : 0) + 0.55, Z0); cena.add(nm); numeros.push(nm);
      });
      errAtual = err;
    };
    api.current = { montar };

    const ease = (u: number) => 1 - Math.pow(1 - u, 3);
    p.aoQuadro((dt) => {
      t += dt;
      for (const lista of torres) for (const bl of lista) {
        if (t < bl.t0) { bl.g.visible = false; continue; }
        bl.g.visible = true;
        if (bl.voa) {
          const u = Math.min(1, (t - bl.t0) / 0.65);
          bl.g.position.lerpVectors(bl.de, bl.alvo, ease(u)); bl.g.position.y += Math.sin(Math.PI * u) * 2.2;
          bl.g.rotation.y = (1 - u) * 2.5; bl.g.rotation.x = (1 - u) * 1.2;
          if (u >= 1) { bl.voa = false; bl.g.rotation.set(0, 0, 0); }
        } else {
          bl.g.position.lerp(bl.alvo, Math.min(1, dt * 10));
          const tremer = errAtual.includes(bl.torre) ? Math.sin(t * 40) * 0.03 : 0;
          bl.g.position.x = bl.alvo.x + tremer;
        }
      }
      for (let i = morrendo.length - 1; i >= 0; i--) {
        const g = morrendo[i]; const s = g.scale.x * Math.max(0, 1 - dt * 12); g.scale.setScalar(s);
        if (s < 0.03) { cena.remove(g); morrendo.splice(i, 1); }
      }
      for (const c of criancas) {
        const u = (t - c.pulo) / 0.45;
        const pulo = u > 0 && u < 1 ? Math.sin(Math.PI * u) * 0.45 : 0;
        c.g.position.y = c.base.y + pulo + Math.abs(Math.sin(t * 2.2 + c.base.x)) * 0.03;
      }
    });
    return () => { api.current = null; p.destruir(); };
  }, []);

  const chave = JSON.stringify(dados) + escala + erradas.join(",") + (titulo ?? "");
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { const c = casos[i]; api.current?.montar(c.dados, c.escala ?? 1, [], c.titulo); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(mostrar, 60);
      const id = setInterval(mostrar, 2800);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(dados, escala, erradas, titulo);
  }, [casos, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`Gráfico de barras em 3D feito de bloquinhos${titulo ? `: ${titulo}` : ""}. ${dados.map((d) => `${d.rot}: ${d.v}`).join("; ")}${escala > 1 ? `. Cada bloquinho vale ${escala}.` : ""}`} />;
}
