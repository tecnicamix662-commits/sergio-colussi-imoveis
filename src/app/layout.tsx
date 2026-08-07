import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import { SettingsProvider } from '@/contexts/SettingsContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sérgio Colussi Imóveis | Corretor de Imóveis no ABC Paulista - CRECI 92.920-F',
    template: '%s | Sérgio Colussi Imóveis',
  },
  description:
    'Com 22 anos de experiência no mercado imobiliário, Sérgio Colussi atua em Santo André, Mauá e região do ABC Paulista, oferecendo atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.',
  keywords: [
    'Sérgio Colussi Imóveis',
    'corretor de imóveis Santo André',
    'corretor de imóveis Mauá',
    'imóveis Santo André',
    'imóveis Mauá',
    'comprar imóvel Santo André',
    'comprar imóvel Mauá',
    'vender imóvel ABC Paulista',
    'avaliação de imóveis Santo André e Mauá',
    'CRECI 92.920-F',
    'imobiliária ABC Paulista',
  ],
  authors: [{ name: 'Sérgio Colussi Imóveis' }],
  creator: 'Sérgio Colussi Imóveis',
  metadataBase: new URL('https://sergiocolussi.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://sergiocolussi.com.br',
    title: 'Sérgio Colussi Imóveis | Corretor de Imóveis no ABC Paulista - CRECI 92.920-F',
    description:
      'Com 22 anos de experiência no mercado imobiliário do ABC Paulista. Atendimento transparente, seguro e personalizado para compra, venda e avaliação de imóveis.',
    siteName: 'Sérgio Colussi Imóveis',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sérgio Colussi Imóveis',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Sérgio Colussi Imóveis',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    telephone: '+55-11-99713-5790',
    email: 'sjcolussi@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santo André',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.6558,
      longitude: -46.5367,
    },
    areaServed: ['Santo André', 'Mauá', 'São Bernardo do Campo', 'São Caetano do Sul', 'São Vicente', 'ABC Paulista', 'Litoral Paulista'],
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream-100 text-stone-800 font-sans min-h-screen flex flex-col antialiased">
        <SettingsProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SettingsProvider>
      </body>
    </html>
  );
}
