import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Proteção de segurança: verificar CRON_SECRET se configurado
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { erro: "Não autorizado." },
      { status: 401 }
    );
  }

  // 2. Verificar se o Supabase está configurado
  if (!supabase) {
    return NextResponse.json(
      { erro: "Supabase não configurado neste ambiente (NEXT_PUBLIC_SUPABASE_URL ou ANON_KEY ausentes)." },
      { status: 503 }
    );
  }

  try {
    // 3. Executar uma consulta leve para gerar atividade no banco Postgres
    const { count, error } = await supabase
      .from("criancas")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { erro: "Falha ao consultar o banco", detalhe: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      mensagem: "Banco Supabase acordado com sucesso.",
      timestamp: new Date().toISOString(),
      contagem_amostra: count,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { erro: "Erro inesperado ao executar ping", detalhe: msg },
      { status: 500 }
    );
  }
}
