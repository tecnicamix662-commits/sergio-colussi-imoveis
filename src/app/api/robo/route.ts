import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  await supabase.from("proprietarios_leads").insert({
    bairro: "Centro - Santo André",
    preco: "R$ 350.000,00",
    origem: "OLX",
    whatsapp_dono: "11 99999-9999",
    link_anuncio: "https://www.olx.com.br",
    status: "novo"
  });
  return NextResponse.json({ ok: true });
}