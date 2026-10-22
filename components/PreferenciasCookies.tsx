"use client";

import { abrirPreferencias, TEM_RASTREIO } from "./Analytics";
import { PEDIR_CONSENTIMENTO } from "@/lib/consentimento";

export default function PreferenciasCookies() {
  if (!TEM_RASTREIO || !PEDIR_CONSENTIMENTO) return null;
  return <button type="button" className="link-btn" onClick={abrirPreferencias}>Preferências de cookies</button>;
}
