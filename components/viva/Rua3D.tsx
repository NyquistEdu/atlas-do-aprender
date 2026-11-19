"use client";
/**
 * A rua da escola em 3D: as crianças esperam na calçada, entram nas vans uma a uma e as vans partem.
 * Quem não coube fica na calçada pulando. Gira arrastando.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

export type FaseVan = "escolher" | "embarque" | "partiu";
const CORES_VAN = [0xf2b33d, 0x6f93e0, 0x5fae7b, 0xe8786d, 0xb48ad9];
const CORES_CRIANCA = [0xe8786d, 0xf2b33d, 0x5fae7b, 0x6f93e0, 0xb48ad9, 0xe98fb8, 0x4fb3b8, 0xd98c4f];

function van(cor: number) {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.2), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.5 }));
  corpo.position.y = 0.95; corpo.castShadow = true; g.add(corpo);
  const frente = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 1.15), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.5 }));
  frente.position.set(1.32, 0.72, 0); g.add(frente);
  const vidro = new THREE.MeshStandardMaterial({ color: 0xbfe6ff, roughness: 0.1, metalness: 0.2 });
  [-0.6, 0.1].forEach((x) => { const j = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 1.22), vidro); j.position.set(x, 1.2, 0); g.add(j); });
  const pb = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.4, 1.0), vidro); pb.position.set(1.11, 1.2, 0); g.add(pb);
  const roda = new THREE.MeshStandardMaterial({ color: 0x1d2433, roughness: 0.8 });
  [[-0.7, 0.55], [-0.7, -0.55], [0.95, 0.55], [0.95, -0.55]].forEach(([x, z]) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 18), roda); r.rotation.x = Math.PI / 2; r.position.set(x, 0.3, z); g.add(r); });
  return g;
}
function crianca(cor: number) {
  const g = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.28, 4, 10), new THREE.MeshStandardMaterial({ color: cor, roughness: 0.7 }));
  corpo.position.y = 0.36; corpo.castShadow = true; g.add(corpo);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), new THREE.MeshStandardMaterial({ color: 0xf0c9a4, roughness: 0.8 }));
  cab.position.y = 0.78; cab.castShadow = true; g.add(cab);
  return g;
}

export default function Rua3D({ N, C, vans, fase, altura = 400 }: { N: number; C: number; vans: number; fase: FaseVan; altura?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const palco = useRef<ReturnType<typeof criarPalco> | null>(null);
  const cenaDin = useRef<{ montar: (N: number, C: number, vans: number) => void; fase: (f: FaseVan) => void } | null>(null);

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0xbfe0ff, az: 0.3, el: 0.68, dist: 24, distRetrato: 34, alvo: [-3, 0, 0.5], sombras: true, elMax: 1.3 });
    palco.current = p;
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, 0x8a9aa8, 0.9));
    const sol = new THREE.DirectionalLight(0xffffff, 1.8); sol.position.set(6, 14, 8); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
    Object.assign(sol.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12 }); cena.add(sol);
    const mat = (c: number, r = 0.9) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
    const chao = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), mat(0x8cc56b)); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
    const calcada = new THREE.Mesh(new THREE.BoxGeometry(40, 0.12, 4.2), mat(0xd7d2c8)); calcada.position.set(0, 0.06, -2.4); calcada.receiveShadow = true; cena.add(calcada);
    const rua = new THREE.Mesh(new THREE.BoxGeometry(60, 0.05, 6.4), mat(0x5b6273)); rua.position.set(0, 0.03, 2.9); rua.receiveShadow = true; cena.add(rua);
    for (let i = -14; i < 15; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.14), mat(0xf2f2f2)); f.position.set(i * 2.2, 0.07, 2.9); cena.add(f); }
    // escola
    const escola = new THREE.Group();
    const pr = new THREE.Mesh(new THREE.BoxGeometry(9, 3.6, 3.2), mat(0xf6d9b4)); pr.position.y = 1.8; pr.castShadow = true; escola.add(pr);
    const tel = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.35, 3.8), mat(0xc4483b)); tel.position.y = 3.8; escola.add(tel);
    const porta = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2, 0.08), mat(0x8a5a3b)); porta.position.set(0, 1, 1.62); escola.add(porta);
    for (let i = -3; i <= 3; i++) if (i !== 0) { const j = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.06), mat(0x9fd0f0, 0.2)); j.position.set(i * 1.2, 2.3, 1.62); escola.add(j); }
    escola.position.set(-5, 0, -7.4); cena.add(escola);
    const placa = plaquinha("ESCOLA", { largura: 260, escala: 1.6 }); placa.position.set(-5, 4.6, -6); cena.add(placa);
    const museu = plaquinha("MUSEU →", { largura: 260, fundo: "#f6d35b", escala: 1.4 }); museu.position.set(13, 1.8, 0); cena.add(museu);

    let grupo = new THREE.Group(); cena.add(grupo);
    let vansObj: { g: THREE.Group; etq: THREE.Sprite; pos: THREE.Vector3 }[] = [];
    let kids: { g: THREE.Group; de: THREE.Vector3; van: number; ordem: number }[] = [];
    let faseAtual: FaseVan = "escolher", tFase = 0, cap = 1, total = 0;

    const montar = (n: number, c: number, nv: number) => {
      cena.remove(grupo); grupo = new THREE.Group(); cena.add(grupo);
      cap = c; total = n;
      vansObj = Array.from({ length: nv }, (_, j) => {
        const g = van(CORES_VAN[j % 5]);
        const pos = new THREE.Vector3(-9 + (j % 5) * 3.2, 0, j < 5 ? 1.6 : 4.3);
        g.position.copy(pos); grupo.add(g);
        const etq = plaquinha(`0/${c}`, { largura: 200, escala: 1.1 }); etq.position.set(0, 2.2, 0); g.add(etq);
        return { g, etq, pos };
      });
      kids = Array.from({ length: n }, (_, i) => {
        const g = crianca(CORES_CRIANCA[i % CORES_CRIANCA.length]);
        const de = new THREE.Vector3(-11 + (i % 14) * 0.62, 0.12, -1.0 - Math.floor(i / 14) * 0.75);
        g.position.copy(de); grupo.add(g);
        const vj = Math.floor(i / c);
        return { g, de, van: vj < nv ? vj : -1, ordem: i };
      });
      faseAtual = "escolher"; tFase = 0;
    };
    const etiquetar = (j: number, dentro: number) => {
      const v = vansObj[j]; v.g.remove(v.etq);
      v.etq = plaquinha(`${dentro}/${cap}`, { largura: 200, escala: 1.1, fundo: dentro === cap ? "#d8f2e1" : "#ffffff" }); v.etq.position.set(0, 2.2, 0); v.g.add(v.etq);
    };
    cenaDin.current = { montar, fase: (f) => { faseAtual = f; tFase = 0; } };

    const contagem: number[] = [];
    p.aoQuadro((dt, t) => {
      tFase += dt;
      const passo = 0.12;
      if (faseAtual === "escolher") {
        kids.forEach((k) => { k.g.position.copy(k.de); k.g.position.y += Math.abs(Math.sin(t * 2 + k.ordem)) * 0.05; k.g.scale.setScalar(1); k.g.visible = true; });
        vansObj.forEach((v) => v.g.position.copy(v.pos));
        contagem.length = 0;
      } else {
        const dentro = vansObj.map(() => 0);
        kids.forEach((k) => {
          if (k.van < 0) { k.g.position.copy(k.de); if (faseAtual === "partiu") k.g.position.y += Math.abs(Math.sin(t * 7 + k.ordem)) * 0.35; return; }
          const u = faseAtual === "partiu" ? 1 : Math.max(0, Math.min(1, (tFase - k.ordem * passo) / 0.5));
          const alvo = vansObj[k.van].pos.clone().add(new THREE.Vector3(-0.2, 0.15, -0.75));
          k.g.position.lerpVectors(k.de, alvo, u); k.g.position.y += Math.sin(u * Math.PI) * 0.8;
          k.g.visible = u < 1;
          if (u >= 1) dentro[k.van]++;
        });
        dentro.forEach((d, j) => { if (contagem[j] !== d) { contagem[j] = d; etiquetar(j, d); } });
        if (faseAtual === "partiu") vansObj.forEach((v, j) => { const tt = Math.max(0, tFase - j * 0.08); v.g.position.set(v.pos.x + tt * tt * 6, 0, v.pos.z); });
        else vansObj.forEach((v) => v.g.position.copy(v.pos));
      }
      void total;
    });
    return () => { p.destruir(); palco.current = null; cenaDin.current = null; };
  }, []);

  useEffect(() => { cenaDin.current?.montar(N, C, vans); }, [N, C, vans]);
  useEffect(() => { cenaDin.current?.fase(fase); }, [fase]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`Rua da escola em 3D: ${N} crianças e vans de ${C} lugares`} />;
}
