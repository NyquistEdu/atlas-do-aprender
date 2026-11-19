"use client";
/**
 * Céu noturno em 3D, visto de dentro, como num planetário: arraste para olhar em volta e toque nas estrelas.
 * Posições em azimute (0 = norte, 90 = leste, 180 = sul) e altura em graus.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { criarPalco, plaquinha } from "./palco3d";

export type EstrelaCeu = { id: string; az: number; alt: number; mag: number; grupo?: "cruz" | "marias" };

const R = 100;
const vetor = (az: number, alt: number, r = R) => {
  const a = (az * Math.PI) / 180, h = (alt * Math.PI) / 180;
  return new THREE.Vector3(Math.sin(a) * Math.cos(h) * r, Math.sin(h) * r, -Math.cos(a) * Math.cos(h) * r);
};

function texturaBrilho() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d")!; const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function CeuNoite3D({ estrelas, tocadas, erradas, cruzOk, mariasOk, onTocar, altura = 420 }: {
  estrelas: EstrelaCeu[]; tocadas: string[]; erradas: string | null; cruzOk: boolean; mariasOk: boolean; onTocar: (id: string) => void; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef({ tocadas, erradas, cruzOk, mariasOk });
  st.current = { tocadas, erradas, cruzOk, mariasOk };
  const cb = useRef(onTocar); cb.current = onTocar;

  useEffect(() => {
    const p = criarPalco(ref.current!, { fundo: 0x0b1022, dentro: true, fov: 62, az: (145 * Math.PI) / 180, el: 0.7, elMin: 0.05, elMax: 1.45, alvo: [0, 1.6, 0] });
    const { cena, cam } = p;
    // cúpula com degradê
    const cg = document.createElement("canvas"); cg.width = 4; cg.height = 256;
    const gg = cg.getContext("2d")!; const gr = gg.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#05081a"); gr.addColorStop(0.62, "#0f1734"); gr.addColorStop(1, "#2a3a6e");
    gg.fillStyle = gr; gg.fillRect(0, 0, 4, 256);
    const domo = new THREE.Mesh(new THREE.SphereGeometry(R + 20, 48, 32), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cg), side: THREE.BackSide }));
    cena.add(domo);
    // estrelinhas de fundo
    const pos: number[] = [];
    let s = 5; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 1400; i++) { const v = vetor(rnd() * 360, 2 + Math.asin(rnd()) * (180 / Math.PI) * 0.97, R + 5); pos.push(v.x, v.y, v.z); }
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    cena.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.85 })));
    // estrelas tocáveis
    const tex = texturaBrilho();
    const malhas: { e: EstrelaCeu; sp: THREE.Sprite; alvo: THREE.Mesh }[] = [];
    for (const e of estrelas) {
      const v = vetor(e.az, e.alt);
      const tam = 1.2 + (4 - e.mag) * 0.75;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xf4f6ff, transparent: true, depthWrite: false }));
      sp.position.copy(v); sp.scale.setScalar(tam); cena.add(sp);
      const alvo = new THREE.Mesh(new THREE.SphereGeometry(Math.max(2.4, tam * 0.9), 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
      alvo.position.copy(v); alvo.userData.id = e.id; cena.add(alvo);
      malhas.push({ e, sp, alvo });
    }
    const achar = (id: string) => vetor(estrelas.find((x) => x.id === id)!.az, estrelas.find((x) => x.id === id)!.alt, R - 1);
    // linhas da cruz, ponteiro para o sul e das Três Marias
    const linha = (pts: THREE.Vector3[], cor: number, trac = false) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const l = new THREE.Line(g, trac ? new THREE.LineDashedMaterial({ color: cor, dashSize: 2, gapSize: 1.5 }) : new THREE.LineBasicMaterial({ color: cor }));
      if (trac) l.computeLineDistances(); l.visible = false; cena.add(l); return l;
    };
    const cruz = estrelas.filter((e) => e.grupo === "cruz");
    const temCruz = cruz.length === 4;
    const l1 = temCruz ? linha([achar("gacrux"), achar("acrux")], 0xf6d35b) : null;
    const l2 = temCruz ? linha([achar("mimosa"), achar("delta")], 0xf6d35b) : null;
    let ponteiro: THREE.Line | null = null, polo: THREE.Sprite | null = null;
    if (temCruz) {
      const g = estrelas.find((x) => x.id === "gacrux")!, a = estrelas.find((x) => x.id === "acrux")!;
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 20; k++) { const t = k / 20 * 4.5; pts.push(vetor(a.az + (a.az - g.az) * t, a.alt + (a.alt - g.alt) * t, R - 1)); }
      ponteiro = linha(pts, 0xf6d35b, true);
      polo = plaquinha("polo sul do céu", { largura: 440, fundo: "#f6d35b", escala: 7 });
      const fim = pts[pts.length - 1]; polo.position.copy(fim.clone().multiplyScalar(0.97)); polo.position.y += 4; polo.visible = false; cena.add(polo);
    }
    const marias = estrelas.filter((e) => e.grupo === "marias");
    const l3 = marias.length === 3 ? linha(marias.map((e) => vetor(e.az, e.alt, R - 1)), 0x9fd3ff) : null;
    // chão e silhuetas
    const chao = new THREE.Mesh(new THREE.CircleGeometry(R + 30, 64), new THREE.MeshBasicMaterial({ color: 0x05070f }));
    chao.rotation.x = -Math.PI / 2; chao.position.y = -0.2; cena.add(chao);
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2 + rnd() * 0.05, alt = 4 + rnd() * 9, d = R - 8;
      const arv = new THREE.Mesh(new THREE.ConeGeometry(2 + rnd() * 3, alt, 6), new THREE.MeshBasicMaterial({ color: 0x070a16 }));
      arv.position.set(Math.sin(a) * d, alt / 2 - 1, -Math.cos(a) * d); cena.add(arv);
    }
    [["NORTE", 0], ["LESTE", 90], ["SUL", 180], ["OESTE", 270]].forEach(([n, az]) => {
      const pl = plaquinha(n as string, { largura: 260, fundo: "#1d2433", cor: "#f6d35b", escala: 8 });
      pl.position.copy(vetor(az as number, 3.5, R - 12)); cena.add(pl);
    });

    const ray = new THREE.Raycaster();
    p.aoToque((n) => {
      ray.setFromCamera(n, cam);
      const hit = ray.intersectObjects(malhas.map((m) => m.alvo))[0];
      if (hit) cb.current(hit.object.userData.id);
    });
    p.aoQuadro((_dt, t) => {
      const { tocadas: tc, erradas: er, cruzOk: co, mariasOk: mo } = st.current;
      for (const m of malhas) {
        const ok = tc.includes(m.e.id);
        const cor = er === m.e.id ? 0xe2574c : ok ? (m.e.grupo === "cruz" ? 0xf6d35b : 0x9fd3ff) : 0xf4f6ff;
        (m.sp.material as THREE.SpriteMaterial).color.setHex(cor);
        const base = 1.2 + (4 - m.e.mag) * 0.75;
        m.sp.scale.setScalar(base * (ok ? 1.35 : 1) * (1 + Math.sin(t * 2 + m.e.az) * 0.05));
      }
      if (l1) l1.visible = co; if (l2) l2.visible = co; if (ponteiro) ponteiro.visible = co; if (polo) polo.visible = co; if (l3) l3.visible = mo;
    });
    return () => p.destruir();
  }, [estrelas]);

  return <div className="viva-3d" ref={ref} style={{ height: altura, cursor: "grab" }} role="img" aria-label="Céu noturno em 3D: arraste para olhar em volta e toque nas estrelas" />;
}
