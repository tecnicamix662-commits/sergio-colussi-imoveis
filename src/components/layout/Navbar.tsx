'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Building2, Phone, Menu, X, ChevronRight, Tag, Key, PlusCircle, Calculator } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: 'COMPRAR', href: '/imoveis?finalidade=venda', key: 'comprar' },
    { name: 'SIMULAR FINANCIAMENTO', href: '/simular-financiamento', key: 'simular' },
    { name: 'ANUNCIAR MEU IMÓVEL', href: '/anunciar', key: 'anunciar' },
  ];

  const isLinkActive = (key: string) => {
    if (key === 'comprar') {
      return pathname === '/imoveis' && (searchParams.get('finalidade') === 'venda' || searchParams.get('purpose') === 'venda');
    }
    if (key === 'simular') {
      return pathname.startsWith('/simular-financiamento');
    }
    if (key === 'anunciar') {
      return pathname.startsWith('/anunciar');
    }
    return false;
  };

  const whatsappUrl = SettingsService.getWhatsAppUrl(settings);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md py-2 border-b border-stone-200 shadow-sm'
          : 'bg-white/90 backdrop-blur-sm py-2.5 sm:py-3 border-b border-stone-100 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.companyName} className="h-8 sm:h-9 w-auto object-contain" />
            ) : (
              <>
                {/* Logo SVG — Skyline Refinado */}
                <svg
                  width="36" height="36"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  {/* Linha de base */}
                  <line x1="2" y1="38" x2="42" y2="38" stroke="#0C0A09" strokeWidth="1.6" strokeLinecap="round"/>
                  {/* Torre esquerda — baixa */}
                  <rect x="3" y="24" width="9" height="14" rx="0.5" stroke="#0C0A09" strokeWidth="1.5" fill="none"/>
                  <line x1="3" y1="29" x2="12" y2="29" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="3" y1="34" x2="12" y2="34" stroke="#0C0A09" strokeWidth="0.9"/>
                  {/* Torre central — esbélta e imponente */}
                  <rect x="16" y="4" width="12" height="34" rx="0.5" stroke="#0C0A09" strokeWidth="1.8" fill="none"/>
                  <line x1="16" y1="11" x2="28" y2="11" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="16" y1="19" x2="28" y2="19" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="16" y1="27" x2="28" y2="27" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="16" y1="33" x2="28" y2="33" stroke="#0C0A09" strokeWidth="0.9"/>
                  {/* Torre direita — média */}
                  <rect x="32" y="16" width="9" height="22" rx="0.5" stroke="#0C0A09" strokeWidth="1.5" fill="none"/>
                  <line x1="32" y1="22" x2="41" y2="22" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="32" y1="28" x2="41" y2="28" stroke="#0C0A09" strokeWidth="0.9"/>
                  <line x1="32" y1="33" x2="41" y2="33" stroke="#0C0A09" strokeWidth="0.9"/>
                </svg>
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-lg font-bold tracking-wide uppercase text-stone-950 group-hover:text-stone-700 transition-colors leading-tight">
                    {settings.realtorName || 'Sérgio Colussi'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.18em] text-stone-600 uppercase font-bold leading-tight">
                    Corretor de Imóveis • CRECI {settings.creci || '92.920-F'}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav — FUNDO BRANCO, TEXTOS PRETOS */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.key);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-xs font-bold tracking-wider uppercase transition-all relative py-1 whitespace-nowrap group ${
                    active ? 'text-stone-950' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {active ? (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-black shadow-sm" />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] rounded-full bg-stone-400 transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Contact Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all border border-stone-300 shadow-sm flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-stone-900" />
              <span>Atendimento</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-100 text-stone-900 border border-stone-300 focus:outline-none transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-stone-900" /> : <Menu className="w-5 h-5 text-stone-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer — FUNDO BRANCO, TEXTOS PRETOS */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.key);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-stone-100 text-stone-950 border border-stone-300 shadow-sm'
                      : 'text-stone-800 hover:bg-stone-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.key === 'comprar' && <Tag className="w-4 h-4 text-stone-900" />}
                    {link.key === 'simular' && <Calculator className="w-4 h-4 text-stone-900" />}
                    {link.key === 'anunciar' && <PlusCircle className="w-4 h-4 text-stone-900" />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-900" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 text-white font-bold text-center text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-stone-800 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
