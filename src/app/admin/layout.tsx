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
  MapPin,
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
        { name: 'Gerenciar Bairros', href: '/admin/bairros', icon: MapPin },
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
    <div className="min-h-screen bg-stone-50 text-stone-900 flex font-sans">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-300 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-9 h-9 rounded-lg bg-stone-950 p-[1px] shadow-sm">
                <div className="w-full h-full bg-stone-950 rounded-[7px] flex items-center justify-center border border-stone-800">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-stone-950 tracking-wide">PAINEL ADMIN</span>
                <span className="text-[9px] text-stone-600 tracking-widest uppercase font-bold">Sérgio Colussi</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-600 hover:text-black p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Groups */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 bg-white">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-3 mb-2">
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
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-stone-950 text-white shadow-sm font-extrabold'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-black'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-stone-700'}`} />
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-stone-100 text-stone-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-stone-300">
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
          <div className="p-4 border-t border-stone-200 bg-white space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs transition-colors border border-stone-300 font-bold"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-900" />
                <span>Ver Site Público</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 bg-stone-50">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-stone-200 p-3 px-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-stone-100 text-stone-950 border border-stone-300 flex items-center gap-1.5 font-bold"
              aria-label="Menu do Painel"
            >
              <Menu className="w-5 h-5 text-stone-950" />
              <span className="text-xs font-bold">MENU</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/imoveis/novo"
              className="px-3 py-1.5 rounded-xl bg-stone-950 text-white font-bold text-xs flex items-center gap-1 shadow hover:bg-black transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>+ Imóvel</span>
            </Link>
            <Link
              href="/admin/configuracoes"
              className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-stone-950 font-bold text-xs flex items-center gap-1 shadow hover:bg-stone-200 transition-colors"
            >
              <Settings className="w-4 h-4 text-stone-950" />
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
