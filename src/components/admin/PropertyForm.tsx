'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { ImageService } from '@/services/imageService';
import { NeighborhoodService } from '@/services/neighborhoodService';
import { Property, PropertyType, PropertyPurpose, PropertyStatus } from '@/types/property';
import {
  Save, ArrowLeft, PlusCircle, X, Star, Loader2, Grip,
  Upload, Camera, Image as ImageIcon, CheckCircle2, AlertCircle,
  Trash2, ChevronUp, ChevronDown, FolderOpen, Shield, User,
} from 'lucide-react';

export type PropertyFormData = Omit<Property, 'id' | 'code' | 'slug' | 'createdAt' | 'updatedAt'>;

const FEATURES_SUGGESTIONS = [
  'Piscina Aquecida', 'Churrasqueira', 'Varanda Gourmet', 'Espaço Gourmet',
  'Academia', 'Sauna', 'Elevador', 'Portaria 24h', 'Automação Residencial',
  'Ar Condicionado Central', 'Mármore Italiano', 'Closet', 'Hidromassagem',
  'Gerador de Energia', 'Painel Solar', 'Câmeras de Segurança', 'Playground',
  'Quadra Esportiva', 'Salão de Festas', 'Depósito Privativo',
];

const TYPE_LABELS: Record<PropertyType, string> = {
  casa: 'Casa',
  sobrado: 'Sobrado',
  apartamento: 'Apartamento',
  sala_comercial: 'Sala Comercial',
  galpao: 'Galpão',
  terreno: 'Terreno',
  cobertura: 'Cobertura',
  comercial: 'Comercial',
};

const STATUS_LABELS: Record<PropertyStatus, string> = {
  disponivel: 'Disponível',
  vendido: 'Vendido',
  alugado: 'Alugado',
  inativo: 'Inativo',
};

