import { cache } from 'react';
import mongoClientPromise from './mongodb';

const databaseName = process.env.MONGODB_DB || 'portfolio';
export const INITIAL_PAGE_SIZE = 10;

async function loadPortfolioData() {
  try {
    const client = await mongoClientPromise;
    const db = client.db(databaseName);

    const [template, personal, socials, skills, Sections, sectionData] = await Promise.all([
      db.collection('template').findOne({ _id: 'active' }),
      db.collection('personal').findOne({ _id: 'default' }),
      db.collection('socials').findOne({ _id: 'default' }),
      db.collection('skills').find({}).sort({ order: 1 }).toArray(),
      db.collection('sections').find({}).sort({ order: 1 }).toArray(),
      db.collection('data').find({}).toArray(),
    ]);

    const data = Object.fromEntries(
      sectionData.map((entry) => {
        const allItems = entry.items || [];
        return [
          entry.sectionId,
          {
            items: allItems.slice(0, INITIAL_PAGE_SIZE),
            total: allItems.length,
            hasMore: allItems.length > INITIAL_PAGE_SIZE,
          },
        ];
      }),
    );

    return {
      template: template?.value || 'premium',
      personal: stripId(personal) || {},
      socials: stripId(socials) || {},
      skills: skills.map(stripId),
      Sections: Sections.map(stripId),
      data,
    };
  } catch (error) {
    console.error('Failed to load portfolio data', error);
    return {
      template: 'premium',
      personal: {},
      socials: {},
      skills: [],
      Sections: [],
      data: {},
    };
  }
}

export const getPortfolioData = cache(loadPortfolioData);

function stripId(document) {
  if (!document) return document;
  const { _id, ...value } = document;
  return value;
}

