import { Property, PropertyFilterParams, LeadSubmission, SellerSubmission, PropertyStatus } from '@/types/property';

export const INITIAL_PROPERTIES: Property[] = [];

const PROPERTIES_KEY = 'sergio_colussi_properties_v2';
const LEADS_KEY = 'sergio_colussi_leads_v1';
const SELLERS_KEY = 'sergio_colussi_seller_leads_v1';

let inMemoryCache: Property[] | null = null;
let isSyncing = false;

export class PropertyService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private static loadFromLocalStorage(): Property[] {
    if (!this.isBrowser()) return [];
    try {
      const stored = localStorage.getItem(PROPERTIES_KEY);
      if (stored) {
        const parsed: Property[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading properties from localStorage:', e);
    }
    return [];
  }

  private static saveToLocalStorage(properties: Property[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error('Error saving properties to localStorage:', e);
    }
  }

  /**
   * Retorna os imóveis salvos.
   * Busca primeiro do cache/localStorage garantindo que NUNCA zere na troca de telas.
   */
  public static getProperties(): Property[] {
    if (inMemoryCache === null) {
      const local = this.loadFromLocalStorage();
      inMemoryCache = local;
      this.syncWithServer();
    }
    return inMemoryCache || [];
  }

  /**
   * Sincroniza dados com o servidor Supabase via API route.
   */
  public static async syncWithServer(): Promise<Property[]> {
    if (!this.isBrowser() || isSyncing) return inMemoryCache || this.loadFromLocalStorage();
    isSyncing = true;
    try {
      const res = await fetch('/api/properties', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const serverList: Property[] = data.properties || [];
        
        if (serverList.length > 0) {
          this.updateCache(serverList);
          return serverList;
        } else if (!inMemoryCache || inMemoryCache.length === 0) {
          const local = this.loadFromLocalStorage();
          if (local.length > 0) {
            this.updateCache(local);
            return local;
          }
        }
      }
    } catch (e) {
      console.warn('Sincronização com o servidor indisponível:', e);
    } finally {
      isSyncing = false;
    }
    return inMemoryCache || this.loadFromLocalStorage();
  }

  private static updateCache(properties: Property[]): void {
    // Ordena garantindo os imóveis em DESTAQUE fixados em 1º lugar (no topo)
    const sorted = [...properties].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    inMemoryCache = sorted;
    this.saveToLocalStorage(sorted);

    if (this.isBrowser()) {
      window.dispatchEvent(new Event('properties_updated'));
    }
  }

  public static getActiveProperties(): Property[] {
    return this.getProperties().filter((p) => p.active);
  }

  public static getFeaturedProperties(): Property[] {
    return this.getActiveProperties().filter((p) => p.featured);
  }

  public static getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id);
  }

  public static getPropertyBySlug(slug: string): Property | undefined {
    const list = this.getProperties();
    return list.find(
      (p) =>
        p.slug === slug ||
        p.id === slug ||
        p.code.toLowerCase() === slug.toLowerCase()
    );
  }

  public static searchProperties(params: PropertyFilterParams): Property[] {
    let list = this.getActiveProperties();

    if (params.city && params.city !== 'todas' && params.city !== 'Todas') {
      list = list.filter((p) => p.city.toLowerCase() === params.city?.toLowerCase());
    }

    if (params.neighborhood && params.neighborhood !== 'todos') {
      list = list.filter((p) => p.neighborhood.toLowerCase() === params.neighborhood!.toLowerCase());
    }

    if (params.condominium && params.condominium !== 'todos') {
      list = list.filter((p) => p.condominium && p.condominium.toLowerCase() === params.condominium!.toLowerCase());
    }

    if (params.type && params.type !== 'todos') {
      list = list.filter((p) => p.type === params.type);
    }

    if (params.purpose && params.purpose !== 'todos') {
      list = list.filter((p) => p.purpose === params.purpose);
    }

    if (params.minPrice) {
      list = list.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice) {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.bedrooms && params.bedrooms !== 'todos') {
      const numBeds = Number(params.bedrooms);
      if (!isNaN(numBeds)) {
        list = list.filter((p) => p.bedrooms >= numBeds);
      }
    }

    if (params.parking && params.parking !== 'todos') {
      const numParking = Number(params.parking);
      if (!isNaN(numParking)) {
        list = list.filter((p) => p.parking >= numParking);
      }
    }

    if (params.minArea) {
      list = list.filter((p) => p.area >= params.minArea!);
    }

    if (params.searchQuery) {
      const query = params.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query) ||
          (p.condominium && p.condominium.toLowerCase().includes(query)) ||
          p.city.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (params.featuredOnly) {
      list = list.filter((p) => p.featured);
    }

    return list;
  }

  public static getFilterOptions(filters?: { type?: string; city?: string; neighborhood?: string }) {
    const all = this.getActiveProperties();

    const types = Array.from(new Set(all.map((p) => p.type))).filter(Boolean);

    let cityList = all;
    if (filters?.type && filters.type !== 'todos') {
      cityList = cityList.filter((p) => p.type === filters.type);
    }
    const cities = Array.from(new Set(cityList.map((p) => p.city))).filter(Boolean);

    let neighborhoodList = cityList;
    if (filters?.city && filters.city !== 'todas' && filters.city !== 'Todas') {
      neighborhoodList = neighborhoodList.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    const neighborhoods = Array.from(new Set(neighborhoodList.map((p) => p.neighborhood))).filter(Boolean);

    let condoList = neighborhoodList;
    if (filters?.neighborhood && filters.neighborhood !== 'todos') {
      condoList = condoList.filter((p) => p.neighborhood.toLowerCase() === filters.neighborhood!.toLowerCase());
    }
    const condominiums = Array.from(new Set(condoList.map((p) => p.condominium))).filter(Boolean) as string[];

    return { types, cities, neighborhoods, condominiums };
  }

  /**
   * Cadastra um novo imóvel no Supabase via API.
   * Aguarda a resposta do servidor antes de atualizar o cache.
   */
  public static async addProperty(data: Omit<Property, 'id' | 'code' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar imóvel');
    }

    const saved: Property = await response.json();

    // Atualiza cache local
    const current = inMemoryCache ? [...inMemoryCache] : [];
    current.unshift(saved);
    this.updateCache(current);

    return saved;
  }

  /**
   * Atualiza um imóvel existente no Supabase via API.
   * Aguarda a resposta do servidor antes de atualizar o cache.
   */
  public static async updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
    const response = await fetch('/api/properties', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar imóvel no servidor');
    }

    const updated: Property = await response.json();

    // Atualiza cache local
    if (inMemoryCache) {
      const list = [...inMemoryCache];
      const index = list.findIndex((p) => p.id === id);
      if (index !== -1) {
        list[index] = updated;
      }
      this.updateCache(list);
    }

    return updated;
  }

  /**
   * Exclui um imóvel do Supabase via API.
   * Aguarda confirmação do servidor antes de atualizar o cache.
   */
  public static async deleteProperty(id: string): Promise<boolean> {
    const response = await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Erro ao excluir imóvel no servidor');
      return false;
    }

    // Atualiza cache local
    if (inMemoryCache) {
      const filtered = inMemoryCache.filter((p) => p.id !== id);
      this.updateCache(filtered);
    }

    return true;
  }

  public static async toggleActive(id: string): Promise<boolean> {
    const property = this.getPropertyById(id);
    if (!property) return false;
    await this.updateProperty(id, { active: !property.active });
    return true;
  }

  public static async toggleFeatured(id: string): Promise<boolean> {
    const property = this.getPropertyById(id);
    if (!property) return false;
    await this.updateProperty(id, { featured: !property.featured });
    return true;
  }

  public static resetToDefaults(): void {
    inMemoryCache = [];
    if (this.isBrowser()) {
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

        // Dispara notificação por e-mail para sjcolussi@gmail.com
        fetch('/api/send-lead-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            message: lead.message,
            propertyTitle: lead.propertyTitle,
            type: 'lead',
          }),
        }).catch((err) => console.warn('Erro ao disparar e-mail de notificação:', err));
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

        // Dispara notificação por e-mail para sjcolussi@gmail.com
        fetch('/api/send-lead-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: submission.name,
            phone: submission.phone,
            email: submission.email,
            message: `Solicitação de anúncio de imóvel (${submission.propertyType || 'Imóvel'}, ${submission.city || 'Santo André'}). ${submission.message || ''}`,
            type: 'seller',
          }),
        }).catch((err) => console.warn('Erro ao disparar e-mail de notificação:', err));
      } catch (e) {
        console.error('Error saving seller submission', e);
      }
    }
    return newSub;
  }
}
