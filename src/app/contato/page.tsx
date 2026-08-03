'use client';

import { useState } from 'react';
import { PropertyService } from '@/services/propertyService';
import { useSettings } from '@/contexts/SettingsContext';
import { SettingsService } from '@/services/settingsService';
import {
  MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Send,
  CheckCircle2, Sparkles,
} from 'lucide-react';

export default function ContatoPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { settings } = useSettings();
  const whatsappUrl = SettingsService.getWhatsAppUrl(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);

    PropertyService.saveLead({
      name,
      phone,
      email,
      message,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 bg-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-950 text-xs font-bold uppercase tracking-widest border border-stone-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-stone-900" />
          <span>Atendimento Personalizado</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
          Fale Conosco
        </h1>

        <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed">
          Entre em contato para um atendimento rápido, seguro e personalizado em Santo André e região do ABC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Informações de Contato
            </h3>

            <div className="space-y-5 text-xs text-stone-800 font-medium">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-950 text-sm mb-0.5">Região de Atendimento</h4>
                  <p>{settings.address || 'Atendimento em Santo André e região do ABC Paulista'}</p>
                  <p className="text-stone-600">{settings.city} - {settings.state}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-950 text-sm mb-0.5">Telefones &amp; WhatsApp</h4>
                  {settings.whatsapp && <p className="font-bold text-stone-950">WhatsApp: {settings.whatsapp}</p>}
                  {settings.phone && <p className="text-stone-600">Fixo: {settings.phone}</p>}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-950 text-sm mb-0.5">E-mail Profissional</h4>
                  <p className="font-bold text-stone-950">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-950 text-sm mb-0.5">Horário de Atendimento</h4>
                  <p className="whitespace-pre-line text-stone-700 font-medium">{settings.businessHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-3">
              <span className="text-xs text-stone-900 font-bold uppercase tracking-wider block">Redes Sociais:</span>
              <div className="flex items-center gap-3">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors shadow-sm">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors shadow-sm">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors shadow-sm">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Direct WhatsApp button */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md border border-stone-800"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Conversar Agora no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-950 tracking-tight border-b border-stone-200 pb-3">
              Envie uma Mensagem Direta
            </h3>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 font-medium">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-stone-950 text-xl">Mensagem Recebida!</h4>
                <p className="text-stone-700 text-xs font-medium leading-relaxed">
                  Obrigado pelo contato. Sérgio Colussi responderá seu e-mail ou WhatsApp o mais breve possível.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-stone-900 text-xs font-bold underline pt-2 block mx-auto"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Pedro Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-900 font-bold mb-1.5 text-xs">Seu E-mail</label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-900 font-bold mb-1.5 text-xs">Como podemos te ajudar? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreva o tipo de imóvel que procura ou o imóvel que deseja negociar..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 font-semibold text-xs placeholder-stone-400 focus:outline-none focus:bg-white focus:border-black shadow-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-black hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-black"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
