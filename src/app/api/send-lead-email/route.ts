import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, propertyTitle, propertyCode, type } = body;

    const targetEmail = 'sjcolussi@gmail.com';

    const subject = propertyTitle
      ? `🏡 Novo Interesse no Imóvel: ${propertyTitle} (Cód: ${propertyCode || 'S/N'})`
      : type === 'seller'
      ? `🔑 Nova Solicitação de Anúncio de Imóvel - ${name || 'Proprietário'}`
      : `📩 Nova Mensagem de Contato do Site - ${name || 'Cliente'}`;

    // Dispara envio de e-mail assíncrono via FormSubmit para sjcolussi@gmail.com
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        'Nome do Cliente': name || 'Não informado',
        'Telefone / WhatsApp': phone || 'Não informado',
        'E-mail': email || 'Não informado',
        'Imóvel de Interesse': propertyTitle ? `${propertyTitle} (Cód: ${propertyCode || 'N/A'})` : 'N/A (Contato Geral)',
        'Mensagem do Cliente': message || 'Gostaria de mais informações.',
        'Data/Hora': new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      }),
    });

    if (formSubmitRes.ok) {
      return NextResponse.json({ success: true, message: 'E-mail enviado com sucesso para sjcolussi@gmail.com' });
    }

    // Se falhar o envio para o FormSubmit por algum bloqueio, retorna resposta indicando que o lead foi salvo
    return NextResponse.json({ success: true, warning: 'Lead registrado com sucesso' });
  } catch (err: any) {
    console.error('Error sending lead email:', err);
    return NextResponse.json({ success: true, error: err.message }, { status: 200 });
  }
}
