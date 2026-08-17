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
    { name: 'ALUGAR', href: '/imoveis?finalidade=aluguel', key: 'alugar' },
    { name: 'SIMULAÇÃO', href: '/simular-financiamento', key: 'simular' },
    { name: 'ANUNCIE SEU IMÓVEL', href: '/anunciar', key: 'anunciar' },
  ];

  const isLinkActive = (key: string) => {
    if (key === 'comprar') {
      return pathname === '/imoveis' && (searchParams.get('finalidade') === 'venda' || searchParams.get('purpose') === 'venda');
    }
    if (key === 'alugar') {
      return pathname === '/imoveis' && (searchParams.get('finalidade') === 'aluguel' || searchParams.get('purpose') === 'aluguel');
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
          ? 'bg-white/95 backdrop-blur-md py-3.5 border-b border-stone-200 shadow-sm'
          : 'bg-white/90 backdrop-blur-sm py-4 border-b border-stone-100 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.companyName} className="h-10 sm:h-11 w-auto object-contain" />
            ) : (
              <>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 p-[1px] shadow-sm shrink-0">
                  <div className="w-full h-full rounded-[11px] bg-white flex items-center justify-center border border-stone-200">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-stone-900" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-stone-950 group-hover:text-stone-700 transition-colors">
                    {settings.realtorName || 'Sérgio Colussi'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-stone-600 uppercase font-bold">
                    Corretor de Imóveis • CRECI {settings.creci || '92.920-F'}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav — FUNDO BRANCO, TEXTOS PRETOS */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 xl:gap-12">
            {navLinks.map((link) => {
              const active = isLinkActive(link.key);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-xs lg:text-sm font-bold tracking-wider uppercase transition-all relative py-1.5 whitespace-nowrap group ${
                    active ? 'text-stone-950' : 'text-stone-800 hover:text-black'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {active ? (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-black shadow-sm" />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] rounded-full bg-stone-400 transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Contact Action */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all border border-stone-300 shadow-sm flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-stone-900" />
              <span>Atendimento</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-stone-100 text-stone-900 border border-stone-300 focus:outline-none transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-stone-900" /> : <Menu className="w-6 h-6 text-stone-900" />}
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
                    {link.key === 'alugar' && <Key className="w-4 h-4 text-stone-900" />}
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
