import { Property, PropertyFilterParams, LeadSubmission, SellerSubmission, PropertyStatus } from '@/types/property';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'SC-101',
    title: 'Cobertura Duplex Neoclássica no Bairro Jardim',
    slug: 'cobertura-duplex-neoclassica-bairro-jardim-santo-andre',
    price: 3850000,
    condoFee: 3200,
    iptuFee: 950,
    type: 'cobertura',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'Santo André',
    neighborhood: 'Bairro Jardim',
    condominium: 'Edifício Neoclássico Figueiras',
    address: 'Rua das Figueiras, Bairro Jardim',
    area: 420,
    bedrooms: 4,
    suites: 4,
    bathrooms: 6,
    parking: 5,
    description: 'Espectacular cobertura duplex de altíssimo padrão localizada no coração do Bairro Jardim em Santo André. Conta com vista 360º panorâmica da cidade, acabamentos em mármore italiano, espaço gourmet privativo com piscina aquecida e sauna, automação residencial de iluminação e som, e suíte máster com closet amplo e sala de banho.',
    features: [
      'Piscina Privativa Aquecida',
      'Espaço Gourmet',
      'Automação Residencial',
      'Mármore Italiano',
      'Elevador Privativo',
      'Suíte Máster com Closet',
      'Sauna Seca',
      'Gerador de Energia',
      'Portaria 24h Blindada',
      'Ar Condicionado Central'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    active: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'prop-2',
    code: 'SC-102',
    title: 'Mansão Arquitetura Contemporânea no Swiss Park',
    slug: 'mansao-arquitetura-contemporanea-swiss-park-sao-bernardo',
    price: 5900000,
    condoFee: 1850,
    iptuFee: 1200,
    type: 'casa',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'São Bernardo do Campo',
    neighborhood: 'Swiss Park',
    condominium: 'Condomínio Swiss Park',
    address: 'Alameda dos Pinheiros, Swiss Park',
    area: 650,
    bedrooms: 5,
    suites: 5,
    bathrooms: 7,
    parking: 6,
    description: 'Projeto assinado por renomado escritório de arquitetura no exclusivo condomínio Swiss Park em São Bernardo do Campo. Residência com pé-direito duplo de 7 metros, caixilharia integrada que conecta a área social ao paisagismo exuberante, piscina de borda infinita integrada com spa e fogo de chão.',
    features: [
      'Piscina Borda Infinita',
      'Pé-Direito Duplo',
      'Spa com Hidromassagem',
      'Fogo de Chão (Fire Pit)',
      'Home Theater Climatizado',
      'Adega Climatizada para 500 Garrafas',
      'Painéis Solares Fotovoltaicos',
      'Poço Artesiano',
      'Sistema de Segurança Integrado'
    ],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    active: true,
    createdAt: '2026-01-20T14:30:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
  },
  {
    id: 'prop-3',
    code: 'SC-103',
    title: 'Apartamento de Luxo com Varanda Gourmet no Campestre',
    slug: 'apartamento-luxo-varanda-gourmet-campestre-santo-andre',
    price: 1980000,
    condoFee: 1450,
    iptuFee: 480,
    type: 'apartamento',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'Santo André',
    neighborhood: 'Campestre',
    condominium: 'Residencial Jardinage',
    address: 'Rua das Monções, Campestre',
    area: 185,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    parking: 3,
    description: 'Excelente apartamento no Bairro Campestre em Santo André. Ambientes integrados com finíssimo acabamento, varanda gourmet envidraçada equipada com churrasqueira a carvão, armários planejados de altíssima marcenaria em todos os cômodos e condomínio clube completo.',
    features: [
      'Varanda Gourmet Envidraçada',
      'Churrasqueira a Carvão',
      'Marcenaria de Luxo',
      'Condomínio Clube',
      'Quadra de Tênis de Saibro',
      'Piscina Aquecida Coberta',
      'Academia Equipada Technogym',
      'Pet Place',
      'Depósito Privativo na Garagem'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    active: true,
    createdAt: '2026-01-22T09:15:00Z',
    updatedAt: '2026-01-22T09:15:00Z',
  },
  {
    id: 'prop-4',
    code: 'SC-104',
    title: 'Residência Neoclássica Exclusiva na Vila Assunção',
    slug: 'residencia-neoclassica-exclusiva-vila-assuncao-santo-andre',
    price: 4200000,
    condoFee: 0,
    iptuFee: 890,
    type: 'casa',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'Santo André',
    neighborhood: 'Vila Assunção',
    address: 'Rua Javaés, Vila Assunção',
    area: 480,
    bedrooms: 4,
    suites: 4,
    bathrooms: 6,
    parking: 5,
    description: 'Imponente casa térrea estilo neoclássico na charmosa Vila Assunção em Santo André. Projeto inteligente com amplas salas integradas ao jardim gramado, piscina aquecida com cascatas, quiosque gourmet, escritório privativo e suíte principal com closet generoso.',
    features: [
      'Casa Térrea de Alto Padrão',
      'Jardim Gramado',
      'Piscina com Cascata',
      'Quiosque Gourmet',
      'Escritório Privativo',
      'Sistema de Monitoramento 24h',
      'Garagem Coberta para 5 Carros'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    active: true,
    createdAt: '2026-01-25T16:00:00Z',
    updatedAt: '2026-01-25T16:00:00Z',
  },
  {
    id: 'prop-5',
    code: 'SC-105',
    title: 'Penthouse Contemporânea em Nova Petrópolis',
    slug: 'penthouse-contemporanea-nova-petropolis-sao-bernardo',
    price: 3450000,
    condoFee: 2600,
    iptuFee: 780,
    type: 'cobertura',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'São Bernardo do Campo',
    neighborhood: 'Nova Petrópolis',
    address: 'Av. Imperatriz Leopoldina, Nova Petrópolis',
    area: 380,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parking: 4,
    description: 'Penthouse espetacular no ponto mais nobre de Nova Petrópolis em São Bernardo do Campo. Acabamentos primorosos em porcelanato de grandes formatos, piso em madeira nobre nas suítes, terraço privativo com spa e vista aberta panorâmica da serra.',
    features: [
      'Spa Privativo',
      'Vista Aberta para a Serra',
      'Piso em Madeira Nobre',
      'Porcelanato Importado',
      'Cozinha com Ilha em Quartzo',
      'Elevador Social Privativo'
    ],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    active: true,
    createdAt: '2026-01-26T11:20:00Z',
    updatedAt: '2026-01-26T11:20:00Z',
  },
  {
    id: 'prop-6',
    code: 'SC-106',
    title: 'Apartamento de Luxo no Bairro Santa Maria',
    slug: 'apartamento-luxo-bairro-santa-maria-sao-caetano',
    price: 2400000,
    condoFee: 1750,
    iptuFee: 520,
    type: 'apartamento',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'São Caetano do Sul',
    neighborhood: 'Santa Maria',
    address: 'Alameda Clevelândia, Santa Maria',
    area: 210,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    parking: 3,
    description: 'Exclusividade e sofisticação em São Caetano do Sul. Planta moderna de 210m² com living para 3 ambientes totalmente integrado ao terraço gourmet, suíte máster com hidro e infraestrutura para ar condicionado em todos os ambientes.',
    features: [
      'Living Integrado 3 Ambientes',
      'Terraço Gourmet Envidraçado',
      'Suíte Máster com Hidro',
      'Lazer Completo no Condomínio',
      'Gerador para Áreas Privativas'
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    active: true,
    createdAt: '2026-01-28T15:45:00Z',
    updatedAt: '2026-01-28T15:45:00Z',
  },
  {
    id: 'prop-7',
    code: 'SC-107',
    title: 'Casa Térrea Moderna com Piscina no Anchieta',
    slug: 'casa-terrea-moderna-piscina-anchieta-sao-bernardo',
    price: 2750000,
    condoFee: 0,
    iptuFee: 650,
    type: 'casa',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'São Bernardo do Campo',
    neighborhood: 'Anchieta',
    address: 'Rua Euclides da Cunha, Anchieta',
    area: 320,
    bedrooms: 3,
    suites: 3,
    bathrooms: 5,
    parking: 4,
    description: 'Linda residência térrea no tradicional bairro Anchieta em São Bernardo do Campo. Acabamentos modernos, conceito aberto, área de lazer com piscina solar aquecida, espaço gourmet coberto e projeto de paisagismo tropical.',
    features: [
      'Conceito Aberto',
      'Piscina Solar Aquecida',
      'Espaço Gourmet Coberto',
      'Paisagismo Tropical',
      'Aquecimento Solar de Água'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    active: true,
    createdAt: '2026-01-29T10:00:00Z',
    updatedAt: '2026-01-29T10:00:00Z',
  },
  {
    id: 'prop-8',
    code: 'SC-108',
    title: 'Laje Comercial Corporativa na Av. Kennedy',
    slug: 'laje-comercial-corporativa-av-kennedy-sao-bernardo',
    price: 1250000,
    condoFee: 1600,
    iptuFee: 420,
    type: 'comercial',
    purpose: 'venda',
    status: 'disponivel' as PropertyStatus,
    city: 'São Bernardo do Campo',
    neighborhood: 'Anchieta',
    address: 'Av. Kennedy, Anchieta',
    area: 140,
    bedrooms: 0,
    suites: 0,
    bathrooms: 3,
    parking: 4,
    description: 'Conjunto comercial premium em edifício corporativo com heliponto e segurança 24h na movimentada Av. Kennedy. Ideal para escritórios de advocacia, clínicas de alto padrão ou multinacionais.',
    features: [
      'Edifício Corporativo A+',
      'Heliponto Homologado',
      'Portaria de Controle de Acesso',
      'Piso Elevado',
      '4 Vagas de Garagem Cobertas'
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    active: true,
    createdAt: '2026-01-29T14:15:00Z',
    updatedAt: '2026-01-29T14:15:00Z',
  }
];

const STORAGE_KEY = 'sergio_colussi_imoveis_data_v1';
const LEADS_KEY = 'sergio_colussi_leads_v1';
const SELLERS_KEY = 'sergio_colussi_seller_leads_v1';

export class PropertyService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getProperties(): Property[] {
    if (!this.isBrowser()) return INITIAL_PROPERTIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
        return INITIAL_PROPERTIES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading properties from storage', e);
      return INITIAL_PROPERTIES;
    }
  }

  private static saveProperties(properties: Property[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      // Dispatch custom event for real-time reactivity across components
      window.dispatchEvent(new Event('properties_updated'));
    } catch (e) {
      console.error('Error saving properties to storage', e);
    }
  }

  public static getActiveProperties(): Property[] {
    return this.getProperties().filter(p => p.active);
  }

  public static getFeaturedProperties(): Property[] {
    return this.getActiveProperties().filter(p => p.featured);
  }

  public static getPropertyById(id: string): Property | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  public static getPropertyBySlug(slug: string): Property | undefined {
    return this.getProperties().find(p => p.slug === slug || p.id === slug);
  }

  public static searchProperties(params: PropertyFilterParams): Property[] {
    let list = this.getActiveProperties();

    if (params.city && params.city !== 'todas' && params.city !== 'Todas') {
      list = list.filter(p => p.city.toLowerCase() === params.city?.toLowerCase());
    }

    if (params.neighborhood && params.neighborhood !== 'todos') {
      list = list.filter(p => p.neighborhood.toLowerCase() === params.neighborhood!.toLowerCase());
    }

    if (params.condominium && params.condominium !== 'todos') {
      list = list.filter(p => p.condominium && p.condominium.toLowerCase() === params.condominium!.toLowerCase());
    }

    if (params.type && params.type !== 'todos') {
      list = list.filter(p => p.type === params.type);
    }

    if (params.purpose && params.purpose !== 'todos') {
      list = list.filter(p => p.purpose === params.purpose);
    }

    if (params.minPrice) {
      list = list.filter(p => p.price >= params.minPrice!);
    }

    if (params.maxPrice) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    if (params.bedrooms && params.bedrooms !== 'todos') {
      const numBeds = Number(params.bedrooms);
      if (!isNaN(numBeds)) {
        list = list.filter(p => p.bedrooms >= numBeds);
      }
    }

    if (params.parking && params.parking !== 'todos') {
      const numParking = Number(params.parking);
      if (!isNaN(numParking)) {
        list = list.filter(p => p.parking >= numParking);
      }
    }

    if (params.minArea) {
      list = list.filter(p => p.area >= params.minArea!);
    }

    if (params.searchQuery) {
      const query = params.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.neighborhood.toLowerCase().includes(query) ||
        (p.condominium && p.condominium.toLowerCase().includes(query)) ||
        p.city.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (params.featuredOnly) {
      list = list.filter(p => p.featured);
    }

    return list;
  }

  public static getFilterOptions(filters?: { type?: string; city?: string; neighborhood?: string }) {
    const all = this.getActiveProperties();

    // 1. Tipos disponíveis no cadastro
    const types = Array.from(new Set(all.map(p => p.type))).filter(Boolean);

    // 2. Cidades filtradas pelo Tipo selecionado (se houver)
    let cityList = all;
    if (filters?.type && filters.type !== 'todos') {
      cityList = cityList.filter(p => p.type === filters.type);
    }
    const cities = Array.from(new Set(cityList.map(p => p.city))).filter(Boolean);

    // 3. Bairros filtrados por Tipo + Cidade
    let neighborhoodList = cityList;
    if (filters?.city && filters.city !== 'todas' && filters.city !== 'Todas') {
      neighborhoodList = neighborhoodList.filter(p => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    const neighborhoods = Array.from(new Set(neighborhoodList.map(p => p.neighborhood))).filter(Boolean);

    // 4. Condomínios filtrados por Tipo + Cidade + Bairro
    let condoList = neighborhoodList;
    if (filters?.neighborhood && filters.neighborhood !== 'todos') {
      condoList = condoList.filter(p => p.neighborhood.toLowerCase() === filters.neighborhood!.toLowerCase());
    }
    const condominiums = Array.from(new Set(condoList.map(p => p.condominium))).filter(Boolean) as string[];

    return { types, cities, neighborhoods, condominiums };
  }

  public static addProperty(data: Omit<Property, 'id' | 'code' | 'slug' | 'createdAt' | 'updatedAt'>): Property {
    const list = this.getProperties();
    const nextNum = list.length + 101;
    const code = `SC-${nextNum}`;
    const id = `prop-${Date.now()}`;
    const slug = `${data.title.toLowerCase().replace(/[^a-z0-0]/g, '-').replace(/-+/g, '-')}-${id}`;
    const now = new Date().toISOString();

    const newProperty: Property = {
      ...data,
      id,
      code,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newProperty);
    this.saveProperties(list);
    return newProperty;
  }

  public static updateProperty(id: string, data: Partial<Property>): Property | null {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updated: Property = {
      ...list[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveProperties(list);
    return updated;
  }

  public static deleteProperty(id: string): boolean {
    const list = this.getProperties();
    const filtered = list.filter(p => p.id !== id);
    if (filtered.length === list.length) return false;
    this.saveProperties(filtered);
    return true;
  }

  public static toggleActive(id: string): boolean {
    const property = this.getPropertyById(id);
    if (!property) return false;
    this.updateProperty(id, { active: !property.active });
    return true;
  }

  public static toggleFeatured(id: string): boolean {
    const property = this.getPropertyById(id);
    if (!property) return false;
    this.updateProperty(id, { featured: !property.featured });
    return true;
  }

  public static resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
      window.dispatchEvent(new Event('properties_updated'));
    }
  }

  // Leads submission storage
  public static saveLead(lead: Omit<LeadSubmission, 'id' | 'createdAt'>): LeadSubmission {
    const newLead: LeadSubmission = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (this.isBrowser()) {
      try {
        const stored = localStorage.getItem(LEADS_KEY);
        const leads: LeadSubmission[] = stored ? JSON.parse(stored) : [];
        leads.unshift(newLead);
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      } catch (e) {
        console.error('Error saving lead', e);
      }
    }
    return newLead;
  }

  public static getLeads(): LeadSubmission[] {
    if (!this.isBrowser()) return [];
    try {
      const stored = localStorage.getItem(LEADS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  public static saveSellerSubmission(submission: Omit<SellerSubmission, 'id' | 'createdAt'>): SellerSubmission {
    const newSub: SellerSubmission = {
      ...submission,
      id: `seller-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (this.isBrowser()) {
      try {
        const stored = localStorage.getItem(SELLERS_KEY);
        const list: SellerSubmission[] = stored ? JSON.parse(stored) : [];
        list.unshift(newSub);
        localStorage.setItem(SELLERS_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Error saving seller submission', e);
      }
    }
    return newSub;
  }
}
