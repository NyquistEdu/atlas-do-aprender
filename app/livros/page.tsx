import type { Metadata } from "next";
import Livros from "./Livros";
export const metadata: Metadata = { title: "Livros" };
export default function Page() { return <Livros />; }
