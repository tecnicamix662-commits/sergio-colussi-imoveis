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
      setMessage({ text: `Bairro "${newNeighborhood.trim()}" adicionado com sucesso para ${selectedCity}!`, type: 'success' });
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-7 h-7 text-gold-400" />
          Gerenciamento de Bairros Oficial
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Administre a lista completa de bairros por cidade para manter a busca do site e o cadastro sempre atualizados.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* City Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <label className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
          Selecione a Cidade para Visualizar e Gerenciar os Bairros:
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
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border text-center ${
                selectedCity === city
                  ? 'bg-gold-500/20 border-gold-500/50 text-gold-400 shadow-glow-gold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Form Add Bairro */}
      <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Adicionar Novo Bairro em {selectedCity}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Digite o nome do novo bairro..."
            value={newNeighborhood}
            onChange={(e) => setNewNeighborhood(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gold-gradient text-stone-950 font-extrabold text-xs uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </form>

      {/* Neighborhoods List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Home className="w-4 h-4 text-gold-400" />
            Bairros Cadastrados ({neighborhoods.length}) em {selectedCity}
          </h2>
          <span className="text-[11px] text-slate-400">
            {OFFICIAL_NEIGHBORHOODS_BY_CITY[selectedCity]?.length || 0} bairros oficiais pré-carregados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {neighborhoods.map((n) => (
            <div
              key={n}
              className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 hover:border-slate-700 transition-colors group"
            >
              <span className="font-medium truncate">{n}</span>
              <button
                type="button"
                onClick={() => handleRemove(n)}
                title="Remover Bairro"
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-opacity"
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
