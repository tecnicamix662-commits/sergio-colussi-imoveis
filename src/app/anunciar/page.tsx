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
    const text = `Olá Sérgio Colussi, sou o proprietário ${name}. Quero anunciar meu imóvel (${propertyType} para ${purpose}) no bairro ${neighborhood}, em ${city}. Gostaria de combinar uma avaliação.`;
    return `https://wa.me/5511997135790?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-950 text-xs font-bold uppercase tracking-widest border border-stone-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>Avaliação e Divulgação</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          Anuncie seu Imóvel com Sérgio Colussi
        </h1>

        <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed">
          Cadastre os dados do seu imóvel para avaliação de mercado e divulgação em Santo André, São Bernardo do Campo e região do ABC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Benefits & Trust */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Vantagens de Anunciar
            </h3>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100/60 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Fotos Claras e Bem Posicionadas</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Registros nítidos dos ambientes para apresentar o imóvel com fidelidade aos compradores.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100/60 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Interessados Selecionados</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Divulgação direcionada para pessoas que realmente buscam imóveis no perfil do seu no ABC.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100/60 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-950 text-sm">Atendimento Direto e Suporte Documental</h4>
                  <p className="text-stone-700 text-[11px] leading-snug">Acompanhamento pessoal de Sérgio Colussi em todas as fases da negociação e do contrato.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 text-center space-y-3">
              <span className="text-xs text-stone-700 font-bold block">Prefere atendimento direto?</span>
              <a
                href="https://wa.me/5511997135790?text=Ol%C3%A1%20S%C3%A9rgio%2C%20sou%20propriet%C3%A1rio%20e%20gostaria%20de%20anunciar%20meu%20im%C3%B3vel."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md border border-stone-800"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Falar Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3 flex items-center gap-2">
              <FileText className="w-6 h-6 text-stone-900" />
              <span>Dados do Imóvel</span>
            </h3>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-2xl font-bold text-stone-950">
                  Cadastro Recebido com Sucesso!
                </h4>
                <p className="text-stone-700 text-sm font-medium max-w-md mx-auto leading-relaxed">
                  Obrigado, <strong>{name}</strong>. Sérgio Colussi analisará as informações enviadas e entrará em contato para agendar uma conversa sobre o imóvel.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={buildWhatsAppSellerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Falar no WhatsApp</span>
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
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Nome Completo *</label>
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
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Telefone com WhatsApp *</label>
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
                      <option value="Ribeirão Preto">Ribeirão Preto</option>
                      <option value="São Paulo">São Paulo</option>
                      <option value="Outra">Outra região do ABC / Litoral / Interior</option>
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
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Valor Pretendido de Venda ou Locação (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 650.000,00 ou A combinar"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Características e Detalhes do Imóvel</label>
                  <textarea
                    rows={3}
                    placeholder="Informe metragem aproximada, dormitórios, vagas de garagem, andar, valor de condomínio ou reformas..."
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
                    <span className="text-stone-900 font-bold text-xs block">Clique ou arraste as fotos aqui</span>
                    <span className="text-[11px] text-stone-600 block font-medium">Formatos PNG, JPG ou WEBP (até 10MB por foto)</span>
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
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Imóvel para Avaliação'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
