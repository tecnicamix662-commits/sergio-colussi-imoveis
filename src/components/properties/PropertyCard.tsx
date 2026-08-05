'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Car, Maximize2, Star, ArrowUpRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

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

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

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

            {/* Photo Counter Badge */}
            <div className="absolute top-3 right-28 z-10 bg-black/80 text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border border-stone-700 backdrop-blur-sm">
              {currentImgIndex + 1}/{images.length}
            </div>
          </>
        )}

        {/* Top Badges (DESTAQUE + VENDIDO/ALUGADO + CÓDIGO) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
            {property.featured && (
              <span className="bg-black text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-stone-600 flex items-center gap-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#00FF66] fill-[#00FF66] drop-shadow-[0_0_6px_rgba(0,255,102,0.9)]" />
                <span>Destaque</span>
              </span>
            )}
            {statusBadge && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            )}
          </div>
          <span className="bg-black/90 text-white text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-md border border-stone-600 shadow-sm pointer-events-auto">
            CÓD: {property.code}
          </span>
        </div>

        {/* Price inside image */}
        <div className="absolute bottom-3 left-4 right-4 z-10 space-y-0.5 pointer-events-none">
          <span className="text-[10px] text-stone-200 uppercase tracking-wider font-semibold block">
            {property.purpose === 'aluguel' ? 'Valor do Aluguel' : 'Valor de Venda'}
          </span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight block">
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
            <MessageCircle className="w-4 h-4 text-white fill-white" />
            <span>Chamar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
