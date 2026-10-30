import type { Metadata } from "next";
import Painel from "./Painel";

export const metadata: Metadata = { title: "Painel", robots: { index: false, follow: false } };

export default function Page() {
  return <Painel />;
}
