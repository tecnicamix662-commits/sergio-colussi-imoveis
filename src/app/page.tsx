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
  Sparkles,
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
      const featured = PropertyService.getFeaturedProperties();
      setFeaturedProperties(featured);
    };

    loadProperties();

    window.addEventListener('properties_updated', loadProperties);
    return () => window.removeEventListener('properties_updated', loadProperties);
  }, []);

  // Cover background photos (1st photo: Bright modern house with pool in daylight)
  const coverPhotos = [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=85', // 1st: Casa Bonita Ambiente Claro com Piscina
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85', // 2nd: Prédio Condomínio Residencial
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85', // 3rd: Casa Contemporânea Iluminada
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1920&q=85', // 4th: Torre de Apartamentos de Luxo
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=85', // 5th: Mansão Moderna Arquitetônica
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
    <div className="space-y-24 pb-20">
      {/* HERO SECTION WITH AUTOMATIC BACKGROUND PHOTO CAROUSEL */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image Carousel with Smooth Crossfade */}
        {coverPhotos.map((imgUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <Image
              src={imgUrl}
              alt="Imóveis Sérgio Colussi"
              fill
              priority={index === 0}
              className="object-cover object-center brightness-[0.78] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent" />
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        {coverPhotos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + coverPhotos.length) % coverPhotos.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-900/60 hover:bg-stone-900/90 border border-gold-500/40 text-gold-400 flex items-center justify-center backdrop-blur transition-all shadow-lg hover:scale-110"
              aria-label="Foto Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % coverPhotos.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-stone-900/60 hover:bg-stone-900/90 border border-gold-500/40 text-gold-400 flex items-center justify-center backdrop-blur transition-all shadow-lg hover:scale-110"
              aria-label="Próxima Foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Hero Fixed Content Overlay (All text is fixed; only background photos rotate) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Fixed Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight drop-shadow-lg">
            {settings.heroTitle ? (
              settings.heroTitle
            ) : (
              <>
                Exclusividade e Confiança nos{' '}
                <span className="text-gold-gradient">Melhores Endereços</span> de Santo André e Região
              </>
            )}
          </h1>

          {/* Fixed Subtitle */}
          <p className="text-slate-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
            {settings.heroSubtitle || 'Com 22 anos de experiência no mercado imobiliário do ABC Paulista. Atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/imoveis"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 border border-stone-700"
            >
              <Building2 className="w-5 h-5 text-gold-400" />
              <span>Ver Catálogo Completo</span>
            </Link>

            <Link
              href="/anunciar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold text-sm uppercase tracking-wider border border-white/30 hover:border-gold-400/60 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <span>Anunciar meu Imóvel</span>
            </Link>

            <a
              href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20gostaria%20de%20atendimento%20para%20im%C3%B3veis."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Slide Indicator Dots */}
          {coverPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {coverPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'w-8 bg-gold-400 shadow-glow-gold'
                      : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para a foto ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Search / Filter Bar Section */}
          <div className="pt-6 max-w-5xl mx-auto text-left">
            <div className="mb-3 text-center sm:text-left font-serif text-white font-semibold text-lg flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-5 h-5 text-gold-400" />
              <span>Encontre o imóvel ideal para a sua família:</span>
            </div>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-white border border-cream-300 shadow-soft">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-1">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-900">22 Anos</span>
            <span className="text-xs text-stone-700 uppercase tracking-wider font-semibold">De Experiência no ABC</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-1">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-900">Centenas</span>
            <span className="text-xs text-stone-700 uppercase tracking-wider font-semibold">De Imóveis Negociados</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-300 flex items-center justify-center text-gold-600 mb-1">
              <Users className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-900">100%</span>
            <span className="text-xs text-stone-700 uppercase tracking-wider font-semibold">Foco no Cliente</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-300 flex items-center justify-center text-gold-600 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-serif text-3xl font-bold text-stone-900">100%</span>
            <span className="text-xs text-stone-700 uppercase tracking-wider font-semibold">Segurança Jurídica</span>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream-300 pb-6">
          <div className="space-y-2">
            <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest">
              Imóveis Selecionados
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
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
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-gold-400 border border-gold-500/40 shadow-glow-gold'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-cream-300 hover:border-gold-300'
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
          <div className="text-center py-12 bg-white rounded-2xl border border-cream-300 space-y-3">
            <Building2 className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-stone-600 text-sm font-medium">Nenhum imóvel em destaque encontrado nesta categoria.</p>
            <Link href="/imoveis" className="text-xs text-gold-600 hover:underline font-semibold">
              Ver todo o catálogo -&gt;
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 border border-stone-700 transition-all shadow-md group"
          >
            <span>Explorar Todos os Imóveis</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* REALTOR PRESENTATION / SOBRE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-soft relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-card">
              <Image
                src={settings.realtorPhotoUrl || "/images/sergio-colussi.jpg"}
                alt={settings.realtorName || "Sérgio Colussi"}
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="font-serif text-2xl font-bold text-white block">Sérgio Colussi</span>
                <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold block">
                  Corretor de Imóveis | CRECI {settings.creci || '92.920-F'}
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Differentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">
                Transparência & Experiência no ABC Paulista
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
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
                <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-cream-100/80 border border-cream-300 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-0.5 text-xs">{item.title}</h4>
                    <p className="text-stone-700 text-[11px] font-medium leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/sobre"
                className="px-6 py-3 rounded-xl bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-glow-gold"
              >
                Conhecer Minha História
              </Link>
              <Link
                href="/contato"
                className="px-6 py-3 rounded-xl bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 border border-stone-700 text-xs font-semibold transition-all"
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
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest">
            Reconhecimento & Confiança
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-stone-500 text-sm">
            Depoimentos reais de clientes que realizaram excelentes negócios com nossa assessoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-cream-300 shadow-soft hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-gold-400/40" />
                <p className="text-stone-700 text-xs leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-cream-300 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-800 text-xs">{item.name}</h4>
                  <span className="text-[10px] text-stone-500 block">{item.role}</span>
                </div>
                <div className="flex text-gold-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 fill-gold-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FOR SELLER / PROPRIETÁRIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 p-10 sm:p-16 border border-gold-500/30 shadow-2xl text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest">
              Anuncie com Quem Entende do Seu Imóvel
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Deseja Vender ou Alugar Seu Imóvel?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Disponibilize seu imóvel em nossa plataforma exclusiva com cobertura fotográfica profissional, avaliação precisa e atendimento direto de Sérgio Colussi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/anunciar"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-navy-950 font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-glow-gold flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Cadastrar Imóvel Agora</span>
            </Link>

            <a
              href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20quero%20vender%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Avaliação Rápida via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
