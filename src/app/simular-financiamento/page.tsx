import { Metadata } from 'next';
import { OFFICIAL_FINANCING_BANKS } from '@/data/financingBanks';
import BankCard from '@/components/financing/BankCard';
import HowItWorks from '@/components/financing/HowItWorks';
import DisclaimerNotice from '@/components/financing/DisclaimerNotice';
import RealtorContactCTA from '@/components/financing/RealtorContactCTA';
import { Calculator, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Simulação de Financiamento Imobiliário | Sérgio Colussi - Corretor de Imóveis',
  description:
    'Consulte as condições de crédito imobiliário nos simuladores oficiais dos principais bancos (Caixa, Santander, Bradesco, Itaú e Banco do Brasil).',
};

export default function SimularFinanciamentoPage() {
  const caixaBank = OFFICIAL_FINANCING_BANKS.find((b) => b.id === 'caixa');
  const otherBanks = OFFICIAL_FINANCING_BANKS.filter((b) => b.id !== 'caixa');

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-950 text-xs font-bold uppercase tracking-widest border border-stone-300 shadow-sm">
          <Calculator className="w-4 h-4 text-stone-900" />
          <span>Simuladores Bancários Oficiais</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          Simulação de Financiamento Imobiliário
        </h1>

        <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
          Consulte as condições de financiamento imobiliário diretamente nos portais oficiais dos principais bancos. Calcule prazos, entrada e estimativas de parcelas para planejar a compra do seu imóvel no ABC Paulista.
        </p>

        <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Acesso direto aos portais oficiais dos bancos para simulação de crédito imobiliário.</span>
        </div>
      </div>

      {/* Primary Highlight Card: CAIXA ECONÔMICA FEDERAL */}
      {caixaBank && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>Principal Instituição Habitacional</span>
          </div>
          <BankCard bank={caixaBank} />
        </div>
      )}

      {/* Outros Bancos Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
            Demais Instituições Financeiras
          </h2>
          <span className="text-xs font-medium text-stone-500 hidden sm:inline-block">
            Portais Oficiais
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherBanks.map((bank) => (
            <BankCard key={bank.id} bank={bank} />
          ))}
        </div>
      </div>

      {/* Como Funciona? */}
      <HowItWorks />

      {/* Disclaimer / Legal Security Notice */}
      <DisclaimerNotice />

      {/* Realtor WhatsApp & Credentials CTA */}
      <RealtorContactCTA />
    </div>
  );
}
