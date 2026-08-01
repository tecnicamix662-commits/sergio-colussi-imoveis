import { SiteSettings, DEFAULT_SETTINGS } from '@/types/settings';

const SETTINGS_KEY = 'sergio_colussi_site_settings_v1';
const SETTINGS_EVENT = 'site_settings_updated';

export class SettingsService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getSettings(): SiteSettings {
    if (!this.isBrowser()) return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return DEFAULT_SETTINGS;
      // Merge with defaults to handle new fields added after first save
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Error reading settings from storage', e);
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: SiteSettings): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event(SETTINGS_EVENT));
    } catch (e) {
      console.error('Error saving settings to storage', e);
    }
  }

  public static resetToDefaults(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  }

  /** Returns the formatted full address string */
  public static getFullAddress(settings: SiteSettings): string {
    const parts = [settings.address];
    if (settings.neighborhood) parts.push(settings.neighborhood);
    if (settings.city && settings.state) parts.push(`${settings.city} - ${settings.state}`);
    return parts.join(', ');
  }

  /** Returns the WhatsApp URL with optional message */
  public static getWhatsAppUrl(settings: SiteSettings, message?: string): string {
    const number = settings.whatsapp.replace(/\D/g, '');
    const msg = message || `Olá ${settings.realtorName}, gostaria de informações sobre imóveis em Santo André e região.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }
}
