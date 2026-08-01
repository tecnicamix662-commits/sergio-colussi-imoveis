'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  LayoutDashboard,
  PlusCircle,
  ListFilter,
  LogOut,
  ShieldCheck,
  Globe,
  Settings,
  ChevronRight,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react';

interface NavGroup {
  label: string;
  items: { name: string; href: string; icon: React.ElementType; badge?: string }[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('sergio_colussi_admin_auth');
    if (!auth && pathname !== '/admin/login') {
      router.push('/admin/login');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  if (isAuthenticated === false) return null;

  const handleLogout = () => {
    localStorage.removeItem('sergio_colussi_admin_auth');
    router.push('/admin/login');
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Visão Geral',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Imóveis',
      items: [
        { name: 'Todos os Imóveis', href: '/admin/imoveis', icon: ListFilter },
        { name: 'Cadastrar Imóvel', href: '/admin/imoveis/novo', icon: PlusCircle },
      ],
    },
    {
      label: 'Configurações',
      items: [
        { name: 'Configurações do Site', href: '/admin/configuracoes', icon: Settings },
        { name: 'Mensagens / Leads', href: '/admin/mensagens', icon: MessageSquare },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0a0f1e] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-9 h-9 rounded-lg bg-gold-gradient p-[1px] shadow-glow-gold">
                <div className="w-full h-full bg-navy-900 rounded-[7px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gold-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-white tracking-wide">PAINEL ADMIN</span>
                <span className="text-[9px] text-gold-400 tracking-widest uppercase">Sérgio Colussi</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Groups */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-stone-800 text-white border border-stone-700 shadow-md'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-gold-400' : 'text-gold-400/80'}`} />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-gold-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-gold-400 text-xs transition-colors border border-slate-800"
            >
              <span className="flex items-center gap-2 font-medium">
                <Globe className="w-4 h-4 text-gold-400" />
                <span>Ver Site Público</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#0a0f1e] border-b border-slate-800 p-3 px-4 flex items-center justify-between sticky top-0 z-20 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-stone-900 text-white border border-stone-700 flex items-center gap-1.5"
              aria-label="Menu do Painel"
            >
              <Menu className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-bold">MENU</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/imoveis/novo"
              className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-xs flex items-center gap-1 shadow"
            >
              <PlusCircle className="w-4 h-4 text-gold-400" />
              <span>+ Imóvel</span>
            </Link>
            <Link
              href="/admin/configuracoes"
              className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-bold text-xs flex items-center gap-1 shadow"
            >
              <Settings className="w-4 h-4 text-gold-400" />
              <span>Fotos</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
