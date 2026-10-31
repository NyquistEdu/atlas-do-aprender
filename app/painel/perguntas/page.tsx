import type { Metadata } from "next";
import Responder from "./Responder";
export const metadata: Metadata = { title: "Perguntas das famílias", robots: { index: false, follow: false } };
export default function Page() { return <Responder />; }
