import type { Metadata } from "next";
import Pedidos from "./Pedidos";
export const metadata: Metadata = { title: "Pedidos de planejamento", robots: { index: false, follow: false } };
export default function Page() { return <Pedidos />; }
