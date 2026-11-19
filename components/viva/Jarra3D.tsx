"use client";
/** Jarra de vidro de 1 litro em 3D: o líquido sobe a cada copo; passou de 1 L, derrama na mesa. Gira arrastando. */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

const ALT = 3.2, RAIO = 1.15;

export default function Jarra3D({ ml, max = 1000, cor = 0xf6f3ea, altura = 360 }: { ml: number; max?: number; cor?: number; altura?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef({ ml, cor });
  st.current = { ml, cor };

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0x1d2433, az: 0.5, el: 0.35, dist: 9.5, distRetrato: 12.5, alvo: [0, 1.5, 0], elMax: 1.1, auto: 0.12 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xfff6e6, 0x2b3756, 1.1));
    const luz = new THREE.DirectionalLight(0xffffff, 1.4); luz.position.set(4, 8, 6); cena.add(luz);
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 0.25, 64), new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.8 }));
    mesa.position.y = -0.13; cena.add(mesa);
    // vidro
    const vidro = new THREE.MeshStandardMaterial({ color: 0xdff1ff, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
    const copo = new THREE.Mesh(new THREE.CylinderGeometry(RAIO, RAIO * 0.92, ALT, 48, 1, true), vidro); copo.position.y = ALT / 2 + 0.05; copo.renderOrder = 2; cena.add(copo);
    const fundo = new THREE.Mesh(new THREE.CylinderGeometry(RAIO * 0.92, RAIO * 0.92, 0.1, 48), vidro); fundo.position.y = 0.05; cena.add(fundo);
    const borda = new THREE.Mesh(new THREE.TorusGeometry(RAIO, 0.04, 8, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    borda.rotation.x = Math.PI / 2; borda.position.y = ALT + 0.05; cena.add(borda);
    const alca = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.1, 10, 32, Math.PI), new THREE.MeshStandardMaterial({ color: 0xdff1ff, transparent: true, opacity: 0.5 }));
    alca.rotation.z = -Math.PI / 2; alca.position.set(RAIO + 0.05, ALT * 0.55, 0); cena.add(alca);
    const bico = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 3, 1, true), vidro); bico.rotation.z = Math.PI / 2; bico.position.set(-RAIO - 0.1, ALT - 0.1, 0); cena.add(bico);
    // marcas
    [250, 500, 750, 1000].filter((m) => m <= max).forEach((m) => {
      const y = 0.1 + (m / max) * (ALT - 0.25);
      const anel = new THREE.Mesh(new THREE.TorusGeometry(RAIO + 0.005, 0.018, 4, 64, Math.PI * 0.55), new THREE.MeshBasicMaterial({ color: 0x1d2433 }));
      anel.rotation.x = Math.PI / 2; anel.rotation.z = Math.PI * 0.2; anel.position.y = y; cena.add(anel);
      const pl = plaquinha(m === 1000 ? "1 L" : `${m} mL`, { largura: 230, escala: 0.75, fundo: "#fff6d6" });
      pl.position.set(0, y, RAIO + 0.55); cena.add(pl);
    });
    // líquido
    const liqMat = new THREE.MeshStandardMaterial({ color: st.current.cor, roughness: 0.25, transparent: true, opacity: 0.92 });
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(RAIO * 0.95, RAIO * 0.88, 1, 48), liqMat); cena.add(liq);
    const sup = new THREE.Mesh(new THREE.CircleGeometry(RAIO * 0.95, 48), new THREE.MeshStandardMaterial({ color: st.current.cor, roughness: 0.1 }));
    sup.rotation.x = -Math.PI / 2; cena.add(sup);
    const poca = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshStandardMaterial({ color: st.current.cor, roughness: 0.1, transparent: true, opacity: 0.85 }));
    poca.rotation.x = -Math.PI / 2; poca.position.set(-RAIO - 1.2, 0.01, 0.4); cena.add(poca);
    const fio = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, ALT, 10), new THREE.MeshStandardMaterial({ color: st.current.cor, transparent: true, opacity: 0.85 }));
    fio.position.set(-RAIO - 0.35, ALT / 2, 0); cena.add(fio);

    let nivel = 0;
    p.aoQuadro((dt, t) => {
      const alvo = Math.min(st.current.ml, max) / max;
      nivel += (alvo - nivel) * Math.min(1, dt * 4);
      const h = Math.max(0.001, nivel * (ALT - 0.25));
      liq.scale.y = h; liq.position.y = 0.1 + h / 2; liq.visible = nivel > 0.002;
      sup.position.y = 0.1 + h + 0.002; sup.visible = liq.visible;
      sup.position.x = Math.sin(t * 3) * 0.01;
      [liqMat, sup.material, poca.material, fio.material].forEach((m) => (m as THREE.MeshStandardMaterial).color.setHex(st.current.cor));
      const passou = st.current.ml - max;
      fio.visible = passou > 0; poca.visible = passou > 0;
      if (passou > 0) poca.scale.setScalar(0.5 + Math.min(2.2, passou / 300));
    });
    return () => p.destruir();
  }, [max]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label={`Jarra de 1 litro em 3D com ${ml} mL: arraste para girar`} />;
}
