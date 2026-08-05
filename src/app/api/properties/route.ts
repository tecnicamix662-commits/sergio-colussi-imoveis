import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { Property } from '@/types/property';

const TABLE = 'properties';

/* ───────────────────────────────────────────────
   Mapeamento entre colunas do Supabase e o tipo Property do app.

   Colunas existentes no Supabase (tabela "properties"):
     id (uuid PK), title, purpose, price, condominium (numeric=condoFee),
     iptu (numeric=iptuFee), city, neighborhood, address, description,
     owner (=ownerName), status, area, bedrooms, suites, bathrooms,
     garages (=parking), features (jsonb), differentials (jsonb),
     images (jsonb), created_at, updated_at

   Campos extras do app armazenados em "differentials" (jsonb):
     code, slug, type, condominium_name, mainImage, featured, active,
     realtorName, ownerPhone, ownerEmail, ownerNotes
   ─────────────────────────────────────────────── */

interface DbRow {
  id: string;
  title: string | null;
  purpose: string | null;
  price: number | null;
  condominium: number | null;
  iptu: number | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  description: string | null;
  owner: string | null;
  status: string | null;
  area: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  garages: number | null;
  features: string[] | null;
  differentials: Record<string, unknown> | null;
  images: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Converte uma linha do Supabase para o tipo Property do app */
function rowToProperty(row: DbRow): Property {
  const diff = (row.differentials || {}) as Record<string, any>;
  const fallbackCode = `REF-${row.id ? row.id.substring(0, 4).toUpperCase() : '001'}`;
  const code = diff.code && typeof diff.code === 'string' && diff.code.trim() !== ''
    ? diff.code
    : fallbackCode;

  return {
    id: row.id,
    code,
    title: row.title || '',
    slug: diff.slug || row.id,
    price: row.price || 0,
    condoFee: row.condominium || undefined,
    iptuFee: row.iptu || undefined,
    type: diff.type || 'apartamento',
    purpose: (row.purpose as any) || 'venda',
    status: (row.status as any) || 'disponivel',
    city: row.city || '',
    neighborhood: row.neighborhood || '',
    condominium: diff.condominium_name || undefined,
    address: row.address || undefined,
    area: row.area || 0,
    bedrooms: row.bedrooms || 0,
    suites: row.suites || 0,
    bathrooms: row.bathrooms || 0,
    parking: row.garages || 0,
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    images: Array.isArray(row.images) ? row.images : [],
    mainImage: diff.mainImage || (Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : ''),
    featured: diff.featured === true,
    active: diff.active !== false, // default true
    realtorName: diff.realtorName || undefined,
    ownerName: row.owner || undefined,
    ownerPhone: diff.ownerPhone || undefined,
    ownerEmail: diff.ownerEmail || undefined,
    ownerAddress: diff.ownerAddress || undefined,
    ownerNotes: diff.ownerNotes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/** Converte os dados do app para o formato do Supabase */
function propertyToRow(data: Partial<Property> & { code?: string; slug?: string }): Partial<DbRow> {
  const row: Record<string, unknown> = {};
  const diff: Record<string, unknown> = {};

  // Campos mapeados diretamente
  if (data.title !== undefined) row.title = data.title;
  if (data.purpose !== undefined) row.purpose = data.purpose;
  if (data.price !== undefined) row.price = data.price;
  if (data.condoFee !== undefined) row.condominium = data.condoFee || null;
  if (data.iptuFee !== undefined) row.iptu = data.iptuFee || null;
  if (data.city !== undefined) row.city = data.city;
  if (data.neighborhood !== undefined) row.neighborhood = data.neighborhood;
  if (data.address !== undefined) row.address = data.address || null;
  if (data.description !== undefined) row.description = data.description;
  if (data.ownerName !== undefined) row.owner = data.ownerName || null;
  if (data.status !== undefined) row.status = data.status;
  if (data.area !== undefined) row.area = data.area;
  if (data.bedrooms !== undefined) row.bedrooms = data.bedrooms;
  if (data.suites !== undefined) row.suites = data.suites;
  if (data.bathrooms !== undefined) row.bathrooms = data.bathrooms;
  if (data.parking !== undefined) row.garages = data.parking;
  if (data.features !== undefined) row.features = data.features;
  if (data.images !== undefined) row.images = data.images;

  // Campos extras armazenados em differentials
  if (data.code !== undefined) diff.code = data.code;
  if (data.slug !== undefined) diff.slug = data.slug;
  if (data.type !== undefined) diff.type = data.type;
  if (data.condominium !== undefined) diff.condominium_name = data.condominium;
  if (data.mainImage !== undefined) diff.mainImage = data.mainImage;
  if (data.featured !== undefined) diff.featured = data.featured;
  if (data.active !== undefined) diff.active = data.active;
  if (data.realtorName !== undefined) diff.realtorName = data.realtorName;
  if (data.ownerPhone !== undefined) diff.ownerPhone = data.ownerPhone;
  if (data.ownerEmail !== undefined) diff.ownerEmail = data.ownerEmail;
  if (data.ownerAddress !== undefined) diff.ownerAddress = data.ownerAddress;
  if (data.ownerNotes !== undefined) diff.ownerNotes = data.ownerNotes;

  if (Object.keys(diff).length > 0) {
    row.differentials = diff;
  }

  row.updated_at = new Date().toISOString();

  return row as Partial<DbRow>;
}

/** Conta os códigos sequenciais existentes para gerar o próximo */
async function getNextCodeIndex(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from(TABLE)
    .select('differentials')
    .not('differentials', 'is', null);

  let maxIndex = 0;
  if (data) {
    for (const row of data) {
      const diff = row.differentials as Record<string, any> | null;
      if (diff?.code && typeof diff.code === 'string') {
        const digits = diff.code.replace(/\D/g, '');
        const num = parseInt(digits, 10);
        if (!isNaN(num) && num > maxIndex) maxIndex = num;
      }
    }
  }
  return maxIndex + 1;
}

// ═══════════════════════════════════════════
// GET - Listar todos os imóveis
// ═══════════════════════════════════════════
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ properties: [] }, { status: 200 });
    }

    const properties = (data || []).map(rowToProperty);
    return NextResponse.json({ properties }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (err: any) {
    console.error('Error fetching properties:', err);
    return NextResponse.json({ properties: [] }, { status: 200 });
  }
}

