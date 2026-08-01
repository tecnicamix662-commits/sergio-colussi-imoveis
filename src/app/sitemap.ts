import { MetadataRoute } from 'next';
import { PropertyService } from '@/services/propertyService';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sergiocolussi.com.br';

  const properties = PropertyService.getProperties();
  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.id}`,
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/anunciar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cartao-digital`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...propertyUrls,
  ];
}
