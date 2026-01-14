import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType, Model } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true })

type UserDoc = InferSchemaType<typeof UserSchema>

export default (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>('User', UserSchema)
