'use client';

import { useState, useEffect, useCallback } from 'react';
import { PropertyService } from '@/services/propertyService';
import { LeadSubmission } from '@/types/property';
import { MessageSquare, Phone, Mail, Clock, Building2, Trash2, AlertTriangle, Search } from 'lucide-react';

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
    // Note: In a real app you'd have a deleteLead method. Here we just filter in state
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Mensagens e Leads</h1>
          <p className="text-slate-400 text-sm mt-1">
            {leads.length} mensagem{leads.length !== 1 ? 's' : ''} recebida{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail, imóvel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
        />
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">Excluir esta mensagem?</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800 transition">Cancelar</button>
            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Excluir</button>
          </div>
        </div>
      )}

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            {leads.length === 0 ? 'Nenhuma mensagem recebida ainda.' : 'Nenhuma mensagem encontrada com essa busca.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{lead.name}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(lead.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-gold-400 transition">
                      <Phone className="w-3.5 h-3.5 text-gold-400" /> {lead.phone}
                    </a>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-gold-400 transition">
                      <Mail className="w-3.5 h-3.5 text-gold-400" /> {lead.email}
                    </a>
                  </div>

                  {lead.propertyTitle && (
                    <div className="flex items-center gap-1.5 text-xs text-gold-400 font-medium">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Interesse em: {lead.propertyTitle}</span>
                    </div>
                  )}

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mt-2">
                    <p className="text-slate-300 text-xs leading-relaxed">{lead.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {lead.phone && (
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, recebi sua mensagem sobre imóveis. Como posso ajudá-lo?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold transition"
                    >
                      WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => setDeleteId(lead.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
