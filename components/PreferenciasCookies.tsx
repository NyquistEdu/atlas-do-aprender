"use client";

import { abrirPreferencias } from "./Analytics";

export default function PreferenciasCookies() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return <button type="button" className="link-btn" onClick={abrirPreferencias}>Preferências de cookies</button>;
}
