'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  Share2,
  ShieldCheck,
  Calendar,
  Sparkles,
  DollarSign,
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
      <div className="min-h-screen pt-32 pb-20 max-w-4xl mx-auto px-4 text-center space-y-6">
        <Building2 className="w-16 h-16 text-gold-500/40 mx-auto animate-bounce" />
        <h2 className="font-serif text-3xl font-bold text-white">Carregando Detalhes do Imóvel...</h2>
        <p className="text-slate-400 text-sm">Aguarde um momento enquanto buscamos as fotos e informações.</p>
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider hover:underline">
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
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-gold-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Todos os Imóveis</span>
        </Link>

        <div className="flex items-center gap-2 text-slate-500 font-mono">
          <span>Código de Referência:</span>
          <span className="bg-slate-900 text-gold-400 px-2.5 py-1 rounded-md border border-slate-800 font-bold">
            {property.code}
          </span>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-lg">
            {property.type}
          </span>
          <span className="bg-slate-900 text-slate-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg border border-slate-800">
            Para {property.purpose}
          </span>
          {property.featured && (
            <span className="bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg border border-gold-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Destaque Exclusivo
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
          <span>
            {property.address ? `${property.address}, ` : ''}{property.neighborhood}, {property.city} - SP
          </span>
        </div>
      </div>

      {/* Main Grid: Left Gallery & Info, Right Sticky Contact Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (Photos, Features, Description, Map) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Gallery Component */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Quick Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 glass-card rounded-2xl border border-slate-800 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 text-xs uppercase font-semibold">
                <Maximize2 className="w-4 h-4" /> Área Útil
              </div>
              <span className="font-serif text-2xl font-bold text-white">{property.area} m²</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 text-xs uppercase font-semibold">
                <Bed className="w-4 h-4" /> Dormitórios
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                {property.bedrooms} <span className="text-xs text-slate-400 font-sans">({property.suites} suítes)</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 text-xs uppercase font-semibold">
                <Bath className="w-4 h-4" /> Banheiros
              </div>
              <span className="font-serif text-2xl font-bold text-white">{property.bathrooms}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 text-xs uppercase font-semibold">
                <Car className="w-4 h-4" /> Vagas
              </div>
              <span className="font-serif text-2xl font-bold text-white">{property.parking}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Descrição do Imóvel
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features & Amenities */}
          {property.features && property.features.length > 0 && (
            <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Características & Diferenciais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approximate Location / Map Mockup */}
          <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Localização Aproximada
            </h3>
            <p className="text-xs text-slate-400">
              Por questões de privacidade e segurança dos proprietários, o endereço exato é fornecido mediante agendamento de visita.
            </p>
            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center text-center p-6">
              <div className="space-y-3 relative z-10">
                <MapPin className="w-10 h-10 text-gold-400 mx-auto animate-bounce" />
                <h4 className="font-serif font-bold text-white text-lg">
                  {property.neighborhood} - {property.city}/SP
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Excelente infraestrutura de comércio, escolas de alto padrão e rápida acessibilidade.
                </p>
              </div>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          </div>
        </div>

        {/* Right Sticky Column (Pricing & Lead Capture Form) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          {/* Pricing Box */}
          <div className="glass-card rounded-2xl p-6 border border-gold-500/30 space-y-6 shadow-glow-gold">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold block">
                Valor do Imóvel
              </span>
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight block">
                {formatCurrency(property.price)}
              </span>

              {(property.condoFee || property.iptuFee) && (
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  {property.condoFee && <span>Condomínio: <strong>{formatCurrency(property.condoFee)}</strong>/mês</span>}
                  {property.iptuFee && <span>IPTU: <strong>{formatCurrency(property.iptuFee)}</strong>/ano</span>}
                </div>
              )}
            </div>

            {/* Main WhatsApp Direct CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Tenho Interesse via WhatsApp</span>
            </a>

            <div className="text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Sérgio Colussi | Atendimento direto sem intermediários
              </span>
            </div>
          </div>

          {/* Lead Capture Form */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold-400" />
              <span>Agendar Visita / Enviar Mensagem</span>
            </h3>

            {submittedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Mensagem Enviada!</h4>
                <p>Obrigado pelo interesse. O corretor Sérgio Colussi entrará em contato em instantes.</p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="text-gold-400 underline font-semibold pt-1 block mx-auto"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Mariana Costa"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seu E-mail</label>
                  <input
                    type="email"
                    placeholder="seuemail@dominio.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Mensagem</label>
                  <textarea
                    rows={3}
                    placeholder="Gostaria de agendar uma visita presencial nesta semana..."
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-glow-gold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-white">
              Imóveis Semelhantes em {property.city}
            </h3>
            <Link href="/imoveis" className="text-xs text-gold-400 hover:underline font-semibold">
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
