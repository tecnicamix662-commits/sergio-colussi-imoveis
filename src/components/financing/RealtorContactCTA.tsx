'use client';

import { Phone, CheckCircle2, UserCheck, MessageCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function RealtorContactCTA() {
  const { settings } = useSettings();

  const realtorName = settings.realtorName || 'Sérgio Colussi';
  const creci = settings.creci || '92.920';
  const whatsappPhone = settings.whatsapp || '(11) 99713-5790';
  const whatsappRaw = '5511997135790';

  const defaultMessage = 'Já fiz minha simulação de financiamento e gostaria da sua ajuda para encontrar o imóvel ideal dentro do meu orçamento.';
  const whatsappUrl = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <section className="bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl overflow-hidden relative">
      <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: CTA message & WhatsApp button */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Atendimento Especializado</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-snug">
            Já fez sua simulação?
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
            “Já fez sua simulação? Fale comigo e me diga quanto pretende investir. Vou te ajudar a encontrar o imóvel ideal.”
          </p>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-900/30 hover:scale-[1.02] border border-emerald-400"
            >
              <Phone className="w-5 h-5 text-stone-950 fill-stone-950" />
              <span>FALAR COM SÉRGIO</span>
            </a>
          </div>
        </div>

        {/* Right Column: Realtor Information Card */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-white shrink-0 overflow-hidden shadow-inner">
              {settings.realtorPhotoUrl ? (
                <img src={settings.realtorPhotoUrl} alt={realtorName} className="w-full h-full object-cover" />
              ) : (
                <UserCheck className="w-7 h-7 text-stone-300" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">{realtorName}</h3>
              <p className="text-stone-300 text-xs font-semibold uppercase tracking-wider">Corretor de Imóveis</p>
              <p className="text-emerald-400 text-xs font-mono font-bold mt-0.5">CRECI-SP {creci}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-stone-300">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">WhatsApp:</span>
              <span className="font-bold text-white">{whatsappPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Atendimento:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direto e Personalizado
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
