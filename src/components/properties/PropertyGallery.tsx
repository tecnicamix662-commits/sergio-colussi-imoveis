'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const galleryImages = images && images.length > 0 ? images : [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2371717a">Sem Fotos Cadastradas</text></svg>'
  ];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Active Image Container */}
      <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-2xl">
        <Image
          src={galleryImages[activeIdx]}
          alt={`${title} - Foto ${activeIdx + 1}`}
          fill
          priority
          unoptimized={typeof galleryImages[activeIdx] === 'string' && galleryImages[activeIdx].startsWith('data:')}
          className="object-cover transition-all duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />



        {/* Expand Lightbox Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 bg-navy-950/80 hover:bg-gold-500 text-white hover:text-navy-950 p-2.5 rounded-xl border border-slate-700/60 transition-all backdrop-blur-md shadow-lg"
          title="Ampliar Galeria Fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Gallery Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy-950/80 hover:bg-gold-500 text-white hover:text-navy-950 p-3 rounded-full border border-slate-700/60 transition-all backdrop-blur-md"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy-950/80 hover:bg-gold-500 text-white hover:text-navy-950 p-3 rounded-full border border-slate-700/60 transition-all backdrop-blur-md"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 w-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === idx
                  ? 'border-gold-500 scale-105 shadow-glow-gold'
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <Image
                src={img}
                alt={`${title} miniatura ${idx + 1}`}
                fill
                unoptimized={typeof img === 'string' && img.startsWith('data:')}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10 text-white">
            <div>
              <h3 className="font-serif font-bold text-lg">{title}</h3>
              <p className="text-xs text-slate-400">
                Foto {activeIdx + 1} de {galleryImages.length}
              </p>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Main Image */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            <Image
              src={galleryImages[activeIdx]}
              alt={title}
              fill
              unoptimized={typeof galleryImages[activeIdx] === 'string' && galleryImages[activeIdx].startsWith('data:')}
              className="object-contain"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 bg-slate-900/80 hover:bg-gold-500 text-white hover:text-navy-950 p-4 rounded-full border border-slate-700"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 bg-slate-900/80 hover:bg-gold-500 text-white hover:text-navy-950 p-4 rounded-full border border-slate-700"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeIdx === idx ? 'border-gold-500 scale-110' : 'border-slate-800 opacity-50'
                }`}
              >
                <Image src={img} alt="thumb" fill unoptimized={typeof img === 'string' && img.startsWith('data:')} className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
