import type { Metadata } from "next";
import Jogos from "./Jogos";
export const metadata: Metadata = { title: "Jogos" };
export default function Page() { return <Jogos />; }
