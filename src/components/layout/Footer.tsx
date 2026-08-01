'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();

  if (pathname.startsWith('/admin')) return null;

  const whatsappUrl = SettingsService.getWhatsAppUrl(settings);
  const fullAddress = SettingsService.getFullAddress(settings);

  return (
    <footer className="bg-stone-900 border-t border-stone-700 text-stone-200 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.companyName} className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gold-gradient p-[1px] shadow-glow-gold">
                    <div className="w-full h-full bg-stone-900 rounded-[7px] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gold-400" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold text-white tracking-wide uppercase">
                      {settings.realtorName || settings.companyName}
                    </span>
                    <span className="text-[9px] tracking-[0.2em] text-gold-400 uppercase font-medium">
                      {settings.tagline}
                    </span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-stone-300 text-xs leading-relaxed font-normal">{settings.footerDescription}</p>
            {settings.creci && (
              <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>CRECI: {settings.creci} | Registro Ativo</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-semibold text-base uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Página Inicial', href: '/' },
                { label: 'Catálogo de Imóveis', href: '/imoveis' },
                { label: 'Anuncie seu Imóvel', href: '/anunciar' },
                { label: `Sobre ${settings.realtorName}`, href: '/sobre' },
                { label: 'Fale Conosco', href: '/contato' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regiões */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-semibold text-base uppercase tracking-wider">Regiões Atendidas</h3>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Santo André e Mauá (Foco Principal)', bold: true },
                { label: 'São Bernardo do Campo', bold: false },
                { label: 'São Caetano do Sul', bold: false },
                { label: 'Grande São Paulo e ABC Paulista', bold: false },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between border-b border-stone-700/60 pb-2 last:border-0 last:pb-0">
                  <span className={r.bold ? 'font-bold text-gold-400' : 'text-stone-300'}>{r.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-500 shrink-0 ml-2" />
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-serif text-white font-semibold text-base uppercase tracking-wider">Contato</h3>
            <div className="space-y-3 text-xs">
              {fullAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>{fullAddress}</span>
                </div>
              )}
              {(settings.phone || settings.whatsapp) && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                    {settings.phone || settings.whatsapp}
                  </a>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{settings.email}</span>
                </div>
              )}
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="w-9 h-9 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center text-stone-300 hover:text-gold-400 hover:border-gold-500/40 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300 gap-4">
          <p>© {new Date().getFullYear()} {settings.companyName}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/sobre" className="hover:text-gold-400 transition-colors">Termos de Uso</Link>
            <Link href="/sobre" className="hover:text-gold-400 transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