function Field({ label, required, hint, children }: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-gold-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 transition-all";
const selectCls = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500 transition-all";

interface PropertyFormProps {
  initialData?: Property;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<'success' | 'error' | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [activeSection, setActiveSection] = useState<'basico' | 'detalhes' | 'fotos' | 'proprietario' | 'status'>('basico');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const buildInitial = (): PropertyFormData => {
    if (initialData) {
      const { id, code, slug, createdAt, updatedAt, ...rest } = initialData;
      return rest;
    }
    return {
      title: '',
      price: 0,
      condoFee: undefined,
      iptuFee: undefined,
      type: 'apartamento',
      purpose: 'venda',
      status: 'disponivel',
      city: '',
      neighborhood: '',
      address: '',
      area: 0,
      bedrooms: 0,
      suites: 0,
      bathrooms: 0,
      parking: 0,
      description: '',
      features: [],
      images: [],
      mainImage: '',
      featured: false,
      active: true,
      realtorName: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerNotes: '',
    };
  };

  const [form, setForm] = useState<PropertyFormData>(buildInitial);

  const update = (key: keyof PropertyFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Photo management
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const results = await ImageService.uploadMultipleImages(files, (completed, total) => {
        setUploadProgress({ current: completed, total });
      });

      const newUrls = results.map((r) => r.url);
      const updatedImages = [...form.images, ...newUrls];
      update('images', updatedImages);
      if (!form.mainImage && updatedImages.length > 0) {
        update('mainImage', updatedImages[0]);
      }
    } catch (err) {
      console.error('Erro ao fazer upload das imagens:', err);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const addImageUrl = (url: string) => {
    if (!url.trim()) return;
    const newImages = [...form.images, url.trim()];
    update('images', newImages);
    if (!form.mainImage) update('mainImage', newImages[0]);
  };

  const removeImage = (idx: number) => {
    const newImages = form.images.filter((_, i) => i !== idx);
    update('images', newImages);
    if (form.mainImage === form.images[idx]) {
      update('mainImage', newImages[0] || '');
    }
  };

  const setMainImage = (url: string) => update('mainImage', url);

  const moveImage = (idx: number, direction: 'up' | 'down') => {
    const arr = [...form.images];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
    update('images', arr);
  };

  // Features
  const addFeature = (feat: string) => {
    const trimmed = feat.trim();
    if (!trimmed || form.features.includes(trimmed)) return;
    update('features', [...form.features, trimmed]);
    setFeatureInput('');
  };

  const removeFeature = (feat: string) => {
    update('features', form.features.filter((f) => f !== feat));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      if (mode === 'create') {
        PropertyService.addProperty(form);
      } else if (initialData) {
        PropertyService.updateProperty(initialData.id, form);
      }
      setSavedMsg('success');
      setTimeout(() => router.push('/admin/imoveis'), 1200);
    } catch {
      setSavedMsg('error');
      setSaving(false);
    }
  };

  const sections = [
    { id: 'basico', label: 'Dados Básicos' },
    { id: 'detalhes', label: 'Detalhes e Características' },
    { id: 'fotos', label: 'Fotos' },
    { id: 'proprietario', label: '👤 Proprietário (Privado)' },
    { id: 'status', label: 'Status e Publicação' },
  ] as const;

  const [newImageUrl, setNewImageUrl] = useState('');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/imoveis')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs mb-3 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para a lista
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {mode === 'create' ? 'Cadastrar Novo Imóvel' : 'Editar Imóvel'}
          </h1>
          {initialData && (
            <p className="text-slate-400 text-xs mt-1">Código: {initialData.code}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Salvando...' : mode === 'create' ? 'Publicar Imóvel' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Status Banner */}
      {savedMsg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
          savedMsg === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {savedMsg === 'success'
            ? <><CheckCircle2 className="w-4 h-4" /> Imóvel salvo com sucesso! Redirecionando...</>
            : <><AlertCircle className="w-4 h-4" /> Erro ao salvar. Verifique os campos obrigatórios.</>
          }
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === s.id
                ? 'bg-stone-800 text-white border border-stone-700 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 font-medium'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">

        {/* === DADOS BÁSICOS === */}
        {activeSection === 'basico' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <Field label="Título do Anúncio" required>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    placeholder="Ex: Cobertura Duplex com Piscina no Bairro Jardim"
                    required
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Corretor Responsável" hint="Nome do corretor de imóveis">
                <input
                  type="text"
                  value={form.realtorName || ''}
                  onChange={(e) => update('realtorName', e.target.value)}
                  placeholder="Ex: Sérgio Colussi"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field label="Tipo de Imóvel" required>
                <select value={form.type} onChange={(e) => update('type', e.target.value as PropertyType)} required className={selectCls}>
                  {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </Field>
              <Field label="Finalidade" required>
                <select value={form.purpose} onChange={(e) => update('purpose', e.target.value as PropertyPurpose)} required className={selectCls}>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </Field>
              <Field label="Preço (R$)" required>
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => update('price', Number(e.target.value))}
                  placeholder="Ex: 1500000"
                  required
                  min={0}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Condomínio (R$/mês)" hint="Deixe em branco se não houver">
                <input type="number" value={form.condoFee || ''} onChange={(e) => update('condoFee', e.target.value ? Number(e.target.value) : undefined)} placeholder="Ex: 1200" min={0} className={inputCls} />
              </Field>
              <Field label="IPTU (R$/ano)" hint="Deixe em branco se não souber">
                <input type="number" value={form.iptuFee || ''} onChange={(e) => update('iptuFee', e.target.value ? Number(e.target.value) : undefined)} placeholder="Ex: 4800" min={0} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <Field label="Cidade" required>
                <select
                  value={form.city}
                  onChange={(e) => {
                    update('city', e.target.value);
                    update('neighborhood', '');
                  }}
                  required
                  className={selectCls}
                >
                  <option value="">Selecione a Cidade...</option>
                  <option value="Santo André">Santo André</option>
                  <option value="São Bernardo do Campo">São Bernardo do Campo</option>
                  <option value="Mauá">Mauá</option>
                  <option value="São Caetano do Sul">São Caetano do Sul</option>
                </select>
              </Field>
              <Field label="Bairro" required hint="Selecione ou digite um bairro">
                <input
                  type="text"
                  list="neighborhoods-list"
                  value={form.neighborhood}
                  onChange={(e) => update('neighborhood', e.target.value)}
                  placeholder="Ex: Bairro Jardim"
                  required
                  className={inputCls}
                />
                <datalist id="neighborhoods-list">
                  {NeighborhoodService.getNeighborhoodsByCity(form.city).map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </Field>
              <Field label="Condomínio / Edifício">
                <input type="text" value={form.condominium || ''} onChange={(e) => update('condominium', e.target.value)} placeholder="Ex: Swiss Park, Edifício Figueiras" className={inputCls} />
              </Field>
              <Field label="Endereço / Logradouro">
                <input type="text" value={form.address || ''} onChange={(e) => update('address', e.target.value)} placeholder="Ex: Rua das Figueiras, 1200" className={inputCls} />
              </Field>
            </div>

            <Field label="Descrição Completa" required>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={6}
                required
                placeholder="Descreva todos os diferenciais do imóvel de forma atraente e completa..."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        )}

        {/* === DETALHES === */}
        {activeSection === 'detalhes' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Área (m²)" required>
                <input type="number" value={form.area || ''} onChange={(e) => update('area', Number(e.target.value))} placeholder="Ex: 180" required min={0} className={inputCls} />
              </Field>
              <Field label="Dormitórios">
                <input type="number" value={form.bedrooms || ''} onChange={(e) => update('bedrooms', Number(e.target.value))} placeholder="0" min={0} className={inputCls} />
              </Field>
              <Field label="Suítes">
                <input type="number" value={form.suites || ''} onChange={(e) => update('suites', Number(e.target.value))} placeholder="0" min={0} className={inputCls} />
              </Field>
              <Field label="Banheiros">
                <input type="number" value={form.bathrooms || ''} onChange={(e) => update('bathrooms', Number(e.target.value))} placeholder="0" min={0} className={inputCls} />
              </Field>
              <Field label="Vagas de Garagem">
                <input type="number" value={form.parking || ''} onChange={(e) => update('parking', Number(e.target.value))} placeholder="0" min={0} className={inputCls} />
              </Field>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Características e Diferenciais</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(featureInput); }}}
                  placeholder="Digite uma característica e pressione Enter..."
                  className={`${inputCls} flex-1`}
                />
                <button type="button" onClick={() => addFeature(featureInput)} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 whitespace-nowrap">
                  + Adicionar
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {FEATURES_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addFeature(s)}
                    disabled={form.features.includes(s)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                      form.features.includes(s)
                        ? 'bg-gold-500/20 border-gold-500/40 text-gold-400 cursor-default'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    {form.features.includes(s) ? '✓ ' : '+ '}{s}
                  </button>
                ))}
              </div>

              {/* Selected Features */}
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.features.map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs px-3 py-1.5 rounded-full">
                      {feat}
                      <button type="button" onClick={() => removeFeature(feat)} className="text-gold-400 hover:text-red-400 transition">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === FOTOS === */}
        {activeSection === 'fotos' && (
          <div className="space-y-6">
            {/* Upload Area: Drag & Drop / Computer Files */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.length) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-gold-500 bg-gold-500/10 scale-[1.01]'
                  : 'border-slate-700 hover:border-gold-500/60 bg-slate-900/60 hover:bg-slate-900/90'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-glow-gold">
                  {uploading ? <Loader2 className="w-7 h-7 animate-spin text-gold-400" /> : <Upload className="w-7 h-7" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {uploading
                      ? `Processando fotos (${uploadProgress?.current || 0}/${uploadProgress?.total || 0})...`
                      : 'Clique aqui para escolher fotos do seu computador'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Ou arraste e solte seus arquivos de imagem aqui (JPG, PNG, WebP)
                  </p>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl bg-gold-gradient text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Selecionar Fotos do Computador</span>
                </button>
              </div>
            </div>

            {/* Alternativa: Inserir URL manual */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 transition"
              >
                <span>{showUrlInput ? '− Ocultar inserção via URL' : '+ Adicionar foto por URL externa'}</span>
              </button>

              {showUrlInput && (
                <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://... (URL pública da imagem)"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => { addImageUrl(newImageUrl); setNewImageUrl(''); }}
                      disabled={!newImageUrl.trim()}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 whitespace-nowrap disabled:opacity-40"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Imagens Adicionadas */}
            {form.images.length === 0 ? (
              <div className="text-center py-8 border border-slate-800 rounded-2xl bg-slate-900/30">
                <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-xs">Nenhuma foto no imóvel ainda.</p>
                <p className="text-slate-600 text-[11px] mt-1">Selecione fotos do dispositivo no quadro acima.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300">
                    Galeria do Imóvel ({form.images.length} foto{form.images.length !== 1 ? 's' : ''})
                  </p>
                  <p className="text-[11px] text-slate-500">A primeira imagem ou a marcada com ★ é a capa principal.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {form.images.map((url, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 items-center p-3 rounded-xl border transition-all ${
                        form.mainImage === url
                          ? 'border-gold-500/50 bg-gold-500/10'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative">
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'; }}
                        />
                        {form.mainImage === url && (
                          <span className="absolute top-1 left-1 bg-gold-500 text-navy-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                            ★ Capa
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">Foto {idx + 1}</p>
                        <p className="text-[11px] text-slate-500 truncate">{url.startsWith('data:') ? 'Foto enviada do computador' : url}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'up')}
                          disabled={idx === 0}
                          title="Mover para cima"
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'down')}
                          disabled={idx === form.images.length - 1}
                          title="Mover para baixo"
                          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMainImage(url)}
                          title="Definir como foto principal"
                          className={`p-2 rounded-lg transition ${
                            form.mainImage === url
                              ? 'bg-gold-500/20 text-gold-400'
                              : 'text-slate-400 hover:text-gold-400 hover:bg-slate-800'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Remover foto"
                          className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === STATUS === */}
        {activeSection === 'status' && (
          <div className="space-y-6">
            <Field label="Status do Imóvel" required>
              <select
                value={form.status || 'disponivel'}
                onChange={(e) => {
                  const s = e.target.value as PropertyStatus;
                  update('status', s);
                  update('active', s === 'disponivel' || s === 'alugado');
                }}
                className={selectCls}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>

            {/* Featured toggle */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/60">
              <button
                type="button"
                onClick={() => update('featured', !form.featured)}
                className={`w-12 h-6 rounded-full relative transition-colors shrink-0 mt-0.5 ${
                  form.featured ? 'bg-gold-500' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'left-7' : 'left-1'}`} />
              </button>
              <div>
                <p className="text-white text-sm font-semibold flex items-center gap-2">
                  <Star className={`w-4 h-4 ${form.featured ? 'text-gold-400' : 'text-slate-500'}`} />
                  Imóvel em Destaque
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Imóveis em destaque aparecem na página inicial e têm prioridade nos resultados de busca.
                </p>
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/60">
              <button
                type="button"
                onClick={() => update('active', !form.active)}
                className={`w-12 h-6 rounded-full relative transition-colors shrink-0 mt-0.5 ${
                  form.active ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? 'left-7' : 'left-1'}`} />
              </button>
              <div>
                <p className="text-white text-sm font-semibold">
                  {form.active ? '✅ Visível no Site Público' : '🔒 Oculto do Site Público'}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Imóveis inativos não aparecem para visitantes, mas continuam salvos no sistema.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* === DADOS DO PROPRIETÁRIO (PRIVADO) === */}
        {activeSection === 'proprietario' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs flex items-center gap-3">
              <Shield className="w-5 h-5 shrink-0 text-gold-400" />
              <div>
                <p className="font-bold">🔒 Dados Confidenciais do Proprietário</p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Estes dados são estritamente privados para seu controle interno e NUNCA serão exibidos publicamente no site.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field label="Nome do Proprietário">
                <input
                  type="text"
                  value={form.ownerName || ''}
                  onChange={(e) => update('ownerName', e.target.value)}
                  placeholder="Ex: João da Silva"
                  className={inputCls}
                />
              </Field>

              <Field label="Telefone / WhatsApp">
                <input
                  type="text"
                  value={form.ownerPhone || ''}
                  onChange={(e) => update('ownerPhone', e.target.value)}
                  placeholder="Ex: (11) 99888-7777"
                  className={inputCls}
                />
              </Field>

              <Field label="E-mail do Proprietário">
                <input
                  type="email"
                  value={form.ownerEmail || ''}
                  onChange={(e) => update('ownerEmail', e.target.value)}
                  placeholder="Ex: proprietario@email.com"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Observações Privadas / Notas Internas" hint="Anotações sobre chaves, horários de visita, comissão, autorização...">
              <textarea
                value={form.ownerNotes || ''}
                onChange={(e) => update('ownerNotes', e.target.value)}
                rows={5}
                placeholder="Ex: Chave na portaria com o seu Carlos. Visitas autorizadas após 14h. Comissão alinhada em 6%."
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                🔒 Ao salvar, todos os dados do imóvel e do proprietário serão gravados com segurança no sistema.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Salvando...' : 'Salvar Dados do Proprietário'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Action Bar */}
      <div className="pt-4 flex items-center justify-between">
        <button type="button" onClick={() => router.push('/admin/imoveis')} className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar aos Imóveis
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Salvando...' : mode === 'create' ? 'Publicar Imóvel' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Floating Sticky Save Bar on Mobile & Desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0f1e]/95 backdrop-blur-md border-t border-slate-800 p-3 px-4 shadow-2xl flex items-center justify-between md:hidden">
        <button type="button" onClick={() => router.push('/admin/imoveis')} className="text-xs text-slate-400 font-medium">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Salvando...' : 'Salvar Imóvel'}</span>
        </button>
      </div>
    </form>
  );
}
