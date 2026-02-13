// app/auth/index.ts
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { bearer } from 'better-auth/plugins'
import mongoose from 'mongoose'
import type { Db, MongoClient } from 'mongodb'
import { useRuntimeConfig } from '#imports'

// --- connection singleton (works in serverless) ---
let connecting: Promise<typeof mongoose> | null = null

async function ensureMongoose() {
  if (mongoose.connection.readyState === 1) return

  if (!connecting) {
    const { mongodbUri } = useRuntimeConfig()
    if (!mongodbUri) throw new Error('Missing runtimeConfig.mongodbUri')

    connecting = mongoose.connect(mongodbUri).catch((error) => {
      connecting = null
      throw error
    })
  }

  await connecting
}

// --- Better Auth singleton ---
let _auth:
  | ReturnType<typeof betterAuth>
  | null = null
let authInitializing: Promise<ReturnType<typeof betterAuth>> | null = null

export async function getAuth() {
  if (_auth) return _auth

  if (!authInitializing) {
    authInitializing = (async () => {
      await ensureMongoose()

      const db: Db | undefined = mongoose.connection.db!
      if (!db) throw new Error('Mongoose connected but no db handle')

      const client = (
        mongoose.connection as unknown as { getClient?: () => MongoClient }
      ).getClient?.()

      const secret =
        process.env.BETTER_AUTH_SECRET ||
        (process.env.NODE_ENV === 'production' ? '' : 'dev-secret-change-me')

      if (!secret) {
        throw new Error('Missing BETTER_AUTH_SECRET in production')
      }

      _auth = betterAuth({
        database: mongodbAdapter(db, { client }),
        secret,
        emailAndPassword: { enabled: true },
        plugins: [bearer()],
      })

      return _auth
    })().catch((error) => {
      authInitializing = null
      _auth = null
      throw error
    })
  }

  return authInitializing
}