// ═══════════════════════════════════════════
// POST - Cadastrar novo imóvel
// ═══════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // Gera código sequencial único REF-001, REF-002...
    const codeNumber = await getNextCodeIndex();
    const code = `REF-${String(codeNumber).padStart(3, '0')}`;

    // Gera slug
    const slugTitle = (body.title || 'imovel')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugTitle}-${code.toLowerCase()}`;

    // Monta o objeto completo para o Supabase
    const fullData = { ...body, code, slug };
    const row = propertyToRow(fullData);

    // Merge differentials com code e slug
    const diff = (row.differentials || {}) as Record<string, any>;
    diff.code = code;
    diff.slug = slug;
    diff.type = body.type || 'apartamento';
    diff.mainImage = body.mainImage || (Array.isArray(body.images) && body.images.length > 0 ? body.images[0] : '');
    diff.featured = body.featured === true;
    diff.active = body.active !== false;
    diff.condominium_name = body.condominium || null;
    diff.realtorName = body.realtorName || null;
    diff.ownerPhone = body.ownerPhone || null;
    diff.ownerEmail = body.ownerEmail || null;
    diff.ownerAddress = body.ownerAddress || null;
    diff.ownerNotes = body.ownerNotes || null;
    row.differentials = diff;

    // Remove campos que não existem no Supabase
    delete (row as any).id;
    row.created_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('Supabase INSERT error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const newProperty = rowToProperty(data);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (err: any) {
    console.error('Error adding property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao cadastrar imóvel' }, { status: 500 });
  }
}

// ═══════════════════════════════════════════
// PUT - Atualizar imóvel existente
// ═══════════════════════════════════════════
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...dataToUpdate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Lê o registro atual para preservar differentials existentes
    const { data: existing } = await supabase
      .from(TABLE)
      .select('differentials')
      .eq('id', id)
      .single();

    const existingDiff = (existing?.differentials || {}) as Record<string, any>;
    const row = propertyToRow(dataToUpdate);

    // Merge differentials: preserva valores antigos, sobrescreve com novos
    const newDiff = { ...existingDiff, ...((row.differentials || {}) as Record<string, any>) };

    // Garante que o código nunca muda na edição
    if (existingDiff.code) newDiff.code = existingDiff.code;
    row.differentials = newDiff;

    const { data, error } = await supabase
      .from(TABLE)
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase UPDATE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json(rowToProperty(data));
  } catch (err: any) {
    console.error('Error updating property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar imóvel' }, { status: 500 });
  }
}

// ═══════════════════════════════════════════
// DELETE - Excluir imóvel
// ═══════════════════════════════════════════
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error, count } = await supabase
      .from(TABLE)
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (count === 0) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao excluir imóvel' }, { status: 500 });
  }
}
