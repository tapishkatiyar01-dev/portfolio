import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('MONGODB_URI is not configured. Add it to .env.local.');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!globalThis.__portfolioMongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalThis.__portfolioMongoClientPromise = client.connect();
  }
  clientPromise = globalThis.__portfolioMongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
