import type { Metadata } from "next";
import Livros from "./Livros";
export const metadata: Metadata = {
  title: "Livros infantis para ler com a criança, por ano e matéria",
  description: "Livros paradidáticos para crianças da alfabetização ao 5º ano, organizados por matéria e ano, com o que cada história ajuda a trabalhar. Mais uma estante de formação com literatura, poesia, mitos e Brasil.",
  alternates: { canonical: "/livros" },
};
export default function Page() { return <Livros />; }
