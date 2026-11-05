import type { Metadata } from "next";
import Imprimir from "./Imprimir";
export const metadata: Metadata = { title: "Imprimir planejamento", robots: { index: false, follow: false } };
export default function Page() { return <Imprimir />; }
