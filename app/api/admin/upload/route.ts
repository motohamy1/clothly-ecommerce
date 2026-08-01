import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_BYTES = 5 * 1024 * 1024;

const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

function verifyMagicBytes(buffer: Buffer, claimedType: string): boolean {
  const expected = MAGIC_BYTES[claimedType];
  if (!expected) return false;
  if (buffer.length < expected.length) return false;
  return expected.every((byte, i) => buffer[i] === byte);
}

export async function POST(request: Request) {
  try { await requireAdmin(); } catch (r) { return r as Response; }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "That file type isn't supported. Use a JPG, PNG, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only .jpg, .jpeg, .png, .webp are allowed.' },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!verifyMagicBytes(bytes, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match its declared type.' },
        { status: 400 },
      );
    }

    const base = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}${ext}`;

    const dir = path.join(process.cwd(), 'public', 'images', 'products');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);

    return NextResponse.json({ path: `/images/products/${filename}` }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
