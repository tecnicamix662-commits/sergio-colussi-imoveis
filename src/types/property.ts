export type PropertyType = 'apartamento' | 'casa' | 'cobertura' | 'terreno' | 'comercial';
export type PropertyPurpose = 'venda' | 'aluguel';
export type PropertyStatus = 'disponivel' | 'vendido' | 'alugado' | 'inativo';

export interface Property {
  id: string;
  code: string;
  title: string;
  slug: string;
  price: number;
  condoFee?: number;
  iptuFee?: number;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  city: string;
  neighborhood: string;
  condominium?: string;
  address?: string;
  area: number; // m²
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  description: string;
  features: string[];
  images: string[];
  mainImage: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterParams {
  city?: string;
  neighborhood?: string;
  condominium?: string;
  type?: PropertyType | 'todos';
  purpose?: PropertyPurpose | 'todos';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'todos';
  parking?: number | 'todos';
  minArea?: number;
  searchQuery?: string;
  featuredOnly?: boolean;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  createdAt: string;
}

export interface SellerSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  city: string;
  neighborhood: string;
  estimatedPrice?: string;
  message?: string;
  images?: string[];
  createdAt: string;
}
