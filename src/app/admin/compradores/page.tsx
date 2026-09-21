'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Trash2,
  AlertTriangle,
  Plus,
  MessageCircle,
  MapPin,
  DollarSign,
  Home,
  User,
  Phone,
  Tag,
  ChevronDown,
} from 'lucide-react';

interface Comprador {
  id: string;
  nome: string;
  whatsapp: string;
  bairro_interesse: string;
  orcamento: string;
  tipo_imovel: string;
  origem: string;
  created_at: string;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatWhatsApp(raw: string): string {
  return raw.replace(/\D/g, '');
}

const TIPOS_IMOVEL = ['Apartamento', 'Casa', 'Terreno', 'Comercial', 'Cobertura', 'Studio', 'Outros'];
const ORIGENS = ['Instagram', 'Indicação', 'Site', 'WhatsApp', 'Facebook', 'Placa', 'Outros'];

const EMPTY_FORM = {
  nome: '',
  whatsapp: '',
  bairro_interesse: '',
  orcamento: '',
  tipo_imovel: '',
  origem: '',
};

export default function CompradoresPage() {
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [filtered, setFiltered] = useState<Comprador[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [tableNotFound, setTableNotFound] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadCompradores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compradores', { cache: 'no-store' });
      const data = await res.json();
      if (data.tableNotFound) {
        setTableNotFound(true);
        setCompradores([]);
      } else {
        setCompradores(data.compradores || []);
      }
    } catch {
      setErrorMsg('Erro ao carregar compradores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompradores();
  }, [loadCompradores]);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(compradores);
    } else {
      setFiltered(
        compradores.filter(
          (c) =>
            c.nome?.toLowerCase().includes(q) ||
            c.bairro_interesse?.toLowerCase().includes(q) ||
            c.whatsapp?.includes(q) ||
            c.tipo_imovel?.toLowerCase().includes(q) ||
            c.origem?.toLowerCase().includes(q)
        )
      );
    }
  }, [compradores, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.whatsapp.trim()) {
      setErrorMsg('Nome e WhatsApp sao obrigatorios.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/compradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || 'Erro ao salvar comprador.');
        return;
      }
      const novo: Comprador = await res.json();
      setCompradores((prev) => [novo, ...prev]);
      setForm(EMPTY_FORM);
      setSuccessMsg('Comprador adicionado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrorMsg('Erro ao salvar comprador.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/compradores?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCompradores((prev) => prev.filter((c) => c.id !== id));
        setDeleteId(null);
      } else {
        setErrorMsg('Erro ao excluir comprador.');
      }
    } catch {
      setErrorMsg('Erro ao excluir comprador.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
            Compradores
          </h1>
          <p className="text-stone-600 text-sm mt-1 font-medium">
            {compradores.length} comprador{compradores.length !== 1 ? 'es' : ''} cadastrado{compradores.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Alerta tabela nao encontrada */}
      {tableNotFound && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 text-sm font-semibold flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Tabela nao encontrada no Supabase</p>
            <p className="font-normal mt-1">
              Execute o seguinte SQL no Supabase para criar a tabela:
            </p>
            <pre className="mt-2 bg-amber-100 rounded-lg p-3 text-xs overflow-x-auto font-mono text-amber-950 whitespace-pre-wrap">
{`CREATE TABLE compradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  whatsapp text NOT NULL,
  bairro_interesse text,
  orcamento text,
  tipo_imovel text,
  origem text,
  created_at timestamp with time zone DEFAULT now()
);`}
            </pre>
          </div>
        </div>
      )}

      {/* Mensagens de feedback */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Formulario de adicionar */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100 bg-stone-50">
          <Plus className="w-4 h-4 text-stone-700" />
          <h2 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Adicionar Comprador</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5" /> Nome *
            </label>
            <input
              type="text"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              required
              className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-stone-950 font-medium"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" /> WhatsApp *
            </label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={form.whatsapp}
              onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
              required
              className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-stone-950 font-medium"
            />
          </div>

          {/* Bairro */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" /> Bairro de Interesse
            </label>
            <input
              type="text"
              placeholder="Ex: Jardim, Centro..."
              value={form.bairro_interesse}
              onChange={(e) => setForm((p) => ({ ...p, bairro_interesse: e.target.value }))}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-stone-950 font-medium"
            />
          </div>

          {/* Orcamento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" /> Orcamento
            </label>
            <input
              type="text"
              placeholder="Ex: ate R$ 500.000"
              value={form.orcamento}
              onChange={(e) => setForm((p) => ({ ...p, orcamento: e.target.value }))}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-stone-950 font-medium"
            />
          </div>

          {/* Tipo imovel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" /> Tipo de Imovel
            </label>
            <div className="relative">
              <select
                value={form.tipo_imovel}
                onChange={(e) => setForm((p) => ({ ...p, tipo_imovel: e.target.value }))}
                className="w-full appearance-none bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-950 font-medium pr-8"
              >
                <option value="">Selecionar...</option>
                {TIPOS_IMOVEL.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Origem */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Origem
            </label>
            <div className="relative">
              <select
                value={form.origem}
                onChange={(e) => setForm((p) => ({ ...p, origem: e.target.value }))}
                className="w-full appearance-none bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-950 focus:outline-none focus:border-stone-950 font-medium pr-8"
              >
                <option value="">Selecionar...</option>
                {ORIGENS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white text-sm font-extrabold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Adicionar Comprador'}
            </button>
          </div>
        </form>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar por nome, bairro, WhatsApp, tipo de imovel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
        />
      </div>

      {/* Confirmacao de delete */}
      {deleteId && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
            <p className="text-sm font-bold">Excluir este comprador permanentemente?</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDelete(deleteId)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition"
            >
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* Tabela */}
      {loading ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <p className="text-stone-600 text-sm font-bold">Carregando compradores...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl shadow-sm space-y-3">
          <Users className="w-12 h-12 text-stone-300 mx-auto" />
          <p className="text-stone-700 text-sm font-bold">
            {compradores.length === 0
              ? 'Nenhum comprador cadastrado ainda.'
              : 'Nenhum comprador encontrado para esta busca.'}
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Use o formulario acima para adicionar o primeiro comprador ao seu banco de leads.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Cabecalho da tabela - desktop */}
          <div className="hidden md:grid grid-cols-[1fr_140px_140px_120px_100px_90px_auto] gap-4 px-6 py-3 border-b border-stone-100 bg-stone-50">
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Nome</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">WhatsApp</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Bairro</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Orcamento</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Tipo</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Origem</span>
            <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">Acoes</span>
          </div>

          <div className="divide-y divide-stone-100">
            {filtered.map((c) => {
              const whatsNum = formatWhatsApp(c.whatsapp);
              const waLink = `https://wa.me/55${whatsNum}?text=${encodeURIComponent(`Ola ${c.nome}, sou o Sergio Colussi Corretor. Vi que voce esta procurando ${c.tipo_imovel || 'um imovel'} no bairro ${c.bairro_interesse || 'de Santo Andre'}. Posso te ajudar!`)}`;

              return (
                <div key={c.id} className="px-6 py-4 hover:bg-stone-50 transition-colors">
                  {/* Mobile layout */}
                  <div className="flex flex-col gap-2 md:hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-stone-950 text-sm">{c.nome}</p>
                        <p className="text-xs text-stone-500 font-mono">{c.whatsapp}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-extrabold uppercase tracking-wide transition shadow-sm flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="p-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-700 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {c.bairro_interesse && (
                        <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-1 rounded-lg font-semibold">
                          <MapPin className="w-3 h-3" /> {c.bairro_interesse}
                        </span>
                      )}
                      {c.tipo_imovel && (
                        <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-1 rounded-lg font-semibold">
                          <Home className="w-3 h-3" /> {c.tipo_imovel}
                        </span>
                      )}
                      {c.orcamento && (
                        <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-1 rounded-lg font-semibold">
                          <DollarSign className="w-3 h-3" /> {c.orcamento}
                        </span>
                      )}
                      {c.origem && (
                        <span className="flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-1 rounded-lg font-semibold">
                          <Tag className="w-3 h-3" /> {c.origem}
                        </span>
                      )}
                      <span className="text-stone-400 font-mono text-[10px] self-center">{formatDate(c.created_at)}</span>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_140px_140px_120px_100px_90px_auto] gap-4 items-center">
                    <div>
                      <p className="font-bold text-stone-950 text-sm truncate">{c.nome}</p>
                      <p className="text-[10px] text-stone-400 font-mono">{formatDate(c.created_at)}</p>
                    </div>
                    <p className="text-xs text-stone-700 font-mono truncate">{c.whatsapp}</p>
                    <p className="text-xs text-stone-700 font-semibold truncate">{c.bairro_interesse || '—'}</p>
                    <p className="text-xs text-stone-700 font-semibold truncate">{c.orcamento || '—'}</p>
                    <p className="text-xs text-stone-700 font-semibold truncate">{c.tipo_imovel || '—'}</p>
                    <p className="text-xs text-stone-700 font-semibold truncate">{c.origem || '—'}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-extrabold uppercase tracking-wide transition shadow-sm flex items-center gap-1.5"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WA</span>
                      </a>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="p-2 rounded-xl border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-700 transition"
                        title="Excluir comprador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}