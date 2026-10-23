import type { Metadata } from "next";
import MeuPlano from "./MeuPlano";

export const metadata: Metadata = { title: "Meu plano de estudos", robots: { index: false, follow: false } };

export default function Page() {
  return <MeuPlano />;
}
