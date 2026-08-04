'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, ShieldCheck, Award, Phone, Sparkles } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function SobrePage() {
  const { settings } = useSettings();

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white">
      {/* Main Container */}
      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-12 relative overflow-hidden">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-950 text-xs font-bold uppercase tracking-widest border border-stone-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>22 Anos de Experiência no ABC Paulista</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
            Sobre {settings.realtorName || 'Sérgio Colussi'}
          </h1>

          <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-medium">
            Com 22 anos de experiência no mercado imobiliário, Sérgio Colussi atua em Santo André e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.
          </p>
        </div>

        {/* Profile Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Photo — BRILHANTE, NÍTIDA E GARANTIDA */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[480px] sm:h-[540px] w-full rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xl bg-stone-200">
              <img
                src={settings.realtorPhotoUrl && settings.realtorPhotoUrl.trim() ? settings.realtorPhotoUrl : "/images/sergio-colussi.jpg"}
                alt={settings.realtorName || "Sérgio Colussi"}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/sergio-colussi.jpg";
                }}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 space-y-1 z-10">
                <span className="font-serif text-2xl font-bold text-white block drop-shadow-md">Sérgio Colussi</span>
                <span className="text-xs text-stone-200 font-bold uppercase tracking-wider block drop-shadow-sm">
                  Corretor de Imóveis | CRECI {settings.creci || '92.920-F'}
                </span>
              </div>
            </div>
          </div>

          {/* Text Story */}
          <div className="lg:col-span-7 space-y-6 text-stone-900">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
              Experiência, Transparência e Foco em Resultados
            </h2>

            <div className="space-y-4 text-base leading-relaxed text-stone-800">
              <p className="text-stone-900 font-medium">
                Com <strong className="text-black font-extrabold">22 anos de experiência no mercado imobiliário</strong>, Sérgio Colussi atua em Santo André e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.
              </p>

              <p className="text-stone-800 font-medium">
                Com conhecimento da região e compromisso com cada cliente, seu objetivo é tornar o processo imobiliário mais simples, seguro e tranquilo, ajudando pessoas a encontrarem as melhores oportunidades.
              </p>

              <p className="text-stone-800 font-medium">
                Seja para encontrar o imóvel ideal para a sua família, vender sua propriedade com rapidez e avaliação justa, ou realizar investimentos seguros, você conta com suporte completo do início ao fim da negociação.
              </p>
            </div>

            {/* Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-stone-900 mb-1" />
                <h4 className="font-bold text-stone-950 text-sm">Segurança Jurídica</h4>
                <p className="text-stone-700 text-xs font-medium">Análise minuciosa de toda a documentação para uma transação 100% tranquila.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1 shadow-sm">
                <Award className="w-5 h-5 text-stone-900 mb-1" />
                <h4 className="font-bold text-stone-950 text-sm">Avaliação de Imóveis</h4>
                <p className="text-stone-700 text-xs font-medium">Avaliações precisas baseadas no conhecimento prático do mercado local.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/imoveis"
                className="px-6 py-3 rounded-xl bg-black hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                Ver Imóveis Disponíveis
              </Link>
              <a
                href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20gostaria%20de%20atendimento%20para%20im%C3%B3veis."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md border border-stone-800"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Falar Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
