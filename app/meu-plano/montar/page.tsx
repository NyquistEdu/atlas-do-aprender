import type { Metadata } from "next";
import MontarSozinha from "./MontarSozinha";

export const metadata: Metadata = { title: "Montar meu plano de estudos", robots: { index: false, follow: false } };

export default function Page() {
  return <MontarSozinha />;
}
