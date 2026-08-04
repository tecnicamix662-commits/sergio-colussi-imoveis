import { NextResponse } from 'next/server';
import { getSupabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';

/**
 * Garante que o bucket "imoveis" existe no Supabase Storage.
 * Cria automaticamente se não existir.
 */
async function ensureBucket() {
  const supabase = getSupabaseAdmin();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB max
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    });
    if (error && !error.message?.includes('already exists')) {
      console.error('Error creating storage bucket:', error);
    }
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    await ensureBucket();

    const formData = await request.formData();
    let files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files = [singleFile];
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      if (!file.name) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = (file.name.match(/\.(jpg|jpeg|png|webp|gif|avif)$/i) || ['.jpg'])[0].toLowerCase();
      const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = `properties/${filename}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '31536000',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading to Supabase Storage:', error);
        continue;
      }

      // Gera URL pública permanente
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      results.push({
        url: publicUrlData.publicUrl,
        name: file.name,
        size: file.size,
      });
    }

    if (results.length === 0) {
      return NextResponse.json({ error: 'Falha ao enviar arquivos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('Error in upload API:', err);
    return NextResponse.json({ error: err.message || 'Erro no upload de arquivos' }, { status: 500 });
  }
}
