// Serviço centralizado para gestão dos Bairros Oficiais por Cidade (Santo André, SBC, Mauá, SCS)

export const OFFICIAL_NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  'Santo André': [
    'Bangú',
    'Bairro Jardim',
    'Campestre',
    'Casa Branca',
    'Cata Preta',
    'Centro',
    'Cidade São Jorge',
    'Condomínio Maracanã',
    'Jardim Alzira Franco',
    'Jardim Alvorada',
    'Jardim Bela Vista',
    'Jardim Bom Pastor',
    'Jardim Ciprestes',
    'Jardim Cristiane',
    'Jardim do Estádio',
    'Jardim Guarará',
    'Jardim Ipanema',
    'Jardim Jamaica',
    'Jardim Las Vegas',
    'Jardim Milena',
    'Jardim Oriental',
    'Jardim Paraíso',
    'Jardim Pilar',
    'Jardim Santa Cristina',
    'Jardim Santo Alberto',
    'Jardim Santo André',
    'Jardim Santo Antônio',
    'Jardim Stella',
    'Jardim Teresópolis',
    'Parque Capuava',
    'Parque das Nações',
    'Parque Erasmo Assunção',
    'Parque Jaçatuba',
    'Parque João Ramalho',
    'Parque Novo Oratório',
    'Parque Oratório',
    'Recreio da Borda do Campo',
    'Santa Teresinha',
    'Utinga',
    'Vila Alice',
    'Vila Alpina',
    'Vila Alzira',
    'Vila América',
    'Vila Apiaí',
    'Vila Assunção',
    'Vila Bastos',
    'Vila Camilópolis',
    'Vila Cecília Maria',
    'Vila Curuçá',
    'Vila Floresta',
    'Vila Gilda',
    'Vila Guiomar',
    'Vila Humaitá',
    'Vila Junqueira',
    'Vila Linda',
    'Vila Lutécia',
    'Vila Luzita',
    'Vila Metalúrgica',
    'Vila Palmares',
    'Vila Paraíso',
    'Vila Pires',
    'Vila Sacadura Cabral',
    'Vila Scarpelli',
    'Vila Suíça',
    'Vila Tibiriçá',
    'Vila Valparaíso',
    'Vila Vitória',
  ],
  'São Bernardo do Campo': [
    'Anchieta',
    'Assunção',
    'Baeta Neves',
    'Batelão',
    'Centro',
    'Demarchi',
    'Dos Casa',
    'Ferrazópolis',
    'Jardim do Mar',
    'Jardim Hollywood',
    'Jardim Sea',
    'Jordanópolis',
    'Nova Petrópolis',
    'Paulicéia',
    'Planalto',
    'Rudge Ramos',
    'Santa Teresinha',
    'Swiss Park',
    'Vila Caminho do Mar',
    'Vila Euclides',
    'Vila Lusitânia',
    'Vila Marchi',
  ],
  'Mauá': [
    'Capuava',
    'Centro',
    'Jardim Guapituba',
    'Jardim Mauá',
    'Jardim Primavera',
    'Jardim Zaira',
    'Matriz',
    'Parque São Vicente',
    'Vila Assis Brasil',
    'Vila Bocaina',
    'Vila Guarani',
    'Vila Noêmia',
    'Vila Victória',
  ],
  'São Caetano do Sul': [
    'Barcelona',
    'Boa Vista',
    'Centro',
    'Cerâmica',
    'Fundação',
    'Jardim São Caetano',
    'Mauá',
    'Nova Gérsia',
    'Olímpico',
    'Oswaldo Cruz',
    'Prosperidade',
    'Santa Maria',
    'Santa Paula',
    'Santo Antônio',
    'São José',
  ],
  'São Vicente': [
    'Beira Mar',
    'Bitaram',
    'Boa Vista',
    'Catiapoã',
    'Centro',
    'Cidade Náutica',
    'Esplanada dos Barreiros',
    'Gonzaguinha',
    'Humaitá',
    'Ilha Porchat',
    'Itararé',
    'Japuí',
    'Parque Bitaram',
    'Parque das Américas',
    'Parque São Vicente',
    'Quarentenário',
    'Vila Eslania',
    'Vila Industrial',
    'Vila Margarida',
    'Vila Melo',
    'Vila Nova São Vicente',
    'Vila Valença',
    'Voturuá',
  ],
};

const STORAGE_KEY = 'sergio_colussi_custom_neighborhoods_v1';

export class NeighborhoodService {
  /**
   * Retorna os bairros organizados para a cidade informada.
   * Se nenhuma cidade for selecionada ou "todas", retorna a combinação de todas.
   */
  static getNeighborhoodsByCity(city?: string): string[] {
    const customData = this.getCustomNeighborhoodsMap();
    
    if (city && city !== 'todas' && city !== 'Todas') {
      const defaults = OFFICIAL_NEIGHBORHOODS_BY_CITY[city] || [];
      const customs = customData[city] || [];
      const combined = Array.from(new Set([...defaults, ...customs]));
      return combined.sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }

    // Se todas as cidades
    const set = new Set<string>();
    Object.values(OFFICIAL_NEIGHBORHOODS_BY_CITY).forEach((list) => list.forEach((n) => set.add(n)));
    Object.values(customData).forEach((list) => list.forEach((n) => set.add(n)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }

  /**
   * Adiciona um novo bairro para a cidade especificada
   */
  static addNeighborhood(city: string, neighborhood: string): boolean {
    if (!city || !neighborhood.trim()) return false;
    const name = neighborhood.trim();
    const map = this.getCustomNeighborhoodsMap();
    if (!map[city]) map[city] = [];
    if (!map[city].includes(name)) {
      map[city].push(name);
      this.saveCustomNeighborhoodsMap(map);
      return true;
    }
    return false;
  }

  /**
   * Remove/oculta um bairro para a cidade especificada
   */
  static removeNeighborhood(city: string, neighborhood: string): boolean {
    if (!city || !neighborhood) return false;
    const map = this.getCustomNeighborhoodsMap();
    if (map[city]) {
      map[city] = map[city].filter((n) => n !== neighborhood);
      this.saveCustomNeighborhoodsMap(map);
      return true;
    }
    return false;
  }

  private static getCustomNeighborhoodsMap(): Record<string, string[]> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private static saveCustomNeighborhoodsMap(map: Record<string, string[]>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      window.dispatchEvent(new Event('neighborhoods_updated'));
    } catch (e) {
      console.error('Erro ao salvar bairros customizados:', e);
    }
  }
}
