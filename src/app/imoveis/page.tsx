'use client';
import { formatCurrency } from '@/lib/format';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PropertyService } from '@/services/propertyService';
import { Property, PropertyFilterParams } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilterBar from '@/components/properties/PropertyFilterBar';
import { Building2, LayoutGrid, List, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.827.737 5.484 2.027 7.793L0 32l8.445-2.012A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.266 13.266 0 01-6.757-1.845l-.485-.287-5.01 1.194 1.27-4.878-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.928c-.398-.199-2.356-1.162-2.72-1.295-.365-.133-.63-.199-.896.2-.265.397-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.232-.398-.025-.613.175-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.958-.323-.778-.65-.672-.896-.684l-.763-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.954.304 1.823.261 2.51.158.765-.114 2.356-.963 2.688-1.894.333-.93.333-1.728.233-1.894-.1-.166-.365-.265-.763-.465z"/>
    </svg>
  );
}

function CatalogContent() {
  const { settings } = useSettings();
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
    const initialIsLaunch = searchParams.get('lancamentos') === 'sim' || searchParams.get('status') === 'lancamento' ? true : undefined;
    const initialIsReadyToMove = searchParams.get('pronto') === 'sim' ? true : undefined;

    const initialFilters: PropertyFilterParams = {
      purpose: initialPurpose,
      type: initialType,
      city: initialCity,
      neighborhood: initialNeighborhood,
      condominium: initialCondo,
      searchQuery: initialQ,
      isLaunchOnly: initialIsLaunch,
      isReadyToMoveOnly: initialIsReadyToMove,
    };

    setFilters(initialFilters);

    // Sincroniza com o banco na nuvem antes de carregar os imóveis
    const initLoad = async () => {
      await PropertyService.syncWithServer();
      loadData(initialFilters);
    };
    initLoad();

    const handleUpdate = () => loadData(initialFilters);
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
    sorted.sort((a, b) => {
      // Fixa imóveis em Destaque em 1º lugar no topo sem saírem do lugar
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (sort === 'preco-asc') {
        return a.price - b.price;
      } else if (sort === 'preco-desc') {
        return b.price - a.price;
      } else if (sort === 'area-desc') {
        return b.area - a.area;
      } else {
        // recentes
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
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

  const launchWhatsappMsg = `Olá ${settings.realtorName}, gostaria de receber novidades e informações em primeira mão sobre os próximos lançamentos e empreendimentos no ABC Paulista!`;
  const launchWhatsappUrl = SettingsService.getWhatsAppUrl(settings, launchWhatsappMsg);

  const activeFilterTags = [];
  if (filters.purpose) activeFilterTags.push({ key: 'purpose', label: `Finalidade: ${filters.purpose === 'venda' ? 'Compra' : 'Aluguel'}` });
  if (filters.isLaunchOnly) activeFilterTags.push({ key: 'isLaunchOnly', label: 'Empreendimentos / Lançamentos' });
  if (filters.isReadyToMoveOnly) activeFilterTags.push({ key: 'isReadyToMoveOnly', label: 'Pronto para Morar' });
  if (filters.type) activeFilterTags.push({ key: 'type', label: `Tipo: ${filters.type}` });
  if (filters.city) activeFilterTags.push({ key: 'city', label: `Cidade: ${filters.city}` });
  if (filters.neighborhood) activeFilterTags.push({ key: 'neighborhood', label: `Bairro: ${filters.neighborhood}` });
  if (filters.condominium) activeFilterTags.push({ key: 'condominium', label: `Condomínio: ${filters.condominium}` });
  if (filters.searchQuery) activeFilterTags.push({ key: 'searchQuery', label: `Busca: "${filters.searchQuery}"` });
  if (filters.minPrice) activeFilterTags.push({ key: 'minPrice', label: `Mín: ${formatCurrency(filters.minPrice)}` });
  if (filters.maxPrice) activeFilterTags.push({ key: 'maxPrice', label: `Máx: ${formatCurrency(filters.maxPrice)}` });
  if (filters.bedrooms) activeFilterTags.push({ key: 'bedrooms', label: `${filters.bedrooms}+ Quartos` });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white">
      {/* Header Title */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-stone-900 text-xs font-bold uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-stone-900" />
          <span>Sérgio Colussi • Imóveis no ABC Paulista</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          {filters.isLaunchOnly ? 'Lançamentos e Empreendimentos' : filters.isReadyToMoveOnly ? 'Prontos para Morar' : 'Imóveis à Venda'}
        </h1>
        <p className="text-stone-700 text-base max-w-2xl font-medium">
          {filters.isLaunchOnly
            ? 'Confira os lançamentos, empreendimentos e imóveis novos na planta ou recém-construídos no ABC Paulista.'
            : filters.isReadyToMoveOnly
            ? 'Imóveis prontos para morar, com entrega imediata, em Santo André, São Bernardo do Campo e região.'
            : 'Confira as opções de apartamentos, casas e imóveis comerciais disponíveis em Santo André, São Bernardo do Campo e região.'}
        </p>
      </div>

      {/* Filter Component */}
      {!filters.isLaunchOnly && (
        <PropertyFilterBar initialFilters={filters} onFilterChange={handleFilterChange} />
      )}

      {/* Active Filter Tags */}
      {!filters.isLaunchOnly && activeFilterTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-stone-600 font-bold mr-1">Filtros ativos:</span>
          {activeFilterTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center gap-1.5 bg-stone-100 border border-stone-300 text-stone-900 font-semibold text-xs px-3 py-1 rounded-lg whitespace-nowrap"
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

      {/* Banner Especial de Lançamentos com Balanço Suave */}
      {filters.isLaunchOnly && (
        <div className="relative pt-0 pb-6 px-2 max-w-4xl mx-auto w-full">
          {/* Cordinhas / Hastes de sustentação da placa */}
          <div className="flex justify-between max-w-sm sm:max-w-md mx-auto px-12 sm:px-16 pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-stone-700 border-2 border-stone-400 shadow-sm" />
              <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-stone-400 to-stone-700" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-stone-700 border-2 border-stone-400 shadow-sm" />
              <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-stone-400 to-stone-700" />
            </div>
          </div>

          {/* Placa com animação de balanço suave */}
          <div className="animate-banner-sway relative bg-gradient-to-br from-stone-950 via-stone-900 to-black text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Efeitos sutis de luz no fundo */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              {/* Selo Em Breve */}
              <div className="inline-flex items-center gap-2 bg-stone-900/90 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-amber-500/30 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Em Breve • Lançamentos Exclusivos</span>
              </div>

              {/* Título Principal */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-2xl leading-tight">
                Novos Empreendimentos no ABC Paulista
              </h2>

              {/* Descrição */}
              <p className="text-stone-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
                Estamos selecionando e cadastrando os lançamentos mais aguardados e empreendimentos na planta em <strong className="text-white font-semibold">Santo André, São Bernardo do Campo e região</strong>.
              </p>

              {/* Destaques */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-2xl pt-1">
                <div className="flex items-center justify-center gap-1.5 bg-stone-900/80 border border-stone-800/80 rounded-xl py-2 px-3 text-[11px] sm:text-xs text-stone-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Condições de pré-lançamento</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-stone-900/80 border border-stone-800/80 rounded-xl py-2 px-3 text-[11px] sm:text-xs text-stone-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Plantas & tabelas exclusivas</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 bg-stone-900/80 border border-stone-800/80 rounded-xl py-2 px-3 text-[11px] sm:text-xs text-stone-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Atendimento com {settings.realtorName}</span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-3">
                <a
                  href={launchWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                  <span>Receber Novidades no WhatsApp</span>
                </a>

                <Link
                  href="/imoveis?pronto=sim"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-stone-700 transition-all hover:scale-[1.02]"
                >
                  <span>Ver Imóveis Prontos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar (Results count, Sort, View mode) */}
      {(!filters.isLaunchOnly || filteredProperties.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <div className="text-xs text-stone-700 font-medium">
            Exibindo <span className="font-bold text-stone-950">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
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
                <option value="recentes">Mais recentes</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
                <option value="area-desc">Maior área (m²)</option>
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
      )}

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
      ) : !filters.isLaunchOnly ? (
        <div className="bg-stone-50 p-16 rounded-3xl text-center space-y-4 max-w-2xl mx-auto border border-stone-200">
          <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-950">
            Nenhum imóvel encontrado com os critérios selecionados
          </h3>
          <p className="text-stone-600 text-xs leading-relaxed font-medium">
            Tente ajustar ou remover filtros da busca, ou entre em contato direto com Sérgio Colussi para consultar opções em captação.
          </p>
          <button
            onClick={() => handleFilterChange({})}
            className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md"
          >
            Limpar filtros de busca
          </button>
        </div>
      ) : null}
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
