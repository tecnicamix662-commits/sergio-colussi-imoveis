'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, ShieldCheck, ChevronRight } from 'lucide-react';

interface WhatsAppFloatProps {
  customMessage?: string;
  propertyTitle?: string;
  propertyCode?: string;
}

export default function WhatsAppFloat({
  customMessage,
  propertyTitle,
  propertyCode,
}: WhatsAppFloatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const defaultPhone = '5511997135790'; // Sérgio Colussi WhatsApp Number

  const buildWhatsAppUrl = (msg?: string) => {
    let finalMsg = msg || userMsg;
    if (!finalMsg) {
      if (propertyTitle && propertyCode) {
        finalMsg = `Olá Sérgio, tenho interesse no imóvel "${propertyTitle}" (Cód: ${propertyCode}). Gostaria de mais detalhes e agendar uma visita.`;
      } else {
        finalMsg = `Olá Sérgio Colussi, gostaria de informações sobre imóveis em Santo André e região.`;
      }
    }
    return `https://wa.me/${defaultPhone}?text=${encodeURIComponent(finalMsg)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Chat Card */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 glass-card rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 p-0.5 border border-white/30 flex items-center justify-center font-bold font-serif text-sm">
                  SC
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Sérgio Colussi Imóveis</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Atendimento Exclusivo Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3 bg-navy-950/90 text-xs">
            <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/60 text-slate-200 leading-relaxed">
              👋 Olá! Sou o <strong>Sérgio Colussi</strong>. Como posso ajudar com o seu imóvel em Santo André e região?
            </div>

            {propertyTitle && (
              <div className="bg-gold-500/10 border border-gold-500/30 p-2.5 rounded-lg text-gold-300 font-medium">
                📍 Interesse no Imóvel: {propertyTitle} (Cód: {propertyCode})
              </div>
            )}

            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Mensagens rápidas:
              </p>
              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl(
                      propertyTitle
                        ? `Olá Sérgio, gostaria de agendar uma visita para o imóvel ${propertyTitle} (Cód: ${propertyCode}).`
                        : 'Olá Sérgio Colussi, gostaria de agendar uma visita a um imóvel.'
                    ),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>📅 Agendar uma Visita Presencial</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl('Olá Sérgio Colussi, estou procurando um imóvel para COMPRAR em Santo André e região. Pode me enviar opções disponíveis?'),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>🔑 Comprar um Imóvel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl('Olá Sérgio Colussi, estou procurando um imóvel para ALUGAR em Santo André e região. Pode me enviar as opções?'),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>🔑 Alugar um Imóvel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl('Olá Sérgio Colussi, quero anunciar/vender meu imóvel com você.'),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>🏡 Vender / Avaliar meu Imóvel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.open(buildWhatsAppUrl(), '_blank');
                    setIsOpen(false);
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Enviar WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-4 py-3.5 rounded-full shadow-2xl border border-emerald-400/40 transition-all duration-300 hover:scale-105"
        aria-label="Falar no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-6 h-6 fill-white stroke-emerald-700" />
        <span className="hidden sm:inline-block font-bold text-xs uppercase tracking-wider">
          WhatsApp Sérgio Colussi
        </span>
      </button>
    </div>
  );
}
