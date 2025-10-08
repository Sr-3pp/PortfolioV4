import mongoose from 'mongoose'

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined
}

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const uri = config.mongodbUri
  if (!uri) {
    console.warn('MONGODB_URI is not set; DB will not connect.')
    return
  }

  if (!global._mongooseConn) {
    global._mongooseConn = mongoose.connect(uri, {
      // Reasonable options; Mongoose v6+ doesn’t need many flags
      maxPoolSize: 10,           // keep the pool small on serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((m) => {
      console.log('✅ Mongoose connected')
      return m
    }).catch((err) => {
      console.error('❌ Mongoose connection error', err)
      throw err
    })
  }
})
