import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const results = [];

    for (const file of files) {
      if (!file.name) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const rawExt = path.extname(file.name) || '.jpg';
      const cleanExt = rawExt.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|avif)$/)
        ? rawExt.toLowerCase()
        : '.jpg';

      const filename = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      results.push({
        url: publicUrl,
        name: file.name,
        size: file.size,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('Error in upload API:', err);
    return NextResponse.json({ error: err.message || 'Erro no upload de arquivos' }, { status: 500 });
  }
}
