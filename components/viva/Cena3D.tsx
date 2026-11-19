"use client";
/**
 * Cena 3D da divisão: itens (biscoitos ou ovos) saem do monte e vão para os recipientes.
 * repartir: k pratos, um item de cada vez em cada prato (rodadas); o que não dá para todos fica de fora.
 * agrupar: caixas de k itens; enche uma caixa de cada vez; o que não completa uma caixa fica de fora.
 * Gira arrastando com o dedo ou o mouse.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ModoDiv = "repartir" | "agrupar";
export type Caso = { n: number; k: number; modo: ModoDiv; legenda?: string };

type Props = {
  n: number; k: number; modo: ModoDiv;
  item?: "biscoito" | "ovo";
  casos?: Caso[]; // se vier, a cena alterna sozinha entre os casos
  onCaso?: (c: Caso, i: number) => void;
  altura?: number;
  oculto?: boolean; // esconde a distribuição (para prever antes de ver)
};

const COR = { fundo: 0x1d2433, chao: 0x2b3756, prato: 0xfbf7ef, aba: 0xe9dfcb, caixa: 0xd8b585, biscoito: 0xc98a4b, gota: 0x4a2c17, ovo: 0xf4e6cc, sobra: 0xe2574c };

type Peca = { obj: THREE.Object3D; de: THREE.Vector3; para: THREE.Vector3; atraso: number; sobra: boolean };

function biscoito(esc: number) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.13, 22), new THREE.MeshStandardMaterial({ color: COR.biscoito, roughness: 0.85 }));
  m.castShadow = true; g.add(m);
  const gm = new THREE.MeshStandardMaterial({ color: COR.gota, roughness: 0.6 });
  [[0.12, 0.08], [-0.13, 0.1], [0.02, -0.15], [-0.08, -0.05], [0.17, -0.1]].forEach(([x, z]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), gm);
    s.position.set(x, 0.07, z); g.add(s);
  });
  g.scale.setScalar(esc);
  return g;
}
function ovo(esc: number) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), new THREE.MeshStandardMaterial({ color: COR.ovo, roughness: 0.55 }));
  m.scale.set(1, 1.3, 1); m.castShadow = true;
  const g = new THREE.Group(); g.add(m); g.scale.setScalar(esc);
  return g;
}
function prato(r: number) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.86, 0.1, 40), new THREE.MeshStandardMaterial({ color: COR.prato, roughness: 0.35 }));
  base.receiveShadow = true; g.add(base);
  const aba = new THREE.Mesh(new THREE.TorusGeometry(r, 0.07, 10, 48), new THREE.MeshStandardMaterial({ color: COR.aba, roughness: 0.4 }));
  aba.rotation.x = Math.PI / 2; aba.position.y = 0.06; g.add(aba);
  return g;
}
function caixa(w: number, d: number) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: COR.caixa, roughness: 0.9 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), mat); base.receiveShadow = true; g.add(base);
  const h = 0.32;
  [[0, d / 2, w, 0.06], [0, -d / 2, w, 0.06]].forEach(([x, z, ww]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(ww, h, 0.06), mat); p.position.set(x, h / 2, z); g.add(p); });
  [[w / 2, 0], [-w / 2, 0]].forEach(([x]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, d), mat); p.position.set(x, h / 2, 0); g.add(p); });
  return g;
}

/** Onde cada item termina. */
export function distribuir(n: number, k: number, modo: ModoDiv) {
  const q = Math.floor(n / k), r = n % k;
  const recipientes = modo === "repartir" ? k : q;
  const porRecipiente = modo === "repartir" ? q : k;
  const destino: { rec: number; slot: number }[] = [];
  for (let i = 0; i < n; i++) {
    if (i >= n - r) { destino.push({ rec: -1, slot: i - (n - r) }); continue; }
    if (modo === "repartir") destino.push({ rec: i % k, slot: Math.floor(i / k) });
    else destino.push({ rec: Math.floor(i / k), slot: i % k });
  }
  return { q, r, recipientes, porRecipiente, destino };
}

