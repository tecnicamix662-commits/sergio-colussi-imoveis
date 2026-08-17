'use client';

import { ShieldAlert } from 'lucide-react';

export default function DisclaimerNotice() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-stone-900 flex items-start gap-4 shadow-sm">
      <div className="p-2 bg-amber-500/20 text-amber-800 rounded-xl shrink-0 mt-0.5">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="space-y-1 text-xs sm:text-sm">
        <h4 className="font-bold text-amber-950 uppercase tracking-wider text-xs">
          Aviso de Segurança e Condições Bancárias
        </h4>
        <p className="text-stone-700 leading-relaxed font-medium">
          “Os resultados apresentados pelos bancos são simulações e podem sofrer alterações. A aprovação do financiamento depende da análise de crédito, documentação, avaliação do imóvel e demais critérios da instituição financeira.”
        </p>
      </div>
    </div>
  );
}
