'use client';

import { useState, useEffect, useCallback } from 'react';
import { PropertyService } from '@/services/propertyService';
import { LeadSubmission, SellerSubmission } from '@/types/property';
import { MessageSquare, Phone, Mail, Clock, Building2, Trash2, AlertTriangle, Search, UserCheck } from 'lucide-react';

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
}

export default function MensagensPage() {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<LeadSubmission[]>([]);

  const loadLeads = useCallback(() => {
    setLeads(PropertyService.getLeads());
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(leads);
    } else {
      const q = search.toLowerCase();
      setFiltered(leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.propertyTitle || '').toLowerCase().includes(q) ||
          l.message.toLowerCase().includes(q)
      ));
    }
  }, [leads, search]);

  const handleDelete = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sergio_colussi_leads_v1', JSON.stringify(updated));
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl bg-stone-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">Mensagens e Leads</h1>
          <p className="text-stone-600 text-sm mt-1 font-medium">
            {leads.length} mensagem{leads.length !== 1 ? 's' : ''} recebida{leads.length !== 1 ? 's' : ''} dos clientes no site
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail, telefone ou mensagem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
        />
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <p className="text-sm font-bold">Excluir esta mensagem permanentemente?</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition">Cancelar</button>
            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition">Excluir</button>
          </div>
        </div>
      )}

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3">
          <MessageSquare className="w-12 h-12 text-stone-400 mx-auto" />
          <p className="text-stone-700 text-sm font-bold">
            {leads.length === 0 ? 'Nenhuma mensagem recebida ainda.' : 'Nenhuma mensagem encontrada para esta busca.'}
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Quando um cliente preencher o formulário de um imóvel ou entrar em contato pelo site, a mensagem aparecerá aqui e também no seu e-mail sjcolussi@gmail.com.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-400 transition shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <UserCheck className="w-4 h-4 text-stone-900" />
                    <span className="font-serif text-lg font-bold text-stone-950">{lead.name}</span>
                    <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      <Clock className="w-3 h-3 text-stone-600" /> {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-stone-700 pt-1">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-black transition">
                      <Phone className="w-3.5 h-3.5 text-stone-900" /> {lead.phone}
                    </a>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-black transition">
                      <Mail className="w-3.5 h-3.5 text-stone-900" /> {lead.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {lead.phone && (
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, sou Sérgio Colussi Corretor. Recebi sua mensagem sobre imóveis. Como posso ajudá-lo?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-extrabold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
                    >
                      <span>Responder no WhatsApp</span>
                    </a>
                  )}
                  <button
                    onClick={() => setDeleteId(lead.id)}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-500 hover:text-red-700 transition"
                    title="Excluir mensagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {lead.propertyTitle && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-semibold text-amber-950 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span><strong>Interesse no Imóvel:</strong> {lead.propertyTitle}</span>
                </div>
              )}

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">MENSAGEM DO CLIENTE:</span>
                <p className="text-stone-950 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                  {lead.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
