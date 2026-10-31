import type { Metadata } from "next";
import Moderar from "./Moderar";
export const metadata: Metadata = { title: "Mural de conquistas · moderação", robots: { index: false, follow: false } };
export default function Page() { return <Moderar />; }
