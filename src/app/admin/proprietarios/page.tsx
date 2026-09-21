"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Page() {
    const [leads, setLeads] = useState<any[]>([]);
    const supabase = createClient();
    useEffect(() => { (async () => { const { data } = await supabase.from("proprietarios_leads").select("*").order("criado_em", { ascending: false }); if (data) setLeads(data); })(); }, []);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">🤖 Robô de Captação</h1>
            <p className="text-sm text-zinc-500 mb-6">{leads.length} leads</p>
            <div className="bg-white rounded-xl border shadow overflow-auto">
                <table className="w-full text-sm"><thead className="bg-zinc-100"><tr><th className="p-3 text-left">Bairro</th><th className="p-3">Preço</th><th className="p-3">WhatsApp</th><th className="p-3">Link</th><th className="p-3">Status</th></tr></thead><tbody>{leads.map((l: any) => (<tr key={l.id} className="border-t"><td className="p-3">{l.bairro}</td><td className="p-3">{l.preco}</td><td className="p-3 font-bold text-green-600">{l.whatsapp_dono}</td><td className="p-3"><a href={l.link_anuncio} target="_blank" className="text-blue-600 underline">Abrir</a></td><td className="p-3">{l.status}</td></tr>))}</tbody></table>
                {leads.length === 0 && <p className="p-10 text-center text-zinc-400">Nenhum lead ainda.</p>}
            </div>
        </div>
    );
}