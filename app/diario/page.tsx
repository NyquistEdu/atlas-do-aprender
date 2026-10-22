import type { Metadata } from "next";
import { Suspense } from "react";
import Diario from "./Diario";
export const metadata: Metadata = { title: "Diário de aprendizagem", robots: { index: false, follow: true } };
export default function Page() { return <Suspense fallback={<div className="wrap"><p className="status">Carregando…</p></div>}><Diario /></Suspense>; }
