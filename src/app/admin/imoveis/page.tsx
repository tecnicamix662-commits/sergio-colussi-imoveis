'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PropertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  CheckSquare,
  AlertTriangle,
  Loader2,
  Home,
  Building2,
  TrendingUp,
  Tag,
  ExternalLink,
  BadgeCheck,
  XCircle,
} from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  disponivel: { label: 'Disponível', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  vendido:    { label: 'Vendido',    color: 'text-red-400    bg-red-500/10    border-red-500/30' },
  alugado:    { label: 'Alugado',    color: 'text-blue-400   bg-blue-500/10   border-blue-500/30' },
  inativo:    { label: 'Inativo',    color: 'text-slate-400  bg-slate-800     border-slate-700' },
};

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function AdminImoveisPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterType, setFilterType] = useState<string>('todos');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const list = PropertyService.getProperties();
    setProperties(list);
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener('properties_updated', loadData);
    return () => window.removeEventListener('properties_updated', loadData);
  }, [loadData]);

  useEffect(() => {
    let list = [...properties];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'todos') {
      if (filterStatus === 'featured') {
        list = list.filter((p) => p.featured);
      } else {
        list = list.filter((p) => (p.status || (p.active ? 'disponivel' : 'inativo')) === filterStatus);
      }
    }
    if (filterType !== 'todos') {
      list = list.filter((p) => p.type === filterType);
    }
    setFiltered(list);
  }, [properties, search, filterStatus, filterType]);

  const handleToggleFeatured = async (id: string) => {
    PropertyService.toggleFeatured(id);
    loadData();
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'disponivel' ? 'inativo' : 'disponivel';
    PropertyService.updateProperty(id, {
      status: next as any,
      active: next === 'disponivel',
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    PropertyService.deleteProperty(id);
    setDeleteConfirm(null);
    loadData();
    setLoading(false);
  };

  const stats = {
    total: properties.length,
    disponiveis: properties.filter((p) => !p.status || p.status === 'disponivel').length,
    vendidos: properties.filter((p) => p.status === 'vendido').length,
    destaque: properties.filter((p) => p.featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Gerenciar Imóveis</h1>
          <p className="text-slate-400 text-sm mt-1">{properties.length} imóveis no banco de dados</p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Cadastrar Imóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: Building2, color: 'text-gold-400' },
          { label: 'Disponíveis', value: stats.disponiveis, icon: CheckSquare, color: 'text-emerald-400' },
          { label: 'Vendidos', value: stats.vendidos, icon: Tag, color: 'text-red-400' },
          { label: 'Em Destaque', value: stats.destaque, icon: Star, color: 'text-amber-400' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-[11px] uppercase tracking-wider">{s.label}</p>
                <p className="text-white text-xl font-bold">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por título, código, bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-gold-500"
        >
          <option value="todos">Todos os Status</option>
          <option value="disponivel">Disponível</option>
          <option value="vendido">Vendido</option>
          <option value="alugado">Alugado</option>
          <option value="inativo">Inativo</option>
          <option value="featured">Em Destaque</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-gold-500"
        >
          <option value="todos">Todos os Tipos</option>
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="cobertura">Cobertura</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Excluir imóvel permanentemente?</p>
              <p className="text-xs text-slate-400 mt-0.5">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800 transition">Cancelar</button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* Property List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Nenhum imóvel encontrado com os filtros aplicados.</p>
          <Link href="/admin/imoveis/novo" className="mt-4 inline-flex items-center gap-2 text-gold-400 text-xs hover:text-gold-300 transition">
            <PlusCircle className="w-3.5 h-3.5" /> Cadastrar primeiro imóvel
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const statusKey = p.status || (p.active ? 'disponivel' : 'inativo');
            const statusInfo = STATUS_LABELS[statusKey] || STATUS_LABELS['disponivel'];
            return (
              <div
                key={p.id}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 hover:border-slate-700 transition-colors"
              >
                {/* Thumb */}
                <div className="w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  {p.mainImage ? (
                    <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{p.code}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    {p.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/30 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" /> Destaque
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug truncate">{p.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{p.neighborhood}, {p.city} · {p.area}m² · {p.bedrooms} dorm · {p.parking} vaga{p.parking !== 1 ? 's' : ''}</p>
                  <p className="text-gold-400 font-bold text-sm mt-1">{formatCurrency(p.price)}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end justify-end">
                  <Link
                    href={`/admin/imoveis/${p.id}/editar`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Editar</span>
                  </Link>
                  <button
                    onClick={() => handleToggleFeatured(p.id)}
                    title={p.featured ? 'Remover Destaque' : 'Marcar como Destaque'}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      p.featured
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400'
                    }`}
                  >
                    {p.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{p.featured ? 'Destaque' : 'Destacar'}</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(p.id, statusKey)}
                    title={p.active ? 'Desativar' : 'Ativar'}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      p.active
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    {p.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{p.active ? 'Ativo' : 'Inativo'}</span>
                  </button>
                  <Link
                    href={`/imoveis/${p.slug || p.id}`}
                    target="_blank"
                    title="Ver no site"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-gold-400 text-xs font-medium transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ver Site</span>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    title="Excluir imóvel"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-medium transition border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
