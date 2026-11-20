"use client";
/**
 * Fábrica de personagens em 3D: monstro, coruja ou robô, montados a partir de adjetivos
 * (tamanho, cor, jeito e humor). Vários personagens ficam lado a lado numa esteira.
 * Com onToque, dá para tocar num deles (jogo de achados e perdidos).
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { criarPalco, plaquinha } from "./palco3d";

export type Nome = "monstro" | "coruja" | "robo";
export type Config = { nome: Nome; tam?: "pequeno" | "grande"; cor?: string; jeito?: "peludo" | "listrado"; humor?: "feliz" | "triste" | "bravo" | "assustado" };
export type CasoPersonagem = { itens: Config[]; legenda?: string };

export const CORES: Record<string, number> = { azul: 0x5b8def, verde: 0x4fb37a, roxo: 0x9b6ee0, amarelo: 0xf2c23d, vermelho: 0xef5e5e };
const BASE: Record<Nome, number> = { monstro: 0x6cc7b4, coruja: 0xc49a6c, robo: 0xb8c4d6 };
const ESCALA = { pequeno: 0.68, grande: 1.32 } as const;

type Vivo = {
  raiz: THREE.Group; corpo: THREE.Group; olhos: THREE.Object3D[]; lagrima: THREE.Mesh | null; cfg: Config; chave: string;
  alvoX: number; nasceu: number; escala: number; fase: number;
};

const escurecer = (c: number, f = 0.75) => new THREE.Color(c).multiplyScalar(f).getHex();
const clarear = (c: number, f = 0.45) => new THREE.Color(c).lerp(new THREE.Color(0xffffff), f).getHex();

function fazer(cfg: Config): Omit<Vivo, "alvoX" | "nasceu" | "escala" | "fase" | "chave"> {
  const cor = cfg.cor ? CORES[cfg.cor] : BASE[cfg.nome];
  const m = (c: number, r = 0.5, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: r, ...extra });
  const pele = m(cor, 0.55), escuro = m(escurecer(cor), 0.6), claro = m(clarear(cor), 0.6);
  const preto = m(0x1d2433, 0.3), branco = m(0xffffff, 0.25), brilho = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const raiz = new THREE.Group(), corpo = new THREE.Group(); raiz.add(corpo);
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, pai: THREE.Object3D = corpo) => { const me = new THREE.Mesh(geo, mat); me.position.set(x, y, z); me.castShadow = true; pai.add(me); return me; };
  const olhos: THREE.Object3D[] = [];
  let lagrima: THREE.Mesh | null = null;
  const robo = cfg.nome === "robo", coruja = cfg.nome === "coruja";

  // ---------- corpo de cada personagem
  let rostoY = 1.45, rostoZ = 0.82, olhoX = 0.33, olhoR = 0.24, bocaY = 1.05, bocaZ = 0.94;
  if (cfg.nome === "monstro") {
    const b = add(new THREE.SphereGeometry(1, 48, 32), pele, 0, 1.15, 0); b.scale.set(1, 1.05, 0.95);
    const barriga = add(new THREE.SphereGeometry(0.62, 32, 20), claro, 0, 0.95, 0.6); barriga.scale.set(1, 1, 0.45);
    [-0.42, 0.42].forEach((x) => { const p = add(new THREE.SphereGeometry(0.28, 20, 14), escuro, x, 0.16, 0.22); p.scale.set(1, 0.6, 1.3); });
    [-1, 1].forEach((s) => { const br = add(new THREE.CapsuleGeometry(0.13, 0.42, 4, 10), pele, s * 0.98, 1.0, 0.05); br.rotation.z = s * 0.7; });
    [-1, 1].forEach((s) => { const c = add(new THREE.ConeGeometry(0.14, 0.48, 16), m(0xfff1d6, 0.5), s * 0.45, 2.1, -0.05); c.rotation.z = -s * 0.35; });
  } else if (coruja) {
    const b = add(new THREE.SphereGeometry(1, 48, 32), pele, 0, 1.15, 0); b.scale.set(0.92, 1.1, 0.88);
    const barriga = add(new THREE.SphereGeometry(0.75, 32, 20), claro, 0, 0.9, 0.42); barriga.scale.set(0.95, 1.05, 0.55);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - (i % 2); j++) { const pena = add(new THREE.TorusGeometry(0.09, 0.025, 6, 12, Math.PI), escuro, -0.18 + j * 0.18 + (i % 2) * 0.09, 0.95 - i * 0.2, 0.83 - i * 0.03); pena.rotation.z = Math.PI; }
    [-1, 1].forEach((s) => { const a = add(new THREE.SphereGeometry(0.5, 24, 16), escuro, s * 0.86, 1.0, -0.05); a.scale.set(0.38, 1.05, 0.8); a.rotation.z = s * 0.18; });
    [-1, 1].forEach((s) => { const t = add(new THREE.ConeGeometry(0.17, 0.5, 4), escuro, s * 0.52, 2.18, 0); t.rotation.z = -s * 0.45; });
    [-0.3, 0.3].forEach((x) => [-0.09, 0, 0.09].forEach((dx) => { const d = add(new THREE.ConeGeometry(0.05, 0.22, 8), m(0xf29a38), x + dx, 0.06, 0.45); d.rotation.x = Math.PI / 2; }));
    const bico = add(new THREE.ConeGeometry(0.11, 0.3, 12), m(0xf29a38, 0.4), 0, 1.33, 0.9); bico.rotation.x = Math.PI / 2 + 0.5;
    rostoY = 1.58; rostoZ = 0.66; olhoX = 0.34; olhoR = 0.29; bocaY = 1.12; bocaZ = 0.86;
    [-olhoX, olhoX].forEach((x) => { const anel = add(new THREE.TorusGeometry(olhoR + 0.02, 0.06, 10, 28), escuro, x, rostoY, rostoZ + 0.06); anel.scale.z = 0.6; });
  } else {
    add(new RoundedBoxGeometry(1.45, 1.1, 1.0, 4, 0.18), pele, 0, 0.95, 0);
    add(new THREE.CylinderGeometry(0.16, 0.2, 0.25, 16), escuro, 0, 1.6, 0);
    add(new RoundedBoxGeometry(1.15, 0.86, 0.92, 4, 0.2), pele, 0, 2.05, 0);
    add(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), preto, 0, 2.65, 0);
    const luz = add(new THREE.SphereGeometry(0.1, 16, 12), m(0xef5e5e, 0.3, { emissive: 0xef5e5e, emissiveIntensity: 0.8 }), 0, 2.9, 0); luz.name = "luz";
    const painel = add(new RoundedBoxGeometry(0.75, 0.45, 0.06, 2, 0.04), m(0x1d2433, 0.4), 0, 0.98, 0.5);
    [[0xf2c23d, -0.2], [0x4fb37a, 0], [0xef5e5e, 0.2]].forEach(([c, x]) => add(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), m(c, 0.3, { emissive: c, emissiveIntensity: 0.5 }), x, 0.98, 0.54).rotation.x = Math.PI / 2);
    [-1, 1].forEach((s) => { const br = add(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 12), escuro, s * 0.92, 0.95, 0); br.rotation.z = s * 0.35; add(new THREE.SphereGeometry(0.15, 16, 12), pele, s * 1.05, 0.62, 0); });
    [-0.35, 0.35].forEach((x) => { add(new THREE.CylinderGeometry(0.1, 0.1, 0.35, 12), escuro, x, 0.28, 0); add(new RoundedBoxGeometry(0.34, 0.14, 0.45, 2, 0.05), pele, x, 0.07, 0.06); });
    rostoY = 2.12; rostoZ = 0.46; olhoX = 0.26; olhoR = 0.15; bocaY = 1.84; bocaZ = 0.47;
  }

  // ---------- olhos
  [-olhoX, olhoX].forEach((x) => {
    const olho = new THREE.Group(); olho.position.set(x, rostoY, rostoZ); corpo.add(olho); olhos.push(olho);
    if (robo) {
      const tela = new THREE.Mesh(new THREE.CylinderGeometry(olhoR, olhoR, 0.06, 24), m(0x7fe9ff, 0.2, { emissive: 0x7fe9ff, emissiveIntensity: 0.9 })); tela.rotation.x = Math.PI / 2; olho.add(tela);
      const aro = new THREE.Mesh(new THREE.TorusGeometry(olhoR, 0.035, 8, 24), preto); olho.add(aro);
    } else {
      const bola = new THREE.Mesh(new THREE.SphereGeometry(olhoR, 24, 16), branco); bola.scale.z = 0.7; olho.add(bola);
      const pup = new THREE.Mesh(new THREE.SphereGeometry(olhoR * 0.52, 20, 14), preto); pup.position.set(0, -0.01, olhoR * 0.55); pup.scale.z = 0.6; olho.add(pup);
      const br = new THREE.Mesh(new THREE.SphereGeometry(olhoR * 0.18, 10, 8), brilho); br.position.set(olhoR * 0.22, olhoR * 0.25, olhoR * 0.85); olho.add(br);
    }
  });
  // bochechas
  if (!robo) [-1, 1].forEach((s) => { const bo = add(new THREE.SphereGeometry(0.11, 16, 10), m(0xff8fa3, 0.6, { transparent: true, opacity: 0.6 }), s * (olhoX + 0.3), rostoY - 0.3, rostoZ + 0.04); bo.scale.set(1.3, 0.75, 0.3); });

  // ---------- humor: boca e sobrancelhas
  const h = cfg.humor;
  const boca = new THREE.Group(); boca.position.set(0, bocaY, bocaZ); corpo.add(boca);
  const mBoca = robo ? m(0x7fe9ff, 0.2, { emissive: 0x7fe9ff, emissiveIntensity: 0.9 }) : preto;
  const arco = (sorri: boolean, r = 0.2) => { const a = new THREE.Mesh(new THREE.TorusGeometry(r, 0.045, 10, 28, Math.PI), mBoca); a.rotation.z = sorri ? Math.PI : 0; a.position.y = sorri ? 0.06 : -0.12; boca.add(a); return a; };
  if (h === "feliz") {
    if (!robo) { const fundo = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24, Math.PI, Math.PI), m(0x7a2b3a, 0.5)); fundo.position.set(0, 0.06, 0.005); boca.add(fundo); }
    arco(true, 0.21);
  } else if (h === "triste") {
    arco(false, 0.17);
    if (!robo) { lagrima = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), m(0x7fc8ff, 0.1, { transparent: true, opacity: 0.85 })); lagrima.scale.y = 1.4; lagrima.position.set(-olhoX - 0.05, rostoY - 0.2, rostoZ + 0.12); corpo.add(lagrima); }
  } else if (h === "bravo") {
    arco(false, 0.19);
    if (!robo) [-0.08, 0.08].forEach((x) => { const d = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 6), branco); d.position.set(x, -0.1, 0.03); boca.add(d); });
  } else if (h === "assustado") {
    const o = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.045, 10, 24), mBoca); o.scale.y = 1.35; o.position.y = -0.02; boca.add(o);
    olhos.forEach((ol) => ol.scale.setScalar(1.18));
  } else arco(true, 0.13);
  if (h && h !== "feliz") {
    [-1, 1].forEach((s) => {
      const sob = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.07, 0.06, 2, 0.03), robo ? preto : m(escurecer(cor, 0.45), 0.6));
      const ang = h === "bravo" ? 0.42 : h === "triste" ? -0.38 : 0;
      sob.position.set(s * olhoX, rostoY + olhoR + (h === "assustado" ? 0.2 : 0.1), rostoZ + 0.1); sob.rotation.z = -s * ang; corpo.add(sob);
    });
  }

  // ---------- jeito: peludo ou listrado
  if (cfg.jeito === "peludo") {
    const n = robo ? 110 : 230;
    const fio = new THREE.ConeGeometry(0.055, 0.24, 6); fio.translate(0, 0.12, 0);
    const inst = new THREE.InstancedMesh(fio, m(escurecer(cor, 0.88), 0.8), n); inst.castShadow = true;
    const dum = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0);
    let k = 0;
    for (let i = 0; i < n * 3 && k < n; i++) {
      const y = 1 - (i / (n * 3 - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      const dir = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
      let p: THREE.Vector3;
      if (robo) { if (dir.y < 0.35) continue; p = new THREE.Vector3(dir.x * 0.55, 2.05 + dir.y * 0.43, dir.z * 0.46); if (p.z > 0.25 && p.y < 2.4) continue; }
      else {
        const sx = coruja ? 0.92 : 1, sy = coruja ? 1.1 : 1.05, sz = coruja ? 0.88 : 0.95;
        p = new THREE.Vector3(dir.x * sx, 1.15 + dir.y * sy, dir.z * sz);
        if (dir.z > 0.35 && Math.abs(dir.x) < 0.75 && dir.y > -0.55 && dir.y < 0.8) continue; // deixa o rosto e a barriga à mostra
        if (dir.y < -0.75) continue;
      }
      dum.position.copy(p); dum.quaternion.setFromUnitVectors(up, dir); dum.scale.setScalar(0.8 + ((i * 37) % 10) / 20); dum.updateMatrix();
      inst.setMatrixAt(k++, dum.matrix);
    }
    inst.count = k; corpo.add(inst);
  } else if (cfg.jeito === "listrado") {
    const ml = m(escurecer(cor, 0.62), 0.55);
    if (robo) [0.62, 0.95, 1.28].forEach((y) => add(new THREE.BoxGeometry(1.48, 0.1, 1.03), ml, 0, y, 0));
    else {
      const sx = coruja ? 0.92 : 1, sy = coruja ? 1.1 : 1.05, sz = coruja ? 0.88 : 0.95;
      (coruja ? [-0.55, -0.25, 0.75] : [-0.6, -0.28, 0.72]).forEach((dy) => {
        const r = Math.sqrt(Math.max(0.05, 1 - (dy / sy) ** 2));
        const anel = new THREE.Mesh(new THREE.TorusGeometry(r * sx + 0.005, 0.075, 10, 48), ml); anel.rotation.x = Math.PI / 2; anel.scale.set(1, sz / sx, 1); anel.position.y = 1.15 + dy; corpo.add(anel);
      });
    }
  }
  raiz.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true; });
  return { raiz, corpo, olhos, lagrima, cfg };
}

export default function Personagem3D({ itens, casos, onCaso, onToque, marcado, altura = 400 }: {
  itens: Config[]; casos?: CasoPersonagem[]; onCaso?: (c: CasoPersonagem) => void; onToque?: (i: number) => void; marcado?: { i: number; ok: boolean } | null; altura?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const api = useRef<{ montar: (l: Config[]) => void; marcar: (m?: { i: number; ok: boolean } | null) => void } | null>(null);
  const cb = useRef(onCaso); cb.current = onCaso;
  const tq = useRef(onToque); tq.current = onToque;

  useEffect(() => {
    // enquadramento automático: a câmera se afasta o suficiente para caber a fila inteira
    let largCont = 3, altCont = 3.6, distAtual = 10;
    const TAN = Math.tan((38 * Math.PI) / 360);
    const distFn = (asp: number) => {
      const alvoD = Math.max(altCont / (2 * TAN), (largCont + 1.8) / (2 * TAN * asp), 7.5);
      distAtual += (alvoD - distAtual) * 0.08; return distAtual;
    };
    const p = criarPalco(ref.current!, { fundo: 0xffe7c2, az: 0, el: 0.14, distFn, alvo: [0, 1.35, 0], sombras: true, elMin: 0.05, elMax: 0.9 });
    const { cena, cam } = p;
    cena.fog = new THREE.Fog(0xffe7c2, 18, 40);
    cena.add(new THREE.HemisphereLight(0xffffff, 0xd9a46a, 1.15));
    const sol = new THREE.DirectionalLight(0xfff4e6, 1.9); sol.position.set(4, 9, 7); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024); sol.shadow.bias = -0.0004;
    Object.assign(sol.shadow.camera, { left: -8, right: 8, top: 7, bottom: -3 }); cena.add(sol);
    const contra = new THREE.DirectionalLight(0xc9e0ff, 0.7); contra.position.set(-6, 5, -6); cena.add(contra);
    const mat = (c: number, r = 0.6) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

    // a fábrica: parede, esteira, rolos e placa
    const piso = new THREE.Mesh(new THREE.CircleGeometry(30, 48), mat(0xf4d3a3, 0.95)); piso.rotation.x = -Math.PI / 2; piso.position.y = -0.36; piso.receiveShadow = true; cena.add(piso);
    const parede = new THREE.Mesh(new THREE.PlaneGeometry(40, 14), mat(0xffd9a0, 0.95)); parede.position.set(0, 6, -3.2); cena.add(parede);
    for (let i = -8; i <= 8; i++) { const lis = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 14), mat(i % 2 ? 0xffe3b5 : 0xffd9a0, 0.95)); lis.position.set(i * 1.8, 6, -3.18); cena.add(lis); }
    const esteira = new THREE.Mesh(new RoundedBoxGeometry(14, 0.3, 2.6, 3, 0.12), mat(0x3a4256, 0.7)); esteira.position.set(0, -0.15, 0); esteira.receiveShadow = true; cena.add(esteira);
    [-1.33, 1.33].forEach((z) => { const borda = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 0.14), mat(0xf2c23d, 0.5)); borda.position.set(0, 0.03, z); cena.add(borda); });
    const listras: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 2.4), mat(0x2a3042, 0.8)); l.position.set(-7 + i, 0.005, 0); cena.add(l); listras.push(l); }
    [-6.8, 6.8].forEach((x) => { const pe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 2.2), mat(0x8a93a8, 0.5)); pe.position.set(x, -0.6, 0); cena.add(pe); });
    const placa = plaquinha("FÁBRICA DE PERSONAGENS", { largura: 760, fundo: "#ffffff", escala: 1.3 }); placa.position.set(0, 4.15, -3); cena.add(placa);
    // engrenagens na parede
    const engs: THREE.Mesh[] = [];
    [[-6.2, 3.4, 0.9, 0xef5e5e], [6.3, 3.1, 1.1, 0x5b8def], [-5.1, 5.0, 0.55, 0xf2c23d], [5.2, 5.2, 0.6, 0x4fb37a]].forEach(([x, y, r, c]) => {
      const e = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.15, 12), mat(c, 0.5)); e.rotation.x = Math.PI / 2; e.position.set(x, y, -3.05); cena.add(e); engs.push(e);
      const miolo = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.35, r * 0.35, 0.18, 20), mat(0xffffff, 0.5)); miolo.rotation.x = Math.PI / 2; miolo.position.set(x, y, -3.0); cena.add(miolo);
    });
    const anel = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.08, 10, 48), new THREE.MeshBasicMaterial({ color: 0x4fb37a })); anel.rotation.x = -Math.PI / 2; anel.position.y = 0.04; anel.visible = false; cena.add(anel);

    let vivos: Vivo[] = [];
    let t = 0, andar = 0;
    const layout = (l: Config[]) => {
      const larg = l.map((c) => 2.5 * (c.tam ? ESCALA[c.tam] : 1));
      const tot = larg.reduce((a, b) => a + b, 0) + (l.length - 1) * 0.35;
      largCont = tot; altCont = 3.4 * Math.max(...l.map((c) => (c.tam ? ESCALA[c.tam] : 1))) + 0.8;
      let x = -tot / 2; return larg.map((w) => { const c = x + w / 2; x += w + 0.35; return c; });
    };
    const montar = (l: Config[]) => {
      const xs = layout(l);
      const novos: Vivo[] = [];
      l.forEach((cfg, i) => {
        const chave = JSON.stringify(cfg);
        const velho = vivos[i];
        const esc = cfg.tam ? ESCALA[cfg.tam] : 1;
        if (velho && velho.chave === chave) { velho.alvoX = xs[i]; velho.escala = esc; novos.push(velho); return; }
        if (velho) cena.remove(velho.raiz);
        const f = fazer(cfg);
        f.raiz.position.set(velho ? xs[i] : xs[i] - 9, 0, 0);
        f.raiz.scale.setScalar(velho ? 0.01 : esc);
        f.raiz.traverse((o) => (o.userData.idx = i));
        cena.add(f.raiz);
        novos.push({ ...f, chave, alvoX: xs[i], nasceu: t, escala: esc, fase: i * 1.7 });
        andar = velho ? andar : 1.2;
      });
      vivos.slice(l.length).forEach((v) => cena.remove(v.raiz));
      vivos = novos;
    };
    const marcar = (mk?: { i: number; ok: boolean } | null) => {
      if (!mk || !vivos[mk.i]) { anel.visible = false; return; }
      anel.visible = true; (anel.material as THREE.MeshBasicMaterial).color.setHex(mk.ok ? 0x4fb37a : 0xef5e5e);
      anel.position.x = vivos[mk.i].alvoX; anel.scale.setScalar(vivos[mk.i].escala);
    };
    api.current = { montar, marcar };

    const ray = new THREE.Raycaster();
    p.aoToque((n) => {
      if (!tq.current) return;
      ray.setFromCamera(n, cam);
      const hit = ray.intersectObjects(vivos.map((v) => v.raiz), true)[0];
      if (hit && typeof hit.object.userData.idx === "number") tq.current(hit.object.userData.idx);
    });

    const elastico = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -9 * u) * Math.cos(u * 11));
    p.aoQuadro((dt) => {
      t += dt;
      andar = Math.max(0, andar - dt);
      listras.forEach((l) => { l.position.x += dt * (andar > 0 ? 3 : 0.4); if (l.position.x > 7) l.position.x -= 14; });
      engs.forEach((e, i) => (e.rotation.y += dt * (i % 2 ? -0.6 : 0.6)));
      for (const v of vivos) {
        const u = Math.min(1, (t - v.nasceu) / 0.7);
        const s = v.escala * (v.raiz.position.x < v.alvoX - 0.5 && u < 1 ? 1 : elastico(u) || 0.01);
        v.raiz.scale.setScalar(Math.max(0.01, s));
        v.raiz.position.x += (v.alvoX - v.raiz.position.x) * Math.min(1, dt * 4);
        const h = v.cfg.humor, ph = t * 2 + v.fase;
        let y = 0, rx = 0, rz = 0, sx = 1, sy = 1;
        sy = 1 + Math.sin(ph * 1.2) * 0.025; sx = 1 - Math.sin(ph * 1.2) * 0.015;
        if (h === "feliz") { const pulo = Math.max(0, Math.sin(ph * 1.6)); y = pulo * 0.35; sy += pulo * 0.05; rz = Math.sin(ph * 0.8) * 0.06; }
        else if (h === "triste") { rx = 0.16; y = Math.sin(ph * 0.6) * 0.02; }
        else if (h === "bravo") { rz = Math.sin(t * 22 + v.fase) * 0.025; sy = 1 + Math.abs(Math.sin(ph * 2.5)) * 0.04; }
        else if (h === "assustado") { v.corpo.position.x = Math.sin(t * 40 + v.fase) * 0.03; y = 0.05; }
        else y = Math.abs(Math.sin(ph)) * 0.08;
        v.corpo.position.y = y; v.corpo.rotation.set(rx, Math.sin(ph * 0.5) * 0.12, rz); v.corpo.scale.set(sx, sy, sx);
        // piscar
        const pisca = ((t + v.fase * 1.3) % 3.4) < 0.12 ? 0.12 : 1;
        v.olhos.forEach((o) => { o.scale.y = (h === "assustado" ? 1.18 : 1) * pisca; });
        if (v.lagrima) { const k = ((t + v.fase) % 1.6) / 1.6; v.lagrima.position.y = 1.2 + (v.cfg.nome === "coruja" ? 0.13 : 0) - k * 0.55; (v.lagrima.material as THREE.MeshStandardMaterial).opacity = 0.9 * (1 - k); }
        const luz = v.corpo.getObjectByName("luz") as THREE.Mesh | undefined;
        if (luz) (luz.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + (Math.sin(t * 5) > 0 ? 0.9 : 0);
      }
      if (anel.visible) anel.rotation.z += dt;
    });
    return () => { api.current = null; p.destruir(); };
  }, []);

  const chave = JSON.stringify(itens);
  useEffect(() => {
    if (casos && casos.length) {
      let i = 0;
      const mostrar = () => { const c = casos[i]; api.current?.montar(c.itens); cb.current?.(c); i = (i + 1) % casos.length; };
      const id0 = setTimeout(mostrar, 60);
      const id = setInterval(mostrar, 3000);
      return () => { clearTimeout(id0); clearInterval(id); };
    }
    api.current?.montar(itens);
  }, [casos, chave]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { api.current?.marcar(marcado); }, [marcado?.i, marcado?.ok, chave]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="viva-3d" ref={ref} style={{ height: altura, cursor: onToque ? "pointer" : undefined }} role="img" aria-label={`Fábrica de personagens em 3D: ${itens.length} personagem(ns)`} />;
}
