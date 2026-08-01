'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, ShieldCheck, Award, Users, Phone, CheckCircle2, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function SobrePage() {
  const { settings } = useSettings();

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Main Dark Card Container */}
      <div className="bg-stone-900 border border-stone-700/80 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-12 relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-widest border border-gold-500/40 shadow-glow-gold">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>22 Anos de Experiência no ABC Paulista</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Sobre {settings.realtorName || 'Sérgio Colussi'}
          </h1>

          <p className="text-stone-200 text-base sm:text-lg leading-relaxed font-medium">
            Com 22 anos de experiência no mercado imobiliário, Sérgio Colussi atua em Santo André e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.
          </p>
        </div>

        {/* Profile Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[480px] sm:h-[540px] w-full rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-2xl">
              <Image
                src={settings.realtorPhotoUrl || "/images/sergio-colussi.jpg"}
                alt={settings.realtorName || "Sérgio Colussi"}
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="font-serif text-2xl font-bold text-white block">Sérgio Colussi</span>
                <span className="text-xs text-gold-400 font-bold uppercase tracking-wider block">
                  Corretor de Imóveis | CRECI {settings.creci || '92.920-F'}
                </span>
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="lg:col-span-7 space-y-6 text-white">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Experiência, Transparência e Foco em Resultados
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-stone-200">
              <p className="text-stone-100 font-medium">
                Com <strong className="text-white font-bold">22 anos de experiência no mercado imobiliário</strong>, Sérgio Colussi atua em Santo André e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.
              </p>

              <p className="text-stone-200">
                Com conhecimento da região e compromisso com cada cliente, seu objetivo é tornar o processo imobiliário mais simples, seguro e tranquilo, ajudando pessoas a encontrarem as melhores oportunidades.
              </p>

              <p className="text-stone-200">
                Seja para encontrar o imóvel ideal para a sua família, vender sua propriedade com rapidez e avaliação justa, ou realizar investimentos seguros, você conta com suporte completo do início ao fim da negociação.
              </p>
            </div>

            {/* Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-stone-950/90 border border-stone-700 space-y-1 shadow-md">
                <ShieldCheck className="w-5 h-5 text-gold-400 mb-1" />
                <h4 className="font-bold text-white text-sm">Segurança Jurídica</h4>
                <p className="text-stone-300 text-xs font-normal">Análise minuciosa de toda a documentação para uma transação 100% tranquila.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/90 border border-stone-700 space-y-1 shadow-md">
                <Award className="w-5 h-5 text-gold-400 mb-1" />
                <h4 className="font-bold text-white text-sm">Avaliação de Imóveis</h4>
                <p className="text-stone-300 text-xs font-normal">Avaliações precisas baseadas no conhecimento prático do mercado local.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/imoveis"
                className="px-6 py-3 rounded-xl bg-gold-gradient text-stone-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-glow-gold"
              >
                Ver Imóveis Disponíveis
              </Link>
              <a
                href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20gostaria%20de%20atendimento%20para%20im%C3%B3veis."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Falar Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
