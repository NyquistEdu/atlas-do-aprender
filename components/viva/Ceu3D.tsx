"use client";
/**
 * Cena 3D do céu: Sol, Terra e Lua (fora de escala, para caber na tela).
 * hora: 0 a 24, gira a Terra (a casinha amarela fica de frente para o Sol ao meio-dia).
 * fase: 0 a 1 do ciclo da Lua (0 = nova, entre a Terra e o Sol; 0,5 = cheia, do outro lado).
 * auto: anima sozinho (capa). Gira arrastando com o dedo ou o mouse.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { hora: number; fase: number; auto?: boolean; altura?: number; onTempo?: (hora: number, fase: number) => void };

function texturaTerra() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#2f6fbf"); gr.addColorStop(0.5, "#3b86d6"); gr.addColorStop(1, "#2f6fbf");
  g.fillStyle = gr; g.fillRect(0, 0, 512, 256);
  let s = 7; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cores = ["#4fa35f", "#5cb36a", "#8fb85a", "#c9b06a"];
  for (let i = 0; i < 26; i++) {
    const x = r() * 512, y = 40 + r() * 176, rr = 14 + r() * 34;
    g.fillStyle = cores[Math.floor(r() * cores.length)];
    g.beginPath();
    for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2, d = rr * (0.6 + r() * 0.6); g.lineTo(x + Math.cos(a) * d * 1.4, y + Math.sin(a) * d); }
    g.closePath(); g.fill();
  }
  g.fillStyle = "#eef4fb"; g.fillRect(0, 0, 512, 16); g.fillRect(0, 240, 512, 16);
  g.globalAlpha = 0.55; g.fillStyle = "#ffffff";
  for (let i = 0; i < 30; i++) { g.beginPath(); g.ellipse(r() * 512, 20 + r() * 216, 10 + r() * 26, 3 + r() * 5, 0, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function texturaLua() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 128;
  const g = c.getContext("2d")!; g.fillStyle = "#cfcfd4"; g.fillRect(0, 0, 256, 128);
  let s = 3; const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 40; i++) { g.fillStyle = r() > 0.5 ? "#b3b3ba" : "#a2a2aa"; g.beginPath(); g.arc(r() * 256, r() * 128, 2 + r() * 10, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function brilho() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d")!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,230,150,1)"); gr.addColorStop(0.35, "rgba(255,190,80,.55)"); gr.addColorStop(1, "rgba(255,160,40,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export const angTerra = (hora: number) => Math.PI + ((hora - 12) * Math.PI * 2) / 24;

export default function Ceu3D({ hora, fase, auto = false, altura = 360, onTempo }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const alvo = useRef({ hora, fase });
  alvo.current = { hora, fase };
  const cb = useRef(onTempo); cb.current = onTempo;

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";
    const cena = new THREE.Scene(); cena.background = new THREE.Color(0x111729);
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
    cena.add(new THREE.AmbientLight(0x8090c0, 0.18));
    const luz = new THREE.PointLight(0xffffff, 260, 0, 1.6); luz.position.set(-10, 0, 0); cena.add(luz);

    // estrelas
    const pg = new THREE.BufferGeometry(); const pos: number[] = [];
    for (let i = 0; i < 700; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(60 + Math.random() * 30); pos.push(v.x, v.y, v.z); }
    pg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    cena.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 0.18 })));

    // Sol
    const sol = new THREE.Mesh(new THREE.SphereGeometry(2, 40, 30), new THREE.MeshBasicMaterial({ color: 0xffc94a }));
    sol.position.set(-10, 0, 0); cena.add(sol);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: brilho(), transparent: true, depthWrite: false }));
    halo.scale.set(9, 9, 1); halo.position.copy(sol.position); cena.add(halo);
    // raios de luz até a Terra
    const raios = new THREE.Group();
    for (let i = -2; i <= 2; i++) {
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-7.6, i * 0.45, 0), new THREE.Vector3(-1.8, i * 0.45, 0)]);
      raios.add(new THREE.Line(g, new THREE.LineDashedMaterial({ color: 0xffd36b, dashSize: 0.3, gapSize: 0.25, transparent: true, opacity: 0.5 })));
    }
    raios.children.forEach((l) => (l as THREE.Line).computeLineDistances()); cena.add(raios);

    // Terra (com a casinha)
    const terra = new THREE.Group(); cena.add(terra);
    const globo = new THREE.Mesh(new THREE.SphereGeometry(1.4, 48, 32), new THREE.MeshStandardMaterial({ map: texturaTerra(), roughness: 0.9 }));
    terra.add(globo);
    const casa = new THREE.Group();
    const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), new THREE.MeshBasicMaterial({ color: 0xffe08a }));
    haste.rotation.z = -Math.PI / 2; haste.position.x = 1.6; casa.add(haste);
    const bola = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd23f }));
    bola.position.x = 1.9; casa.add(bola);
    globo.add(casa);
    // terminador (linha dia/noite) para ajudar a leitura
    const anelDN = new THREE.Mesh(new THREE.TorusGeometry(1.43, 0.015, 6, 80), new THREE.MeshBasicMaterial({ color: 0x9fb3e8, transparent: true, opacity: 0.6 }));
    anelDN.rotation.y = Math.PI / 2; terra.add(anelDN);

    // Lua
    const orbita = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.012, 4, 120), new THREE.MeshBasicMaterial({ color: 0x55638f }));
    orbita.rotation.x = Math.PI / 2; cena.add(orbita);
    const lua = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), new THREE.MeshStandardMaterial({ map: texturaLua(), roughness: 1 }));
    cena.add(lua);

    let az = 0.35, el2 = 0.55, arr = false, ux = 0, uy = 0, ocioso = 9;
    const centro = new THREE.Vector3(-3.2, 0, 0);
    const down = (e: PointerEvent) => { arr = true; ux = e.clientX; uy = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!arr) return; az -= (e.clientX - ux) * 0.008; el2 = Math.max(0.08, Math.min(1.25, el2 + (e.clientY - uy) * 0.005)); ux = e.clientX; uy = e.clientY; ocioso = 0; };
    const up = () => { arr = false; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);

    let dist = 15;
    const ajustar = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      cam.aspect = w / h; dist = w / h < 1 ? 23 : 15.5; cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(ajustar); ro.observe(el); ajustar();

    let hAtual = alvo.current.hora, fAtual = alvo.current.fase, raf = 0, ult = performance.now(), tAuto = 0;
    const loop = (agora: number) => {
      const dt = Math.min(0.05, (agora - ult) / 1000); ult = agora;
      if (auto) {
        tAuto += dt;
        hAtual = (hAtual + dt * 2.2) % 24;
        fAtual = (fAtual + dt * 0.022) % 1;
        if (Math.floor(tAuto * 4) !== Math.floor((tAuto - dt) * 4)) cb.current?.(hAtual, fAtual);
      } else {
        // anda pelo caminho mais curto até o alvo
        let dh = alvo.current.hora - hAtual; if (dh > 12) dh -= 24; if (dh < -12) dh += 24;
        hAtual = (hAtual + dh * Math.min(1, dt * 6) + 24) % 24;
        let df = alvo.current.fase - fAtual; if (df > 0.5) df -= 1; if (df < -0.5) df += 1;
        fAtual = (fAtual + df * Math.min(1, dt * 6) + 1) % 1;
      }
      globo.rotation.y = angTerra(hAtual);
      const a = fAtual * Math.PI * 2;
      lua.position.set(-Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6);
      lua.rotation.y = -a + Math.PI;
      if (!arr) { ocioso += dt; if (ocioso > 3 && auto) az += dt * 0.08; }
      cam.position.set(centro.x + Math.sin(az) * dist * Math.cos(el2), dist * Math.sin(el2), Math.cos(az) * dist * Math.cos(el2));
      cam.lookAt(centro);
      renderer.render(cena, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); };
  }, [auto]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} role="img" aria-label="Sol, Terra e Lua em 3D: arraste para girar" />;
}
