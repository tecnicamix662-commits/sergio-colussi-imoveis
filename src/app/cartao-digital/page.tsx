'use client';

import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, Award, Share2, Instagram, Facebook, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

export default function CartaoDigitalPage() {
  const { settings } = useSettings();

  const whatsappMsg = `Olá Sérgio, recebi seu cartão digital e gostaria de atendimento imobiliário.`;
  const whatsappUrl = SettingsService.getWhatsAppUrl(settings, whatsappMsg);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sérgio Colussi - Corretor de Imóveis',
        text: `Cartão de Visita Digital - Sérgio Colussi | CRECI ${settings.creci || '92.920-F'}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link do cartão copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Top action bar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-black font-bold transition py-1"
        >
          <ArrowLeft className="w-4 h-4 text-stone-900" />
          <span>Voltar ao Site</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-stone-900 bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-xl shadow-sm hover:bg-stone-200 transition font-bold"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-900" />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* DIGITAL CARD CONTAINER (Vertical 9:16 mobile format matching site branding) */}
      <div className="w-full max-w-md bg-stone-950 border-2 border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 text-white">
        
        {/* Header / Brand Logo */}
        <div className="flex flex-col items-center text-center space-y-3 pb-5 border-b border-stone-800">
          <div className="w-16 h-16 rounded-2xl bg-white p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center border border-stone-800">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sérgio Colussi
            </h1>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">
              Corretor de Imóveis | CRECI {settings.creci || '92.920-F'}
            </p>
          </div>
        </div>

        {/* Highlight Badge: Experience & Location */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-center shadow-inner">
          <div className="flex items-center justify-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-white shrink-0" />
            <span>22 Anos de Experiência</span>
          </div>
          <p className="text-stone-300 text-xs leading-relaxed font-medium">
            Atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis em Santo André e região do ABC Paulista.
          </p>
        </div>

        {/* Contact Info List */}
        <div className="space-y-3 text-xs">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-900 border border-stone-700 text-white transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-white shrink-0 border border-stone-700">
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">WhatsApp / Telefone</span>
              <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {settings.phone || '(11) 99713-5790'}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400 shrink-0" />
          </a>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-900 border border-stone-800">
            <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-white shrink-0 border border-stone-700">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Região de Atuação</span>
              <span className="text-xs font-semibold text-stone-200">Santo André e Região do ABC Paulista</span>
            </div>
          </div>

          {settings.email && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-900 border border-stone-800">
              <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-white shrink-0 border border-stone-700">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">E-mail</span>
                <span className="text-xs font-semibold text-stone-200 truncate block">{settings.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Row */}
        <div className="pt-1 flex items-center justify-center gap-3">
          {settings.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white transition text-xs font-semibold"
            >
              <Instagram className="w-4 h-4 text-[#E4405F]" />
              <span>Instagram</span>
            </a>
          )}
          {settings.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white transition text-xs font-semibold"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>Facebook</span>
            </a>
          )}
        </div>

        {/* Action Buttons: Download & WhatsApp */}
        <div className="pt-2 space-y-2.5">
          <a
            href="/cartao-sergio-colussi.png"
            download="Cartao_Digital_Sergio_Colussi.png"
            className="w-full py-3.5 rounded-xl bg-white text-stone-950 font-extrabold text-xs uppercase tracking-wider hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-stone-950" />
            <span>Baixar Imagem do Cartão (Para Enviar no Zap)</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 border border-stone-700"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Enviar Mensagem no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-[11px] text-stone-600 font-medium mt-4 text-center">
        © {new Date().getFullYear()} {settings.companyName} • Cartão de Visita Digital
      </p>
    </div>
  );
}
