import mongoClientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const PAGE_SIZE = 10;
const databaseName = process.env.MONGODB_DB || 'portfolio';

export async function GET(request, { params }) {
  const { sectionId } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10)));
  const skip = (page - 1) * limit;

  const client = await mongoClientPromise;
  const db = client.db(databaseName);

  const doc = await db.collection('data').findOne({ sectionId });

  if (!doc || !Array.isArray(doc.items)) {
    return NextResponse.json({ items: [], total: 0, page, limit, hasMore: false });
  }

  const total = doc.items.length;
  const items = doc.items.slice(skip, skip + limit);
  const hasMore = skip + limit < total;

  return NextResponse.json({ items, total, page, limit, hasMore });
}
