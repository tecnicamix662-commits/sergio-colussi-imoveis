import { Property, PropertyFilterParams, LeadSubmission, SellerSubmission, PropertyStatus } from '@/types/property';

export const INITIAL_PROPERTIES: Property[] = [];

const STORAGE_KEY = 'sergio_colussi_imoveis_data_v2';
const LEADS_KEY = 'sergio_colussi_leads_v1';
const SELLERS_KEY = 'sergio_colussi_seller_leads_v1';

let inMemoryCache: Property[] | null = null;
let isSyncing = false;

export class PropertyService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Sincroniza dados de imóveis com o banco de dados permanente no servidor (/api/properties).
   */
  public static async syncWithServer(): Promise<Property[]> {
    if (!this.isBrowser() || isSyncing) return inMemoryCache || [];
    isSyncing = true;
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        const serverList: Property[] = data.properties || [];
        inMemoryCache = serverList;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverList));
        window.dispatchEvent(new Event('properties_updated'));
        return serverList;
      }
    } catch (e) {
      console.warn('Sincronização com o servidor indisponível:', e);
    } finally {
      isSyncing = false;
    }
    return inMemoryCache || this.getProperties();
  }

  public static getProperties(): Property[] {
    if (inMemoryCache !== null) return inMemoryCache;

    if (!this.isBrowser()) return INITIAL_PROPERTIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.syncWithServer();
        return INITIAL_PROPERTIES;
      }
      const parsed = JSON.parse(stored);
      inMemoryCache = parsed;
      this.syncWithServer();
      return parsed;
    } catch (e) {
      console.error('Error reading properties from storage', e);
      return INITIAL_PROPERTIES;
    }
  }

  private static saveProperties(properties: Property[]): void {
    inMemoryCache = properties;
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      window.dispatchEvent(new Event('properties_updated'));
    } catch (e) {
      console.error('Error saving properties to storage', e);
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

  public static addProperty(data: Omit<Property, 'id' | 'code' | 'slug' | 'createdAt' | 'updatedAt'>): Property {
    const list = [...this.getProperties()];
    const now = new Date().toISOString();
    const tempId = `prop-${Date.now()}`;
    const tempCode = `SC${String(list.length + 1).padStart(3, '0')}`;
    const slugTitle = (data.title || 'imovel')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const tempSlug = `${slugTitle}-${tempId}`;

    const newProperty: Property = {
      ...data,
      id: tempId,
      code: tempCode,
      slug: tempSlug,
      createdAt: now,
      updatedAt: now,
    };

    // Atualização otimista local
    list.unshift(newProperty);
    this.saveProperties(list);

    // Envia para persistência permanente no servidor (/api/properties)
    if (this.isBrowser()) {
      fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((saved: Property | null) => {
          if (saved && saved.id) {
            const current = [...this.getProperties()];
            const idx = current.findIndex((p) => p.id === tempId);
            if (idx !== -1) {
              current[idx] = saved;
            } else {
              current.unshift(saved);
            }
            this.saveProperties(current);
          }
        })
        .catch((err) => console.error('Erro ao salvar imóvel no servidor:', err));
    }

    return newProperty;
  }

  public static updateProperty(id: string, data: Partial<Property>): Property | null {
    const list = [...this.getProperties()];
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updated: Property = {
      ...existing,
      ...data,
      id: existing.id,
      code: existing.code, // CÓDIGO NUNCA MUDA AO EDITAR
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveProperties(list);

    // Envia atualização para o servidor
    if (this.isBrowser()) {
      fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      }).catch((err) => console.error('Erro ao atualizar imóvel no servidor:', err));
    }

    return updated;
  }

  public static deleteProperty(id: string): boolean {
    const list = this.getProperties();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    this.saveProperties(filtered);

    // Envia requisição de exclusão para o servidor (código não é reutilizado)
    if (this.isBrowser()) {
      fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch((err) => console.error('Erro ao excluir imóvel no servidor:', err));
    }

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
