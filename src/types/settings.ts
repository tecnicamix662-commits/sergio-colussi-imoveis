export interface SiteSettings {
  // Identidade da Imobiliária
  companyName: string;
  realtorName: string;
  creci: string;
  tagline: string;

  // Contato
  phone: string;
  whatsapp: string; // Ex: 5511999999999 (sem +, sem espaços)
  email: string;

  // Endereço
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;

  // Horário
  businessHours: string;

  // Imagens
  logoUrl: string;      // URL da logo (ou vazio para usar ícone padrão)
  faviconUrl: string;   // URL do favicon
  heroBannerUrl: string; // Banner principal da Home
  realtorPhotoUrl: string; // Foto do corretor

  // Textos Institucionais
  aboutText: string;
  heroTitle: string;
  heroSubtitle: string;
  footerDescription: string;

  // Redes Sociais
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'Sérgio Colussi',
  realtorName: 'Sérgio Colussi',
  creci: '92.920-F',
  tagline: 'Corretor de Imóveis • CRECI 92.920-F',

  phone: '(11) 99713-5790',
  whatsapp: '5511997135790',
  email: 'sjcolussi@gmail.com',

  address: 'Av. Saudade',
  neighborhood: 'Bairro Assunção',
  city: 'Santo André',
  state: 'SP',
  cep: '',

  businessHours: 'Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 13:00 (com agendamento)',

  logoUrl: '',
  faviconUrl: '',
  heroBannerUrl: '/images/hero-banner-dia-1.png',
  realtorPhotoUrl: '/images/sergio-colussi.jpg',

  aboutText: 'Corretor de imóveis com 22 anos de experiência no ABC Paulista, atuando principalmente em Santo André, São Bernardo do Campo e região. Atendimento direto e transparente para quem busca comprar, vender ou avaliar imóveis, com acompanhamento completo em todas as etapas da documentação e da negociação.',
  heroTitle: 'Imóveis à Venda em Santo André, São Bernardo do Campo e ABC Paulista',
  heroSubtitle: 'Corretor de imóveis com 22 anos de atuação na região. Atendimento direto, avaliação de mercado precisa e assessoria completa para compra e venda.',
  footerDescription: 'Sérgio Colussi, corretor de imóveis há 22 anos no ABC Paulista. Atendimento direto na compra, venda e avaliação de imóveis em Santo André, São Bernardo do Campo e região.',

  instagram: 'https://www.instagram.com/sjcolussi/',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
  youtube: '',

  metaTitle: 'Sérgio Colussi | Corretor de Imóveis no ABC Paulista - CRECI 92.920-F',
  metaDescription: 'Corretor de imóveis com 22 anos de experiência no ABC Paulista. Atendimento direto e seguro para compra, venda e avaliação de imóveis em Santo André e região.',
};
