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
  Trash2, ChevronUp, ChevronDown, FolderOpen, Shield, User, FileText,
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
      <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
        {label} {required && <span className="text-stone-400 font-medium text-[10px] tracking-normal lowercase ml-1">(obrigatório)</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-stone-500 font-medium">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-950 font-semibold placeholder-stone-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm";
const selectCls = "w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-950 font-semibold focus:outline-none focus:border-black transition-all shadow-sm cursor-pointer";

interface PropertyFormProps {
  initialData?: Property;
  mode: 'create' | 'edit';
}

export default function PropertyForm({ initialData, mode }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saveType, setSaveType] = useState<'publish' | 'draft' | null>(null);
  const [savedMsg, setSavedMsg] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
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

function formatToBRL(value: string | number): { display: string; numeric: number } {
  if (value === '' || value === null || value === undefined) {
    return { display: '', numeric: 0 };
  }

  let numeric = 0;
  if (typeof value === 'number') {
    numeric = value;
  } else {
    const digits = value.replace(/\D/g, '');
    if (!digits) return { display: '', numeric: 0 };
    numeric = parseInt(digits, 10) / 100;
  }

  if (numeric <= 0) return { display: '', numeric: 0 };

  const display = numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return { display, numeric };
}

  const [form, setForm] = useState<PropertyFormData>(buildInitial);
  const [priceInput, setPriceInput] = useState<string>(initialData?.price ? formatToBRL(initialData.price).display : '');
  const [condoInput, setCondoInput] = useState<string>(initialData?.condoFee ? formatToBRL(initialData.condoFee).display : '');
  const [iptuInput, setIptuInput] = useState<string>(initialData?.iptuFee ? formatToBRL(initialData.iptuFee).display : '');

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

  const executeSave = async (isDraft: boolean = false) => {
    setSavedMsg(null);
    setErrorMessage(null);
    setSuccessDetails(null);

    if (!form.title || !form.title.trim()) {
      setActiveSection('basico');
      setSavedMsg('error');
      setErrorMessage('Por favor, preencha o Título do Imóvel.');
      return;
    }

    const priceVal = form.price > 0 ? form.price : formatToBRL(priceInput).numeric;
    if (!priceVal || priceVal <= 0) {
      setActiveSection('basico');
      setSavedMsg('error');
      setErrorMessage('Por favor, informe um Preço válido para o Imóvel (ex: 500.000,00).');
      return;
    }

    if (!form.city) {
      setActiveSection('basico');
      setSavedMsg('error');
      setErrorMessage('Por favor, selecione a Cidade do Imóvel.');
      return;
    }

    if (!form.neighborhood || !form.neighborhood.trim()) {
      setActiveSection('basico');
      setSavedMsg('error');
      setErrorMessage('Por favor, informe o Bairro do Imóvel.');
      return;
    }

    if (!form.description || !form.description.trim()) {
      setActiveSection('basico');
      setSavedMsg('error');
      setErrorMessage('Por favor, preencha a Descrição Completa do Imóvel.');
      return;
    }

    const targetStatus: PropertyStatus = isDraft ? 'inativo' : (form.status === 'inativo' ? 'disponivel' : form.status || 'disponivel');
    const targetActive = !isDraft && targetStatus !== 'inativo';

    const updatedForm = {
      ...form,
      price: priceVal,
      status: targetStatus,
      active: targetActive,
    };

    setSaving(true);
    setSaveType(isDraft ? 'draft' : 'publish');
    try {
      if (mode === 'create') {
        await PropertyService.addProperty(updatedForm);
      } else if (initialData) {
        await PropertyService.updateProperty(initialData.id, updatedForm);
      }
      setSavedMsg('success');
      setSuccessDetails(
        isDraft
          ? '📋 Rascunho salvo com sucesso! O imóvel foi gravado como inativo e não aparecerá no site público até ser publicado.'
          : '🚀 Imóvel publicado com sucesso no site! Redirecionando para a lista...'
      );
      setTimeout(() => router.push('/admin/imoveis'), 1400);
    } catch (err: any) {
      console.error('Erro ao salvar imóvel:', err);
      setSavedMsg('error');
      setErrorMessage(err.message || 'Erro ao salvar imóvel no servidor. Verifique os dados e tente novamente.');
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSave(false);
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
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/imoveis')}
            className="text-xs text-stone-600 hover:text-stone-950 font-bold flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a lista</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
            {mode === 'create' ? 'Cadastrar Novo Imóvel' : 'Editar Imóvel'}
          </h1>
          {mode === 'edit' && initialData ? (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-950 font-mono text-xs font-extrabold shadow-sm">
                🏷️ CÓDIGO: {initialData.code}
              </span>
            </div>
          ) : (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold">
                ✨ Código único automático (ex: REF-001) será gerado no envio
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Botão Salvar Rascunho */}
          <button
            type="button"
            disabled={saving}
            onClick={() => executeSave(true)}
            className="px-4 py-3 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-100 text-stone-900 font-bold text-xs tracking-wide shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving && saveType === 'draft' ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-700" />
            ) : (
              <FileText className="w-4 h-4 text-stone-600" />
            )}
            <span>{saving && saveType === 'draft' ? 'Salvando Rascunho...' : 'Salvar Rascunho'}</span>
          </button>

          {/* Botão Publicar Imóvel */}
          <button
            type="button"
            disabled={saving}
            onClick={() => executeSave(false)}
            className="px-6 py-3 rounded-xl bg-stone-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving && saveType === 'publish' ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{saving && saveType === 'publish' ? 'Publicando...' : mode === 'create' ? 'Publicar Imóvel' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {savedMsg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-bold shadow-sm ${
          savedMsg === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          {savedMsg === 'success' ? (
            <><CheckCircle2 className="w-4 h-4 text-emerald-700" /> {successDetails || 'Imóvel salvo com sucesso! Redirecionando...'}</>
          ) : (
            <><AlertCircle className="w-4 h-4 text-red-700" /> {errorMessage || 'Erro ao salvar. Verifique os campos obrigatórios.'}</>
          )}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-1.5 bg-stone-100 border border-stone-300 rounded-2xl p-1.5 overflow-x-auto shadow-sm">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === s.id
                ? 'bg-stone-950 text-white shadow-sm font-extrabold'
                : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-sm">

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
              <Field label="Preço do Imóvel" required hint="Digite os números e o valor é formatado em R$ automaticamente (ex: 500000000 vira 5.000.000,00)">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-stone-950 font-black text-sm pointer-events-none select-none z-10">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceInput.replace(/^R\$\s?/, '')}
                    onChange={(e) => {
                      const { display, numeric } = formatToBRL(e.target.value);
                      setPriceInput(display);
                      update('price', numeric);
                    }}
                    placeholder="0,00"
                    required
                    className={`${inputCls} pl-10 font-extrabold text-stone-950 text-base`}
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Condomínio (por mês)" hint="Deixe em branco se não houver">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-stone-950 font-black text-sm pointer-events-none select-none z-10">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={condoInput.replace(/^R\$\s?/, '')}
                    onChange={(e) => {
                      const { display, numeric } = formatToBRL(e.target.value);
                      setCondoInput(display);
                      update('condoFee', numeric > 0 ? numeric : undefined);
                    }}
                    placeholder="0,00"
                    className={`${inputCls} pl-10 font-extrabold text-stone-950 text-base`}
                  />
                </div>
              </Field>

              <Field label="IPTU (por ano)" hint="Deixe em branco se não souber">
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-stone-950 font-black text-sm pointer-events-none select-none z-10">
                    R$
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={iptuInput.replace(/^R\$\s?/, '')}
                    onChange={(e) => {
                      const { display, numeric } = formatToBRL(e.target.value);
                      setIptuInput(display);
                      update('iptuFee', numeric > 0 ? numeric : undefined);
                    }}
                    placeholder="0,00"
                    className={`${inputCls} pl-10 font-extrabold text-stone-950 text-base`}
                  />
                </div>
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
                  <option value="São Vicente">São Vicente (Litoral)</option>
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
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">Características e Diferenciais</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(featureInput); }}}
                  placeholder="Digite uma característica e pressione Enter..."
                  className={`${inputCls} flex-1`}
                />
                <button type="button" onClick={() => addFeature(featureInput)} className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-bold transition border border-stone-800 whitespace-nowrap">
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
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-default'
                        : 'bg-stone-100 border-stone-300 text-stone-700 hover:text-stone-950 hover:border-stone-500'
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
                    <span key={feat} className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-3 py-1.5 rounded-full font-bold">
                      {feat}
                      <button type="button" onClick={() => removeFeature(feat)} className="text-stone-500 hover:text-red-500 transition">
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
                  ? 'border-stone-950 bg-stone-100 scale-[1.01]'
                  : 'border-stone-300 hover:border-stone-500 bg-stone-50 hover:bg-stone-100'
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
                <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-900">
                  {uploading ? <Loader2 className="w-7 h-7 animate-spin text-stone-900" /> : <Upload className="w-7 h-7" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-950">
                    {uploading
                      ? `Processando fotos (${uploadProgress?.current || 0}/${uploadProgress?.total || 0})...`
                      : 'Clique aqui para escolher fotos do seu computador'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Ou arraste e solte seus arquivos de imagem aqui (JPG, PNG, WebP)
                  </p>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl bg-stone-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
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
                className="text-xs text-stone-700 hover:text-stone-950 font-bold flex items-center gap-1 transition"
              >
                <span>{showUrlInput ? '− Ocultar inserção via URL' : '+ Adicionar foto por URL externa'}</span>
              </button>

              {showUrlInput && (
                <div className="mt-3 p-4 rounded-xl bg-stone-50 border border-stone-300 space-y-2">
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
                      className="px-4 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white text-xs font-bold transition border border-stone-800 whitespace-nowrap disabled:opacity-40"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Lista de Imagens Adicionadas */}
            {form.images.length === 0 ? (
              <div className="text-center py-8 border border-stone-200 rounded-2xl bg-stone-50">
                <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-600 text-xs font-semibold">Nenhuma foto no imóvel ainda.</p>
                <p className="text-stone-400 text-[11px] mt-1">Selecione fotos do dispositivo no quadro acima.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-950">
                    Galeria do Imóvel ({form.images.length} foto{form.images.length !== 1 ? 's' : ''})
                  </p>
                  <p className="text-[11px] text-stone-500">A primeira imagem ou a marcada com ★ é a capa principal.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {form.images.map((url, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 items-center p-3 rounded-xl border transition-all ${
                        form.mainImage === url
                          ? 'border-stone-950 bg-stone-100'
                          : 'border-stone-200 bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 relative">
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'; }}
                        />
                        {form.mainImage === url && (
                          <span className="absolute top-1 left-1 bg-stone-950 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                            ★ Capa
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-950 truncate">Foto {idx + 1}</p>
                        <p className="text-[11px] text-stone-500 truncate">{url.startsWith('data:') ? 'Foto enviada do computador' : url}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'up')}
                          disabled={idx === 0}
                          title="Mover para cima"
                          className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-950 transition disabled:opacity-30"
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
                              ? 'bg-amber-100 text-amber-600'
                              : 'text-stone-500 hover:text-amber-600 hover:bg-stone-100'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Remover foto"
                          className="p-2 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-500 transition"
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
            <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50">
              <button
                type="button"
                onClick={() => update('featured', !form.featured)}
                className={`w-12 h-6 rounded-full relative transition-colors shrink-0 mt-0.5 ${
                  form.featured ? 'bg-amber-500' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? 'left-7' : 'left-1'}`} />
              </button>
              <div>
                <p className="text-stone-950 text-sm font-bold flex items-center gap-2">
                  <Star className={`w-4 h-4 ${form.featured ? 'text-amber-500' : 'text-stone-400'}`} />
                  Imóvel em Destaque
                </p>
                <p className="text-stone-600 text-xs mt-0.5">
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
                  form.active ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? 'left-7' : 'left-1'}`} />
              </button>
              <div>
                <p className="text-stone-950 text-sm font-bold">
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
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-3">
              <Shield className="w-5 h-5 shrink-0 text-amber-700" />
              <div>
                <p className="font-extrabold text-amber-900">🔒 Dados Confidenciais do Proprietário</p>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Estes dados são estritamente privados para seu controle interno e NUNCA serão exibidos publicamente no site.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <Field label="Corretor Responsável" hint="Nome do corretor de imóveis">
                <input
                  type="text"
                  value={form.realtorName || ''}
                  onChange={(e) => update('realtorName', e.target.value)}
                  placeholder="Ex: Sérgio Colussi"
                  className={inputCls}
                />
              </Field>

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

            <Field label="Endereço Privado do Imóvel / Proprietário (Exclusivo ADM)" hint="Endereço exato do imóvel ou residência do proprietário (não exibido no site público)">
              <input
                type="text"
                value={form.ownerAddress || ''}
                onChange={(e) => update('ownerAddress', e.target.value)}
                placeholder="Ex: Rua das Flores, 123 - Apto 42, Bloco B - Bairro Jardim, Santo André/SP"
                className={inputCls}
              />
            </Field>

            <Field label="Observações Privadas / Notas Internas" hint="Anotações sobre chaves, horários de visita, comissão, autorização...">
              <textarea
                value={form.ownerNotes || ''}
                onChange={(e) => update('ownerNotes', e.target.value)}
                rows={5}
                placeholder="Ex: Chave na portaria com o seu Carlos. Visitas autorizadas após 14h. Comissão alinhada em 6%."
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
              <span className="text-xs text-stone-500">
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

      {/* Floating Sticky Save Bar (Desktop & Mobile) */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-stone-300 shadow-2xl rounded-2xl p-3 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => router.push('/admin/imoveis')}
            className="text-xs text-stone-600 hover:text-stone-950 font-bold flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar aos Imóveis</span>
          </button>
          <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
            {form.active ? '🟢 Status: Visível no site' : '🔒 Status: Rascunho / Inativo'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Botão Rascunho no Rodapé */}
          <button
            type="button"
            disabled={saving}
            onClick={() => executeSave(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-900 font-bold text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving && saveType === 'draft' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-700" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-stone-600" />
            )}
            <span>{saving && saveType === 'draft' ? 'Salvando Rascunho...' : 'Salvar Rascunho'}</span>
          </button>

          {/* Botão Publicar no Rodapé */}
          <button
            type="button"
            disabled={saving}
            onClick={() => executeSave(false)}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-stone-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving && saveType === 'publish' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{saving && saveType === 'publish' ? 'Publicando...' : mode === 'create' ? 'Publicar Imóvel' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
