import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Cache the client across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClient(): Promise<MongoClient> | null {
  if (!uri) return null;
  if (clientPromise) return clientPromise;
  if (typeof global !== 'undefined' && global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise!;
    return clientPromise;
  }
  client = new MongoClient(uri);
  clientPromise = client.connect();
  if (typeof global !== 'undefined') {
    global._mongoClientPromise = clientPromise;
  }
  return clientPromise;
}

export async function getDb(dbName = 'next_product_site') {
  const cp = getMongoClient();
  if (!cp) return null;
  const c = await cp;
  return c.db(dbName);
}
