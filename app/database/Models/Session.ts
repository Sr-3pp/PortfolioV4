import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType, Model } from 'mongoose'

const SessionSchema = new Schema({
  token: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userAgent: { type: String },
  ip: { type: String },
  expiresAt: { type: Date, required: true, index: true },
}, { timestamps: true })

type SessionDoc = InferSchemaType<typeof SessionSchema>

export default (mongoose.models.Session as Model<SessionDoc>) || mongoose.model<SessionDoc>('Session', SessionSchema)
