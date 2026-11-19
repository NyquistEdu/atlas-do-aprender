"use client";
/**
 * Balança de pratos em 3D. No prato da esquerda vai o objeto; no da direita, os pesos (1 kg, 500 g e 100 g).
 * O braço inclina para o lado mais pesado e fica reto quando as massas são iguais. Gira arrastando.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type Objeto = "melancia" | "abacaxi" | "arroz" | "livro" | "abobora" | "pacote";
export type Pesos = { kg1: number; g500: number; g100: number };
export type CasoBalanca = { objeto: Objeto; gramas: number; pesos: Pesos; legenda?: string };

export const massaPesos = (p: Pesos) => p.kg1 * 1000 + p.g500 * 500 + p.g100 * 100;

function etiqueta(txt: string, cor = "#1d2433", fundo = "#fff6d6") {
  const c = document.createElement("canvas"); c.width = 256; c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = fundo; g.beginPath(); g.roundRect(4, 4, 248, 88, 22); g.fill();
  g.lineWidth = 6; g.strokeStyle = cor; g.stroke();
  g.fillStyle = cor; g.font = "800 52px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 52);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
  sp.scale.set(1.5, 0.56, 1); sp.renderOrder = 5;
  return sp;
}

function fazerObjeto(o: Objeto): THREE.Object3D {
  const g = new THREE.Group();
  const mat = (c: number, r = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
  if (o === "melancia") {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 24), mat(0x2f8f46, 0.45)); m.scale.set(1.25, 0.9, 0.95); m.position.y = 0.62; g.add(m);
    for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.03, 6, 40, Math.PI), mat(0x1d5f2e)); f.rotation.set(0, (i / 6) * Math.PI, Math.PI / 2); f.scale.set(1, 1.25, 0.95); f.position.y = 0.62; g.add(f); }
  } else if (o === "abobora") {
    for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), mat(0xe8862c)); const a = (i / 7) * Math.PI * 2; m.position.set(Math.cos(a) * 0.22, 0.45, Math.sin(a) * 0.22); m.scale.set(0.8, 0.95, 0.8); g.add(m); }
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.25, 8), mat(0x5a7a2c)); t.position.y = 0.92; g.add(t);
  } else if (o === "abacaxi") {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.4, 20, 16), mat(0xd9a23b, 0.8)); m.scale.set(1, 1.45, 1); m.position.y = 0.6; g.add(m);
    for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.6, 6), mat(0x3f8f3f)); const a = (i / 7) * Math.PI * 2; f.position.set(Math.cos(a) * 0.08, 1.38, Math.sin(a) * 0.08); f.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); g.add(f); }
  } else if (o === "arroz") {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 0.45), mat(0xf4f1e8, 0.9)); m.position.y = 0.6; g.add(m);
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.32, 0.47), mat(0xc4483b)); faixa.position.y = 0.6; g.add(faixa);
  } else if (o === "livro") {
    [0x2a5db0, 0xc4483b, 0x2f7d4f].forEach((c, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.18, 0.72), mat(c, 0.7)); m.position.set(i * 0.04, 0.12 + i * 0.19, 0); m.rotation.y = (i - 1) * 0.12; g.add(m); });
  } else {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.6), mat(0xc9a06a, 0.9)); m.position.y = 0.3; g.add(m);
    const fita = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.57, 0.12), mat(0x8a5a3b)); fita.position.y = 0.3; g.add(fita);
  }
  g.traverse((x) => { (x as THREE.Mesh).castShadow = true; });
  return g;
}

function fazerPesos(p: Pesos): THREE.Object3D {
  const g = new THREE.Group();
  const ouro = new THREE.MeshStandardMaterial({ color: 0xc9a23a, roughness: 0.35, metalness: 0.5 });
  const prata = new THREE.MeshStandardMaterial({ color: 0xaab2c0, roughness: 0.35, metalness: 0.5 });
  const cobre = new THREE.MeshStandardMaterial({ color: 0xc27a4a, roughness: 0.4, metalness: 0.4 });
  let y = 0;
  const pilha = (n: number, r: number, h: number, m: THREE.Material, x: number) => {
    let yy = 0;
    for (let i = 0; i < n; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), m); c.position.set(x, yy + h / 2, 0); c.castShadow = true; g.add(c);
      const b = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.35, h * 0.5, 16), m); b.position.set(x, yy + h + h * 0.2, 0); g.add(b);
      yy += h * 1.35;
    }
    y = Math.max(y, yy);
  };
  pilha(Math.min(p.kg1, 6), 0.34, 0.26, ouro, p.g500 || p.g100 ? -0.45 : 0);
  pilha(Math.min(p.g500, 6), 0.25, 0.2, prata, p.kg1 ? (p.g100 ? 0.15 : 0.35) : (p.g100 ? -0.25 : 0));
  pilha(Math.min(p.g100, 9), 0.15, 0.13, cobre, p.kg1 || p.g500 ? 0.6 : 0);
  return g;
}

export default function Balanca3D({ objeto, gramas, pesos, casos, onCaso, altura = 360, oculto = false }: {
  objeto: Objeto; gramas: number; pesos: Pesos; casos?: CasoBalanca[]; onCaso?: (c: CasoBalanca) => void; altura?: number; oculto?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (c: CasoBalanca, oculto: boolean) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement); renderer.domElement.style.touchAction = "pan-y";
    const cena = new THREE.Scene(); cena.background = new THREE.Color(0x1d2433);
    const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    cena.add(new THREE.HemisphereLight(0xfff6e6, 0x2b3756, 1.1));
    const sol = new THREE.DirectionalLight(0xffffff, 1.5); sol.position.set(3, 8, 6); sol.castShadow = true; cena.add(sol);
    const mundo = new THREE.Group(); cena.add(mundo);
    const mesa = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.3, 64), new THREE.MeshStandardMaterial({ color: 0x2b3756, roughness: 1 }));
    mesa.position.y = -0.15; mesa.receiveShadow = true; mundo.add(mesa);

    const madeira = new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.6 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xd9d4c7, roughness: 0.3, metalness: 0.6 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1.2), madeira); base.position.y = 0.12; base.castShadow = true; mundo.add(base);
    const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 2.6, 16), madeira); coluna.position.y = 1.5; mundo.add(coluna);
    const braco = new THREE.Group(); braco.position.y = 2.8; mundo.add(braco);
    const barra = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.14, 0.18), metal); braco.add(barra);
    const pino = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), madeira); braco.add(pino);
    const ponteiro = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 10), new THREE.MeshBasicMaterial({ color: 0xe2574c })); ponteiro.position.y = 0.45; braco.add(ponteiro);
    const pratos: THREE.Group[] = [];
    [-2.6, 2.6].forEach((x) => {
      const ponta = new THREE.Object3D(); ponta.position.x = x; braco.add(ponta);
      const prato = new THREE.Group(); mundo.add(prato);
      const disco = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.95, 0.1, 40), metal); disco.receiveShadow = true; prato.add(disco);
      [0, 2.1, 4.2].forEach((a) => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(Math.cos(a) * 0.95, 0.05, Math.sin(a) * 0.95), new THREE.Vector3(0, 1.5, 0)]); prato.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xc9c2b0 }))); });
      prato.userData.ponta = ponta;
      pratos.push(prato);
    });
    let conteudoE = new THREE.Group(), conteudoD = new THREE.Group();
    pratos[0].add(conteudoE); pratos[1].add(conteudoD);
    let etqE: THREE.Sprite | null = null, etqD: THREE.Sprite | null = null;
    let alvoAng = 0, ang = 0;

    const montar = (c: CasoBalanca, esconder: boolean) => {
      pratos[0].remove(conteudoE); pratos[1].remove(conteudoD);
      if (etqE) pratos[0].remove(etqE); if (etqD) pratos[1].remove(etqD);
      conteudoE = new THREE.Group(); conteudoE.add(fazerObjeto(c.objeto)); conteudoE.position.y = 0.05; pratos[0].add(conteudoE);
      conteudoD = new THREE.Group(); conteudoD.add(fazerPesos(c.pesos)); conteudoD.position.y = 0.05; pratos[1].add(conteudoD);
      const fmt = (g: number) => (g >= 1000 && g % 1000 === 0 ? `${g / 1000} kg` : g > 1000 ? `${Math.floor(g / 1000)} kg ${g % 1000} g` : `${g} g`);
      etqE = etiqueta(esconder ? "? kg" : fmt(c.gramas)); etqE.position.y = 2.15; pratos[0].add(etqE);
      etqD = etiqueta(fmt(massaPesos(c.pesos)), "#1d2433", "#e9f0fb"); etqD.position.y = 2.15; pratos[1].add(etqD);
      const dif = massaPesos(c.pesos) - c.gramas;
      alvoAng = dif === 0 ? 0 : Math.sign(dif) * Math.min(0.32, 0.08 + Math.abs(dif) / 4000);
    };
    api.current = { montar };

    let az = 0, el2 = 0.32, arr = false, ux = 0, uy = 0, ocioso = 0;
    const down = (e: PointerEvent) => { arr = true; ux = e.clientX; uy = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!arr) return; az -= (e.clientX - ux) * 0.008; el2 = Math.max(0.05, Math.min(1.1, el2 + (e.clientY - uy) * 0.004)); ux = e.clientX; uy = e.clientY; ocioso = 0; };
    const up = () => { arr = false; };
    renderer.domElement.addEventListener("pointerdown", down); renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up); renderer.domElement.addEventListener("pointercancel", up);
    let dist = 11;
    const ajustar = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%"; cam.aspect = w / h; dist = w / h < 1 ? 15 : 10.5; cam.updateProjectionMatrix(); };
    const ro = new ResizeObserver(ajustar); ro.observe(el); ajustar();

    let raf = 0, ult = performance.now();
    const loop = (agora: number) => {
      const dt = Math.min(0.05, (agora - ult) / 1000); ult = agora;
      // balança com um leve vaivém antes de parar
      ang += (alvoAng - ang) * Math.min(1, dt * 3.2);
      braco.rotation.z = -ang + Math.sin(agora / 260) * 0.012 * Math.min(1, Math.abs(alvoAng - ang) * 20);
      braco.updateMatrixWorld();
      pratos.forEach((p) => { const v = new THREE.Vector3(); (p.userData.ponta as THREE.Object3D).getWorldPosition(v); mundo.worldToLocal(v); p.position.set(v.x, v.y - 1.5, v.z); });
      if (!arr) { ocioso += dt; if (ocioso > 3) az += dt * 0.1; }
      cam.position.set(Math.sin(az) * dist * Math.cos(el2), 1.6 + dist * Math.sin(el2), Math.cos(az) * dist * Math.cos(el2));
      cam.lookAt(0, 1.5, 0);
      renderer.render(cena, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);

  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { api.current?.montar(casos[i], false); cb.current?.(casos[i]); i = (i + 1) % casos.length; };
      mostrar(); const id = setInterval(mostrar, 4200); return () => clearInterval(id);
    }
    api.current?.montar({ objeto, gramas, pesos }, oculto);
  }, [casos, objeto, gramas, pesos, oculto]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label="Balança de pratos em 3D: arraste para girar" />;
}