export default function Cena3D({ n, k, modo, item = "biscoito", casos, onCaso, altura = 360, oculto = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const st = useRef<{ montar: (c: Caso) => void; oculto: boolean } | null>(null);
  const casoCb = useRef(onCaso);
  casoCb.current = onCaso;

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const cena = new THREE.Scene();
    cena.background = new THREE.Color(COR.fundo);
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    cena.add(new THREE.HemisphereLight(0xfff6e6, 0x2b3756, 1.05));
    const sol = new THREE.DirectionalLight(0xffffff, 1.6);
    sol.position.set(4, 10, 6); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
    Object.assign(sol.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 });
    cena.add(sol);

    const mundo = new THREE.Group(); cena.add(mundo);
    const chao = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.3, 64), new THREE.MeshStandardMaterial({ color: COR.chao, roughness: 1 }));
    chao.position.y = -0.2; chao.receiveShadow = true; mundo.add(chao);
    const aneis = new THREE.Group();
    [3, 5.5, 8].forEach((r) => { const a = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 4, 96), new THREE.MeshBasicMaterial({ color: 0x4b5d8a })); a.rotation.x = Math.PI / 2; a.position.y = -0.04; aneis.add(a); });
    mundo.add(aneis);
    // estrelinhas ao fundo
    const pts = new THREE.BufferGeometry(); const pos: number[] = [];
    for (let i = 0; i < 160; i++) pos.push((Math.random() - 0.5) * 50, 4 + Math.random() * 14, -12 - Math.random() * 18);
    pts.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    cena.add(new THREE.Points(pts, new THREE.PointsMaterial({ color: 0xc9d4f2, size: 0.07 })));

    let conteudo = new THREE.Group(); mundo.add(conteudo);
    let pecas: Peca[] = [];
    let t0 = performance.now();
    let escalaMundo = 1;

    const limpar = () => {
      mundo.remove(conteudo);
      conteudo.traverse((o) => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); const mat = m.material as THREE.Material | undefined; if (mat && mat.dispose) mat.dispose(); });
      conteudo = new THREE.Group(); mundo.add(conteudo); pecas = [];
    };

    const montar = (c: Caso) => {
      limpar();
      const nn = Math.max(0, Math.min(40, Math.round(c.n))), kk = Math.max(1, Math.round(c.k));
      const d = distribuir(nn, kk, c.modo);
      const s = Math.max(1, d.porRecipiente);
      const cols = Math.ceil(Math.sqrt(s));
      const esc = s > 16 ? 0.62 : s > 9 ? 0.75 : 1;
      const passo = 0.78 * esc;
      const raio = Math.max(0.95, (cols * passo) / 2 + 0.45);
      const nRec = Math.max(0, d.recipientes);
      const porLinha = nRec <= 5 ? Math.max(1, nRec) : Math.ceil(nRec / 2);
      const linhas = Math.max(1, Math.ceil(nRec / porLinha));
      const larg = c.modo === "repartir" ? raio * 2 + 0.5 : cols * passo + 0.9;
      const prof = c.modo === "repartir" ? raio * 2 + 0.5 : Math.ceil(s / cols) * passo + 0.9;
      const centros: THREE.Vector3[] = [];
      for (let i = 0; i < nRec; i++) {
        const li = Math.floor(i / porLinha), ci = i % porLinha;
        const naLinha = Math.min(porLinha, nRec - li * porLinha);
        const x = (ci - (naLinha - 1) / 2) * larg;
        const z = -1.2 + (li - (linhas - 1) / 2) * prof;
        const v = new THREE.Vector3(x, 0, z);
        centros.push(v);
        const rec = c.modo === "repartir" ? prato(raio) : caixa(cols * passo + 0.5, Math.ceil(s / cols) * passo + 0.5);
        rec.position.copy(v); rec.scale.set(0.001, 0.001, 0.001); rec.userData.cresce = true;
        conteudo.add(rec);
      }
      // ajusta a escala para caber
      const largTotal = porLinha * larg, profTotal = linhas * prof + 3.5;
      escalaMundo = Math.min(1, 13 / largTotal, 10 / profTotal);
      mundo.scale.setScalar(escalaMundo);
      // zona da sobra
      if (d.r > 0) {
        const anel = new THREE.Mesh(new THREE.TorusGeometry(0.75 + d.r * 0.08, 0.05, 8, 48), new THREE.MeshBasicMaterial({ color: COR.sobra }));
        anel.rotation.x = Math.PI / 2; anel.position.set(0, 0.02, 3.4); conteudo.add(anel);
      }
      // monte inicial
      const fazer = item === "ovo" ? ovo : biscoito;
      d.destino.forEach((dst, i) => {
        const obj = fazer(esc);
        const ang = i * 2.4, rr = 0.35 * Math.sqrt(i);
        const de = new THREE.Vector3(Math.cos(ang) * rr * 0.7, 0.1 + (i % 3) * 0.06, 3.4 + Math.sin(ang) * rr * 0.45);
        let para: THREE.Vector3;
        if (dst.rec >= 0) {
          const cc = centros[dst.rec];
          const lin = Math.floor(dst.slot / cols), col = dst.slot % cols;
          const rows = Math.ceil(s / cols);
          para = new THREE.Vector3(cc.x + (col - (cols - 1) / 2) * passo, 0.14, cc.z + (lin - (rows - 1) / 2) * passo);
        } else {
          const a = dst.slot * (Math.PI * 2 / Math.max(1, d.r));
          para = new THREE.Vector3(d.r > 1 ? Math.cos(a) * 0.4 : 0, 0.14, 3.4 + (d.r > 1 ? Math.sin(a) * 0.3 : 0));
        }
        obj.position.copy(de);
        conteudo.add(obj);
        const ordem = c.modo === "repartir" ? i : i;
        pecas.push({ obj, de, para, atraso: 0.5 + ordem * Math.max(0.05, 1.6 / Math.max(1, nn)), sobra: dst.rec < 0 });
      });
      t0 = performance.now();
    };
    st.current = { montar, oculto };

    // arrastar para girar
    let rotY = -0.35, rotX = 0, arrastando = false, ux = 0, uy = 0, ocioso = 0;
    const down = (ev: PointerEvent) => { arrastando = true; ux = ev.clientX; uy = ev.clientY; renderer.domElement.setPointerCapture(ev.pointerId); };
    const move = (ev: PointerEvent) => {
      if (!arrastando) return;
      rotY += (ev.clientX - ux) * 0.008; rotX = Math.max(-0.35, Math.min(0.5, rotX + (ev.clientY - uy) * 0.004));
      ux = ev.clientX; uy = ev.clientY; ocioso = 0;
    };
    const up = () => { arrastando = false; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);
    renderer.domElement.style.touchAction = "pan-y";

    const ajustar = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      cam.aspect = w / h;
      const longe = w / h < 1 ? 17.5 : 14;
      cam.position.set(0, longe * 0.72, longe * 0.8);
      cam.lookAt(0, -0.4, 1.1);
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(ajustar); ro.observe(el); ajustar();

    let raf = 0, ult = performance.now();
    const loop = (agora: number) => {
      const dt = (agora - ult) / 1000; ult = agora;
      const t = (agora - t0) / 1000;
      if (!arrastando) { ocioso += dt; if (ocioso > 2) rotY += dt * 0.12; }
      mundo.rotation.y = rotY; mundo.rotation.x = rotX;
      conteudo.children.forEach((o) => { if (o.userData.cresce) { const s = Math.min(1, o.scale.x + dt * 3.5); o.scale.setScalar(s); } });
      const esconder = st.current?.oculto;
      for (const p of pecas) {
        const u = esconder ? 0 : Math.max(0, Math.min(1, (t - p.atraso) / 0.55));
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        p.obj.position.lerpVectors(p.de, p.para, e);
        p.obj.position.y += Math.sin(u * Math.PI) * 1.4;
        p.obj.rotation.y = e * Math.PI * 2;
        if (p.sobra && u >= 1) p.obj.position.y = p.para.y + Math.abs(Math.sin(t * 4)) * 0.12;
      }
      renderer.render(cena, cam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); limpar();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [item]);

  // casos automáticos (capa) ou controlados
  useEffect(() => {
    if (st.current) st.current.oculto = oculto;
  }, [oculto]);
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { st.current?.montar(casos[i]); casoCb.current?.(casos[i], i); i = (i + 1) % casos.length; };
      mostrar();
      const id = setInterval(mostrar, 6500);
      return () => clearInterval(id);
    }
    st.current?.montar({ n, k, modo });
  }, [casos, n, k, modo, item]);

  return <div className="viva-3d" ref={ref} style={{ height: altura }} aria-label="Cena 3D: arraste para girar" role="img" />;
}
