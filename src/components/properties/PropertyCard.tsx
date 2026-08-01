'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Car, Maximize2, Star, Phone, ArrowUpRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';

interface PropertyCardProps {
  property: Property;
  priorityImage?: boolean;
}

export default function PropertyCard({ property, priorityImage = false }: PropertyCardProps) {
  const { settings } = useSettings();

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const whatsappMsg = `Olá ${settings.realtorName}, tenho interesse no imóvel "${property.title}" (Cód: ${property.code}). Gostaria de mais informações e agendar uma visita.`;
  const whatsappUrl = SettingsService.getWhatsAppUrl(settings, whatsappMsg);

  const statusBadge = property.status === 'vendido'
    ? { label: 'Vendido', cls: 'bg-red-600 text-white' }
    : property.status === 'alugado'
    ? { label: 'Alugado', cls: 'bg-blue-600 text-white' }
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-cream-300 hover:border-gold-400 transition-all duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-card-hover flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-stone-100">
        <Image
          src={property.mainImage || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-65 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-stone-900/90 text-gold-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-gold-500/30 capitalize">
              {property.type}
            </span>
            {property.featured && (
              <span className="bg-gold-gradient text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-glow-gold flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Destaque
              </span>
            )}
            {statusBadge && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            )}
          </div>
          <span className="bg-stone-900/80 text-stone-300 text-[10px] font-mono font-medium px-2 py-1 rounded-md">
            {property.code}
          </span>
        </div>

        {/* Price inside image */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <span className="text-[10px] text-stone-300 uppercase tracking-wider block font-medium">
            {property.purpose === 'aluguel' ? 'Valor do Aluguel' : 'Valor de Venda'}
          </span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {formatCurrency(property.price)}
            {property.purpose === 'aluguel' && <span className="text-sm font-normal text-stone-300">/mês</span>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div>
          <div className="flex items-center gap-1.5 text-stone-700 font-medium text-xs mb-2">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city}</span>
          </div>
          <Link href={`/imoveis/${property.id}`} className="group/title">
            <h3 className="font-serif text-lg font-bold text-stone-900 group-hover/title:text-gold-600 transition-colors line-clamp-2 leading-snug">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-cream-300 text-xs text-stone-700">
          {[
            { Icon: Maximize2, value: `${property.area} m²` },
            { Icon: Bed, value: `${property.bedrooms} Dorm.` },
            { Icon: Bath, value: `${property.bathrooms} Banh.` },
            { Icon: Car, value: `${property.parking} Vaga${property.parking !== 1 ? 's' : ''}` },
          ].map(({ Icon, value }) => (
            <div key={value} className="flex flex-col items-center justify-center p-2 rounded-lg bg-cream-100/90 border border-cream-300 shadow-sm">
              <Icon className="w-4 h-4 text-gold-600 mb-1" />
              <span className="font-bold text-stone-900 text-center leading-none">{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/imoveis/${property.id}`}
            className="flex-1 bg-cream-100/80 hover:bg-cream-200 text-stone-900 hover:text-navy-950 border border-cream-300 hover:border-gold-400 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>Ver Detalhes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-600" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center"
            title="Tenho Interesse"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
