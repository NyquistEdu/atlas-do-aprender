import Link from "next/link";
export default function NaoEncontrado() {
  return <div className="wrap"><h2>Página não encontrada</h2><p className="lead">Esse endereço não existe no Atlas.</p><div><Link className="btn" href="/">Voltar ao início</Link></div></div>;
}
