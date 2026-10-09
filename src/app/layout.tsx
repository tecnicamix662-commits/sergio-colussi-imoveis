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
    default: 'Sérgio Colussi | Corretor de Imóveis no ABC Paulista - CRECI 92.920-F',
    template: '%s | Sérgio Colussi - Corretor de Imóveis',
  },
  description:
    'Corretor de imóveis com 22 anos de experiência no ABC Paulista. Atendimento direto para compra, venda e avaliação de imóveis em Santo André, São Bernardo do Campo e região.',
  keywords: [
    'Sérgio Colussi',
    'corretor de imóveis Santo André',
    'corretor de imóveis São Bernardo do Campo',
    'imóveis Santo André',
    'imóveis São Bernardo do Campo',
    'comprar imóvel Santo André',
    'vender imóvel ABC Paulista',
    'avaliação de imóveis ABC Paulista',
    'CRECI 92.920-F',
    'apartamentos à venda Santo André',
  ],
  authors: [{ name: 'Sérgio Colussi' }],
  creator: 'Sérgio Colussi',
  metadataBase: new URL('https://sergiocolussi.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://sergiocolussi.com.br',
    title: 'Sérgio Colussi | Corretor de Imóveis no ABC Paulista - CRECI 92.920-F',
    description:
      'Corretor de imóveis com 22 anos de atuação no ABC Paulista. Assessoria completa na compra, venda e avaliação de imóveis.',
    siteName: 'Sérgio Colussi - Corretor de Imóveis',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Sérgio Colussi - Corretor de Imóveis',
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
    name: 'Sérgio Colussi - Corretor de Imóveis',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
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
    areaServed: ['Santo André', 'Mauá', 'São Bernardo do Campo', 'São Caetano do Sul', 'São Vicente', 'Ribeirão Preto', 'ABC Paulista', 'Litoral Paulista'],
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
