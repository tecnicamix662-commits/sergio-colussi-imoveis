'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyService } from '@/services/propertyService';
import { Property, LeadSubmission } from '@/types/property';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Building2, PlusCircle, Star, Tag, Users, TrendingUp,
  ArrowRight, Settings, MessageSquare, Globe, Eye,
  CheckSquare, Clock, BadgeCheck,
} from 'lucide-react';

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function StatCard({ icon: Icon, label, value, sub, href, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
  color: string;
}) {
  const inner = (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-4 hover:border-stone-950 transition-all shadow-sm group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-stone-200 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-stone-950 text-2xl font-extrabold mt-0.5">{value}</p>
        {sub && <p className="text-stone-600 text-[11px] font-medium mt-0.5">{sub}</p>}
      </div>
      {href && <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-950 ml-auto shrink-0 mt-1 transition" />}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const { settings } = useSettings();

  const loadData = () => {
    setProperties(PropertyService.getProperties());
    setLeads(PropertyService.getLeads());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('properties_updated', loadData);
    return () => window.removeEventListener('properties_updated', loadData);
  }, []);

  const totalCount = properties.length;
  const activeCount = properties.filter((p) => p.active).length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const soldCount = properties.filter((p) => p.status === 'vendido').length;
  const totalValue = properties.filter((p) => p.active).reduce((sum, p) => sum + p.price, 0);
  const recentLeads = leads.slice(0, 5);

  const quickActions = [
    { label: 'Cadastrar Imóvel', href: '/admin/imoveis/novo', icon: PlusCircle, color: 'bg-stone-100 text-stone-950' },
    { label: 'Gerenciar Imóveis', href: '/admin/imoveis', icon: Building2, color: 'bg-stone-100 text-stone-950' },
    { label: 'Configurações', href: '/admin/configuracoes', icon: Settings, color: 'bg-stone-100 text-stone-950' },
    { label: 'Ver Mensagens', href: '/admin/mensagens', icon: MessageSquare, color: 'bg-stone-100 text-stone-950' },
    { label: 'Ver Site Público', href: '/', icon: Globe, color: 'bg-stone-100 text-stone-950', external: true },
  ];

  return (
    <div className="space-y-8 bg-stone-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-stone-600 text-sm mt-1 font-medium">
            Bem-vindo, <strong className="text-stone-950">{settings.realtorName}</strong>. Aqui está o resumo do seu portal imobiliário.
          </p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Cadastrar Imóvel</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total de Imóveis" value={totalCount} sub={`${activeCount} ativos`} href="/admin/imoveis" color="bg-stone-100 text-stone-950" />
        <StatCard icon={CheckSquare} label="Disponíveis" value={activeCount} sub="visíveis no site" href="/admin/imoveis" color="bg-emerald-50 text-emerald-800" />
        <StatCard icon={Star} label="Em Destaque" value={featuredCount} sub="na página inicial" href="/admin/imoveis" color="bg-amber-50 text-amber-900" />
        <StatCard icon={Tag} label="Vendidos" value={soldCount} sub="marcados como vendido" href="/admin/imoveis" color="bg-red-50 text-red-800" />
        <StatCard icon={Users} label="Mensagens" value={leads.length} sub="contatos recebidos" href="/admin/mensagens" color="bg-blue-50 text-blue-900" />
        <StatCard icon={TrendingUp} label="Portfólio Ativo" value={formatCurrency(totalValue)} sub="valor total dos imóveis" color="bg-purple-50 text-purple-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <h2 className="font-serif text-base font-bold text-stone-950">Ações Rápidas</h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:border-stone-400 transition group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-stone-200 ${action.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-stone-900 group-hover:text-black text-sm font-bold transition">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-black ml-auto transition" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-stone-950">Últimas Mensagens</h2>
            <Link href="/admin/mensagens" className="text-xs text-stone-950 font-bold hover:underline transition flex items-center gap-1">
              <span>Ver todas</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-stone-600 text-xs font-semibold">Nenhuma mensagem recebida ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-950 text-xs font-bold">{lead.name}</p>
                    {lead.propertyTitle && (
                      <p className="text-stone-800 text-[11px] font-semibold truncate">Interesse em: {lead.propertyTitle}</p>
                    )}
                    <p className="text-stone-600 text-[11px] truncate mt-0.5 font-medium">{lead.message}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-stone-950">Imóveis Recentes</h2>
          <Link href="/admin/imoveis" className="text-xs text-stone-950 font-bold hover:underline transition flex items-center gap-1">
            <span>Gerenciar todos</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {properties.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-400 transition">
              <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                {p.mainImage ? (
                  <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-stone-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-stone-950 text-xs font-bold truncate">{p.title}</p>
                <p className="text-stone-600 text-[11px] font-medium">{p.code} · {p.neighborhood}, {p.city}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.featured && <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  p.active
                    ? 'text-emerald-900 bg-emerald-50 border-emerald-300'
                    : 'text-stone-700 bg-stone-100 border-stone-300'
                }`}>
                  {p.active ? 'Ativo' : 'Inativo'}
                </span>
                <span className="text-stone-950 text-xs font-extrabold">{formatCurrency(p.price)}</span>
                <Link href={`/admin/imoveis/${p.id}/editar`} className="text-stone-700 hover:text-black text-[11px] font-bold transition ml-1">Editar</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
