'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import { MapPin, Navigation, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

interface PropertyMapProps {
  property: Property;
}

/**
 * Remove números prediais e complementos para manter 100% de privacidade do proprietário
 */
function getCleanStreetName(address?: string): string {
  if (!address || !address.trim()) return '';
  let clean = address.split(',')[0];
  clean = clean.replace(/\b\d+\b/g, ''); // remove dígitos isolados
  clean = clean.replace(/\b(apto|apt|bloco|bl|andar|casa|num|nº|no)\b.*/i, ''); // remove complementos
  return clean.trim();
}

export default function PropertyMap({ property }: PropertyMapProps) {
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  const cleanStreet = getCleanStreetName(property.address);
  
  // Monta a busca para o Google Maps sem o número da residência (apenas a rua/bairro/cidade)
  const searchQuery = cleanStreet
    ? `${cleanStreet}, ${property.neighborhood}, ${property.city}, SP, Brasil`
    : `${property.neighborhood}, ${property.city}, SP, Brasil`;

  const displayLocationText = cleanStreet
    ? `Região da ${cleanStreet} — ${property.neighborhood}, ${property.city}/SP`
    : `${property.neighborhood} — ${property.city}/SP`;

  // URL de embed do Google Maps (t=m é mapa padrão de ruas, t=k é mapa de satélite)
  const mapModeParam = mapType === 'satellite' ? 't=k' : 't=m';
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&${mapModeParam}&z=15&ie=UTF8&iwloc=&output=embed`;
  
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-4 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-stone-900" />
            Localização Aproximada
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-1">
            {displayLocationText}
          </p>
        </div>

        {/* Badge de Privacidade */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Endereço Exato Protegido</span>
        </div>
      </div>

      <p className="text-xs text-stone-600 font-medium leading-relaxed">
        Por questões de privacidade e segurança dos proprietários, exibimos a localização aproximada da região do imóvel. O endereço completo e agendamento de visita são fornecidos diretamente pelo corretor.
      </p>

      {/* Controles do Mapa: Ruas / Satélite / Google Maps Extenso */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-300">
          <button
            type="button"
            onClick={() => setMapType('streets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'streets'
                ? 'bg-stone-950 text-white shadow-xs font-extrabold'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modo Ruas / Mapa</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-stone-950 text-white shadow-xs font-extrabold'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Modo Satélite</span>
          </button>
        </div>

        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-black hover:underline px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-300 hover:border-stone-400 transition"
        >
          <span>Abrir no App Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
        </a>
      </div>

      {/* Container do Mapa Google Maps Iframe */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-300 shadow-inner">
        <iframe
          key={`${mapType}-${searchQuery}`}
          title={`Mapa da região - ${displayLocationText}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}