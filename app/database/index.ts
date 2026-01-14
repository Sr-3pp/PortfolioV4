// /server/utils/db.ts
import mongoose from 'mongoose'
import { useRuntimeConfig } from '#imports'

declare global {
   
  var __mongooseConn: Promise<typeof mongoose> | undefined
}

/**
 * Lazily connect to MongoDB using Mongoose.
 * Uses runtime config, and ensures only one connection instance.
 */
export async function connectToDatabase() {
  if (global.__mongooseConn) return global.__mongooseConn

  const config = useRuntimeConfig()
  const uri = config.mongodbUri || process.env.MONGODB_URI

  if (!uri) {
    console.warn('[DB] Missing mongodbUri in runtimeConfig or env.')
    global.__mongooseConn = Promise.resolve(mongoose)
    return global.__mongooseConn
  }

  global.__mongooseConn = mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
    .then((m) => {
      console.log('✅ MongoDB connected')
      return m
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err)
      throw err
    })

  return global.__mongooseConn
}
