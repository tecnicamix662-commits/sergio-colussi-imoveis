'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PropertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import PropertyForm from '@/components/admin/PropertyForm';
import { Building2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function EditarImovelPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    if (id) {
      const found = PropertyService.getPropertyById(id);
      setProperty(found ?? null);
    }
  }, [id]);

  if (property === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (property === null) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-white text-xl font-bold">Imóvel não encontrado</h2>
        <p className="text-slate-400 text-sm">O imóvel com ID "{id}" não existe ou foi excluído.</p>
        <Link href="/admin/imoveis" className="inline-block mt-2 text-gold-400 hover:text-gold-300 text-sm underline">
          ← Voltar para a lista
        </Link>
      </div>
    );
  }

  return <PropertyForm mode="edit" initialData={property} />;
}
