import type { Metadata } from "next";
import Mao from "./Mao";
export const metadata: Metadata = {
  title: "Experimentos e atividades mão na massa para crianças",
  description: "Experimentos de ciências e atividades práticas com material de casa para crianças da alfabetização ao 5º ano, com passo a passo, explicação e cuidados.",
  alternates: { canonical: "/mao-na-massa" },
};
export default function Page() { return <Mao />; }
