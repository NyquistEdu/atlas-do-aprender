"use client";
/**
 * Correio da escola em 3D: uma folha dobrada chega e a criança decide para onde vai:
 * banca do jornal (notícia), caixa de cartas (carta) ou caixa de receitas (receita).
 * Certo: a folha voa e entra. Errado: bate na borda e volta tremendo.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { criarPalco, plaquinha } from "./palco3d";

export type Envio = { dest: 0 | 1 | 2; ok: boolean; n: number } | null;

export default function Correio3D({ rodada, envio, altura = 380 }: { rodada: number; envio: Envio; altura?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ nova: () => void; enviar: (e: NonNullable<Envio>) => void } | null>(null);

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0xdff0ea, az: 0, el: 0.32, dist: 11, distRetrato: 18, alvo: [0, 1.4, 0.6], sombras: true, elMin: 0.1, elMax: 1.1 });
    const { cena } = p;
    cena.add(new THREE.HemisphereLight(0xffffff, 0x8aa38f, 1.1));
    const sol = new THREE.DirectionalLight(0xfff3e0, 1.6); sol.position.set(3, 10, 8); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 7, bottom: -4 }); cena.add(sol);
    const mat = (c: number, r = 0.55) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
    const em = (m: THREE.Mesh, x: number, y: number, z: number) => { m.position.set(x, y, z); m.castShadow = true; return m; };
    const chao = new THREE.Mesh(new THREE.CircleGeometry(20, 48), mat(0xcfe3d8, 0.95)); chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao);
    const parede = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), mat(0xf6ead2, 0.95)); parede.position.set(0, 6, -2.4); cena.add(parede);
    const placa = plaquinha("CORREIO DA ESCOLA", { largura: 620, escala: 1.3, fundo: "#ffffff" }); placa.position.set(0, 4.1, -2.2); cena.add(placa);

    // 0: banca do jornal
    const banca = new THREE.Group(); banca.position.set(-3.3, 0, 0); cena.add(banca);
    banca.add(em(new THREE.Mesh(new RoundedBoxGeometry(2.0, 1.5, 1.4, 3, 0.1), mat(0x5b8def)), 0, 0.75, 0));
    const toldo = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.15, 1.6, 2, 0.06), mat(0xf2c23d)); toldo.position.set(0, 2.4, 0); toldo.castShadow = true; banca.add(toldo);
    [-0.95, 0.95].forEach((x) => { const pa = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), mat(0x3a4256)); pa.position.set(x, 1.95, 0.6); banca.add(pa); });
    for (let i = 0; i < 4; i++) { const j = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.9), mat(0xf3efe4, 0.9)); j.position.set(0, 1.53 + i * 0.07, 0); j.rotation.y = i * 0.1; banca.add(j); }
    const pb = plaquinha("📰 JORNAL", { largura: 330, escala: 0.9, fundo: "#ffffff" }); pb.position.set(0, 2.9, 0.3); banca.add(pb);
    // 1: caixa de cartas vermelha
    const caixa = new THREE.Group(); caixa.position.set(0, 0, 0); cena.add(caixa);
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 12), mat(0x3a4256)); pe.position.y = 0.45; caixa.add(pe);
    const corpo = new THREE.Mesh(new RoundedBoxGeometry(1.4, 1.5, 1.1, 4, 0.2), mat(0xe2574c, 0.45)); corpo.position.y = 1.65; corpo.castShadow = true; caixa.add(corpo);
    const topo = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.4, 24, 1, false, 0, Math.PI), mat(0xe2574c, 0.45)); topo.rotation.z = Math.PI / 2; topo.rotation.y = Math.PI / 2; topo.position.y = 2.38; topo.scale.set(1, 1, 1.0); caixa.add(topo);
    const fenda = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.05), mat(0x1d2433)); fenda.position.set(0, 2.0, 0.56); caixa.add(fenda);
    const pc = plaquinha("✉️ CARTAS", { largura: 330, escala: 0.9, fundo: "#ffffff" }); pc.position.set(0, 3.25, 0.3); caixa.add(pc);
    // 2: caixa de receitas
    const rec = new THREE.Group(); rec.position.set(3.3, 0, 0); cena.add(rec);
    const cx = new THREE.Mesh(new RoundedBoxGeometry(1.9, 1.1, 1.3, 3, 0.08), mat(0xc8935a, 0.7)); cx.position.y = 0.55; cx.castShadow = true; rec.add(cx);
    for (let i = 0; i < 5; i++) { const ficha = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.03), mat(i % 2 ? 0xfffaf0 : 0xdff2e6, 0.9)); ficha.position.set(0, 1.15, -0.4 + i * 0.18); ficha.rotation.x = -0.15; rec.add(ficha); }
    const chapeu = new THREE.Group(); chapeu.position.set(0.55, 1.15, 0.35); rec.add(chapeu);
    chapeu.add(em(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 20), mat(0xffffff, 0.6)), 0, 0.12, 0));
    [[-0.12, 0], [0.12, 0], [0, 0.12], [0, -0.12], [0, 0]].forEach(([x, z]) => chapeu.add(em(new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 10), mat(0xffffff, 0.6)), x, 0.38, z)));
    const prc = plaquinha("🍳 RECEITAS", { largura: 360, escala: 0.9, fundo: "#ffffff" }); prc.position.set(0, 2.4, 0.3); rec.add(prc);
    const destinos = [new THREE.Vector3(-3.3, 1.7, 0), new THREE.Vector3(0, 2.0, 0.6), new THREE.Vector3(3.3, 1.3, 0)];
    const alvos = [banca, caixa, rec];

    // a folha dobrada
    const folha = new THREE.Group(); cena.add(folha);
    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.03, 1.0), mat(0xffffff, 0.8)); f1.position.x = -0.37; f1.rotation.z = 0.15; f1.castShadow = true; folha.add(f1);
    const f2 = f1.clone(); f2.position.x = 0.37; f2.rotation.z = -0.15; folha.add(f2);
    const linhas = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.035, 0.04), mat(0x9aa6c4)); [-0.25, 0, 0.25].forEach((z) => { const l = linhas.clone(); l.position.set(-0.37, 0.04, z); l.rotation.z = 0.15; folha.add(l); });
    const base = new THREE.Vector3(0, 2.1, 2.6);
    let estado: "chega" | "parada" | "vai" | "volta" = "chega", t = 0, t0 = 0, de = new THREE.Vector3(), para = new THREE.Vector3(), dest = 0, festa = -9, tremor = -9;
    const nova = () => { estado = "chega"; t0 = t; folha.visible = true; folha.scale.setScalar(1); };
    const enviar = (e: NonNullable<Envio>) => {
      de = folha.position.clone(); dest = e.dest; t0 = t;
      if (e.ok) { estado = "vai"; para = destinos[e.dest].clone(); }
      else { estado = "volta"; para = destinos[e.dest].clone().add(new THREE.Vector3(0, 0.9, 0.8)); }
    };
    api.current = { nova, enviar };
    nova();
    const ease = (u: number) => 1 - Math.pow(1 - u, 3);
    p.aoQuadro((dt) => {
      t += dt; const u = Math.min(1, (t - t0) / (estado === "chega" ? 0.6 : 0.75));
      if (estado === "chega") { folha.position.set(base.x, base.y + (1 - ease(u)) * 3, base.z); folha.rotation.set(0.5, (1 - u) * 3, 0); if (u >= 1) estado = "parada"; }
      else if (estado === "parada") { folha.position.set(base.x, base.y + Math.sin(t * 2) * 0.08, base.z); folha.rotation.set(0.5, Math.sin(t) * 0.25, 0); }
      else if (estado === "vai") {
        folha.position.lerpVectors(de, para, ease(u)); folha.position.y += Math.sin(Math.PI * u) * 1.6; folha.rotation.y += dt * 8; folha.scale.setScalar(1 - u * 0.75);
        if (u >= 1) { folha.visible = false; festa = t; estado = "parada"; }
      } else if (estado === "volta") {
        const ida = Math.min(1, u * 2), volta = Math.max(0, u * 2 - 1);
        if (u < 0.5) { folha.position.lerpVectors(de, para, ease(ida)); folha.position.y += Math.sin(Math.PI * ida) * 1.2; }
        else { folha.position.lerpVectors(para, base, ease(volta)); }
        if (u >= 1) { estado = "parada"; tremor = t; }
      }
      if (t - tremor < 0.4) folha.position.x = base.x + Math.sin((t - tremor) * 60) * 0.12;
      alvos.forEach((a, i) => { const k = t - festa; a.position.y = i === dest && k < 0.6 ? Math.sin((k / 0.6) * Math.PI) * 0.3 : 0; a.scale.setScalar(i === dest && k < 0.6 ? 1 + Math.sin((k / 0.6) * Math.PI) * 0.06 : 1); });
    });
    return () => { api.current = null; p.destruir(); };
  }, []);

  useEffect(() => { if (rodada > 0) api.current?.nova(); }, [rodada]);
  useEffect(() => { if (envio) api.current?.enviar(envio); }, [envio?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label="Correio da escola em 3D: banca do jornal, caixa de cartas e caixa de receitas" />;
}
