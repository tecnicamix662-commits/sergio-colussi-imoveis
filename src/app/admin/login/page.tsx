'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthService } from '@/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const creds = AuthService.getCredentials();
    setEmail(creds.email);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (AuthService.login(email, password)) {
        router.push('/admin');
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stone-100 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-950 p-[1px] shadow-md">
              <div className="w-full h-full bg-stone-950 rounded-[11px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-stone-950 tracking-tight">
            Sérgio Colussi Imóveis
          </h1>
          <p className="text-xs text-stone-600 font-bold uppercase tracking-widest">
            Painel de Gestão Administrativa
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white p-8 rounded-3xl border-2 border-stone-200 space-y-6 shadow-2xl text-stone-900">
          <div className="space-y-1 text-center">
            <h2 className="font-serif text-2xl font-bold text-stone-900">Acessar Área Restrita</h2>
            <p className="text-xs text-stone-500 font-medium">Entre com suas credenciais de administrador</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs">
            <div>
              <label className="block text-stone-900 font-bold mb-1.5 uppercase tracking-wider text-xs">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@colussi.com.br"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  className="w-full border-2 border-stone-400 rounded-xl pl-10 pr-4 py-3 text-black text-sm font-bold placeholder-stone-500 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-900 font-bold mb-1.5 uppercase tracking-wider text-xs">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                  className="w-full border-2 border-stone-400 rounded-xl pl-10 pr-4 py-3 text-black text-sm font-bold placeholder-stone-500 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
              className="w-full py-4 rounded-xl font-extrabold text-base uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-400 hover:opacity-90 transition-all mt-2"
            >
              <span className="font-extrabold text-white text-base">{isLoading ? 'ENTRANDO...' : 'ENTRAR NO PAINEL'}</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-4 border-t border-stone-200 text-center space-y-2">
            <span className="text-[11px] text-stone-500 block font-semibold">Credenciais de Acesso:</span>
            <div className="bg-stone-100 p-3 rounded-xl border border-stone-300 font-mono text-xs text-stone-800 flex items-center justify-between shadow-sm">
              <span className="font-bold text-emerald-700">admin@colussi.com.br / admin123</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@colussi.com.br');
                  setPassword('admin123');
                }}
                className="text-[11px] bg-stone-900 hover:bg-stone-800 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
              >
                Preencher
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-stone-600 hover:text-stone-950 font-bold transition-colors">
            ← Voltar para o site público
          </Link>
        </div>
      </div>
    </div>
  );
}
