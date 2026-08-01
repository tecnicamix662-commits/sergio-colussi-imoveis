'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Building2, Phone, Menu, X, ChevronRight, Tag, Key, PlusCircle } from 'lucide-react';
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

  // The ONLY 3 menu options strictly required in exact order
  const navLinks = [
    { name: 'COMPRAR', href: '/imoveis?finalidade=venda', key: 'comprar' },
    { name: 'ALUGAR', href: '/imoveis?finalidade=aluguel', key: 'alugar' },
    { name: 'ANUNCIE SEU IMÓVEL', href: '/anunciar', key: 'anunciar' },
  ];

  const isLinkActive = (key: string) => {
    if (key === 'comprar') {
      return pathname === '/imoveis' && (searchParams.get('finalidade') === 'venda' || searchParams.get('purpose') === 'venda');
    }
    if (key === 'alugar') {
      return pathname === '/imoveis' && (searchParams.get('finalidade') === 'aluguel' || searchParams.get('purpose') === 'aluguel');
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
          ? 'bg-stone-950/95 backdrop-blur-md py-3.5 border-b border-stone-800 shadow-2xl'
          : 'bg-gradient-to-b from-stone-950/90 via-stone-950/40 to-transparent py-5'
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
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gold-gradient p-[1px] shadow-glow-gold shrink-0">
                  <div className="w-full h-full rounded-[11px] bg-stone-950 flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-wide uppercase text-white group-hover:text-gold-400 transition-colors">
                    {settings.realtorName || 'Sérgio Colussi'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-gold-400 uppercase font-bold">
                    Corretor de Imóveis • CRECI {settings.creci || '92.920-F'}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav - Ample Spacing & Only the 3 options */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 xl:gap-16">
            {navLinks.map((link) => {
              const active = isLinkActive(link.key);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-xs lg:text-sm font-bold tracking-wider uppercase transition-all relative py-1.5 whitespace-nowrap group ${
                    active ? 'text-gold-400' : 'text-stone-200 hover:text-gold-400'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {active ? (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-gold-gradient shadow-glow-gold" />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] rounded-full bg-gold-400/60 transition-all duration-300 group-hover:w-full" />
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
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs uppercase tracking-wider transition-all border border-stone-700/90 shadow-md flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Atendimento</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:outline-none transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6 text-gold-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950/98 border-b border-stone-800 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-2xl animate-in slide-in-from-top-3 duration-200">
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
                      ? 'bg-gold-500/15 text-gold-400 border border-gold-500/40 shadow-sm'
                      : 'text-stone-200 hover:bg-stone-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.key === 'comprar' && <Tag className="w-4 h-4 text-gold-400" />}
                    {link.key === 'alugar' && <Key className="w-4 h-4 text-gold-400" />}
                    {link.key === 'anunciar' && <PlusCircle className="w-4 h-4 text-gold-400" />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gold-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-800/80">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 border border-stone-800 text-stone-200 font-bold text-center text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-stone-800 transition-colors"
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
