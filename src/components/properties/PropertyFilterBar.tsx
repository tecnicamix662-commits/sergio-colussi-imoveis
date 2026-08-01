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

export const ALL_TYPES_IN_ORDER = [
  { value: 'area_corporativa', label: 'Área Corporativa' },
  { value: 'area', label: 'Área' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'casa_assobradada', label: 'Casa Assobradada' },
  { value: 'casa_comercial', label: 'Casa Comercial' },
  { value: 'casa_condominio', label: 'Casa em Condomínio' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'kitnet', label: 'Kitnet / Studio' },
  { value: 'loja', label: 'Loja' },
  { value: 'predio', label: 'Prédio' },
  { value: 'salao', label: 'Salão' },
  { value: 'sobrado', label: 'Sobrado' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'terreno', label: 'Terreno' },
];

export const TYPE_LABELS: Record<string, string> = ALL_TYPES_IN_ORDER.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {} as Record<string, string>);

const PRIORITY_CITIES = [
  'Santo André',
  'São Bernardo do Campo',
  'Mauá',
  'São Caetano do Sul',
  'São Paulo',
];

const DEFAULT_NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  'Santo André': [
    'Bairro Jardim',
    'Campestre',
    'Vila Assunção',
    'Vila Gilda',
    'Vila Bastos',
    'Parque das Nações',
    'Vila Valparaíso',
    'Vila Metalúrgica',
    'Utinga',
    'Santa Maria',
    'Vila Alpina',
    'Centro',
  ],
  'São Bernardo do Campo': [
    'Swiss Park',
    'Nova Petrópolis',
    'Anchieta',
    'Rudge Ramos',
    'Baeta Neves',
    'Demarchi',
    'Assunção',
    'Paulicéia',
    'Jardim Maracanã',
    'Centro',
  ],
  'Mauá': [
    'Vila Bocaina',
    'Jardim Guapituba',
    'Parque São Vicente',
    'Vila Noêmia',
    'Matriz',
    'Centro',
  ],
  'São Caetano do Sul': [
    'Santa Maria',
    'Santo Antônio',
    'Jardim São Caetano',
    'Barcelona',
    'Santa Paula',
    'Centro',
  ],
};

