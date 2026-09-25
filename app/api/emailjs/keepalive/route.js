import mongoClientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const databaseName = process.env.MONGODB_DB || 'portfolio';
const KEEPALIVE_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;

async function getKeepaliveCollection() {
  const client = await mongoClientPromise;
  return client.db(databaseName).collection('emailjs');
}

export async function POST(request) {
  let action = 'claim';
  try {
    const body = await request.json();
    if (body?.action === 'touch' || body?.action === 'claim') {
      action = body.action;
    }
  } catch {
    action = 'claim';
  }

  try {
    const collection = await getKeepaliveCollection();
    const now = new Date();

    if (action === 'touch') {
      await collection.updateOne(
        { _id: 'keepalive' },
        { $set: { lastSentAt: now } },
        { upsert: true },
      );
      return NextResponse.json({ send: false, recorded: true });
    }

    const existing = await collection.findOne({ _id: 'keepalive' });
    const lastSentAt = existing?.lastSentAt ? new Date(existing.lastSentAt).getTime() : 0;
    const isDue = !lastSentAt || Date.now() - lastSentAt >= KEEPALIVE_INTERVAL_MS;

    if (!isDue) {
      return NextResponse.json({ send: false });
    }

    await collection.updateOne(
      { _id: 'keepalive' },
      { $set: { lastSentAt: now } },
      { upsert: true },
    );

    return NextResponse.json({ send: true });
  } catch (error) {
    return NextResponse.json({ send: true, fallback: true, error: error.message }, { status: 200 });
  }
}
