import mongoose from "mongoose";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/demo-customize";
if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable in .env.local"
  );
}
// ⚡ Interface for cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ⚡ Global cache to prevent multiple connections in dev
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// ✅ Default export function
const connectDB = async (): Promise<typeof mongoose> => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.NEXT_PUBLIC_MONGODB_DB_DATABASE_NAME,
      })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};
export default connectDB;
