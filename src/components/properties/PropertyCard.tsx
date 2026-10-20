'use client';
import { formatCurrency } from '@/lib/format';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Car, Maximize2, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.827.737 5.484 2.027 7.793L0 32l8.445-2.012A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.266 13.266 0 01-6.757-1.845l-.485-.287-5.01 1.194 1.27-4.878-.317-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.928c-.398-.199-2.356-1.162-2.72-1.295-.365-.133-.63-.199-.896.2-.265.397-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.216-2.759-.232-.398-.025-.613.175-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.896-2.16-1.228-2.958-.323-.778-.65-.672-.896-.684l-.763-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.322s1.427 3.854 1.626 4.12c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.954.304 1.823.261 2.51.158.765-.114 2.356-.963 2.688-1.894.333-.93.333-1.728.233-1.894-.1-.166-.365-.265-.763-.465z"/>
    </svg>
  );
}

interface PropertyCardProps {
  property: Property;
  priorityImage?: boolean;
}

export default function PropertyCard({ property, priorityImage = false }: PropertyCardProps) {
  const { settings } = useSettings();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.mainImage || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'];

  const currentImage = images[currentImgIndex] || images[0];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };



  const whatsappMsg = `Olá ${settings.realtorName}, tenho interesse no imóvel "${property.title}" (Cód: ${property.code}). Gostaria de mais informações e agendar uma visita.`;
  const whatsappUrl = SettingsService.getWhatsAppUrl(settings, whatsappMsg);

  const statusBadge = property.status === 'vendido'
    ? { label: 'Vendido', cls: 'bg-red-600 text-white' }
    : property.status === 'alugado'
    ? { label: 'Alugado', cls: 'bg-stone-800 text-white' }
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-black transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col h-full">
      {/* Image Container — FOTOS COM NAVEGAÇÃO DE SLIDE */}
      <div className="relative h-64 w-full overflow-hidden bg-stone-100 group/image">
        <Link href={`/imoveis/${property.id}`} className="block relative w-full h-full">
          <Image
            src={currentImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priorityImage}
            unoptimized={typeof currentImage === 'string' && currentImage.startsWith('data:')}
            className="object-cover group-hover/image:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover/image:opacity-65 transition-opacity" />
        </Link>

        {/* Navigation Arrows for Photos */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              type="button"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-80 hover:scale-110 shadow-md cursor-pointer"
              title="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={handleNextImage}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-80 hover:scale-110 shadow-md cursor-pointer"
              title="Próxima foto"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>


          </>
        )}

        {/* Top Badges (VENDIDO/ALUGADO, ACEITA PERMUTA, PREÇO REDUZIDO) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none items-start">
          {statusBadge && (
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md pointer-events-auto ${statusBadge.cls}`}>
              {statusBadge.label}
            </span>
          )}
          {property.acceptsExchange && (
            <span className="bg-black/85 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg border border-white/10 w-fit pointer-events-auto">
              ACEITA PERMUTA
            </span>
          )}
          {(property.isReducedPrice || (property.originalPrice && property.originalPrice > property.price)) && (
            <span className="bg-black/85 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg border border-white/10 w-fit pointer-events-auto">
              PREÇO REDUZIDO
            </span>
          )}
        </div>

        {/* Price inside image */}
        <div className="absolute bottom-3 left-4 right-4 z-10 space-y-0.5 pointer-events-none">
          <span className="text-[10px] text-stone-200 uppercase tracking-wider font-semibold block">
            {property.purpose === 'aluguel' ? 'Valor do Aluguel' : 'Valor de Venda'}
          </span>
          {property.originalPrice && property.originalPrice > property.price && (
            <span className="text-xs sm:text-sm font-bold text-amber-300 line-through block leading-tight opacity-95 drop-shadow-sm">
              De {formatCurrency(property.originalPrice)}
            </span>
          )}
          <span className="text-xl sm:text-2xl font-sans font-extrabold text-white tracking-tight block whitespace-nowrap">
            {formatCurrency(property.price)}
            {property.purpose === 'aluguel' && <span className="text-sm font-normal text-stone-300">/mês</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-stone-700 font-medium text-xs min-w-0">
              <MapPin className="w-3.5 h-3.5 text-stone-900 shrink-0" />
              <span className="truncate">{property.neighborhood}, {property.city}</span>
            </div>
          </div>
          <Link href={`/imoveis/${property.id}`} className="group/title">
            <h3 className="font-serif text-lg font-bold text-stone-950 group-hover/title:text-stone-600 transition-colors line-clamp-2 leading-snug">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-stone-200 text-xs text-stone-700">
          {[
            { Icon: Maximize2, value: `${property.area} m²` },
            { Icon: Bed, value: `${property.bedrooms} Dorm.` },
            { Icon: Bath, value: `${property.bathrooms} Banh.` },
            { Icon: Car, value: `${property.parking} Vaga${property.parking !== 1 ? 's' : ''}` },
          ].map(({ Icon, value }) => (
            <div key={value} className="flex flex-col items-center justify-center p-2 rounded-lg bg-stone-50 border border-stone-200">
              <Icon className="w-4 h-4 text-stone-900 mb-1" />
              <span className="font-bold text-stone-950 text-center leading-none">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/imoveis/${property.id}`}
            className="flex-1 bg-stone-100 hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-300 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ver Detalhes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 font-extrabold text-xs"
            title="Tenho interesse - Chamar no WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