export default function PropertyFilterBar({ onFilterChange, compact = false, initialFilters }: PropertyFilterBarProps) {
  // State for the 4 interlinked filters
  const [type, setType] = useState<string>(initialFilters?.type || 'todos');
  const [city, setCity] = useState<string>(initialFilters?.city || 'todas');
  const [neighborhood, setNeighborhood] = useState<string>(initialFilters?.neighborhood || 'todos');
  const [condominium, setCondominium] = useState<string>(initialFilters?.condominium || 'todos');

  // Secondary advanced filters
  const [minPrice, setMinPrice] = useState<string>(initialFilters?.minPrice ? String(initialFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters?.maxPrice ? String(initialFilters.maxPrice) : '');
  const [bedrooms, setBedrooms] = useState<string>(initialFilters?.bedrooms ? String(initialFilters.bedrooms) : 'todos');
  const [parking, setParking] = useState<string>(initialFilters?.parking ? String(initialFilters.parking) : 'todos');
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.searchQuery || '');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Property list reactive trigger (updates when properties are added/edited in admin)
  const [propertiesVersion, setPropertiesVersion] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => setPropertiesVersion((v) => v + 1);
    window.addEventListener('properties_updated', handleUpdate);
    return () => window.removeEventListener('properties_updated', handleUpdate);
  }, []);

  // Get active properties for dynamic filter options
  const activeProperties = useMemo(() => {
    return PropertyService.getActiveProperties();
    // eslint-disable-next-deps
  }, [propertiesVersion]);

  // 1. Available Types
  const availableTypes = useMemo(() => {
    const activeTypesSet = new Set<string>();
    activeProperties.forEach((p) => p.type && activeTypesSet.add(p.type));
    
    const list = [...ALL_TYPES_IN_ORDER];
    activeTypesSet.forEach((t) => {
      if (!list.some((item) => item.value === t)) {
        list.push({ value: t, label: t });
      }
    });
    return list;
  }, [activeProperties]);

  // 2. Available Cities (in priority order: Santo André, São Bernardo do Campo, Mauá, São Caetano do Sul, São Paulo)
  const availableCities = useMemo(() => {
    const filtered = activeProperties.filter((p) => {
      if (type !== 'todos' && p.type !== type) return false;
      return true;
    });
    const foundCitiesSet = new Set<string>();
    filtered.forEach((p) => p.city && foundCitiesSet.add(p.city));

    const result: string[] = [];
    PRIORITY_CITIES.forEach((c) => {
      result.push(c);
      foundCitiesSet.delete(c);
    });

    const remaining = Array.from(foundCitiesSet).sort();
    return [...result, ...remaining];
  }, [activeProperties, type]);

  // 3. Available Neighborhoods (Strictly separated per selected city)
  const availableNeighborhoods = useMemo(() => {
    const set = new Set<string>();

    if (city !== 'todas' && city !== 'Todas') {
      // Strict filter: ONLY neighborhoods for the selected city
      const presets = DEFAULT_NEIGHBORHOODS_BY_CITY[city];
      if (presets) {
        presets.forEach((n) => set.add(n));
      }

      const filteredProperties = activeProperties.filter(
        (p) => p.city.toLowerCase() === city.toLowerCase()
      );
      filteredProperties.forEach((p) => p.neighborhood && set.add(p.neighborhood));
    } else {
      // All cities selected
      activeProperties.forEach((p) => p.neighborhood && set.add(p.neighborhood));
      Object.values(DEFAULT_NEIGHBORHOODS_BY_CITY).forEach((arr) => {
        arr.forEach((n) => set.add(n));
      });
    }

    return Array.from(set).sort();
  }, [activeProperties, city]);

  // 4. Available Condominiums
  const availableCondominiums = useMemo(() => {
    const filtered = activeProperties.filter((p) => {
      if (type !== 'todos' && p.type !== type) return false;
      if (city !== 'todas' && city !== 'Todas' && p.city.toLowerCase() !== city.toLowerCase()) return false;
      if (neighborhood !== 'todos' && p.neighborhood.toLowerCase() !== neighborhood.toLowerCase()) return false;
      return true;
    });
    const set = new Set<string>();
    filtered.forEach((p) => p.condominium && set.add(p.condominium));
    return Array.from(set).sort();
  }, [activeProperties, type, city, neighborhood]);

  // Cascading Reset when parent filter changes
  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setNeighborhood('todos'); // Reset neighborhood when city changes
    setCondominium('todos');  // Reset condo when city changes
  };

  const handleNeighborhoodChange = (newNeighborhood: string) => {
    setNeighborhood(newNeighborhood);
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
      {/* 
        EXACT SEQUENCE (DESKTOP: Left to Right | MOBILE: Top to Bottom):
        TIPO ➔ CIDADE ➔ BAIRROS ➔ CONDOMÍNIOS ➔ BUSCAR IMÓVEIS
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
        {/* TIPO */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gold-400" /> Tipo
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-white text-xs font-semibold focus:outline-none focus:border-gold-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            {availableTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
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
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* BAIRROS */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-gold-400" /> Bairros
          </label>
          <select
            value={neighborhood}
            onChange={(e) => handleNeighborhoodChange(e.target.value)}
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

        {/* BOTÃO BUSCAR IMÓVEIS - HIGH VISIBILITY GOLD & BLACK BUTTON */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-glow-gold flex items-center justify-center gap-2 border border-amber-300 cursor-pointer"
          >
            <Search className="w-4 h-4 text-stone-950 shrink-0 stroke-[2.5]" />
            <span className="text-stone-950 font-black tracking-wider text-xs">BUSCAR IMÓVEIS</span>
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
