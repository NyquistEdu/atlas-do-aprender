"use client";
/**
 * Trem das sílabas em 3D: uma locomotiva que solta fumaça e um vagão para cada sílaba (palma).
 * "partiu" faz o trem sair pela direita; trocar "chave" traz um trem novo pela esquerda.
 * Modo estação: passageiros com plaquinhas na plataforma; tocar num deles chama onToque,
 * e "embarca" faz o passageiro pular para dentro do último vagão.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { criarPalco, plaquinha } from "./palco3d";

export type CasoTrem = { silabas: string[]; placa?: string; legenda?: string; partiu?: boolean };
const CORES = [0xf2b33d, 0x5b8def, 0x4fb37a, 0xb07fe0, 0xef6f5e, 0x4fb3b8];
const LW = 2.0; // comprimento de cada vagão

export default function Trem3D({ silabas, placa, chave, partiu = false, passageiros, onToque, embarca = null, errado = null, casos, onCaso, altura = 380 }: {
  silabas: string[]; placa?: string; chave: string | number; partiu?: boolean; passageiros?: string[]; onToque?: (i: number) => void;
  embarca?: number | null; errado?: { i: number; n: number } | null; casos?: CasoTrem[]; onCaso?: (c: CasoTrem) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (s: string[], placa: string | undefined, chave: string | number) => void; partir: (p: boolean) => void; pax: (l?: string[]) => void; embarcar: (i: number | null) => void; nao: (i: number) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;
  const tq = useRef(onToque); tq.current = onToque;
  const estacao = !!passageiros;

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0xbfe6ff, az: 0, el: estacao ? 0.5 : 0.3, dist: estacao ? 16 : 15, distRetrato: 26, alvo: [0, estacao ? 1.8 : 1.4, estacao ? -1.2 : 0], sombras: true, elMin: 0.1, elMax: 1.1 });
    const { cena, cam } = p;
    cena.fog = new THREE.Fog(0xbfe6ff, 30, 70);
    cena.add(new THREE.HemisphereLight(0xffffff, 0x6f9a4f, 1.1));
    const sol = new THREE.DirectionalLight(0xfff4e0, 1.7); sol.position.set(6, 12, 8); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -14, right: 14, top: 8, bottom: -6 }); cena.add(sol);
    const mat = (c: number, r = 0.55) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
    const add = (pai: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = true; pai.add(me); return me; };

    // paisagem: grama, trilhos, árvores e montanhas
    const grama = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), mat(0x8cc56b, 1)); grama.rotation.x = -Math.PI / 2; grama.receiveShadow = true; cena.add(grama);
    const brita = new THREE.Mesh(new THREE.BoxGeometry(120, 0.08, 2.2), mat(0xb9ab95, 1)); brita.position.y = 0.04; brita.receiveShadow = true; cena.add(brita);
    for (let x = -60; x < 60; x += 0.9) add(cena, new THREE.BoxGeometry(0.28, 0.1, 1.9), mat(0x8a5a3b, 0.9), x, 0.1, 0).receiveShadow = true;
    [-0.62, 0.62].forEach((z) => add(cena, new THREE.BoxGeometry(120, 0.12, 0.1), mat(0x8a93a8, 0.3), 0, 0.2, z));
    let s = 3; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 22; i++) {
      const x = -30 + i * 2.8 + rnd(), z = -6 - rnd() * 8;
      add(cena, new THREE.CylinderGeometry(0.18, 0.24, 1.2, 8), mat(0x7a4e32), x, 0.6, z);
      add(cena, new THREE.SphereGeometry(0.9 + rnd() * 0.5, 14, 10), mat([0x4f9a52, 0x5fae5f, 0x3f8f4a][i % 3], 0.9), x, 1.8, z);
    }
    [[-18, 0x9fc9e8], [-4, 0xa9d1ee], [12, 0x9fc9e8], [26, 0xa9d1ee]].forEach(([x, c]) => { const m = add(cena, new THREE.ConeGeometry(7, 7, 6), mat(c, 1), x, 3.2, -26); m.castShadow = false; });

    // estação
    const passGrupo = new THREE.Group(); cena.add(passGrupo);
    if (estacao) {
      const plat = add(cena, new RoundedBoxGeometry(14, 0.5, 2.6, 2, 0.08), mat(0xd9c7a6, 0.9), 0, 0.25, -3.4); plat.receiveShadow = true;
      add(cena, new THREE.BoxGeometry(14, 0.06, 0.25), mat(0xf2c23d), 0, 0.53, -2.2);
      const tel = add(cena, new RoundedBoxGeometry(9, 0.2, 2.4, 2, 0.08), mat(0xef6f5e), 0, 4.0, -3.9); tel.castShadow = true;
      [-4, 4].forEach((x) => add(cena, new THREE.CylinderGeometry(0.1, 0.1, 3.5, 10), mat(0xffffff), x, 2.25, -4.4));
      const pl = plaquinha("ESTAÇÃO DAS RIMAS", { largura: 600, escala: 1.2, fundo: "#ffffff" }); pl.position.set(0, 4.7, -3.9); cena.add(pl);
    }

    // trem
    // o trem anda para a esquerda: a locomotiva fica à esquerda e as sílabas se leem da esquerda para a direita
    const trem = new THREE.Group(); trem.rotation.y = Math.PI; cena.add(trem);
    const loco = new THREE.Group(); trem.add(loco);
    add(loco, new RoundedBoxGeometry(2.4, 1.1, 1.5, 3, 0.15), mat(0xe2574c, 0.4), 0, 1.0, 0);
    add(loco, new THREE.CylinderGeometry(0.62, 0.62, 1.7, 24), mat(0x2f3a55, 0.4), 0.35, 1.75, 0).rotation.z = Math.PI / 2;
    add(loco, new RoundedBoxGeometry(1.0, 1.3, 1.5, 3, 0.12), mat(0xe2574c, 0.4), -0.85, 2.05, 0);
    add(loco, new RoundedBoxGeometry(1.2, 0.18, 1.7, 2, 0.06), mat(0x2f3a55, 0.4), -0.85, 2.78, 0);
    add(loco, new THREE.BoxGeometry(0.5, 0.45, 1.52), mat(0xbfe6ff, 0.1), -0.85, 2.2, 0);
    const chamine = add(loco, new THREE.CylinderGeometry(0.22, 0.16, 0.7, 16), mat(0x2f3a55, 0.4), 0.85, 2.85, 0);
    add(loco, new THREE.CylinderGeometry(0.3, 0.3, 0.12, 16), mat(0xf2c23d, 0.3), 0.85, 3.2, 0);
    add(loco, new THREE.ConeGeometry(0.55, 0.7, 4), mat(0xf2c23d, 0.4), 1.45, 0.65, 0).rotation.set(0, Math.PI / 4, -Math.PI / 2);
    const farol = add(loco, new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: 0xfff3b0, emissive: 0xfff3b0, emissiveIntensity: 0.8 }), 1.22, 1.75, 0);
    void farol;
    const rodas: THREE.Mesh[] = [];
    const gRoda = new THREE.CylinderGeometry(0.34, 0.34, 0.16, 20), mRoda = mat(0x1d2433, 0.6);
    const roda = (pai: THREE.Object3D, x: number) => [-0.72, 0.72].forEach((z) => { const r = add(pai, gRoda, mRoda, x, 0.42, z); r.rotation.x = Math.PI / 2; rodas.push(r); });
    [-0.8, 0.6].forEach((x) => roda(loco, x));
    let placaLoco: THREE.Sprite | null = null;

    // fumaça
    const fumos: { m: THREE.Mesh; t: number }[] = [];
    const gFumo = new THREE.SphereGeometry(0.28, 12, 8);
    const soltarFumo = () => {
      const m = new THREE.Mesh(gFumo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.85 }));
      const wp = new THREE.Vector3(); chamine.getWorldPosition(wp); m.position.copy(wp).add(new THREE.Vector3(0, 0.6, 0)); cena.add(m); fumos.push({ m, t: 0 });
    };

    type Vagao = { g: THREE.Group; alvoX: number; etq: THREE.Sprite };
    let vagoes: Vagao[] = [];
    const fazVagao = (txt: string, i: number) => {
      const g = new THREE.Group();
      add(g, new RoundedBoxGeometry(LW - 0.25, 1.1, 1.45, 3, 0.14), mat(CORES[i % CORES.length], 0.45), 0, 1.0, 0);
      add(g, new THREE.BoxGeometry(LW - 0.1, 0.12, 1.55), mat(0x2f3a55, 0.4), 0, 0.5, 0);
      add(g, new THREE.BoxGeometry(0.4, 0.08, 0.08), mat(0x2f3a55), LW / 2 - 0.05, 0.55, 0);
      roda(g, -0.55); roda(g, 0.55);
      const etq = plaquinha(txt, { largura: Math.max(200, 70 + txt.length * 52), escala: 1.25, fundo: "#ffffff" }); etq.position.set(0, 2.15, 0); g.add(etq);
      return { g, etq };
    };
    let trX = 0, vel = 0, saindo = false, chegando = false, t = 0;
    const centro = (n: number) => -((n + 1) * LW) / 2 + LW * 0.6; // posição da locomotiva para o trem ficar centrado
    const layout = () => { vagoes.forEach((v, i) => (v.alvoX = -(i + 1) * LW - 0.35)); };
    const montar = (sil: string[], plc: string | undefined, ch: string | number) => {
      const nova = String(ch) !== String(chaveAtual);
      if (nova) {
        vagoes.forEach((v) => trem.remove(v.g)); vagoes = [];
        sil.forEach((sx, i) => { const { g, etq } = fazVagao(sx, i); g.position.x = -(i + 1) * LW - 0.35; trem.add(g); vagoes.push({ g, alvoX: g.position.x, etq }); });
        trX = 26 + sil.length * LW; trem.position.x = trX; chegando = true; saindo = false; vel = 0; chaveAtual = ch;
      } else {
        // vagões a mais ou a menos (palmas): entram rolando por trás
        while (vagoes.length > sil.length) trem.remove(vagoes.pop()!.g);
        sil.forEach((sx, i) => {
          if (vagoes[i]) { if (vagoes[i].etq.userData.t !== sx) { vagoes[i].g.remove(vagoes[i].etq); const e = plaquinha(sx, { largura: Math.max(200, 70 + sx.length * 52), escala: 1.25, fundo: "#ffffff" }); e.position.set(0, 2.15, 0); e.userData.t = sx; vagoes[i].g.add(e); vagoes[i].etq = e; } return; }
          const { g, etq } = fazVagao(sx, i); etq.userData.t = sx; g.position.x = -(i + 1) * LW - 6; trem.add(g); vagoes.push({ g, alvoX: 0, etq });
        });
        layout(); chegando = true;
      }
      if (placaLoco) loco.remove(placaLoco);
      placaLoco = plc ? plaquinha(plc, { largura: Math.max(240, 80 + plc.length * 34), escala: 1.3, fundo: "#fff6d6" }) : null;
      if (placaLoco) { placaLoco.position.set(0, 3.9, 0); loco.add(placaLoco); }
      layout();
    };
    let chaveAtual: string | number = "__";

    // passageiros
    type Pax = { g: THREE.Group; base: THREE.Vector3; pulo: number; nao: number; dentro: boolean };
    let pax: Pax[] = [];
    const PELE = [0xf0c9a4, 0xd9a07a, 0xa8714f], ROUPA = [0x5b8def, 0xef6f5e, 0x4fb37a, 0xb07fe0];
    const montarPax = (l?: string[]) => {
      pax.forEach((x) => passGrupo.remove(x.g)); pax = [];
      (l || []).forEach((txt, i) => {
        const g = new THREE.Group();
        add(g, new THREE.CapsuleGeometry(0.28, 0.45, 4, 12), mat(ROUPA[i % 4], 0.7), 0, 0.6, 0);
        add(g, new THREE.SphereGeometry(0.27, 16, 12), mat(PELE[i % 3], 0.8), 0, 1.3, 0);
        add(g, new THREE.SphereGeometry(0.29, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat([0x2b1d14, 0x5a3a22, 0x1d2433][i % 3], 0.9), 0, 1.35, -0.02);
        [-0.1, 0.1].forEach((x) => add(g, new THREE.SphereGeometry(0.04, 8, 6), mat(0x1d2433), x, 1.33, 0.25));
        const pl = plaquinha(txt, { largura: Math.max(220, 70 + txt.length * 34), escala: 1.25, fundo: "#ffffff" }); pl.position.set(0, 2.45, 0); g.add(pl);
        const base = new THREE.Vector3(-4 + i * 4, 0.5, -3.4);
        g.position.copy(base); g.traverse((o) => (o.userData.idx = i)); passGrupo.add(g);
        pax.push({ g, base, pulo: -9, nao: -9, dentro: false });
      });
    };
    const embarcar = (i: number | null) => { if (i === null || !pax[i]) return; pax[i].pulo = t; pax[i].dentro = true; };
    const nao = (i: number) => { if (pax[i]) pax[i].nao = t; };
    api.current = { montar, partir: (x) => { saindo = x; if (!x) vel = 0; }, pax: montarPax, embarcar, nao };

    const ray = new THREE.Raycaster();
    p.aoToque((n) => {
      if (!tq.current) return;
      ray.setFromCamera(n, cam);
      const hit = ray.intersectObjects(pax.map((x) => x.g), true)[0];
      if (hit && typeof hit.object.userData.idx === "number") tq.current(hit.object.userData.idx);
    });

    let ultFumo = 0;
    p.aoQuadro((dt) => {
      t += dt;
      const alvo = centro(vagoes.length);
      if (saindo) { vel = Math.min(16, vel + dt * 7); trX -= vel * dt; }
      else if (chegando) { trX += (alvo - trX) * Math.min(1, dt * 2.2); if (Math.abs(alvo - trX) < 0.01) chegando = false; }
      else trX += (alvo - trX) * Math.min(1, dt * 3);
      const dx = trX - trem.position.x; trem.position.x = trX;
      rodas.forEach((r) => (r.rotation.y += dx / 0.34));
      vagoes.forEach((v) => { v.g.position.x += (v.alvoX - v.g.position.x) * Math.min(1, dt * 5); });
      trem.position.y = Math.abs(dx) > 0.002 ? Math.sin(t * 30) * 0.015 : 0;
      if (t - ultFumo > (Math.abs(dx) > 0.01 ? 0.12 : 0.45)) { soltarFumo(); ultFumo = t; }
      for (let i = fumos.length - 1; i >= 0; i--) {
        const f = fumos[i]; f.t += dt; f.m.position.y += dt * 1.1; f.m.position.x += dt * (0.6 + vel * 0.6); f.m.scale.setScalar(1 + f.t * 1.4);
        (f.m.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.85 - f.t * 0.45);
        if (f.t > 1.9) { cena.remove(f.m); (f.m.material as THREE.Material).dispose(); fumos.splice(i, 1); }
      }
      pax.forEach((x) => {
        if (x.dentro) {
          const u = Math.min(1, (t - x.pulo) / 0.7);
          const fim = new THREE.Vector3(); (vagoes.length ? vagoes[vagoes.length - 1].g : trem).getWorldPosition(fim); fim.y = 1.3;
          x.g.position.lerpVectors(x.base, fim, u); x.g.position.y += Math.sin(Math.PI * u) * 1.6; x.g.scale.setScalar(1 - u * 0.6);
          x.g.visible = u < 1;
        } else {
          const k = t - x.nao;
          x.g.position.copy(x.base); x.g.position.y += Math.abs(Math.sin(t * 2 + x.base.x)) * 0.05;
          x.g.rotation.y = k < 0.6 ? Math.sin(k * 30) * 0.5 : 0;
        }
      });
    });
    return () => { api.current = null; p.destruir(); };
  }, [estacao]);

  const chaveS = JSON.stringify(silabas) + (placa ?? "") + String(chave);
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const ir = () => { const c = casos[i]; api.current?.partir(false); api.current?.montar(c.silabas, c.placa, `caso${i}`); cb.current?.(c); if (c.partiu) setTimeout(() => api.current?.partir(true), 1600); i = (i + 1) % casos.length; };
      const id0 = setTimeout(ir, 60);
      const id = setInterval(ir, 3600);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(silabas, placa, chave);
  }, [casos, chaveS]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!casos) api.current?.partir(partiu); }, [partiu]); // eslint-disable-line react-hooks/exhaustive-deps
  const chaveP = JSON.stringify(passageiros ?? []) + String(chave);
  useEffect(() => { api.current?.pax(passageiros); }, [chaveP]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { api.current?.embarcar(embarca); }, [embarca]);
  useEffect(() => { if (errado) api.current?.nao(errado.i); }, [errado?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura, cursor: onToque ? "pointer" : undefined }} role="img" aria-label={`Trem em 3D com ${silabas.length} vagões: ${silabas.join("-")}`} />;
}
