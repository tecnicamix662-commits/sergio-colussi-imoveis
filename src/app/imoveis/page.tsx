'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { Property, PropertyFilterParams } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilterBar from '@/components/properties/PropertyFilterBar';
import { Building2, LayoutGrid, List, X } from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilterParams>({});
  const [sortOption, setSortOption] = useState<string>('recentes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Extract search query params on mount
    const initialPurpose = ((searchParams.get('finalidade') || searchParams.get('purpose')) as any) || undefined;
    const initialType = (searchParams.get('tipo') as any) || undefined;
    const initialCity = searchParams.get('cidade') || undefined;
    const initialNeighborhood = searchParams.get('bairro') || undefined;
    const initialCondo = searchParams.get('condominio') || undefined;
    const initialQ = searchParams.get('q') || undefined;

    const initialFilters: PropertyFilterParams = {
      purpose: initialPurpose,
      type: initialType,
      city: initialCity,
      neighborhood: initialNeighborhood,
      condominium: initialCondo,
      searchQuery: initialQ,
    };

    setFilters(initialFilters);
    loadData(initialFilters);

    const handleUpdate = () => loadData(filters);
    window.addEventListener('properties_updated', handleUpdate);
    return () => window.removeEventListener('properties_updated', handleUpdate);
  }, [searchParams]);

  const loadData = (currentFilters: PropertyFilterParams) => {
    const list = PropertyService.searchProperties(currentFilters);
    setProperties(list);
    applySort(list, sortOption);
  };

  const applySort = (list: Property[], sort: string) => {
    const sorted = [...list];
    if (sort === 'preco-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'preco-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'area-desc') {
      sorted.sort((a, b) => b.area - a.area);
    } else {
      // recentes
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setFilteredProperties(sorted);
  };

  const handleFilterChange = (newFilters: PropertyFilterParams) => {
    setFilters(newFilters);
    const results = PropertyService.searchProperties(newFilters);
    setProperties(results);
    applySort(results, sortOption);
  };

  const handleSortChange = (newSort: string) => {
    setSortOption(newSort);
    applySort(properties, newSort);
  };

  const activeFilterTags = [];
  if (filters.purpose) activeFilterTags.push({ key: 'purpose', label: `Finalidade: ${filters.purpose === 'venda' ? 'Compra' : 'Aluguel'}` });
  if (filters.type) activeFilterTags.push({ key: 'type', label: `Tipo: ${filters.type}` });
  if (filters.city) activeFilterTags.push({ key: 'city', label: `Cidade: ${filters.city}` });
  if (filters.neighborhood) activeFilterTags.push({ key: 'neighborhood', label: `Bairro: ${filters.neighborhood}` });
  if (filters.condominium) activeFilterTags.push({ key: 'condominium', label: `Condomínio: ${filters.condominium}` });
  if (filters.searchQuery) activeFilterTags.push({ key: 'searchQuery', label: `Busca: "${filters.searchQuery}"` });
  if (filters.minPrice) activeFilterTags.push({ key: 'minPrice', label: `Min: R$ ${filters.minPrice.toLocaleString()}` });
  if (filters.maxPrice) activeFilterTags.push({ key: 'maxPrice', label: `Max: R$ ${filters.maxPrice.toLocaleString()}` });
  if (filters.bedrooms) activeFilterTags.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Quartos` });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white">
      {/* Header Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-stone-900 text-xs font-bold uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-stone-900" />
          <span>Sérgio Colussi Imóveis no ABC Paulista</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          Catálogo Completo de Imóveis
        </h1>
        <p className="text-stone-700 text-base max-w-2xl font-medium">
          Filtre e descubra as melhores opções de imóveis em Santo André, Mauá e em toda a região do ABC Paulista.
        </p>
      </div>

      {/* Filter Component */}
      <PropertyFilterBar initialFilters={filters} onFilterChange={handleFilterChange} />

      {/* Active Filter Tags */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-stone-600 font-bold mr-1">Filtros Ativos:</span>
          {activeFilterTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-900 font-semibold text-xs px-3 py-1 rounded-lg"
            >
              <span>{tag.label}</span>
              <button
                onClick={() => {
                  const updated = { ...filters, [tag.key]: undefined };
                  handleFilterChange(updated);
                }}
                className="hover:text-black"
              >
                <X className="w-3.5 h-3.5 text-stone-700" />
              </button>
            </span>
          ))}
          <button
            onClick={() => handleFilterChange({})}
            className="text-xs text-stone-600 hover:text-black underline ml-2 font-medium"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}

      {/* Controls Bar (Results count, Sort, View mode) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <div className="text-xs text-stone-700 font-medium">
          Exibindo <span className="font-bold text-stone-950">{filteredProperties.length}</span> imóvei(s) encontrado(s)
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium hidden sm:inline">Ordenar por:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-black font-semibold"
            >
              <option value="recentes">Mais Recentes</option>
              <option value="preco-asc">Menor Preço</option>
              <option value="preco-desc">Maior Preço</option>
              <option value="area-desc">Maior Área (m²)</option>
            </select>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-black text-white' : 'text-stone-600 hover:text-black'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'text-stone-600 hover:text-black'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Cards Grid / List */}
      {filteredProperties.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'grid grid-cols-1 gap-6'
          }
        >
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-stone-50 p-16 rounded-3xl text-center space-y-4 max-w-2xl mx-auto border border-stone-200">
          <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-950">
            Nenhum imóvel atende aos critérios selecionados
          </h3>
          <p className="text-stone-600 text-xs leading-relaxed font-medium">
            Tente remover alguns filtros de busca ou entre em contato direto com Sérgio Colussi para verificar captações em andamento ainda não publicadas.
          </p>
          <button
            onClick={() => handleFilterChange({})}
            className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md"
          >
            Resetar Filtros de Busca
          </button>
        </div>
      )}
    </div>
  );
}

export default function PropertiesCatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">
        Carregando catálogo de imóveis...
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
