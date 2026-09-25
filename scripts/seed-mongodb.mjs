import { MongoClient } from 'mongodb';
import { readFile } from 'node:fs/promises';

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || 'portfolio';

if (!uri) throw new Error('MONGODB_URI is not configured.');

const source = JSON.parse(await readFile(new URL('../portfolio-sample-data.json', import.meta.url), 'utf8'));
const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(databaseName);

  await db.collection('template').replaceOne({ _id: 'active' }, { _id: 'active', value: source.template || 'premium' }, { upsert: true });
  await db.collection('personal').replaceOne({ _id: 'default' }, { _id: 'default', ...source.personal }, { upsert: true });
  await db.collection('socials').replaceOne({ _id: 'default' }, { _id: 'default', ...source.socials }, { upsert: true });

  await db.collection('skills').deleteMany({});
  if (source.skills?.length) await db.collection('skills').insertMany(source.skills.map((skill, order) => ({ ...skill, order })));

  await db.collection('sections').deleteMany({});
  if (source.Sections?.length) await db.collection('sections').insertMany(source.Sections.map((section, order) => ({ ...section, order })));

  await db.collection('data').deleteMany({});
  for (const section of source.Sections || []) {
    // Prefer section.id — repository / API key by sectionId. data-type is a field shape, not a data key.
    const sourceKey = section['data-source'] || section.id;
    const items = source.data?.[sourceKey] || source.data?.[section.id] || [];
    await db.collection('data').replaceOne({ _id: section.id }, { _id: section.id, sectionId: section.id, items }, { upsert: true });
  }

  console.log(`Seeded ${databaseName} database with ${source.Sections?.length || 0} dynamic sections.`);
} finally {
  await client.close();
}
