'use client';

import { Building, DollarSign, Wallet, FileSpreadsheet, MessageSquare } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Escolha o banco',
      description: 'Selecione a instituição financeira de sua preferência (Caixa, Santander, Bradesco, Itaú ou BB).',
      icon: Building,
    },
    {
      number: '02',
      title: 'Informe o valor do imóvel',
      description: 'Insira o valor estimado do imóvel que você deseja adquirir no portal oficial do banco.',
      icon: DollarSign,
    },
    {
      number: '03',
      title: 'Informe sua entrada e renda',
      description: 'Preencha os seus dados financeiros para calcular as condições e o limite disponível para você.',
      icon: Wallet,
    },
    {
      number: '04',
      title: 'Faça a simulação no banco',
      description: 'Veja o resultado oficial emitido diretamente pelo banco, com estimativa de parcelas e juros.',
      icon: FileSpreadsheet,
    },
    {
      number: '05',
      title: 'Fale com o Sérgio',
      description: 'Envie o resultado ou o valor pretendido para encontrar os melhores imóveis dentro do seu orçamento.',
      icon: MessageSquare,
    },
  ];

  return (
    <section className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 bg-white px-3.5 py-1 rounded-full border border-stone-200 shadow-xs inline-block">
          Passo a Passo Simples
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-950 tracking-tight">
          COMO FUNCIONA?
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm font-medium">
          Entenda como realizar sua simulação oficial e encontrar seu novo imóvel sem complicações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-stone-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    {step.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 border border-stone-200">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-stone-950 text-sm leading-snug">
                  {step.title}
                </h3>
              </div>

              <p className="text-stone-600 text-xs leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
