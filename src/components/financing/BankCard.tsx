'use client';

import { ExternalLink, ShieldCheck, Landmark } from 'lucide-react';
import { FinancingBank } from '@/data/financingBanks';

interface BankCardProps {
  bank: FinancingBank;
}

export default function BankCard({ bank }: BankCardProps) {
  const isCaixa = bank.isCaixaPrimary;

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
        isCaixa
          ? 'bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white border-2 border-stone-800 shadow-xl hover:shadow-2xl hover:border-stone-700'
          : 'bg-white text-stone-900 border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300'
      }`}
    >
      {/* Background Subtle Highlight for CAIXA */}
      {isCaixa && (
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isCaixa
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{bank.badge}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              isCaixa ? 'text-stone-400' : 'text-stone-500'
            }`}
            title="Link Oficial Direto"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isCaixa ? 'text-blue-400' : 'text-emerald-600'}`} />
            <span className="font-mono">{bank.officialDomain}</span>
          </span>
        </div>

        {/* Bank Title */}
        <h3
          className={`font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${
            isCaixa ? 'text-white' : 'text-stone-950'
          }`}
        >
          {bank.name}
        </h3>

        {/* Description */}
        <p
          className={`text-xs sm:text-sm font-medium leading-relaxed mb-6 ${
            isCaixa ? 'text-stone-300' : 'text-stone-600'
          }`}
        >
          {bank.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <a
          href={bank.simulatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500"
        >
          <span>{bank.buttonText}</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white" />
        </a>
        <span
          className={`block text-center text-[10px] uppercase tracking-widest font-semibold mt-2.5 ${
            isCaixa ? 'text-stone-400' : 'text-stone-400'
          }`}
        >
          Abre em nova aba no portal oficial
        </span>
      </div>
    </div>
  );
}
