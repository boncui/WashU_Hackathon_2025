import mongoose, { Schema, Document } from 'mongoose'

export enum InterestType {
  Type1 = 'Transactional',
  Type2 = 'Informational',
}

export interface IInterests extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  type: InterestType
  update: boolean
  articles: mongoose.Types.ObjectId[] // can populate later if needed
}

const InterestSchema: Schema<IInterests> = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(InterestType), required: true },
  update: { type: Boolean, required: true },
  articles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
    validate: [
      (arr: mongoose.Types.ObjectId[]) => arr.length <= 5,
      'An interest can only have up to 5 articles',
    ],
  },
}, { timestamps: true }) // ⏰ Optional

export default mongoose.model<IInterests>('Interest', InterestSchema)
