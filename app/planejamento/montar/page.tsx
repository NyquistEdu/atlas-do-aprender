import type { Metadata } from "next";
import Montar from "./Montar";
export const metadata: Metadata = { title: "Montar planejamento", robots: { index: false, follow: false } };
export default function Page() { return <Montar />; }
