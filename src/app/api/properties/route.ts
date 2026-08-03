import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Property } from '@/types/property';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'properties.json');

interface DatabaseSchema {
  nextCodeIndex: number;
  properties: Property[];
}

function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      const initial: DatabaseSchema = {
        nextCodeIndex: 1,
        properties: [],
      };
      fs.writeFileSync(FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);

    // Enforce data structure
    let nextIndex = typeof parsed.nextCodeIndex === 'number' ? parsed.nextCodeIndex : 1;
    const list: Property[] = Array.isArray(parsed.properties) ? parsed.properties : [];

    // Ensure nextCodeIndex is always higher than any existing SC code numeric suffix
    list.forEach((p) => {
      if (p.code && p.code.startsWith('SC')) {
        const numPart = parseInt(p.code.replace('SC', ''), 10);
        if (!isNaN(numPart) && numPart >= nextIndex) {
          nextIndex = numPart + 1;
        }
      }
    });

    return { nextCodeIndex: nextIndex, properties: list };
  } catch (err) {
    console.error('Error reading properties database:', err);
    return { nextCodeIndex: 1, properties: [] };
  }
}

function writeDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing properties database:', err);
  }
}

function generateCode(index: number): string {
  return `SC${String(index).padStart(3, '0')}`;
}

export async function GET() {
  const db = readDatabase();
  return NextResponse.json(db);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDatabase();

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
    writeDatabase(db);

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

    const db = readDatabase();
    const index = db.properties.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    const existing = db.properties[index];

    // Preserva o CÓDIGO ÚNICO original, ID e data de criação sem alterações
    const updatedProperty: Property = {
      ...existing,
      ...dataToUpdate,
      id: existing.id,
      code: existing.code, // O CÓDIGO NUNCA MUDA AO EDITAR
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    db.properties[index] = updatedProperty;
    writeDatabase(db);

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

    const db = readDatabase();
    const initialCount = db.properties.length;
    db.properties = db.properties.filter((p) => p.id !== id);

    if (db.properties.length === initialCount) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    // NÃO decrementa o nextCodeIndex, garantindo que o código excluído NUNCA seja reutilizado
    writeDatabase(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    return NextResponse.json({ error: err.message || 'Erro ao excluir imóvel' }, { status: 500 });
  }
}
