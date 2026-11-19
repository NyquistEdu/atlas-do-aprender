/** Base das cenas 3D das Fases Vivas: renderizador, câmera em órbita (arrastar gira), ajuste de tamanho e laço de animação. */
import * as THREE from "three";

export type Palco = {
  renderer: THREE.WebGLRenderer; cena: THREE.Scene; cam: THREE.PerspectiveCamera;
  orbita: { az: number; el: number; dist: number; alvo: THREE.Vector3; auto: number };
  aoQuadro: (f: (dt: number, t: number) => void) => void;
  aoToque: (f: (ndc: THREE.Vector2) => void) => void;
  destruir: () => void;
};

export function criarPalco(el: HTMLElement, op: { fundo?: number; az?: number; el?: number; dist?: number; distRetrato?: number; alvo?: [number, number, number]; fov?: number; auto?: number; elMin?: number; elMax?: number; sombras?: boolean; dentro?: boolean }): Palco {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  if (op.sombras) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  el.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = "pan-y";
  const cena = new THREE.Scene();
  cena.background = new THREE.Color(op.fundo ?? 0x1d2433);
  const cam = new THREE.PerspectiveCamera(op.fov ?? 38, 1, 0.1, 400);
  const orbita = { az: op.az ?? 0, el: op.el ?? 0.4, dist: op.dist ?? 12, alvo: new THREE.Vector3(...(op.alvo ?? [0, 0, 0])), auto: op.auto ?? 0 };
  const elMin = op.elMin ?? 0.05, elMax = op.elMax ?? 1.25;
  let distBase = orbita.dist;

  let arr = false, mexeu = 0, ux = 0, uy = 0, ocioso = 0;
  const toques: ((n: THREE.Vector2) => void)[] = [];
  const down = (e: PointerEvent) => { arr = true; mexeu = 0; ux = e.clientX; uy = e.clientY; renderer.domElement.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => {
    if (!arr) return;
    const dx = e.clientX - ux, dy = e.clientY - uy; mexeu += Math.abs(dx) + Math.abs(dy);
    const s = op.dentro ? -0.005 : 0.008;
    orbita.az -= dx * s; orbita.el = Math.max(elMin, Math.min(elMax, orbita.el + dy * (op.dentro ? -0.004 : 0.004)));
    ux = e.clientX; uy = e.clientY; ocioso = 0;
  };
  const up = (e: PointerEvent) => {
    if (arr && mexeu < 8) {
      const r = renderer.domElement.getBoundingClientRect();
      const n = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      toques.forEach((f) => f(n));
    }
    arr = false;
  };
  renderer.domElement.addEventListener("pointerdown", down);
  renderer.domElement.addEventListener("pointermove", move);
  renderer.domElement.addEventListener("pointerup", up);
  renderer.domElement.addEventListener("pointercancel", () => { arr = false; });

  const ajustar = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
    cam.aspect = w / h; distBase = w / h < 1 ? (op.distRetrato ?? orbita.dist * 1.4) : (op.dist ?? 12); cam.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(ajustar); ro.observe(el); ajustar();

  const quadros: ((dt: number, t: number) => void)[] = [];
  let raf = 0, ult = performance.now();
  const t0 = performance.now();
  const loop = (agora: number) => {
    const dt = Math.min(0.05, (agora - ult) / 1000); ult = agora;
    if (!arr) { ocioso += dt; if (ocioso > 3 && orbita.auto) orbita.az += dt * orbita.auto; }
    quadros.forEach((f) => f(dt, (agora - t0) / 1000));
    if (op.dentro) {
      cam.position.copy(orbita.alvo);
      cam.lookAt(orbita.alvo.x + Math.sin(orbita.az) * Math.cos(orbita.el), orbita.alvo.y + Math.sin(orbita.el), orbita.alvo.z - Math.cos(orbita.az) * Math.cos(orbita.el));
    } else {
      const d = distBase;
      cam.position.set(orbita.alvo.x + Math.sin(orbita.az) * d * Math.cos(orbita.el), orbita.alvo.y + d * Math.sin(orbita.el), orbita.alvo.z + Math.cos(orbita.az) * d * Math.cos(orbita.el));
      cam.lookAt(orbita.alvo);
    }
    renderer.render(cena, cam);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return {
    renderer, cena, cam, orbita,
    aoQuadro: (f) => quadros.push(f),
    aoToque: (f) => toques.push(f),
    destruir: () => {
      cancelAnimationFrame(raf); ro.disconnect();
      cena.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mat = m.material as THREE.Material | THREE.Material[] | undefined; (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose()); });
      renderer.dispose(); renderer.domElement.remove();
    },
  };
}

/** Plaquinha de texto que sempre olha para a câmera. */
export function plaquinha(txt: string, op: { cor?: string; fundo?: string; largura?: number; escala?: number } = {}) {
  const c = document.createElement("canvas");
  const larg = op.largura ?? 320; c.width = larg; c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = op.fundo ?? "#ffffff"; g.beginPath(); g.roundRect(4, 4, larg - 8, 88, 24); g.fill();
  g.lineWidth = 6; g.strokeStyle = op.cor ?? "#1d2433"; g.stroke();
  g.fillStyle = op.cor ?? "#1d2433"; g.font = "800 46px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, larg / 2, 52);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  const e = op.escala ?? 1; sp.scale.set((larg / 96) * 0.56 * e, 0.56 * e, 1); sp.renderOrder = 10;
  return sp;
}
