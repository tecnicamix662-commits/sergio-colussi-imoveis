'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  Image as ImageIcon,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Lock,
  Key,
} from 'lucide-react';
import { SiteSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { SettingsService } from '@/services/settingsService';
import { AuthService } from '@/services/authService';

type TabId = 'empresa' | 'contato' | 'visual' | 'textos' | 'redes' | 'seguranca';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'empresa', label: 'Empresa', icon: Building2 },
  { id: 'contato', label: 'Contato', icon: Phone },
  { id: 'visual', label: 'Visual / Mídias', icon: ImageIcon },
  { id: 'textos', label: 'Textos', icon: User },
  { id: 'redes', label: 'Redes Sociais', icon: Share2 },
  { id: 'seguranca', label: 'Segurança / Senha', icon: Lock },
];

function InputField({
  label,
  hint,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-gold-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all"
      />
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all resize-none"
      />
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

import { ImageService } from '@/services/imageService';
import { Upload, Trash2, FolderOpen } from 'lucide-react';

function ImageUploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await ImageService.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>

      <div className="border border-slate-700 bg-slate-900/60 rounded-xl p-4 space-y-3">
        {value ? (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-48 flex items-center justify-center p-2">
              <img
                src={value}
                alt={label}
                className="max-h-44 w-auto object-contain rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-3.5 py-2 rounded-lg bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderOpen className="w-3.5 h-3.5" />}
                <span>{uploading ? 'Enviando...' : 'Trocar Foto do Computador'}</span>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover Foto</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-gold-500/60 rounded-xl p-6 text-center cursor-pointer transition hover:bg-slate-900/90 flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <p className="text-xs font-semibold text-white">
              {uploading ? 'Processando foto...' : 'Clique para escolher foto do seu computador'}
            </p>
            <p className="text-[11px] text-slate-400">Suporta JPG, PNG, WebP (otimizado automaticamente)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-gold-400 hover:underline"
          >
            {showUrlInput ? '− Ocultar URL manual' : '+ Usar URL de foto externa'}
          </button>
          {showUrlInput && (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all"
            />
          )}
        </div>
      </div>

      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<TabId>('empresa');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<'success' | 'error' | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    setSettings(SettingsService.getSettings());
  }, []);

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400)); // smooth UX delay
      SettingsService.saveSettings(settings);
      setSavedMsg('success');
    } catch {
      setSavedMsg('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(null), 3000);
    }
  };

  const handleReset = () => {
    SettingsService.resetToDefaults();
    setSettings(DEFAULT_SETTINGS);
    setShowReset(false);
    setSavedMsg('success');
    setTimeout(() => setSavedMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Configurações do Site
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Todas as alterações refletem imediatamente no site público.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReset(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {savedMsg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium animate-in slide-in-from-top duration-200 ${
          savedMsg === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {savedMsg === 'success'
            ? <><CheckCircle2 className="w-4 h-4" /> Configurações e foto salvas com sucesso! O site foi atualizado.</>
            : <><AlertCircle className="w-4 h-4" /> Erro ao salvar. Tente novamente.</>
          }
        </div>
      )}

      {/* Reset Confirm */}
      {showReset && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-red-400 font-semibold text-sm">Restaurar configurações padrão?</p>
            <p className="text-slate-400 text-xs mt-1">Esta ação não pode ser desfeita. Todos os dados serão resetados.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowReset(false)} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800 transition">Cancelar</button>
            <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Confirmar Reset</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active ? 'bg-stone-800 text-white border border-stone-700 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/80 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">

        {/* === EMPRESA === */}
        {activeTab === 'empresa' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
              Identidade da Imobiliária
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Nome da Imobiliária"
                value={settings.companyName}
                onChange={(v) => update('companyName', v)}
                placeholder="Ex: Sérgio Colussi Imóveis"
                required
              />
              <InputField
                label="Nome do Corretor"
                value={settings.realtorName}
                onChange={(v) => update('realtorName', v)}
                placeholder="Ex: Sérgio Colussi"
                required
              />
              <InputField
                label="CRECI"
                value={settings.creci}
                onChange={(v) => update('creci', v)}
                placeholder="Ex: 198.420-F"
                hint="Número de registro ativo junto ao CRECI"
              />
              <InputField
                label="Slogan / Tagline"
                value={settings.tagline}
                onChange={(v) => update('tagline', v)}
                placeholder="Ex: Corretor de Imóveis • CRECI 92.920-F"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <ImageUploadField
                label="Foto Profissional do Corretor (Sérgio Colussi)"
                value={settings.realtorPhotoUrl}
                onChange={(v) => update('realtorPhotoUrl', v)}
                hint="Foto oficial do Sérgio Colussi exibida na página inicial e na página Sobre"
              />
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Salvando Foto...' : 'Salvar Foto do Corretor'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-5">
              <h3 className="text-sm font-semibold text-white">Endereço</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Rua / Logradouro" value={settings.address} onChange={(v) => update('address', v)} placeholder="Ex: Rua das Figueiras, 1200" />
                <InputField label="Bairro" value={settings.neighborhood} onChange={(v) => update('neighborhood', v)} placeholder="Ex: Bairro Jardim" />
                <InputField label="Cidade" value={settings.city} onChange={(v) => update('city', v)} placeholder="Ex: Santo André" />
                <InputField label="Estado (UF)" value={settings.state} onChange={(v) => update('state', v)} placeholder="Ex: SP" />
                <InputField label="CEP" value={settings.cep} onChange={(v) => update('cep', v)} placeholder="Ex: 09080-300" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <InputField
                label="Horário de Atendimento"
                value={settings.businessHours}
                onChange={(v) => update('businessHours', v)}
                placeholder="Ex: Seg a Sex: 08:30 às 18:30 | Sáb: 09:00 às 13:00"
                hint="Informe os horários completos de atendimento"
              />
            </div>
          </div>
        )}

        {/* === CONTATO === */}
        {activeTab === 'contato' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
              Dados de Contato
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Telefone Fixo / Comercial"
                value={settings.phone}
                onChange={(v) => update('phone', v)}
                placeholder="Ex: (11) 4438-0000"
                type="tel"
              />
              <InputField
                label="WhatsApp (somente números)"
                value={settings.whatsapp}
                onChange={(v) => update('whatsapp', v.replace(/\D/g, ''))}
                placeholder="Ex: 5511999999999"
                hint="Formato: código do país + DDD + número. Sem espaços ou traços."
                type="tel"
              />
              <InputField
                label="E-mail Principal"
                value={settings.email}
                onChange={(v) => update('email', v)}
                placeholder="Ex: contato@sergiocolussi.com.br"
                type="email"
              />
            </div>
            {settings.whatsapp && (
              <div className="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300">
                <p className="font-semibold mb-1">✅ Link do WhatsApp gerado:</p>
                <a
                  href={SettingsService.getWhatsAppUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                >
                  {SettingsService.getWhatsAppUrl(settings)}
                </a>
              </div>
            )}
          </div>
        )}

        {/* === VISUAL === */}
        {activeTab === 'visual' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
              Identidade Visual e Mídias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploadField
                label="Logo da Imobiliária"
                value={settings.logoUrl}
                onChange={(v) => update('logoUrl', v)}
                hint="Envie uma imagem do seu computador ou informe a URL. Recomendado: PNG com fundo transparente."
              />
              <ImageUploadField
                label="Favicon do Site"
                value={settings.faviconUrl}
                onChange={(v) => update('faviconUrl', v)}
                hint="Ícone exibido na aba do navegador. Formato .ico, .png ou .svg"
              />
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Banner Principal (Hero da Home)"
                  value={settings.heroBannerUrl}
                  onChange={(v) => update('heroBannerUrl', v)}
                  hint="Imagem de alta qualidade exibida como fundo de destaque na capa do site. Recomendado: 1920x1080px"
                />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Foto do Corretor / Perfil"
                  value={settings.realtorPhotoUrl}
                  onChange={(v) => update('realtorPhotoUrl', v)}
                  hint="Foto profissional do Sérgio Colussi exibida na seção 'Sobre' e na Home"
                />
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-xs text-blue-300">
              <p className="font-semibold mb-1">💡 Dica sobre imagens:</p>
              <p>Cole URLs públicas de imagens (Unsplash, Google Drive público, Cloudinary, etc.). Para fazer upload próprio, utilize um serviço de hospedagem de imagens como <strong>Cloudinary</strong> ou <strong>ImgBB</strong> e cole a URL gerada aqui.</p>
            </div>
          </div>
        )}

        {/* === TEXTOS === */}
        {activeTab === 'textos' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
              Textos Institucionais
            </h2>
            <TextAreaField
              label="Título do Banner Principal"
              value={settings.heroTitle}
              onChange={(v) => update('heroTitle', v)}
              rows={2}
              placeholder="Ex: Exclusividade e Confiança nos Melhores Endereços de Santo André"
              hint="Exibido no topo da página inicial como título de impacto"
            />
            <TextAreaField
              label="Subtítulo / Descrição do Banner"
              value={settings.heroSubtitle}
              onChange={(v) => update('heroSubtitle', v)}
              rows={3}
              placeholder="Ex: Seu canal definitivo para compra, venda e investimento imobiliário de alto padrão..."
              hint="Texto secundário no banner principal"
            />
            <TextAreaField
              label="Texto Sobre a Empresa / Corretor"
              value={settings.aboutText}
              onChange={(v) => update('aboutText', v)}
              rows={5}
              placeholder="Apresentação profissional exibida na seção Sobre..."
              hint="Exibido na seção 'Sobre' e nos cards de apresentação do corretor"
            />
            <TextAreaField
              label="Descrição do Rodapé"
              value={settings.footerDescription}
              onChange={(v) => update('footerDescription', v)}
              rows={3}
              placeholder="Ex: Referência na intermediação e captação de imóveis de luxo no ABC Paulista..."
              hint="Texto exibido na coluna de marca do rodapé"
            />
            <div className="pt-2 border-t border-slate-800 space-y-5">
              <h3 className="text-sm font-semibold text-white">SEO — Meta Tags</h3>
              <InputField
                label="Meta Title (Título SEO)"
                value={settings.metaTitle}
                onChange={(v) => update('metaTitle', v)}
                placeholder="Ex: Sérgio Colussi Imóveis | Imóveis de Alto Padrão no ABC"
                hint="Título exibido nas pesquisas do Google. Máx. 60 caracteres recomendados."
              />
              <TextAreaField
                label="Meta Description (Descrição SEO)"
                value={settings.metaDescription}
                onChange={(v) => update('metaDescription', v)}
                rows={2}
                placeholder="Ex: Especialista em compra, venda e captação de imóveis..."
                hint="Descrição exibida nos resultados de busca. Máx. 160 caracteres recomendados."
              />
            </div>
          </div>
        )}

        {/* === REDES SOCIAIS === */}
        {activeTab === 'redes' && (
          <div className="space-y-5">
            <h2 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-3">
              Redes Sociais
            </h2>
            <p className="text-slate-400 text-xs">
              Cole a URL completa do perfil (ex: https://instagram.com/sergiocolussi). Deixe em branco para não exibir.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Instagram" value={settings.instagram} onChange={(v) => update('instagram', v)} placeholder="https://instagram.com/seuperfil" type="url" />
              <InputField label="Facebook" value={settings.facebook} onChange={(v) => update('facebook', v)} placeholder="https://facebook.com/seuperfil" type="url" />
              <InputField label="LinkedIn" value={settings.linkedin} onChange={(v) => update('linkedin', v)} placeholder="https://linkedin.com/in/seuperfil" type="url" />
              <InputField label="YouTube" value={settings.youtube} onChange={(v) => update('youtube', v)} placeholder="https://youtube.com/@seucanal" type="url" />
            </div>
          </div>
        )}

        {/* === SEGURANÇA / SENHA === */}
        {activeTab === 'seguranca' && (
          <ChangePasswordSection />
        )}
      </div>

      {/* Sticky Save Bar */}
      {activeTab !== 'seguranca' && (
        <>
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>

          {/* Floating Sticky Save Bar for Mobile */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0f1e]/95 backdrop-blur-md border-t border-slate-800 p-3 px-4 shadow-2xl flex items-center justify-between md:hidden">
            <span className="text-xs text-slate-400 font-medium">Configurações</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Salvando...' : 'Salvar Tudo'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChangePasswordSection() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const creds = AuthService.getCredentials();
    setCurrentEmail(creds.email);
    setNewEmail(creds.email);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'A nova senha e a confirmação de senha não coincidem.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = AuthService.changePassword(currentPassword, newEmail, newPassword);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        const updated = AuthService.getCredentials();
        setCurrentEmail(updated.email);
        setNewEmail(updated.email);
      } else {
        setStatus({ type: 'error', message: res.message });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-gold-400" />
          <span>Segurança & Senha de Acesso</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Altere o e-mail e a senha utilizados para entrar no painel administrativo do site.
        </p>
      </div>

      {status && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
          status.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            E-mail de Acesso ao Painel
          </label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-all"
          />
          <p className="text-[11px] text-slate-500">Este e-mail será exigido no formulário de login.</p>
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Senha Atual <span className="text-gold-400">*</span>
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual para autorizar a alteração"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nova Senha <span className="text-gold-400">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirmar Nova Senha <span className="text-gold-400">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                minLength={6}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? 'Atualizando...' : 'Salvar Nova Senha de Acesso'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
