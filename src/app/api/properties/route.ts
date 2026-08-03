import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Property } from '@/types/property';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'properties.json');
const CLOUD_DB_URL = 'https://jsonblob.com/api/jsonBlob/019fc88c-27a8-74e3-853c-c41f5c32cea1';

interface DatabaseSchema {
  nextCodeIndex: number;
  properties: Property[];
}

function sanitizeDb(parsed: any): DatabaseSchema {
  let nextIndex = typeof parsed?.nextCodeIndex === 'number' ? parsed.nextCodeIndex : 1;
  const list: Property[] = Array.isArray(parsed?.properties) ? parsed.properties : [];

  list.forEach((p) => {
    if (p.code && p.code.startsWith('SC')) {
      const numPart = parseInt(p.code.replace('SC', ''), 10);
      if (!isNaN(numPart) && numPart >= nextIndex) {
        nextIndex = numPart + 1;
      }
    }
  });

  return { nextCodeIndex: nextIndex, properties: list };
}

function readDatabaseLocal(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      const initial: DatabaseSchema = { nextCodeIndex: 1, properties: [] };
      fs.writeFileSync(FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return sanitizeDb(JSON.parse(raw));
  } catch (err) {
    return { nextCodeIndex: 1, properties: [] };
  }
}

function writeDatabaseLocal(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Ignore local filesystem write errors on serverless
  }
}

async function readDatabase(): Promise<DatabaseSchema> {
  try {
    const res = await fetch(CLOUD_DB_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.properties)) {
        return sanitizeDb(data);
      }
    }
  } catch (err) {
    console.warn('Fallback to local database:', err);
  }
  return readDatabaseLocal();
}

async function writeDatabase(data: DatabaseSchema): Promise<void> {
  const sanitized = sanitizeDb(data);
  writeDatabaseLocal(sanitized);
  try {
    await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitized),
    });
  } catch (err) {
    console.error('Error syncing to cloud DB:', err);
  }
}

function generateCode(index: number): string {
  return `SC${String(index).padStart(3, '0')}`;
}

export async function GET() {
  const db = await readDatabase();
  return NextResponse.json(db, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await readDatabase();

    // Generate unique code: SC001, SC002, SC003...
    const codeNumber = db.nextCodeIndex;
    const code = generateCode(codeNumber);
    db.nextCodeIndex = codeNumber + 1;

    const id = `prop-${Date.now()}`;
    const slugTitle = (body.title || 'imovel')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugTitle}-${code.toLowerCase()}`;
    const now = new Date().toISOString();

    const newProperty: Property = {
      ...body,
      id,
      code,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    db.properties.unshift(newProperty);
    await writeDatabase(db);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (err: any) {
    console.error('Error adding property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao cadastrar imóvel' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...dataToUpdate } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    const db = await readDatabase();
    const index = db.properties.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    const existing = db.properties[index];

    const updatedProperty: Property = {
      ...existing,
      ...dataToUpdate,
      id: existing.id,
      code: existing.code, // CÓDIGO NUNCA MUDA AO EDITAR
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    db.properties[index] = updatedProperty;
    await writeDatabase(db);

    return NextResponse.json(updatedProperty);
  } catch (err: any) {
    console.error('Error updating property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar imóvel' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 });
    }

    const db = await readDatabase();
    const initialCount = db.properties.length;
    db.properties = db.properties.filter((p) => p.id !== id);

    if (db.properties.length === initialCount) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    await writeDatabase(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao excluir imóvel' }, { status: 500 });
  }
}
