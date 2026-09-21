import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  
  // Nao ha como executar DDL diretamente via supabase-js sem exec_sql
  // Vamos verificar se a tabela existe tentando uma query
  const { error } = await supabase.from('compradores').select('id').limit(1);
  
  if (!error) {
    return NextResponse.json({ status: 'table_exists', message: 'Tabela compradores ja existe!' });
  }
  
  return NextResponse.json({ 
    status: 'table_not_found',
    message: 'Tabela compradores nao encontrada. Execute o SQL abaixo no Supabase SQL Editor.',
    sql: `CREATE TABLE IF NOT EXISTS compradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  whatsapp text NOT NULL,
  bairro_interesse text,
  orcamento text,
  tipo_imovel text,
  origem text,
  created_at timestamp with time zone DEFAULT now()
);`,
    supabase_url: 'https://supabase.com/dashboard/project/kkljtuaxaxfovyfhkfuw/sql/new'
  });
}