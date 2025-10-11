// app/auth/index.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import type { Db } from "mongodb";
import { useRuntimeConfig } from "#imports";

// --- connection singleton (works in serverless) ---
let connecting: Promise<typeof mongoose> | null = null;

async function ensureMongoose() {
  if (mongoose.connection.readyState === 1) return;       // already connected
  if (!connecting) {
    const { mongodbUri } = useRuntimeConfig();             // read from Nuxt runtimeConfig
    if (!mongodbUri) throw new Error("Missing runtimeConfig.mongodbUri");
    connecting = mongoose.connect(mongodbUri, {
      // tweak as needed:
      // serverSelectionTimeoutMS: 5000,
      // maxPoolSize: 5,
    });
  }
  await connecting;
}

// --- Better Auth singleton ---
let _auth:
  | ReturnType<typeof betterAuth>
  | null = null;

export async function getAuth() {
  if (_auth) return _auth;

  await ensureMongoose();
  const db: Db | undefined = mongoose.connection.db!;
  if (!db) throw new Error("Mongoose connected but no db handle");

  // Optional: some Mongoose versions expose the underlying MongoClient:
  const client = (mongoose.connection as unknown as { getClient?: () => unknown }).getClient?.();
  
  _auth = betterAuth({
    database: mongodbAdapter(db, { client }), // client is optional
    // You can put your Better Auth options/plugins here:
    emailAndPassword: { enabled: true },
    // oauth: { ... },
    // user: { additionalFields: { role: { type: "string", defaultValue: "user", input: false } } },
  });

  return _auth;
}
