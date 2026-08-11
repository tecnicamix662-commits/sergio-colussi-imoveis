'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PropertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import PropertyGallery from '@/components/properties/PropertyGallery';
import PropertyCard from '@/components/properties/PropertyCard';
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  Phone,
  Send,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      // Sempre sincroniza com o banco de dados na nuvem antes de exibir
      await PropertyService.syncWithServer();

      const loaded = PropertyService.getPropertyBySlug(propertyId) || PropertyService.getPropertyById(propertyId);
      if (loaded) {
        setProperty(loaded);
        const similar = PropertyService.getActiveProperties()
          .filter((p) => p.id !== loaded.id && p.city === loaded.city)
          .slice(0, 3);
        setSimilarProperties(similar);
      }
    };

    loadProperty();

    const handleUpdate = () => {
      const loaded = PropertyService.getPropertyBySlug(propertyId) || PropertyService.getPropertyById(propertyId);
      if (loaded) {
        setProperty(loaded);
      }
    };
    window.addEventListener('properties_updated', handleUpdate);
    return () => window.removeEventListener('properties_updated', handleUpdate);
  }, [propertyId]);

  if (!property) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-6 bg-white">
        <Building2 className="w-16 h-16 text-stone-400 mx-auto animate-bounce" />
        <h2 className="font-serif text-3xl font-bold text-stone-950">Carregando Detalhes do Imóvel...</h2>
        <p className="text-stone-600 text-sm font-medium">Aguarde um momento enquanto buscamos as fotos e informações.</p>
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-wider hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo de Imóveis
        </Link>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const whatsappMsg = `Olá Sérgio Colussi, tenho interesse no imóvel "${property.title}" (Código: ${property.code}) anunciado por ${formatCurrency(property.price)}. Gostaria de mais detalhes e agendar uma visita.`;
  const whatsappUrl = `https://wa.me/5511997135790?text=${encodeURIComponent(whatsappMsg)}`;

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    PropertyService.saveLead({
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      propertyId: property.id,
      propertyTitle: property.title,
      message: leadMessage || 'Gostaria de agendar uma visita ao imóvel.',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setLeadName('');
      setLeadPhone('');
      setLeadEmail('');
      setLeadMessage('');
    }, 600);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 bg-white">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-black font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Todos os Imóveis</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg border border-stone-300">
            {property.type}
          </span>
          <span className="bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-stone-300">
            Para {property.purpose}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight leading-tight">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
          <MapPin className="w-4 h-4 text-stone-950 shrink-0" />
          <span>
            {property.address ? `${property.address}, ` : ''}{property.neighborhood}, {property.city} - SP
          </span>
        </div>
      </div>

      {/* Main Grid: Left Gallery & Info, Right Sticky Contact Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (Photos, Features, Description, Map) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Gallery Component (FOTOS 100% COLORIDAS E VIVAS) */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Quick Specifications Bar - Estilo Casari */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 bg-stone-50 rounded-2xl border border-stone-200 text-center shadow-xs">
            <div className="space-y-1">
              <Maximize2 className="w-5 h-5 text-stone-900 mx-auto" />
              <span className="font-serif text-lg font-bold text-stone-950 block">{property.area} m²</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Área Construída</span>
            </div>

            <div className="space-y-1">
              <Bed className="w-5 h-5 text-stone-900 mx-auto" />
              <span className="font-serif text-lg font-bold text-stone-950 block">{property.bedrooms}</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Quartos</span>
            </div>

            <div className="space-y-1">
              <Bath className="w-5 h-5 text-stone-900 mx-auto" />
              <span className="font-serif text-lg font-bold text-stone-950 block">{property.bathrooms}</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Banheiro</span>
            </div>

            <div className="space-y-1">
              <Car className="w-5 h-5 text-stone-900 mx-auto" />
              <span className="font-serif text-lg font-bold text-stone-950 block">{property.parking}</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Vagas</span>
            </div>

            <div className="space-y-1">
              <Sparkles className="w-5 h-5 text-stone-900 mx-auto" />
              <span className="font-serif text-lg font-bold text-stone-950 block">{property.suites || 0}</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Suíte</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-8 border border-stone-200 space-y-4 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Descrição do Imóvel
            </h3>
            <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-line font-medium">
              {property.description}
            </p>
          </div>

          {/* Features & Amenities */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 space-y-4 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
                Características & Diferenciais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold hover:border-emerald-300 transition-colors">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 fill-emerald-100/60 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approximate Location / Map Mockup */}
          <div className="bg-white rounded-2xl p-8 border border-stone-200 space-y-4 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Localização Aproximada
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              Por questões de privacidade e segurança dos proprietários, o endereço exato é fornecido mediante agendamento de visita.
            </p>
            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-300 flex items-center justify-center text-center p-6">
              <div className="space-y-3 relative z-10">
                <MapPin className="w-10 h-10 text-stone-900 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-stone-950 text-lg">
                  {property.neighborhood} - {property.city}/SP
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
                  Excelente infraestrutura de comércio, escolas de alto padrão e rápida acessibilidade.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column (Pricing & Lead Capture Form - Estilo Casari, Mantendo Cores do Site) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="bg-stone-50/90 rounded-2xl p-6 border border-stone-300 space-y-5 shadow-xl">
            {/* Header: IMÓVEL + Cód. imóvel */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                IMÓVEL
              </span>
              <span className="text-xs font-mono font-extrabold text-stone-950 bg-white px-2.5 py-1 rounded-lg border border-stone-300 shadow-xs">
                Cód. imóvel: {property.code}
              </span>
            </div>

            {/* Price Block: VALOR, Condomínio, IPTU */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider">VALOR</span>
                <span className="font-serif text-3xl font-bold text-stone-950">
                  {formatCurrency(property.price)}
                  {property.purpose === 'aluguel' && <span className="text-xs font-normal text-stone-500">/mês</span>}
                </span>
              </div>

              <div className="space-y-1 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Condomínio</span>
                  <span className="font-semibold text-stone-900">{property.condoFee ? formatCurrency(property.condoFee) : 'R$ 0,00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>IPTU</span>
                  <span className="font-semibold text-stone-900">{property.iptuFee ? formatCurrency(property.iptuFee) : 'R$ 0,00'}</span>
                </div>
              </div>
            </div>

            {/* Lead Capture Form */}
            {submittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 text-center font-medium">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-950 text-sm">Mensagem Enviada!</h4>
                <p>Obrigado pelo contato. O corretor Sérgio Colussi retornará em instantes.</p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="text-stone-950 underline font-bold pt-1 block mx-auto cursor-pointer"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                    SEU NOME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EX: José da Silva"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                    SEU E-MAIL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="EX: email@email.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                    CELULAR <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="EX: (XX) X XXXX-XXXX"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1">
                    MENSAGEM (NÃO OBRIGATÓRIO)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Olá, gostaria de mais informações sobre o imóvel: ${property.code}.`}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-950 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold shadow-xs"
                  />
                </div>

                <p className="text-[10px] text-stone-500 leading-tight">
                  Ao informar meus dados, eu concordo com a <span className="underline cursor-pointer font-semibold">Política de Privacidade</span>.
                </p>

                {/* Stacked Action Buttons */}
                <div className="space-y-2 pt-1">
                  {/* Botão 1: TENHO INTERESSE (Principal escuro elegante do site) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-stone-950 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? 'ENVIANDO...' : 'TENHO INTERESSE'}</span>
                  </button>

                  {/* Botão 2: AGENDAR UMA VISITA (Botão secundário limpo) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-950 border border-stone-300 font-extrabold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Calendar className="w-4 h-4 text-stone-800" />
                    <span>AGENDAR UMA VISITA</span>
                  </button>

                  {/* Botão 3: CHAMAR NO WHATSAPP (Verde oficial WhatsApp) */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-white fill-white" />
                    <span>CHAMAR NO WHATSAPP</span>
                  </a>
                </div>
              </form>
            )}

            {/* Social Share Row */}
            <div className="pt-4 border-t border-stone-200 text-center space-y-2">
              <span className="text-[11px] font-bold text-stone-600 block">Compartilhar nas redes sociais</span>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira este imóvel: ${property.title} (Cód: ${property.code})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:scale-110 transition"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-700" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs hover:scale-110 transition"
                  title="Compartilhar no Facebook"
                >
                  f
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs hover:scale-110 transition"
                  title="Compartilhar no LinkedIn"
                >
                  in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-950">
              Imóveis Semelhantes em {property.city}
            </h3>
            <Link href="/imoveis" className="text-xs text-stone-900 hover:underline font-bold">
              Ver mais imóveis
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((simProp) => (
              <PropertyCard key={simProp.id} property={simProp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
