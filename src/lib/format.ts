/**
 * Utilitários de formatação de valores monetários no padrão brasileiro oficial.
 *
 * Regras estritas:
 * - Sempre começar com "R$"
 * - Ter exatamente um espaço entre "R$" e o valor
 * - Usar ponto (.) como separador de milhares
 * - Usar vírgula (,) para os centavos
 * - SEMPRE mostrar duas casas decimais: ",00"
 * - Valores inteiros também aparecem com ",00"
 *
 * Exemplos:
 * 900000   -> "R$ 900.000,00"
 * 420000   -> "R$ 420.000,00"
 * 760000   -> "R$ 760.000,00"
 * 1050000  -> "R$ 1.050.000,00"
 * 1350000  -> "R$ 1.350.000,00"
 * 1690000  -> "R$ 1.690.000,00"
 */

export function formatCurrency(value?: number | string | null): string {
  if (value === undefined || value === null || value === '') {
    return 'R$ 0,00';
  }

  let numeric: number;
  if (typeof value === 'number') {
    numeric = value;
  } else {
    const cleanStr = String(value).trim();
    if (!cleanStr) return 'R$ 0,00';
    // Remove prefixo R$ e espaços se existirem, depois remove pontos de milhar e troca vírgula decimal por ponto
    const sanitized = cleanStr.replace(/^R\$\s?/, '').replace(/\./g, '').replace(',', '.');
    numeric = parseFloat(sanitized);
  }

  if (isNaN(numeric) || !isFinite(numeric)) {
    return 'R$ 0,00';
  }

  const formattedNumber = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);

  return `R$ ${formattedNumber}`;
}

/**
 * Converte valor digitado em campo de formulário para exibição formatada e número puro.
 */
export function formatToBRL(value: string | number): { display: string; numeric: number } {
  if (value === '' || value === null || value === undefined) {
    return { display: '', numeric: 0 };
  }

  let numeric = 0;
  if (typeof value === 'number') {
    numeric = value;
  } else {
    const digits = String(value).replace(/\D/g, '');
    if (!digits) return { display: '', numeric: 0 };
    numeric = parseInt(digits, 10) / 100;
  }

  if (numeric <= 0) return { display: '', numeric: 0 };

  const display = formatCurrency(numeric);

  return { display, numeric };
}
