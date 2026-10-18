"use client";

import { abrirPreferencias, TEM_RASTREIO } from "./Analytics";

export default function PreferenciasCookies() {
  if (!TEM_RASTREIO) return null;
  return <button type="button" className="link-btn" onClick={abrirPreferencias}>Preferências de cookies</button>;
}
