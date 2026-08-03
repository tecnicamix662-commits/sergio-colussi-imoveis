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
    const loaded = PropertyService.getPropertyBySlug(propertyId) || PropertyService.getPropertyById(propertyId);
    if (loaded) {
      setProperty(loaded);
      const similar = PropertyService.getActiveProperties()
        .filter((p) => p.id !== loaded.id && p.city === loaded.city)
        .slice(0, 3);
      setSimilarProperties(similar);
    }
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
      maximumFractionDigits: 0,
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

        <div className="flex items-center gap-2 text-stone-600 font-mono">
          <span>Código de Referência:</span>
          <span className="bg-stone-100 text-stone-950 px-2.5 py-1 rounded-md border border-stone-300 font-bold">
            {property.code}
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-black text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-lg">
            {property.type}
          </span>
          <span className="bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg border border-stone-300">
            Para {property.purpose}
          </span>
          {property.featured && (
            <span className="bg-stone-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg border border-stone-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Destaque Exclusivo
            </span>
          )}
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

          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 text-xs uppercase font-bold">
                <Maximize2 className="w-4 h-4" /> Área Útil
              </div>
              <span className="font-serif text-2xl font-bold text-stone-950">{property.area} m²</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 text-xs uppercase font-bold">
                <Bed className="w-4 h-4" /> Dormitórios
              </div>
              <span className="font-serif text-2xl font-bold text-stone-950">
                {property.bedrooms} <span className="text-xs text-stone-600 font-sans">({property.suites} suítes)</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 text-xs uppercase font-bold">
                <Bath className="w-4 h-4" /> Banheiros
              </div>
              <span className="font-serif text-2xl font-bold text-stone-950">{property.bathrooms}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 text-xs uppercase font-bold">
                <Car className="w-4 h-4" /> Vagas
              </div>
              <span className="font-serif text-2xl font-bold text-stone-950">{property.parking}</span>
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
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
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

        {/* Right Sticky Column (Pricing & Lead Capture Form) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          {/* Pricing Box */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-300 space-y-6 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2">
                <span className="bg-black text-amber-400 text-xs font-mono font-extrabold px-3 py-1 rounded-lg border border-amber-500/40 tracking-wider shadow-xs">
                  CÓDIGO: {property.code}
                </span>
                <span className="text-xs text-stone-600 uppercase tracking-wider font-extrabold">
                  {property.purpose === 'aluguel' ? 'Valor do Aluguel' : 'Valor de Venda'}
                </span>
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 tracking-tight block pt-1">
                {formatCurrency(property.price)}
              </span>

              {(property.condoFee || property.iptuFee) && (
                <div className="flex items-center gap-4 text-xs text-stone-700 pt-2 border-t border-stone-200">
                  {property.condoFee && <span>Condomínio: <strong>{formatCurrency(property.condoFee)}</strong>/mês</span>}
                  {property.iptuFee && <span>IPTU: <strong>{formatCurrency(property.iptuFee)}</strong>/ano</span>}
                </div>
              )}
            </div>

            {/* Main WhatsApp Direct CTA Button com Verde Oficial WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 text-white fill-white" />
              <span>Tenho Interesse - Chama no Zap</span>
            </a>

            <div className="text-center">
              <span className="text-[11px] text-stone-600 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-900" /> Sérgio Colussi | Atendimento direto sem intermediários
              </span>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-stone-950 border-b border-stone-200 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-stone-900" />
              <span>Agendar Visita / Enviar Mensagem</span>
            </h3>

            {submittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs space-y-2 text-center font-medium">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-950 text-sm">Mensagem Enviada!</h4>
                <p>Obrigado pelo interesse. O corretor Sérgio Colussi entrará em contato em instantes.</p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="text-stone-900 underline font-bold pt-1 block mx-auto"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Mariana Costa"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Seu E-mail</label>
                  <input
                    type="email"
                    placeholder="seuemail@dominio.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Mensagem</label>
                  <textarea
                    rows={3}
                    placeholder="Gostaria de agendar uma visita presencial nesta semana..."
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-black hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-black"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
                </button>
              </form>
            )}
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
