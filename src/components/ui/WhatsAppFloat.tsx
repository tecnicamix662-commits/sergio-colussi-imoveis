'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, Send, ShieldCheck, ChevronRight } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.827.737 5.484 2.027 7.793L0 32l8.445-2.012A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.266 13.266 0 01-6.757-1.845l-.485-.287-5.01 1.194 1.27-4.878-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.928c-.398-.199-2.356-1.162-2.72-1.295-.365-.133-.63-.199-.896.2-.265.397-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.232-.398-.025-.613.175-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.958-.323-.778-.65-.672-.896-.684l-.763-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.954.304 1.823.261 2.51.158.765-.114 2.356-.963 2.688-1.894.333-.93.333-1.728.233-1.894-.1-.166-.365-.265-.763-.465z"/>
    </svg>
  );
}

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

  const defaultPhone = '5511997135790';

  const buildWhatsAppUrl = (msg?: string) => {
    let finalMsg = msg || userMsg;
    if (!finalMsg) {
      if (propertyTitle && propertyCode) {
        finalMsg = `Ol\u00e1 S\u00e9rgio, tenho interesse no im\u00f3vel "${propertyTitle}" (C\u00f3d: ${propertyCode}). Gostaria de mais detalhes e agendar uma visita.`;
      } else {
        finalMsg = `Ol\u00e1 S\u00e9rgio Colussi, gostaria de informa\u00e7\u00f5es sobre im\u00f3veis em Santo Andr\u00e9 e regi\u00e3o.`;
      }
    }
    return `https://wa.me/${defaultPhone}?text=${encodeURIComponent(finalMsg)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Card expandido */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 glass-card rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Cabe\u00e7alho */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 p-0.5 border border-white/30 flex items-center justify-center font-bold font-serif text-sm">
                  SC
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">S\u00e9rgio Colussi</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Corretor de Im\u00f3veis \u2022 CRECI 92.920-F
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corpo */}
          <div className="p-4 space-y-3 bg-navy-950/90 text-xs">
            <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/60 text-slate-200 leading-relaxed">
              Ol\u00e1! Sou S\u00e9rgio Colussi, corretor de im\u00f3veis no ABC Paulista. Como posso ajudar na compra ou venda do seu im\u00f3vel?
            </div>

            {propertyTitle && (
              <div className="bg-gold-500/10 border border-gold-500/30 p-2.5 rounded-lg text-gold-300 font-medium">
                Im\u00f3vel selecionado: {propertyTitle} (C\u00f3d: {propertyCode})
              </div>
            )}

            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Mensagens r\u00e1pidas:
              </p>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl(
                      propertyTitle
                        ? `Ol\u00e1 S\u00e9rgio, gostaria de agendar uma visita ao im\u00f3vel ${propertyTitle} (C\u00f3d: ${propertyCode}).`
                        : 'Ol\u00e1 S\u00e9rgio Colussi, gostaria de agendar uma visita a um im\u00f3vel.'
                    ),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>Agendar uma visita</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl('Ol\u00e1 S\u00e9rgio, estou procurando um im\u00f3vel para compra no ABC Paulista. Pode me enviar op\u00e7\u00f5es dispon\u00edveis?'),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>Comprar um im\u00f3vel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  window.open(
                    buildWhatsAppUrl('Ol\u00e1 S\u00e9rgio, quero anunciar meu im\u00f3vel no ABC Paulista.'),
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-between hover:text-gold-400 transition-colors text-xs font-semibold"
              >
                <span>Anunciar ou avaliar meu im\u00f3vel</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* Mensagem personalizada */}
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
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bot\u00e3o flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium px-4 py-3.5 rounded-full shadow-2xl border border-emerald-400/40 transition-all duration-300 hover:scale-105"
        aria-label="Falar no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
        <WhatsAppIcon className="w-6 h-6" />
        <span className="hidden sm:inline-block font-bold text-xs uppercase tracking-wider">
          WhatsApp S\u00e9rgio Colussi
        </span>
      </button>
    </div>
  );
}