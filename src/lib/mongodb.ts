import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// We cache the connection in the global object to avoid multiple connections in dev
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// @ts-ignore
let cached: Cached = global.mongoose;

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  };
  // @ts-ignore
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
