'use client';

import { useState } from 'react';
import { PropertyService } from '@/services/propertyService';
import { PropertyType, PropertyPurpose } from '@/types/property';
import {
  Phone,
  Mail,
  User,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Send,
  X,
  FileText,
} from 'lucide-react';

export default function AnunciarPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartamento');
  const [purpose, setPurpose] = useState<PropertyPurpose>('venda');
  const [city, setCity] = useState('Santo André');
  const [neighborhood, setNeighborhood] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageFiles((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);

    PropertyService.saveSellerSubmission({
      name,
      phone,
      email,
      propertyType,
      purpose,
      city,
      neighborhood,
      estimatedPrice,
      message,
      images: imageFiles,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const buildWhatsAppSellerUrl = () => {
    const text = `Olá Sérgio Colussi, sou o proprietário ${name}. Quero anunciar meu imóvel (${propertyType} para ${purpose}) no bairro ${neighborhood}, em ${city}. Gostaria de agendar uma avaliação.`;
    return `https://wa.me/5511997135790?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-950 text-xs font-bold uppercase tracking-widest border border-stone-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>Captação e Venda com Segurança</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          Anuncie Seu Imóvel com Sérgio Colussi
        </h1>

        <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed">
          Cadastre seu imóvel para receber atendimento personalizado, avaliação de mercado precisa e total segurança contratual em Santo André e no ABC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Benefits & Trust */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Por Que Vender / Alugar Conosco?
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Produção Fotográfica Profissional</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Seu imóvel será fotografado com ângulos e iluminação que valorizam cada ambiente.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Compradores Pré-Qualificados</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Trabalhamos com carteira de clientes interessados em imóveis no ABC Paulista.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Segurança Jurídica &amp; Atendimento Direto</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Acompanhamento completo de Sérgio Colussi em todas as fases da negociação.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 text-center space-y-3">
              <span className="text-xs text-stone-700 font-bold block">Prefere atendimento imediato?</span>
              <a
                href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20sou%20propriet%C3%A1rio%20e%20gostaria%20de%20anunciar%20meu%20im%C3%B3vel."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md border border-stone-800"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Enviar Dados Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3 flex items-center gap-2">
              <FileText className="w-6 h-6 text-stone-900" />
              <span>Formulário de Cadastro de Imóvel</span>
            </h3>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-2xl font-bold text-stone-950">
                  Cadastro Recebido com Sucesso!
                </h4>
                <p className="text-stone-700 text-sm font-medium max-w-md mx-auto leading-relaxed">
                  Obrigado, <strong>{name}</strong>. Sérgio Colussi analisará as informações e entrará em contato em breve para conversar sobre o seu imóvel.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={buildWhatsAppSellerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Acelerar pelo WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setNeighborhood('');
                      setEstimatedPrice('');
                      setMessage('');
                      setImageFiles([]);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-300 text-xs font-bold"
                  >
                    Cadastrar outro imóvel
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Seu Nome Completo *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-900 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Telefone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-900 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-900 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Property Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Tipo de Imóvel</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="casa">Casa / Sobrado</option>
                      <option value="cobertura">Cobertura</option>
                      <option value="terreno">Terreno / Lote</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Finalidade</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    >
                      <option value="venda">Venda</option>
                      <option value="aluguel">Locação</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Cidade</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    >
                      <option value="Santo André">Santo André</option>
                      <option value="Mauá">Mauá</option>
                      <option value="São Bernardo do Campo">São Bernardo do Campo</option>
                      <option value="São Caetano do Sul">São Caetano do Sul</option>
                      <option value="São Vicente">São Vicente (Litoral)</option>
                      <option value="São Paulo">São Paulo</option>
                      <option value="Outra">Outra região do ABC / Litoral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Bairro</label>
                    <input
                      type="text"
                      placeholder="Ex: Bairro Jardim, Campestre"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Valor Pretendido de Venda / Locação (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 650.000 ou A Combinar"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Observações ou Detalhes do Imóvel</label>
                  <textarea
                    rows={3}
                    placeholder="Conte mais sobre vagas de garagem, reformas recentes, andar, vista, etc..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                  />
                </div>

                {/* Photos Uploader */}
                <div className="space-y-2">
                  <label className="block text-stone-900 font-bold text-xs">Fotos do Imóvel (Opcional)</label>
                  <div className="border-2 border-dashed border-stone-300 hover:border-black rounded-2xl p-6 text-center cursor-pointer bg-stone-50 transition-colors relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="w-8 h-8 text-stone-900 mx-auto mb-2" />
                    <span className="text-stone-900 font-bold text-xs block">Clique ou arraste fotos aqui</span>
                    <span className="text-[11px] text-stone-600 block font-medium">PNG, JPG ou WEBP (Max 10MB por foto)</span>
                  </div>

                  {/* Uploaded Previews */}
                  {imageFiles.length > 0 && (
                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                      {imageFiles.map((img, idx) => (
                        <div key={idx} className="relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border border-stone-300 group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-80 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-black hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-black"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Enviando Cadastro...' : 'Enviar Imóvel para Avaliação'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
