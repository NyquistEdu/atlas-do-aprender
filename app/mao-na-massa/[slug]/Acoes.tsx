"use client";

import { ParaDiario } from "@/components/Registrar";

/** Botões da ficha: imprimir e guardar a descoberta no diário. */
export default function Acoes({ area, titulo }: { area: string; titulo: string }) {
  return (
    <div className="row no-print">
      <button type="button" className="btn" onClick={() => window.print()}>Imprimir a ficha</button>
      <ParaDiario area={area} tipo="Experimento" titulo={titulo} texto="Guardar a descoberta no diário" />
    </div>
  );
}
