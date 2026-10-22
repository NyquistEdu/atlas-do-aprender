import type { Metadata } from "next";
import { Suspense } from "react";
import Entrar from "./Entrar";
export const metadata: Metadata = { title: "Entrar ou criar conta", robots: { index: false, follow: true } };
export default function Page() { return <Suspense fallback={null}><Entrar /></Suspense>; }
