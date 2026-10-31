import type { Metadata } from "next";
import Preferencias from "./Preferencias";
export const metadata: Metadata = { title: "E-mails do Atlas", robots: { index: false } };
export default function Page() { return <Preferencias />; }
