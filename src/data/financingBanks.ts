export interface FinancingBank {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  buttonText: string;
  simulatorUrl: string;
  officialDomain: string;
  accentColor: string;
  isCaixaPrimary?: boolean;
}

export const OFFICIAL_FINANCING_BANKS: FinancingBank[] = [
  {
    id: 'caixa',
    name: 'Caixa Econômica Federal',
    shortName: 'CAIXA',
    badge: 'Líder em Crédito Habitacional',
    description: 'Maior instituição de financiamento imobiliário do país. Simule linhas SBPE, Minha Casa Minha Vida e uso do FGTS.',
    buttonText: 'SIMULAR NA CAIXA',
    simulatorUrl: 'https://simuladorhabitacao.caixa.gov.br/',
    officialDomain: 'caixa.gov.br',
    accentColor: '#005CA9',
    isCaixaPrimary: true,
  },
  {
    id: 'santander',
    name: 'Banco Santander',
    shortName: 'Santander',
    badge: 'Financiamento Imobiliário',
    description: 'Simulação rápida para imóveis residenciais e comerciais com taxas competitivas e composição de renda.',
    buttonText: 'SIMULAR NO SANTANDER',
    simulatorUrl: 'https://www.santander.com.br/credito-financiamento/imoveis',
    officialDomain: 'santander.com.br',
    accentColor: '#EC0000',
  },
  {
    id: 'bradesco',
    name: 'Banco Bradesco',
    shortName: 'Bradesco',
    badge: 'Crédito Imobiliário Bradesco',
    description: 'Consulte prazos de até 35 anos, valores de amortização e condições personalizadas no portal oficial.',
    buttonText: 'SIMULAR NO BRADESCO',
    simulatorUrl: 'https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/imoveis/index.shtm',
    officialDomain: 'banco.bradesco',
    accentColor: '#CC092F',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    shortName: 'Itaú',
    badge: 'Crédito Imobiliário Itaú',
    description: 'Simule online o valor da parcela, pré-aprovação de crédito e opções com juros fixos ou atrelados ao rendimento.',
    buttonText: 'SIMULAR NO ITAÚ',
    simulatorUrl: 'https://www.itau.com.br/credito-imobiliario',
    officialDomain: 'itau.com.br',
    accentColor: '#EC7000',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    shortName: 'Banco do Brasil',
    badge: 'Crédito Imobiliário BB',
    description: 'Faça a simulação no portal oficial do Banco do Brasil para clientes correntistas e não correntistas.',
    buttonText: 'SIMULAR NO BANCO DO BRASIL',
    simulatorUrl: 'https://www.bb.com.br/site/pra-voce/credito-imobiliario/',
    officialDomain: 'bb.com.br',
    accentColor: '#0038A8',
  },
];
