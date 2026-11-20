import type { Metadata } from "next";
import Link from "next/link";
import "../viva.css";
import SobreFase from "@/components/viva/SobreFase";
import { metaViva } from "@/lib/vivasSeo";
import BrincarViva from "./BrincarViva";

export const metadata: Metadata = metaViva("brincar-com-as-palavras");

export default function Page() {
  return (
    <div className="viva-pagina">
      <div className="wrap-largo">
        <p className="meta"><Link href="/vivas">Fases Vivas</Link> › Brincar com as Palavras <span className="tag cie" style={{ marginLeft: 6 }}>Grátis</span></p>
        <BrincarViva />
        <p className="meta" style={{ textAlign: "center" }}>Ligue o som: quase tudo aqui é para ouvir. A capa e o laboratório são abertos para todos; do treino em diante, entre na sua conta grátis do Atlas.</p>
        <SobreFase slug="brincar-com-as-palavras" />
      </div>
    </div>
  );
}
