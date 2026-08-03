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
  email: 'contato@sergiocolussi.com.br',

  address: 'Av. Saudade',
  neighborhood: 'Bairro Assunção',
  city: 'Santo André',
  state: 'SP',
  cep: '',

  businessHours: 'Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 13:00 (com agendamento)',

  logoUrl: '',
  faviconUrl: '',
  heroBannerUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
  realtorPhotoUrl: '/images/sergio-colussi.jpg',

  aboutText: 'Com 22 anos de experiência no mercado imobiliário, Sérgio Colussi atua em Santo André, Mauá e região do ABC Paulista, oferecendo um atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.\n\nCom conhecimento profundo da região e compromisso com cada cliente, seu objetivo é tornar o processo imobiliário mais simples, seguro e tranquilo, ajudando pessoas a encontrarem as melhores oportunidades.',
  heroTitle: 'Experiência e Confiança nos Melhores Endereços de Santo André, Mauá e Região',
  heroSubtitle: 'Com 22 anos de experiência no mercado imobiliário do ABC Paulista, oferecemos atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis em Santo André, Mauá e região.',
  footerDescription: 'Tradição e transparência na compra, venda e avaliação de imóveis em Santo André, Mauá e região do ABC Paulista. Atendimento seguro e personalizado para realizar bons negócios.',

  instagram: 'https://www.instagram.com/sjcolussi/',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
  youtube: '',

  metaTitle: 'Sérgio Colussi Imóveis | Compra, Venda e Avaliação em Santo André, Mauá e ABC Paulista',
  metaDescription: 'Com 22 anos de experiência, Sérgio Colussi atua em Santo André, Mauá e região do ABC Paulista oferecendo atendimento transparente e seguro para compra, venda e avaliação de imóveis.',
};
