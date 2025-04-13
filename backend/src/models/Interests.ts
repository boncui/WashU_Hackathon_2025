// backend/src/models/Interests.ts
import mongoose, { Schema, Document } from 'mongoose'
import "./Article";  

export enum InterestType {
  Transactional = 'transactional',
  Informational = 'informational',
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
  type: { type: String, enum: Object.values(InterestType), required: true }, // ✅ matches frontend now
  update: { type: Boolean, required: true },
  articles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Article',
    validate: [
      (arr: mongoose.Types.ObjectId[]) => arr.length <= 5,
      'An interest can only have up to 5 articles',
    ],
  },
}, { timestamps: true })


// ✅ Rename model to match reference string used in .populate('interests')
export default mongoose.model<IInterests>('Interest', InterestSchema)


