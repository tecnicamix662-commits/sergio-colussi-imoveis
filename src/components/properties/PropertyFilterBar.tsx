'use client';

import { useState, useEffect, useMemo } from 'react';
import { PropertyFilterParams, PropertyType } from '@/types/property';
import { PropertyService } from '@/services/propertyService';
import { NeighborhoodService } from '@/services/neighborhoodService';
import { Search, Building2, MapPin, Home, Shield, RotateCcw, SlidersHorizontal, DollarSign, Bed, Car } from 'lucide-react';

interface PropertyFilterBarProps {
  onFilterChange: (filters: PropertyFilterParams) => void;
  compact?: boolean;
  initialFilters?: PropertyFilterParams;
}

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
    window.addEventListener('neighborhoods_updated', handleUpdate);
    return () => {
      window.removeEventListener('properties_updated', handleUpdate);
      window.removeEventListener('neighborhoods_updated', handleUpdate);
    };
  }, []);

  const activeProperties = useMemo(() => {
    return PropertyService.getActiveProperties();
    // eslint-disable-next-deps
  }, [propertiesVersion]);

  // Neighborhoods strictly dependent on selected city + registered official list
  const availableNeighborhoods = useMemo(() => {
    const officialList = NeighborhoodService.getNeighborhoodsByCity(city);
    const set = new Set<string>(officialList);

    if (city !== 'todas' && city !== 'Todas') {
      const activeForCity = activeProperties.filter((p) => p.city.toLowerCase() === city.toLowerCase());
      activeForCity.forEach((p) => p.neighborhood && set.add(p.neighborhood));
    } else {
      activeProperties.forEach((p) => p.neighborhood && set.add(p.neighborhood));
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [activeProperties, city]);

  // Condominiums available in active properties
  const availableCondominiums = useMemo(() => {
    const set = new Set<string>();
    
    let filteredProps = activeProperties;
    if (city !== 'todas' && city !== 'Todas') {
      filteredProps = filteredProps.filter((p) => p.city.toLowerCase() === city.toLowerCase());
    }
    
    filteredProps.forEach((p) => p.condominium && set.add(p.condominium));
    
    if (set.size === 0) {
      set.add('Condomínio Swiss Park');
      set.add('Edifício Neoclássico Figueiras');
      set.add('Residencial Jardinage');
      set.add('Residencial Barão de Mauá');
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [activeProperties, city]);

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
    <div className="w-full bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-xl space-y-5">
      {/* Title */}
      {!compact && (
        <div className="border-b border-stone-200 pb-3.5">
          <h2 className="text-base sm:text-lg font-serif font-bold text-stone-950 tracking-wide">
            Encontre o imóvel ideal para a sua família
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Selecione os filtros abaixo para encontrar as melhores opções no ABC Paulista
          </p>
        </div>
      )}

      {/* 
        EXACT SEQUENCE REQUIRED:
        1. TIPO ➔ 2. CIDADE ➔ 3. BAIRROS ➔ 4. CONDOMÍNIO ➔ 5. BUSCAR IMÓVEIS (FUNDO PRETO, TEXTO BRANCO)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* 1. TIPO */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-900 shrink-0" /> Tipo
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3.5 text-stone-900 text-xs font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="casa">Casa</option>
            <option value="sobrado">Sobrado</option>
            <option value="apartamento">Apartamento</option>
            <option value="sala_comercial">Sala Comercial</option>
            <option value="galpao">Galpão</option>
            <option value="terreno">Terreno</option>
            <option value="cobertura">Cobertura</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        {/* 2. CIDADE */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-900 shrink-0" /> Cidade
          </label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3.5 text-stone-900 text-xs font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors shadow-sm cursor-pointer"
          >
            <option value="todas">Todas as Cidades</option>
            <option value="Santo André">Santo André</option>
            <option value="São Bernardo do Campo">São Bernardo do Campo</option>
            <option value="Mauá">Mauá</option>
            <option value="São Caetano do Sul">São Caetano do Sul</option>
          </select>
        </div>

        {/* 3. BAIRROS */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-stone-900 shrink-0" /> Bairros
          </label>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3.5 text-stone-900 text-xs font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">
              {city !== 'todas' && city !== 'Todas' ? `Todos os Bairros de ${city}` : 'Todos os Bairros'}
            </option>
            {availableNeighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* 4. CONDOMÍNIOS */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-stone-900 shrink-0" /> Condomínio
          </label>
          <select
            value={condominium}
            onChange={(e) => setCondominium(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-3.5 text-stone-900 text-xs font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors shadow-sm cursor-pointer"
          >
            <option value="todos">Todos os Condomínios</option>
            {availableCondominiums.map((condo) => (
              <option key={condo} value={condo}>
                {condo}
              </option>
            ))}
          </select>
        </div>

        {/* 5. BOTÃO "PESQUISAR IMÓVEL" / "BUSCAR IMÓVEIS" (EXCEÇÃO: FUNDO PRETO, TEXTO BRANCO) */}
        <div className="w-full md:col-span-2 lg:col-span-1">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 rounded-xl bg-black hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-black cursor-pointer"
          >
            <Search className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Buscar Imóveis</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Toggle & Reset Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-stone-700 hover:text-black font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-900" />
          <span>{showAdvanced ? 'Ocultar Filtros Adicionais' : 'Mais Filtros (Preço, Quartos, Vagas, Código)'}</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors self-end sm:self-center cursor-pointer font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar Filtros</span>
        </button>
      </div>

      {/* Expanded Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-stone-200 animate-in fade-in duration-200">
          {/* Min & Max Price */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-stone-900" /> Faixa de Preço (R$)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-black"
              />
              <span className="text-stone-400">-</span>
              <input
                type="number"
                placeholder="Máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Bedrooms & Parking */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-stone-900" /> Quartos
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-black"
              >
                <option value="todos">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-stone-900" /> Vagas
              </label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-black"
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-stone-900" /> Palavra-Chave / Código
            </label>
            <input
              type="text"
              placeholder="Ex: SC-101, Piscina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:border-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
