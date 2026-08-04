'use client';

import { useState, useEffect } from 'react';
import { NeighborhoodService, OFFICIAL_NEIGHBORHOODS_BY_CITY } from '@/services/neighborhoodService';
import { MapPin, Plus, Trash2, Home, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminBairrosPage() {
  const [selectedCity, setSelectedCity] = useState<string>('Santo André');
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [newNeighborhood, setNewNeighborhood] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadNeighborhoods = (city: string) => {
    const list = NeighborhoodService.getNeighborhoodsByCity(city);
    setNeighborhoods(list);
  };

  useEffect(() => {
    loadNeighborhoods(selectedCity);
  }, [selectedCity]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNeighborhood.trim()) return;

    const success = NeighborhoodService.addNeighborhood(selectedCity, newNeighborhood.trim());
    if (success) {
      setMessage({ text: `Bairro "${newNeighborhood.trim()}" salvo com sucesso para ${selectedCity}!`, type: 'success' });
      setNewNeighborhood('');
      loadNeighborhoods(selectedCity);
    } else {
      setMessage({ text: `O bairro "${newNeighborhood.trim()}" já está cadastrado em ${selectedCity}.`, type: 'error' });
    }
  };

  const handleRemove = (name: string) => {
    if (confirm(`Tem certeza que deseja remover o bairro "${name}" da lista de ${selectedCity}?`)) {
      NeighborhoodService.removeNeighborhood(selectedCity, name);
      setMessage({ text: `Bairro "${name}" removido com sucesso.`, type: 'success' });
      loadNeighborhoods(selectedCity);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl bg-stone-50 min-h-full">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-stone-950" />
          Gerenciamento de Bairros Oficial
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 font-medium">
          Administre a lista completa de bairros por cidade para manter a busca do site e o cadastro de imóveis sempre atualizados.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xs ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* City Selector */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600 block">
          1. Selecione a Cidade para Visualizar e Gerenciar os Bairros:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Santo André', 'São Bernardo do Campo', 'Mauá', 'São Caetano do Sul'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                setSelectedCity(city);
                setMessage(null);
              }}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
                selectedCity === city
                  ? 'bg-stone-950 text-white border-stone-950 shadow-md'
                  : 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Form Add Bairro */}
      <form onSubmit={handleAdd} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
        <label className="text-xs font-extrabold uppercase tracking-wider text-stone-900 block">
          2. Adicionar Novo Bairro em {selectedCity}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Digite o nome do novo bairro (ex: Parque João Ramalho)..."
            value={newNeighborhood}
            onChange={(e) => setNewNeighborhood(e.target.value)}
            className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-950 placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-stone-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Salvar Bairro</span>
          </button>
        </div>
      </form>

      {/* Neighborhoods List */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <h2 className="text-sm font-bold text-stone-950 flex items-center gap-2">
            <Home className="w-4 h-4 text-stone-900" />
            Bairros Cadastrados em {selectedCity} ({neighborhoods.length})
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {OFFICIAL_NEIGHBORHOODS_BY_CITY[selectedCity]?.length || 0} bairros oficiais pré-carregados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {neighborhoods.map((n) => (
            <div
              key={n}
              className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-950 font-bold hover:border-stone-400 transition-colors group shadow-2xs"
            >
              <span className="truncate">{n}</span>
              <button
                type="button"
                onClick={() => handleRemove(n)}
                title="Remover Bairro"
                className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
