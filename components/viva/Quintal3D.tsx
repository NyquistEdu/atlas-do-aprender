"use client";
/**
 * Quintal em 3D com um cabo de vassoura: o Sol anda do leste (direita) para o oeste e a sombra
 * é desenhada pela própria luz. A pedrinha marca onde estava a ponta da sombra na hora secreta.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

const H = 2.2; // altura do cabo de vassoura
/** Direção do Sol às h horas (leste = +x), um pouco ao norte (−z), como em Sergipe. */
export function dirSol(h: number) {
  const th = (Math.PI * (h - 6)) / 12;
  return new THREE.Vector3(Math.cos(th), Math.sin(th), -0.28).normalize();
}
/** Ponta da sombra do cabo às h horas. */
export function pontaSombra(h: number) {
  const d = dirSol(h);
  return new THREE.Vector3((-H * d.x) / d.y, 0, (-H * d.z) / d.y);
}

export default function Quintal3D({ hora, alvo, altura = 380 }: { hora: number; alvo: number; altura?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef({ hora, alvo });
  st.current = { hora, alvo };

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0xbfe0ff, az: 0.2, el: 0.5, dist: 19, distRetrato: 27, alvo: [0, 0.8, 0], sombras: true, elMax: 1.2 });
    const { cena } = p;
    cena.fog = new THREE.Fog(0xbfe0ff, 30, 70);
    const hemi = new THREE.HemisphereLight(0xffffff, 0x6f9a4f, 0.75); cena.add(hemi);
    const sol = new THREE.DirectionalLight(0xfff2d6, 2.4);
    sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048);
    Object.assign(sol.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
    sol.shadow.bias = -0.0005;
    cena.add(sol); cena.add(sol.target);

    // chão
    const grama = new THREE.Mesh(new THREE.CircleGeometry(30, 64), new THREE.MeshStandardMaterial({ color: 0x8cc56b, roughness: 1 }));
    grama.rotation.x = -Math.PI / 2; grama.receiveShadow = true; cena.add(grama);
    const terra = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshStandardMaterial({ color: 0xa8d07f, roughness: 1 }));
    terra.rotation.x = -Math.PI / 2; terra.position.y = 0.01; terra.receiveShadow = true; cena.add(terra);
    // marcas das horas no chão (como um relógio de sol)
    for (let h = 7; h <= 17; h++) {
      const t = pontaSombra(h); const l = Math.min(8.5, t.length()); const d = t.clone().normalize().multiplyScalar(l);
      const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 10), new THREE.MeshBasicMaterial({ color: 0x6b8f4a }));
      pt.position.set(d.x, 0.02, d.z); cena.add(pt);
    }
    // cabo de vassoura
    const cabo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, H, 16), new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.7 }));
    cabo.position.y = H / 2; cabo.castShadow = true; cena.add(cabo);
    // casa
    const casa = new THREE.Group();
    const paredes = new THREE.Mesh(new THREE.BoxGeometry(4, 2.6, 3), new THREE.MeshStandardMaterial({ color: 0xf6d9b4, roughness: 0.9 }));
    paredes.position.y = 1.3; paredes.castShadow = true; paredes.receiveShadow = true; casa.add(paredes);
    const telhado = new THREE.Mesh(new THREE.ConeGeometry(3.3, 1.6, 4), new THREE.MeshStandardMaterial({ color: 0xc4483b, roughness: 0.8 }));
    telhado.position.y = 3.4; telhado.rotation.y = Math.PI / 4; telhado.scale.set(1.25, 1, 0.95); telhado.castShadow = true; casa.add(telhado);
    const porta = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x8a5a3b })); porta.position.set(0, 0.8, 1.52); casa.add(porta);
    [-1.3, 1.3].forEach((x) => { const j = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x9fd0f0 })); j.position.set(x, 1.6, 1.52); casa.add(j); });
    casa.position.set(-3, 0, -8); cena.add(casa);
    // cerca
    for (let i = 0; i < 14; i++) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      t.position.set(3 + i * 0.45, 0.55, -8.5); t.castShadow = true; cena.add(t);
    }
    // árvore
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.32, 2.4, 10), new THREE.MeshStandardMaterial({ color: 0x7a4e32 }));
    tronco.position.set(-9, 1.2, 2); tronco.castShadow = true; cena.add(tronco);
    const copa = new THREE.Mesh(new THREE.SphereGeometry(1.6, 18, 14), new THREE.MeshStandardMaterial({ color: 0x4f9a52, roughness: 0.9 }));
    copa.position.set(-9, 3.4, 2); copa.castShadow = true; cena.add(copa);
    // pedrinha
    const pedra = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), new THREE.MeshStandardMaterial({ color: 0x7d828c, roughness: 0.8 }));
    pedra.scale.set(1.3, 0.55, 1); pedra.castShadow = true; cena.add(pedra);
    const etqPedra = plaquinha("pedrinha", { escala: 0.8 }); cena.add(etqPedra);
    // pontos cardeais
    const leste = plaquinha("LESTE · nascente", { largura: 520, fundo: "#fff6d6", escala: 0.9 }); leste.position.set(10.5, 0.6, 0); cena.add(leste);
    const oeste = plaquinha("OESTE · poente", { largura: 480, fundo: "#fff6d6", escala: 0.9 }); oeste.position.set(-10.5, 0.6, 0); cena.add(oeste);
    // Sol
    const bola = new THREE.Mesh(new THREE.SphereGeometry(1.4, 28, 20), new THREE.MeshBasicMaterial({ color: 0xffc94a }));
    cena.add(bola);
    const caminho = new THREE.Mesh(new THREE.TorusGeometry(24, 0.05, 6, 120, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    caminho.rotation.x = Math.atan2(0.28, 1) * 0; caminho.lookAt(new THREE.Vector3(0, 0.28, 1)); cena.add(caminho);

    const ceuDia = new THREE.Color(0xbfe0ff), ceuTarde = new THREE.Color(0xffc99a);
    let hAtual = st.current.hora;
    p.aoQuadro((dt) => {
      hAtual += (st.current.hora - hAtual) * Math.min(1, dt * 5);
      const d = dirSol(hAtual);
      sol.position.copy(d.clone().multiplyScalar(30)); sol.target.position.set(0, 0, 0);
      bola.position.copy(d.clone().multiplyScalar(24));
      const baixo = 1 - Math.min(1, d.y / 0.5);
      (cena.background as THREE.Color).copy(ceuDia).lerp(ceuTarde, baixo * 0.7);
      cena.fog!.color.copy(cena.background as THREE.Color);
      const a = pontaSombra(st.current.alvo);
      pedra.position.set(a.x, 0.1, a.z);
      etqPedra.position.set(a.x, 0.95, a.z);
    });
    return () => p.destruir();
  }, []);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label="Quintal em 3D com o cabo de vassoura e a sombra: arraste para girar" />;
}
