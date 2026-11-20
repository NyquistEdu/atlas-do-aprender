"use client";
/**
 * Gráfico de barras em 3D feito de cubinhos: cada voto é um cubinho que cai na barra.
 * Com escala 2, cada cubinho vale 2 votos (meio cubinho vale 1). Há uma parede quadriculada
 * com os números do eixo. Barras marcadas em "erradas" ficam vermelhas.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

export type Barra = { rot: string; v: number };
export type CasoGrafico = { dados: Barra[]; escala?: number; legenda?: string };
export const CORES_BARRA = [0xf2b33d, 0x6f93e0, 0xe8786d, 0x5fae7b, 0xb48ad9];
export const CORES_CSS = ["#f2b33d", "#6f93e0", "#e8786d", "#5fae7b", "#b48ad9"];

const S = 0.56, PASSO = 0.58, ESP = 1.7, NIVEIS = 10;

type Cubo = { m: THREE.Mesh; alvo: THREE.Vector3; meio: boolean; nascer: number; morrer: number | null };

export default function Grafico3D({ dados, escala = 1, erradas = [], titulo, casos, onCaso, altura = 380 }: {
  dados: Barra[]; escala?: number; erradas?: number[]; titulo?: string; casos?: CasoGrafico[]; onCaso?: (c: CasoGrafico) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (d: Barra[], esc: number, err: number[], tit?: string) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0x1d2433, az: 0.14, el: 0.26, dist: 11, distRetrato: 23, alvo: [-0.4, 2.5, 0], sombras: true, elMax: 1.2 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, 0x2b3756, 1.05));
    const sol = new THREE.DirectionalLight(0xffffff, 1.5); sol.position.set(5, 12, 9); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 9, bottom: -3 }); cena.add(sol);
    const mat = (c: number, r = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
    // papel quadriculado
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g = cv.getContext("2d")!; g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, 64, 64); g.strokeStyle = "#c9d6ee"; g.lineWidth = 3; g.strokeRect(0, 0, 64, 64);
    const tx = new THREE.CanvasTexture(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    const t1 = tx.clone(); t1.needsUpdate = true; t1.repeat.set(20, 7);
    const chao = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.2, 4), new THREE.MeshStandardMaterial({ map: t1, roughness: 0.9 })); chao.position.set(0, -0.1, 0.6); chao.receiveShadow = true; cena.add(chao);
    const t2 = tx.clone(); t2.needsUpdate = true; t2.repeat.set(20, NIVEIS);
    const parede = new THREE.Mesh(new THREE.BoxGeometry(11.6, NIVEIS * PASSO + 0.4, 0.15), new THREE.MeshBasicMaterial({ map: t2 })); parede.position.set(0, (NIVEIS * PASSO + 0.4) / 2, -1.45); parede.receiveShadow = true; cena.add(parede);
    // eixo
    const eixo = new THREE.Mesh(new THREE.BoxGeometry(0.08, NIVEIS * PASSO + 0.3, 0.08), mat(0x1d2433)); eixo.position.set(-5.2, (NIVEIS * PASSO + 0.3) / 2, -1.3); cena.add(eixo);
    const linhas: THREE.Mesh[] = [];
    for (let i = 1; i <= NIVEIS; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.03, 0.02), mat(0x9aa6c4)); l.position.set(0.1, i * PASSO, -1.36); cena.add(l); linhas.push(l); }

    const gCubo = new THREE.BoxGeometry(S, S, S);
    const mats = CORES_BARRA.map((c) => mat(c, 0.45)), matErro = mat(0xd9483b, 0.45);
    let barras: Cubo[][] = [];
    const morrendo: Cubo[] = [];
    let rotulos: THREE.Sprite[] = [], numeros: THREE.Sprite[] = [], eixoNums: THREE.Sprite[] = [];
    let t = 0, escAtual = -1, nAtual = -1, titSp: THREE.Sprite | null = null, titAtual = "";
    const xDe = (i: number, n: number) => (i - (n - 1) / 2) * ESP + 0.3;

    const montar = (d: Barra[], esc: number, err: number[], tit?: string) => {
      const n = d.length;
      if (esc !== escAtual) {
        eixoNums.forEach((s) => cena.remove(s)); eixoNums = [];
        for (let i = 0; i <= NIVEIS; i += 1) { if (esc === 1 && i % 2) continue; const s = plaquinha(String(i * esc), { largura: 130, escala: 0.9, fundo: "#fff6d6" }); s.position.set(-5.75, i * PASSO + 0.02, -1.2); cena.add(s); eixoNums.push(s); }
        escAtual = esc;
      }
      if ((tit ?? "") !== titAtual) { if (titSp) cena.remove(titSp); titSp = tit ? plaquinha(tit, { largura: Math.min(900, 60 + tit.length * 26), escala: 1.0, fundo: "#ffffff" }) : null; if (titSp) { titSp.position.set(0.3, NIVEIS * PASSO + 0.85, -1.3); cena.add(titSp); } titAtual = tit ?? ""; }
      if (n !== nAtual) { barras.forEach((b) => b.forEach((c) => { c.morrer = t; morrendo.push(c); })); barras = Array.from({ length: n }, () => []); nAtual = n; }
      rotulos.forEach((s) => cena.remove(s)); numeros.forEach((s) => cena.remove(s)); rotulos = []; numeros = [];
      d.forEach((b, i) => {
        const v = Math.max(0, Math.min(NIVEIS * esc, Math.round(b.v)));
        const cheios = Math.floor(v / esc), meio = v % esc !== 0;
        const quer = cheios + (meio ? 1 : 0);
        const lista = barras[i];
        while (lista.length > quer) { const c = lista.pop()!; c.morrer = t; morrendo.push(c); }
        const antes = lista.length;
        while (lista.length < quer) {
          const m = new THREE.Mesh(gCubo, mats[i % mats.length]); m.castShadow = true; m.receiveShadow = true;
          const k = lista.length; const alvo = new THREE.Vector3(xDe(i, n), S / 2 + k * PASSO, -0.6);
          m.position.copy(alvo).add(new THREE.Vector3(0, 4, 0)); m.visible = false; cena.add(m);
          lista.push({ m, alvo, meio: false, nascer: t + (lista.length - antes) * 0.06, morrer: null });
        }
        const errada = err.includes(i);
        lista.forEach((c, k) => {
          c.meio = meio && k === quer - 1;
          c.alvo.set(xDe(i, n), (c.meio ? S / 4 : S / 2) + k * PASSO, -0.6);
          c.m.material = errada ? matErro : mats[i % mats.length];
        });
        const r = plaquinha(b.rot, { largura: Math.min(420, 80 + b.rot.length * 30), escala: 1.05, fundo: errada ? "#ffd6d1" : "#ffffff" }); r.position.set(xDe(i, n), -0.05, 1.5); cena.add(r); rotulos.push(r);
        const nm = plaquinha(String(v), { largura: 110, escala: 0.95, fundo: "#fff6d6" }); nm.position.set(xDe(i, n), quer * PASSO + 0.5, -0.6); cena.add(nm); numeros.push(nm);
      });
    };
    api.current = { montar };

    p.aoQuadro((dt) => {
      t += dt;
      const k = Math.min(1, dt * 8);
      for (const lista of barras) for (const c of lista) {
        if (t < c.nascer) { c.m.visible = false; continue; }
        c.m.visible = true;
        c.m.position.lerp(c.alvo, k);
        const sy = c.meio ? 0.5 : 1;
        c.m.scale.set(1, c.m.scale.y + (sy - c.m.scale.y) * k, 1);
      }
      for (let i = morrendo.length - 1; i >= 0; i--) {
        const c = morrendo[i]; const s = c.m.scale.x * Math.max(0, 1 - dt * 12); c.m.scale.setScalar(s);
        if (s < 0.03) { cena.remove(c.m); morrendo.splice(i, 1); }
      }
    });
    return () => { api.current = null; p.destruir(); };
  }, []);

  const chave = JSON.stringify(dados) + escala + erradas.join(",") + (titulo ?? "");
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { const c = casos[i]; api.current?.montar(c.dados, c.escala ?? 1, [], undefined); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(mostrar, 60);
      const id = setInterval(mostrar, 2600);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(dados, escala, erradas, titulo);
  }, [casos, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`Gráfico de barras em 3D${titulo ? `: ${titulo}` : ""}. ${dados.map((d) => `${d.rot}: ${d.v}`).join("; ")}${escala > 1 ? `. Cada cubinho vale ${escala}.` : ""}`} />;
}
