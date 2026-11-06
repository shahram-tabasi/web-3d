import { NextResponse } from 'next/server';
import { requireAdmin } from '@/src/admin/guard';
import { listSubmissions, updateSubmissions } from '@/src/content/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await listSubmissions());
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id, status, note, remove } = await req.json();
  const items = await updateSubmissions((all) =>
    remove
      ? all.filter((i) => i.id !== id)
      : all.map((i) => (i.id === id ? { ...i, ...(status ? { status } : {}), ...(note !== undefined ? { note: String(note).slice(0, 4000) } : {}) } : i)));
  return NextResponse.json(items);
}
