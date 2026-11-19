"use client";
/**
 * Dezenas em 3D. Dois cenários:
 * - "dourado": material dourado na mesa. Cubinhos soltos no quadro de dez; 10 cubinhos voam e viram 1 barra (1 dezena).
 * - "feira": o caminhão do Seu Zé com caixas de 10 laranjas e laranjas soltas; "partiu" faz o caminhão sair.
 * Mudar de (d, 10+u) para (d+1, u) anima a troca; o contrário desmancha a barra. Gira arrastando.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

export type Estilo = "dourado" | "feira";
export type CasoDezena = { d: number; u: number; legenda?: string };

const LADO = 0.4, PASSO = 0.42; // cubinho do material dourado
const BED = 0.95; // altura da carroceria

type Peca = { obj: THREE.Object3D; alvo: THREE.Vector3; nascer: number; morrer: number | null; morto?: boolean };

export default function Dezenas3D({ d, u, estilo = "dourado", partiu = false, casos, onCaso, altura = 380 }: {
  d: number; u: number; estilo?: Estilo; partiu?: boolean; casos?: CasoDezena[]; onCaso?: (c: CasoDezena) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (d: number, u: number) => void; partir: (p: boolean) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const feira = estilo === "feira";
    const p = criarPalco(ref.current!, feira
      ? { fundo: 0xbfe0ff, az: -0.35, el: 0.42, dist: 13, distRetrato: 19, alvo: [0, 1.4, 0.4], sombras: true, elMax: 1.2 }
      : { fundo: 0x1d2433, az: 0.16, el: 0.36, dist: 13.5, distRetrato: 21, alvo: [-0.7, 2.0, 0.6], sombras: true, elMax: 1.25 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, feira ? 0x7a8a6a : 0x2b3756, feira ? 0.95 : 1.05));
    const sol = new THREE.DirectionalLight(0xffffff, feira ? 1.7 : 1.5); sol.position.set(5, 12, 8); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 }); cena.add(sol);
    const mat = (c: number, r = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

    // ---------- cenário
    const raiz = new THREE.Group(); cena.add(raiz); // o que anda junto (o caminhão, na feira)
    if (feira) {
      const chao = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), mat(0x8cc56b, 1)); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
      const rua = new THREE.Mesh(new THREE.BoxGeometry(80, 0.04, 4.6), mat(0x5b6273, 0.9)); rua.position.set(0, 0.02, 0.5); rua.receiveShadow = true; cena.add(rua);
      // barraca da feira ao fundo
      const barraca = new THREE.Group();
      const mesa = new THREE.Mesh(new THREE.BoxGeometry(6, 0.9, 1.6), mat(0x8a5a3b)); mesa.position.y = 0.45; mesa.castShadow = true; barraca.add(mesa);
      [-2.8, 2.8].forEach((x) => [-0.7, 0.7].forEach((z) => { const pau = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3), mat(0x6b4a33)); pau.position.set(x, 1.5, z); barraca.add(pau); }));
      const toldo = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.12, 2.2), mat(0xe2574c)); toldo.position.y = 3; toldo.castShadow = true; barraca.add(toldo);
      const listra = new THREE.Mesh(new THREE.BoxGeometry(6.42, 0.13, 0.5), mat(0xffffff)); listra.position.y = 3; barraca.add(listra);
      const lar = new THREE.SphereGeometry(0.16, 14, 10), laranja = mat(0xf28c28, 0.55);
      for (let i = 0; i < 46; i++) { const o = new THREE.Mesh(lar, laranja); o.position.set(-2.5 + (i % 15) * 0.34 + (Math.floor(i / 15) % 2) * 0.17, 1.05 + Math.floor(i / 15) * 0.22, -0.3 + Math.floor(i / 15) * 0.18); barraca.add(o); }
      barraca.position.set(-1, 0, -4.2); cena.add(barraca);
      const placa = plaquinha("FEIRA DO SEU ZÉ", { largura: 520, fundo: "#f6d35b", escala: 1.3 }); placa.position.set(-1, 3.7, -4.2); cena.add(placa);
      // caminhão
      const carroceria = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.25, 3), mat(0x8a5a3b)); carroceria.position.set(-0.7, BED - 0.12, 0.5); carroceria.castShadow = true; carroceria.receiveShadow = true; raiz.add(carroceria);
      [[-0.7, 0.5 - 1.5], [-0.7, 0.5 + 1.5]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.5, 0.08), mat(0xb07a4f)); l.position.set(x, BED + 0.25, z); raiz.add(l); });
      const tras = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 3), mat(0xb07a4f)); tras.position.set(-4.8, BED + 0.25, 0.5); raiz.add(tras);
      const cabine = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.9, 2.8), mat(0x3a6fd8, 0.5)); cabine.position.set(4.35, 1.25, 0.5); cabine.castShadow = true; raiz.add(cabine);
      const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 2.4), new THREE.MeshStandardMaterial({ color: 0xbfe6ff, roughness: 0.1 })); vidro.position.set(5.26, 1.65, 0.5); raiz.add(vidro);
      const roda = mat(0x1d2433, 0.8), gRoda = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 20);
      [[-3.3, -1.0], [-3.3, 2.0], [3.9, -1.0], [3.9, 2.0]].forEach(([x, z]) => { const r = new THREE.Mesh(gRoda, roda); r.rotation.x = Math.PI / 2; r.position.set(x, 0.45, z); r.castShadow = true; raiz.add(r); });
    } else {
      const mesa = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 6.5), mat(0xc89a6a, 0.85)); mesa.position.set(-0.4, -0.15, 0.6); mesa.receiveShadow = true; cena.add(mesa);
      // dois quadros de dez desenhados na mesa
      [0, 1].forEach((f) => {
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 1.1), mat(0xfbf6ea, 0.9)); base.position.set(2.35, 0.015, 0.0 + f * 1.3); base.receiveShadow = true; cena.add(base);
        for (let i = 1; i < 5; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.035, 1.1), mat(0x9aa6c4)); l.position.set(1.05 + i * 0.52, 0.02, f * 1.3); cena.add(l); }
        const lh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.035, 0.02), mat(0x9aa6c4)); lh.position.set(2.35, 0.02, f * 1.3); cena.add(lh);
      });
    }

    // ---------- peças
    const gCubo = new THREE.BoxGeometry(LADO, LADO, LADO);
    const mBarra = mat(0xf2b33d, 0.45), mUnid = mat(0x6f93e0, 0.45);
    const gLar = new THREE.SphereGeometry(0.15, 14, 10), mLar = mat(0xf28c28, 0.55), mCaixa = mat(0xc9935a, 0.8);
    const fazBarra = () => {
      const g = new THREE.Group();
      if (feira) {
        const fundo = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.05, 0.76), mCaixa); fundo.position.y = 0.025; g.add(fundo);
        [[0, 0.38, 1.72, 0.05], [0, -0.38, 1.72, 0.05]].forEach(([x, z, w, dd]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, dd), mCaixa); p.position.set(x, 0.15, z); p.castShadow = true; g.add(p); });
        [-0.86, 0.86].forEach((x) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.76), mCaixa); p.position.set(x, 0.15, 0); g.add(p); });
        for (let k = 0; k < 10; k++) { const o = new THREE.Mesh(gLar, mLar); o.position.copy(slotCaixa(k)); o.castShadow = true; g.add(o); }
      } else {
        for (let k = 0; k < 10; k++) { const c = new THREE.Mesh(gCubo, mBarra); c.position.y = LADO / 2 + k * PASSO; c.castShadow = true; g.add(c); }
      }
      return g;
    };
    const fazUnid = () => { const m = feira ? new THREE.Mesh(gLar, mLar) : new THREE.Mesh(gCubo, mUnid); m.castShadow = true; return m; };
    function slotCaixa(k: number) { return new THREE.Vector3(-0.64 + (k % 5) * 0.32, 0.2, -0.16 + Math.floor(k / 5) * 0.32); }
    const posBarra = (i: number) => feira
      ? new THREE.Vector3(-3.6 + (i % 2) * 1.85, BED + Math.floor(i / 2) * 0.33, 0.1)
      : new THREE.Vector3(-4.6 + i * 0.55, 0, 0.6);
    const posUnid = (j: number) => {
      const f = Math.floor(j / 10), r = j % 10;
      return feira
        ? new THREE.Vector3(0.4 + (r % 5) * 0.34, BED + 0.15, -0.35 + Math.floor(r / 5) * 0.34 + f * 1.05)
        : new THREE.Vector3(1.31 + (r % 5) * 0.52, LADO / 2 + 0.03, -0.27 + Math.floor(r / 5) * 0.55 + f * 1.3);
    };
    // posição (no mundo da raiz) do k-ésimo cubinho/laranja dentro da barra i
    const slotBarra = (i: number, k: number) => posBarra(i).add(feira ? slotCaixa(k) : new THREE.Vector3(0, LADO / 2 + k * PASSO, 0));

    let barras: Peca[] = [], unids: Peca[] = [];
    const morrendo: Peca[] = [];
    let t = 0, D = -1, U = -1;
    let etqN: THREE.Sprite | null = null, etqD: THREE.Sprite | null = null, etqU: THREE.Sprite | null = null;
    const etiquetas = () => {
      [etqN, etqD, etqU].forEach((s) => s && raiz.remove(s));
      const n = D * 10 + U;
      etqN = plaquinha(String(n), { largura: 220, escala: 1.6, fundo: D === 10 && U === 0 ? "#f6d35b" : "#ffffff" });
      etqN.position.set(feira ? 1.9 : 2.35, feira ? 3.2 : 3.3, 0.6); raiz.add(etqN);
      const nomeD = feira ? (D === 1 ? "1 caixa" : `${D} caixas`) : D === 10 ? "10 dezenas = 100" : D === 1 ? "1 dezena" : `${D} dezenas`;
      const nomeU = feira ? (U === 1 ? "1 solta" : `${U} soltas`) : U === 1 ? "1 unidade" : `${U} unidades`;
      etqD = plaquinha(nomeD, { largura: 400, escala: 0.95, fundo: "#fff6d6" });
      etqD.position.set(feira ? -2.7 : -2.1, feira ? 3.0 : 4.75, 0.6); raiz.add(etqD);
      etqU = plaquinha(U >= 10 ? (feira ? `${U} soltas: feche 1 caixa!` : `${U}: troque 10 por 1 barra!`) : nomeU, { largura: U >= 10 ? 560 : 360, escala: 0.95, fundo: U >= 10 ? "#ffd6d1" : "#e3ecff" });
      etqU.position.set(feira ? 1.1 : 2.35, feira ? 2.2 : 1.6, 0.6); raiz.add(etqU);
    };

    const nova = (obj: THREE.Object3D, alvo: THREE.Vector3, atraso: number, de?: THREE.Vector3): Peca => {
      obj.position.copy(de ?? alvo.clone().add(new THREE.Vector3(0, 3.5, 0))); obj.visible = false; raiz.add(obj);
      return { obj, alvo, nascer: t + atraso, morrer: null };
    };
    const matar = (pc: Peca, quando: number, alvo?: THREE.Vector3) => { pc.morrer = quando; if (alvo) pc.alvo = alvo; morrendo.push(pc); };

    const montar = (d: number, u: number) => {
      d = Math.max(0, Math.min(10, d)); u = Math.max(0, Math.min(19, u));
      if (D < 0) { // primeira vez: tudo cai na mesa
        barras = Array.from({ length: d }, (_, i) => nova(fazBarra(), posBarra(i), i * 0.08));
        unids = Array.from({ length: u }, (_, j) => nova(fazUnid(), posUnid(j), d * 0.08 + j * 0.05));
        D = d; U = u; etiquetas(); return;
      }
      if (d === D + 1 && u === U - 10) {
        // troca: os 10 últimos soltos voam para dentro da barra nova e somem quando ela aparece
        const vao = unids.splice(U - 10, 10);
        // os que ficam vão para o começo do quadro
        vao.forEach((pc, k) => matar(pc, t + 0.75, slotBarra(D, k)));
        const b = nova(fazBarra(), posBarra(D), 0.75, posBarra(D)); barras.push(b);
        // reordena os soltos que ficaram
        unids = unids.slice(0, U - 10);
      } else if (d === D - 1 && u === U + 10) {
        // desmancha: a barra some e 10 soltos saem dela
        const b = barras.pop()!; matar(b, t);
        for (let k = 0; k < 10; k++) unids.push(nova(fazUnid(), posUnid(U + k), 0, slotBarra(D - 1, k)));
      } else {
        while (barras.length > d) matar(barras.pop()!, t);
        while (barras.length < d) barras.push(nova(fazBarra(), posBarra(barras.length), (barras.length - D) * 0.08));
        while (unids.length > u) matar(unids.pop()!, t);
        while (unids.length < u) unids.push(nova(fazUnid(), posUnid(unids.length), (unids.length - Math.min(U, u)) * 0.05));
      }
      barras.forEach((pc, i) => { pc.alvo = posBarra(i); });
      unids.forEach((pc, j) => { pc.alvo = posUnid(j); });
      D = d; U = u; etiquetas();
    };

    let partindo = false, vel = 0;
    api.current = { montar, partir: (x) => { partindo = x; if (!x) { raiz.position.x = 0; vel = 0; } } };

    p.aoQuadro((dt) => {
      t += dt;
      const k = Math.min(1, dt * 7);
      for (const pc of [...barras, ...unids]) {
        if (t < pc.nascer) { pc.obj.visible = false; continue; }
        pc.obj.visible = true;
        pc.obj.position.lerp(pc.alvo, k);
        const s = pc.obj.scale.x + (1 - pc.obj.scale.x) * k; pc.obj.scale.setScalar(s);
      }
      for (let i = morrendo.length - 1; i >= 0; i--) {
        const pc = morrendo[i];
        pc.obj.position.lerp(pc.alvo, Math.min(1, dt * 9));
        if (t >= (pc.morrer ?? 0)) {
          const s = pc.obj.scale.x * Math.max(0, 1 - dt * 14); pc.obj.scale.setScalar(s);
          if (s < 0.03) { raiz.remove(pc.obj); morrendo.splice(i, 1); }
        }
      }
      if (feira && partindo) { vel = Math.min(14, vel + dt * 6); raiz.position.x += vel * dt; }
    });
    return () => { api.current = null; p.destruir(); };
  }, [estilo]);

  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { const c = casos[i]; api.current?.montar(c.d, c.u); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(mostrar, 60);
      const id = setInterval(mostrar, 3200);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(d, u);
  }, [casos, d, u, estilo]);
  useEffect(() => { api.current?.partir(partiu); }, [partiu, estilo]);

  const n = d * 10 + u;
  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={estilo === "feira" ? `Caminhão com ${d} caixas de 10 laranjas e ${u} laranjas soltas: ${n} laranjas` : `Material dourado em 3D: ${d} barras de dezena e ${u} cubinhos, o número ${n}`} />;
}
