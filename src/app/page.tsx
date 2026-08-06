'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyService } from '@/services/propertyService';
import { useSettings } from '@/contexts/SettingsContext';
import { Property } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilterBar from '@/components/properties/PropertyFilterBar';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Phone,
  ArrowRight,
  CheckCircle2,
  Quote,
  TrendingUp,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<'todos' | 'apartamento' | 'casa' | 'cobertura'>('todos');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadProperties = () => {
      let featured = PropertyService.getFeaturedProperties();
      if (featured.length === 0) {
        featured = PropertyService.getActiveProperties().slice(0, 6);
      }
      setFeaturedProperties(featured);
    };

    // Sincroniza com o banco na nuvem antes de exibir os imóveis em destaque
    const initLoad = async () => {
      await PropertyService.syncWithServer();
      loadProperties();
    };
    initLoad();

    window.addEventListener('properties_updated', loadProperties);
    return () => window.removeEventListener('properties_updated', loadProperties);
  }, []);

  // Cover background photos para o Slide da Capa - Apenas Mansões Ensolaradas de Dia Claro com Piscina
  const coverPhotos = [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=85',
  ];

  // Auto-play interval for background photos (4.5 seconds)
  useEffect(() => {
    if (coverPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % coverPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [coverPhotos.length]);

  const filteredFeatured = activeTab === 'todos'
    ? featuredProperties
    : featuredProperties.filter((p) => p.type === activeTab);

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Roberto Mendonça',
      role: 'Comprador de Cobertura no Bairro Jardim',
      text: 'O Sérgio Colussi é a definição de profissionalismo. Conseguiu encontrar exatamente o apartamento que eu e minha família procurávamos em Santo André, conduzindo toda a negociação com transparência e rapidez exemplar.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Juliana & Marcelo Ribeiro',
      role: 'Proprietários no Swiss Park',
      text: 'Entregamos a venda da nossa mansão em São Bernardo de forma exclusiva para o Sérgio Colussi. Em menos de 45 dias o imóvel foi negociado pelo valor de avaliação justo, sem incômodos. Recomendamos de olhos fechados!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Fernando Guimarães',
      role: 'Investidor Imobiliário',
      text: 'Compro imóveis com a assessoria do Sérgio há mais de 8 anos. Conhecimento profundo da região do ABC, análise precisa de mercado e segurança jurídica impecável.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-white">
      {/* HERO SECTION WITH AUTOMATIC BACKGROUND PHOTO CAROUSEL */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black">
        {/* Background Image Carousel (FOTOS 100% ENSOLARADAS COM PISCINA) */}
        {coverPhotos.map((imgUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <Image
              src={imgUrl}
              alt="Imóveis de Alto Padrão Sérgio Colussi"
              fill
              priority={index === 0}
              className="object-cover object-center brightness-100 contrast-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/20" />
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        {coverPhotos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + coverPhotos.length) % coverPhotos.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black border border-white/30 text-white flex items-center justify-center backdrop-blur transition-all shadow-lg hover:scale-110"
              aria-label="Foto Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % coverPhotos.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black border border-white/30 text-white flex items-center justify-center backdrop-blur transition-all shadow-lg hover:scale-110"
              aria-label="Próxima Foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Hero Fixed Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg">
            {settings.heroTitle ? (
              settings.heroTitle
            ) : (
              <>
                Exclusividade e Confiança nos{' '}
                <span className="text-white underline decoration-stone-500 underline-offset-8">Melhores Endereços</span> de Santo André e Região
              </>
            )}
          </h1>

          <p className="text-stone-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            {settings.heroSubtitle || 'Com 22 anos de experiência no mercado imobiliário do ABC Paulista. Atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/imoveis"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 border border-white"
            >
              <Building2 className="w-5 h-5 text-stone-950" />
              <span>Ver Catálogo Completo</span>
            </Link>

            <Link
              href="/anunciar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-black/80 hover:bg-black text-white font-bold text-sm uppercase tracking-wider border border-stone-600 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5 text-white" />
              <span>Anunciar meu Imóvel</span>
            </Link>

            <a
              href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20gostaria%20de%20atendimento%20para%20im%C3%B3veis."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 border border-stone-700"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Slide Indicator Dots */}
          {coverPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {coverPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'w-8 bg-white shadow-md'
                      : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para a foto ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Search / Filter Bar Section */}
          <div className="pt-4 max-w-5xl mx-auto text-left">
            <PropertyFilterBar
              onFilterChange={(filters) => {
                const params = new URLSearchParams();
                if (filters.type) params.set('tipo', filters.type);
                if (filters.city) params.set('cidade', filters.city);
                if (filters.neighborhood) params.set('bairro', filters.neighborhood);
                if (filters.condominium) params.set('condominio', filters.condominium);
                if (filters.searchQuery) params.set('q', filters.searchQuery);
                window.location.href = `/imoveis?${params.toString()}`;
              }}
            />
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 mb-1 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-950">22 Anos</span>
            <span className="text-xs text-stone-600 uppercase tracking-wider font-semibold">De Experiência no ABC</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 mb-1 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-950">Centenas</span>
            <span className="text-xs text-stone-600 uppercase tracking-wider font-semibold">De Imóveis Negociados</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 mb-1 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-950">100%</span>
            <span className="text-xs text-stone-600 uppercase tracking-wider font-semibold">Foco no Cliente</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 mb-1 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-950">100%</span>
            <span className="text-xs text-stone-600 uppercase tracking-wider font-semibold">Segurança Jurídica</span>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-stone-900 text-xs font-bold uppercase tracking-widest">
              Imóveis Selecionados
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
              Portfólio em Destaque
            </h2>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'apartamento', label: 'Apartamentos' },
              { id: 'casa', label: 'Casas' },
              { id: 'cobertura', label: 'Coberturas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white border border-black shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:text-black border border-stone-200 hover:border-stone-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-3">
            <Building2 className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-stone-600 text-sm font-medium">Nenhum imóvel em destaque encontrado nesta categoria.</p>
            <Link href="/imoveis" className="text-xs text-stone-900 hover:underline font-bold">
              Ver todo o catálogo -&gt;
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 border border-black transition-all shadow-md group"
          >
            <span>Explorar Todos os Imóveis</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* REALTOR PRESENTATION / SOBRE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photo — BRILHANTE, NÍTIDA E GARANTIDA */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xl bg-stone-200">
              <img
                src={settings.realtorPhotoUrl && settings.realtorPhotoUrl.trim() ? settings.realtorPhotoUrl : "/images/sergio-colussi.jpg"}
                alt={settings.realtorName || "Sérgio Colussi"}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/sergio-colussi.jpg";
                }}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <span className="font-serif text-2xl font-bold text-white block drop-shadow-md">Sérgio Colussi</span>
                <span className="text-xs text-stone-200 uppercase tracking-widest font-bold block drop-shadow-sm">
                  Corretor de Imóveis | CRECI {settings.creci || '92.920-F'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Differentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-stone-900 text-xs font-bold uppercase tracking-widest">
                Transparência & Experiência no ABC Paulista
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
                Atendimento Transparente, Seguro e Personalizado
              </h2>
            </div>

            <p className="text-stone-800 text-base leading-relaxed font-medium">
              Com 22 anos de experiência no mercado imobiliário, Sérgio Colussi atua em Santo André e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {[
                { title: 'Compra e Venda de Imóveis', desc: 'Acompanhamento completo e seguro em todas as fases da negociação.' },
                { title: 'Avaliação de Imóveis', desc: 'Avaliações precisas baseadas no conhecimento real do mercado local.' },
                { title: 'Segurança Jurídica', desc: 'Análise minuciosa da documentação para a garantia de bons negócios.' },
                { title: 'Conhecimento da Região', desc: 'Forte atuação em Santo André e todos os municípios do ABC Paulista.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-950 mb-0.5 text-xs">{item.title}</h4>
                    <p className="text-stone-700 text-[11px] font-medium leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/sobre"
                className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm"
              >
                Conhecer Minha História
              </Link>
              <Link
                href="/contato"
                className="px-6 py-3 rounded-xl bg-white text-stone-900 border border-stone-300 hover:bg-stone-100 text-xs font-bold transition-all"
              >
                Falar Conosco
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-stone-900 text-xs font-bold uppercase tracking-widest">
            Reconhecimento & Confiança
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-stone-600 text-sm font-medium">
            Depoimentos reais de clientes que realizaram excelentes negócios com nossa assessoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-stone-50 rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-stone-400/50" />
                <p className="text-stone-800 text-xs leading-relaxed italic font-medium">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-950 text-xs">{item.name}</h4>
                  <span className="text-[10px] text-stone-600 block">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FOR SELLER / PROPRIETÁRIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 p-10 sm:p-16 border border-stone-800 shadow-2xl text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-white text-xs font-bold uppercase tracking-widest">
              Anuncie com Quem Entende do Seu Imóvel
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Deseja Vender ou Alugar Seu Imóvel?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
              Disponibilize seu imóvel em nossa plataforma exclusiva com cobertura fotográfica profissional, avaliação precisa e atendimento direto de Sérgio Colussi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/anunciar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-stone-950 font-extrabold text-sm uppercase tracking-wider hover:bg-stone-100 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5 text-stone-950" />
              <span>Cadastrar Imóvel Agora</span>
            </Link>

            <a
              href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20quero%20vender%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 border border-stone-700 hover:bg-stone-800 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              <span>Avaliação Rápida via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
