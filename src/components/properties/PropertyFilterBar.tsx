'use client';

import { useState, useEffect, useMemo } from 'react';
import { PropertyFilterParams, PropertyType } from '@/types/property';
import { PropertyService } from '@/services/propertyService';
import { Search, Building2, MapPin, Home, Shield, RotateCcw, SlidersHorizontal, DollarSign, Bed, Car } from 'lucide-react';

interface PropertyFilterBarProps {
  onFilterChange: (filters: PropertyFilterParams) => void;
  compact?: boolean;
  initialFilters?: PropertyFilterParams;
}

const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  'Santo André': [
    'Bairro Jardim',
    'Campestre',
    'Vila Assunção',
    'Vila Gilda',
    'Vila Bastos',
    'Parque das Nações',
    'Vila Valparaíso',
    'Centro',
  ],
  'São Bernardo do Campo': [
    'Swiss Park',
    'Nova Petrópolis',
    'Anchieta',
    'Rudge Ramos',
    'Baeta Neves',
    'Centro',
  ],
  'Mauá': [
    'Vila Bocaina',
    'Jardim Guapituba',
    'Parque São Vicente',
    'Centro',
  ],
  'São Caetano do Sul': [
    'Santa Maria',
    'Santo Antônio',
    'Jardim São Caetano',
    'Barcelona',
    'Centro',
  ],
};

export default function PropertyFilterBar({ onFilterChange, compact = false, initialFilters }: PropertyFilterBarProps) {
  const [type, setType] = useState<string>(initialFilters?.type || 'todos');
  const [city, setCity] = useState<string>(initialFilters?.city || 'todas');
  const [neighborhood, setNeighborhood] = useState<string>(initialFilters?.neighborhood || 'todos');
  const [condominium, setCondominium] = useState<string>(initialFilters?.condominium || 'todos');

  const [minPrice, setMinPrice] = useState<string>(initialFilters?.minPrice ? String(initialFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.maxPrice ? String(initialFilters.maxPrice) : '');
  const [bedrooms, setBedrooms] = useState<string>(initialFilters?.bedrooms ? String(initialFilters.bedrooms) : 'todos');
  const [parking, setParking] = useState<string>(initialFilters?.parking ? String(initialFilters.parking) : 'todos');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.searchQuery || '');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [propertiesVersion, setPropertiesVersion] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => setPropertiesVersion((v) => v + 1);
    window.addEventListener('properties_updated', handleUpdate);
    return () => window.removeEventListener('properties_updated', handleUpdate);
  }, []);

  const activeProperties = useMemo(() => {
    return PropertyService.getActiveProperties();
    // eslint-disable-next-deps
  }, [propertiesVersion]);

  // Neighborhoods strictly separated by selected city
  const availableNeighborhoods = useMemo(() => {
    const set = new Set<string>();

    if (city !== 'todas' && city !== 'Todas' && NEIGHBORHOODS_BY_CITY[city]) {
      NEIGHBORHOODS_BY_CITY[city].forEach((n) => set.add(n));
      const activeForCity = activeProperties.filter((p) => p.city.toLowerCase() === city.toLowerCase());
      activeForCity.forEach((p) => p.neighborhood && set.add(p.neighborhood));
    } else {
      activeProperties.forEach((p) => p.neighborhood && set.add(p.neighborhood));
      Object.values(NEIGHBORHOODS_BY_CITY).forEach((list) => list.forEach((n) => set.add(n)));
    }

    return Array.from(set).sort();
  }, [activeProperties, city]);

  // Condominiums
  const availableCondominiums = useMemo(() => {
    const set = new Set<string>();
    activeProperties.forEach((p) => p.condominium && set.add(p.condominium));
    if (set.size === 0) {
      set.add('Condomínio Swiss Park');
      set.add('Edifício Neoclássico Figueiras');
      set.add('Residencial Jardinage');
      set.add('Residencial Barão de Mauá');
    }
    return Array.from(set).sort();
  }, [activeProperties]);

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setNeighborhood('todos');
    setCondominium('todos');
  };

  const handleApply = () => {
    onFilterChange({
      type: type === 'todos' ? undefined : (type as PropertyType),
      city: city === 'todas' ? undefined : city,
      neighborhood: neighborhood === 'todos' ? undefined : neighborhood,
      condominium: condominium === 'todos' ? undefined : condominium,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms === 'todos' ? undefined : Number(bedrooms),
      parking: parking === 'todos' ? undefined : Number(parking),
      searchQuery: searchQuery.trim() || undefined,
    });
  };

  const handleReset = () => {
    setType('todos');
    setCity('todas');
    setNeighborhood('todos');
    setCondominium('todos');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('todos');
    setParking('todos');
    setSearchQuery('');
    onFilterChange({});
  };

  return (
    <div className="w-full glass-card p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
        {/* TIPO */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gold-400" /> Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-white text-xs font-semibold focus:outline-none focus:border-gold-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa / Mansão</option>
            <option value="cobertura">Cobertura</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        {/* CIDADE */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" /> Cidade
          </label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-white text-xs font-semibold focus:outline-none focus:border-gold-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="todas">Todas as Cidades</option>
            <option value="Santo André">Santo André</option>
            <option value="São Bernardo do Campo">São Bernardo do Campo</option>
            <option value="Mauá">Mauá</option>
            <option value="São Caetano do Sul">São Caetano do Sul</option>
            <option value="São Paulo">São Paulo</option>
          </select>
        </div>

        {/* BAIRROS */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-gold-400" /> Bairros
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-white text-xs font-semibold focus:outline-none focus:border-gold-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Bairros</option>
            {availableNeighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* CONDOMÍNIOS */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-gold-400" /> Condomínios
          </label>
          <select
            value={condominium}
            onChange={(e) => setCondominium(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-white text-xs font-semibold focus:outline-none focus:border-gold-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Condomínios</option>
            {availableCondominiums.map((condo) => (
              <option key={condo} value={condo}>
                {condo}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÃO BUSCAR IMÓVEIS */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 rounded-xl bg-gold-gradient hover:opacity-95 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-glow-gold flex items-center justify-center gap-2 border border-gold-400/40 cursor-pointer"
          >
            <Search className="w-4 h-4 text-stone-950" />
            <span>Buscar Imóveis</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-gold-400 flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
          <span>{showAdvanced ? 'Ocultar Filtros Adicionais' : 'Mais Filtros (Preço, Quartos, Vagas, Código)'}</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar Filtros</span>
        </button>
      </div>

      {/* Expanded Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
          {/* Min & Max Price */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-gold-400" /> Faixa de Preço (R$)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Bedrooms & Parking */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-gold-400" /> Quartos
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500"
              >
                <option value="todos">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-gold-400" /> Vagas
              </label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-500"
              >
                <option value="todos">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Search Query */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-gold-400" /> Palavra-Chave / Código
            </label>
            <input
              type="text"
              placeholder="Ex: SC-101, Piscina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
